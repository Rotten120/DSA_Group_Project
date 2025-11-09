from src.backend.node import Node

class Queue:
    def __init__(self):
        self.head = None
        self.tail = None

    def enqueue(self, data):
        new_node = Node(data)
        if self.tail:
            self.tail.next = new_node
            self.tail = new_node
        else:
            self.head = new_node
            self.tail = new_node

    def dequeue(self):
        if not self.head:
            return None
        deleted_node = self.head
        deleted_data = self.head.data
        
        if not self.head.next:
            self.head = None
            self.tail = None
        elif self.head.next == self.tail:
            self.head = self.tail
        else:
            self.head = self.head.next

        deleted_node.data = None
        deleted_node.next = None

        return deleted_data

    def __iter__(self):
        out = []
        current_node = self.head
        while current_node:
            out.append(current_node.data)
            current_node = current_node.next
        return iter(out) 
