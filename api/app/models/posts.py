# Posts models will be defined here in the future
# For now, posts endpoints use MessageResponse from core


# Example post model structure for future implementation:
# class PostBase(BaseModel):
#     title: str
#     content: str
#     user_id: str
#
# class PostCreate(PostBase):
#     pass
#
# class PostUpdate(PostBase):
#     pass
#
# class PostRead(PostBase):
#     id: str
#     created_at: datetime
#     updated_at: datetime
#
# class Post(PostBase, SQLModelWithId, table=True):
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     updated_at: datetime = Field(default_factory=datetime.utcnow)
