from uuid import uuid4

class Node:
    def __init__(self, value, node_id = None, left = None, right = None):
        self.value = value
        self.id = uuid4().int if node_id is None else node_id
        self.left = left
        self.right = right

    def __dict__(self):
        dict_value = None
        try:
            dict_value = self.value.__dict__()
        except ValueError:
            dict_value = self.value

        return {
            "value": dict_value,
            "id": self.id,
            "left": self.left.id if self.left else None,
            "right": self.right.id if self.right else None
        }
