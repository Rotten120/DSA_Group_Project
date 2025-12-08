class Node:
    def __init__(self, value, left = None, right = None):
        self.value = value
        self.left = left
        self.right = right

    def __dict__(self):
        dict_value = None
        try:
            dict_value = self.value.__dict__()
        except AttributeError:
            dict_value = self.value

        return {
            "value": dict_value,
            "left": self.left.value if self.left else None,
            "right": self.right.value if self.right else None
        }
