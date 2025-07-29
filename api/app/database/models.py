from uuid import uuid4

from sqlmodel import Field, SQLModel


class BaseModel(SQLModel):
    class Config:
        pass
        # alias_generator = AliasGenerator(
        #     validation_alias=to_camel,
        #     serialization_alias=to_pascal,
        # )


class BaseModelWithId(BaseModel):
    id: str = Field(default_factory=uuid4, primary_key=True)


# class SuccessResponse(BaseModel):
#     """Standard success response format"""

#     data: Optional[Any] = Field(default=None, description="Response data")


class MessageResponse(BaseModel):
    """Standard message response format"""

    message: str = Field(description="Main message")
