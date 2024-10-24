from pydantic import BaseModel, EmailStr, Field


class SUserRegister(BaseModel):
    email: EmailStr = Field(..., description="Email")
    password: str = Field(..., min_length=5, max_length=50, description="Password, from 5 to 50 characters")
    password_check: str = Field(..., min_length=5, max_length=50, description="Password, from 5 to 50 characters")
    name: str = Field(..., min_length=3, max_length=50, description="Name, from 3 to 50 characters")


class SUserAuth(BaseModel):
    email: EmailStr = Field(..., description="Email")
    password: str = Field(..., min_length=5, max_length=50, description="Password, from 5 to 50 characters")
