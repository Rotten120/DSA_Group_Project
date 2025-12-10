class Node:
    def __init__(
        self,
        value,
        left: Node | None = None,
        right: Node | None = None
    ):
        self.value = value
        self.left = left
        self.right = right

    def export(self, val_export = None):
        return {
            "value": self.value if val_export is None else val_export(self.value),
            "left": self.left.value if self.left else None,
            "right": self.right.value if self.right else None
        }

    @classmethod
    def import_dict(self, inp_dict: dict, val_import = None):
        return Node(
            inp_dict["value"] if val_import is None else val_import(inp_dict["value"]),
            left = inp_dict["left"],
            right = inp_dict["right"]
        )
