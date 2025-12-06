class Node:
    def __init__(self, value, left = None, right = None):
        self.value = value
        self.left = left
        self.right = right

    def __dict__(self):
        return {
            "value": self.value,
            "left": self.left.id if self.left else None,
            "right": self.right.id if self.right else None
        }
