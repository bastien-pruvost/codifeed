from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from sqlmodel import Field, SQLModel


class ApiBaseModel(BaseModel):
    """Base model to be used for all API models (Converts snake_case to camelCase)"""

    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        validate_by_name=True,
        validate_by_alias=True,
        serialize_by_alias=True,
    )


class SQLModelWithId(SQLModel):
    """Base model to be used for all SQL models with an id field."""

    id: UUID = Field(default_factory=uuid4, primary_key=True)
