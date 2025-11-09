from src.backend.node import Node
from src.backend.dataqueue import Queue

class DeQue(Queue):
    def add_rear(self, data):
        self.enqueue(data)

    def add_front(self, data):
        new_node = Node(data)
        if self.head:
            new_node.next = self.head
            self.head = new_node
        else:
            self.head = new_node
            self.tail = new_node

    def remove_front(self):
        return self.dequeue()

    def remove_rear(self):
        if not self.head:
            return None        

        deleted_node = self.tail
        deleted_data = deleted_node.data        
        if self.head == self.tail:
            self.head = None
            self.tail = None
        elif self.head.next == self.tail:
            self.head.next = None
            self.tail = self.head

        current_node = self.head
        while current_node:
            next_node = current_node.next
            if next_node == self.tail:
                current_node.next = None
                self.tail = current_node
            current_node = next_node
        deleted_node = None
        
        return deleted_data 
