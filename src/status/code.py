from typing import Enum

class Status:
    def __init__(self, title: str, code: int)
        self.title = title
        self.code = code

    def message(self, description: str | None = None):
        msg_out = f"{self.code} {self.title}"
        if not description:
            msg_out += f": {description}"
        return msg_out

class StatusCodes(Enum):
    SUCCESS =               Status("Request Success", 200)
    CREATED =               Status("Entry Created", 201)
    BAD_REQUEST =           Status("Bad Request", 400)
    NOT_FOUND =             Status("Not Found", 404)
    INTERNAL_SERVER_ERR =   Status("Server Error", 500)
