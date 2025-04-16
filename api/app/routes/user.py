from flask_openapi3.blueprint import APIBlueprint
from pydantic import BaseModel
from sqlmodel import select

from app.models import get_session
from app.models.user import User
from app.utils.errors import not_found_error
from app.utils.responses import success_response

user_router = APIBlueprint("user", __name__, url_prefix="/users")


class CreateUserBody(BaseModel):
    email: str
    password: str
    name: str


@user_router.post("/register")
def create_user(body: CreateUserBody):
    user = User(
        email=body.email,
        password=body.password,
        name=body.name,
    )
    for session in get_session():
        session.add(user)
        session.commit()
        session.refresh(user)

    return success_response({"user_id": user.id}, "User created", 201)


class GetUserPath(BaseModel):
    user_id: int


@user_router.get("/<int:user_id>")
def get_user(path: GetUserPath):
    for session in get_session():
        user = session.exec(select(User).where(User.id == path.user_id)).first()
        if not user:
            return not_found_error("User")
        return success_response(user.model_dump(exclude={"password"}), "User retrieved", 200)
