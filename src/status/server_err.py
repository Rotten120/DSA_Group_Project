from flask import jsonify
from .code import StatusCodes

class ServerError(Exception):
    def __init__(
            self,
            status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERR,
            description: str | None = None
    ):
        self.message = status.message(description)
        self.code = status.code
        super().__init__(self.message)

    def __handle(self, **kwargs):
        return jsonify(
            message = self.message,
            **kwargs
        ), self.code

    @classmethod
    def response(cls, err: Exception, **kwargs):
        if isinstance(err, cls):
            return err.__handle(**kwargs)
        temp_err = ServerError(description = str(err))
        return temp_err.__handle(**kwargs)
