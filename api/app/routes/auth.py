from flask_jwt_extended import create_access_token, create_refresh_token
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from passlib.hash import bcrypt
from sqlmodel import select

from app.models import get_session
from app.models.auth import AuthLogin, AuthToken
from app.models.user import User, UserCreate, UserRead
from app.utils.responses import error_response, success_response

tag = Tag(name="Auth", description="Authentication routes")
auth_router = APIBlueprint("auth", __name__, url_prefix="/auth", abp_tags=[tag])


@auth_router.post("/register", responses={201: UserRead})
def register(body: UserCreate):
    user = User.model_validate(
        body,
        update={"hashed_password": bcrypt.hash(body.password)},
    )
    for session in get_session():
        existing_user_query = select(User).where(User.email == user.email)
        existing_user = session.exec(existing_user_query).first()
        if existing_user:
            return error_response("User already exists", 400)
        session.add(user)
        session.commit()
        session.refresh(user)
    return success_response(user.model_dump(exclude={"hashed_password"}), 201)


@auth_router.post("/login", responses={200: AuthToken})
def login(body: AuthLogin):
    for session in get_session():
        user_query = select(User).where(User.email == body.email)
        user = session.exec(user_query).first()
        if not user or not bcrypt.verify(body.password, user.hashed_password):
            return error_response("Email or password is incorrect", 401)
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return success_response(
            AuthToken(
                access_token=access_token,
                refresh_token=refresh_token,
            ).model_dump(),
            200,
        )
