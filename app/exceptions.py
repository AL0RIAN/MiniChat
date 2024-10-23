from fastapi import status, HTTPException


class TokenExpiredException(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")


class TokenNoFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token not found")


UserAlreadyExistsException = HTTPException(status_code=status.HTTP_409_CONFLICT,
                                           detail="User already exists")

PasswordMismatchException = HTTPException(status_code=status.HTTP_409_CONFLICT, detail="The passwords don't match!")

IncorrectEmailOrPasswordException = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                                  detail="Wron email or password")

NoJwtException = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                               detail="The token is not valid")

NoUserIdException = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                  detail="User ID not found")

ForbiddenException = HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough rights!")
