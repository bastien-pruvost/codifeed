from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag

from app.models import ApiBaseModel
from app.utils.response import abp_responses, success_response

healthcheck_tag = Tag(name="Healthcheck", description="Healthcheck routes")
healthcheck_router = APIBlueprint(
    "healthcheck", __name__, abp_tags=[healthcheck_tag], abp_responses=abp_responses
)


class HealthcheckResponse(ApiBaseModel):
    status: str


@healthcheck_router.get(
    "/healthcheck",
    responses={200: HealthcheckResponse},
    description="Check if the server is running",
)
def healthcheck():
    response = HealthcheckResponse(status="ok")
    return success_response(response.model_dump(), 200)


@healthcheck_router.post(
    "/healthcheck",
    responses={200: HealthcheckResponse},
    description="Check if the server is working with a POST request",
)
def healthcheck_test():
    response = HealthcheckResponse(status="ok")
    return success_response(response.model_dump(), 200)
