from enum import Enum

class StatusCodes(Enum):
    SUCCESS =               ("Request Success", 200)
    CREATED =               ("Entry Created", 201)
    BAD_REQUEST =           ("Bad Request", 400)
    NOT_FOUND =             ("Not Found", 404)
    INTERNAL_SERVER_ERR =   ("Server Error", 500)

    def __init__(self, title: str, code: int):
        self.title = title
        self.code = code

    def message(self, description: str | None = None):
        msg_out = f"{self.code} {self.title}"
        if description:
            msg_out += f": {description}"
        return msg_out
