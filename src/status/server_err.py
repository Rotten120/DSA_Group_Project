from .code import StatusCodes, Status

class ServerError(Exception):
    def __init__(
            self,
            status: Status = StatusCodes.INTERNAL_SERVER_ERROR,
            description: str | None = None
    ):
        super().__init__(status.message(description))
        self.code = status.code
