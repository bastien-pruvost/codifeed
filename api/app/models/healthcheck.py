from app.database.models import ApiBaseModel


class HealthcheckResponse(ApiBaseModel):
    status: str
