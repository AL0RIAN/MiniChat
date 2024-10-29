from pydantic import BaseModel, Field
from datetime import datetime


class MessageRead(BaseModel):
    id: int = Field(..., description="Unique message identifier")
    sender_id: int = Field(..., description="Message sender ID")
    recipient_id: int = Field(..., description="Message recipient ID")
    content: str = Field(..., description="Message Contents")
    created_at: datetime = Field(..., description="Sent date")


class MessageCreate(BaseModel):
    recipient_id: int = Field(..., description="Message recipient ID")
    content: str = Field(..., description="Message Contents")
