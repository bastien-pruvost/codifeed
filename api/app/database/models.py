import uuid
from typing import List

from sqlmodel import Field, SQLModel


class BaseModel(SQLModel):
    class Config:
        pass
        # alias_generator = AliasGenerator(
        #     validation_alias=to_camel,
        #     serialization_alias=to_pascal,
        # )


class BaseModelWithId(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class ErrorDetail(BaseModel):
    loc: List[str] = Field(description="Location of the error")
    msg: str = Field(description="Error message")
    type: str = Field(description="Error type")


class ErrorResponse(BaseModel):
    status: int = Field(description="Status code")
    message: str = Field(description="Error message")
    detail: List[ErrorDetail] = Field(description="Error details")


class MessageResponse(BaseModel):
    message: str
