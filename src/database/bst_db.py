from src.binary_search_tree.bst import BinarySearchTree
import json
import os

class BstDB:
    def __init__(self, path: str, fetch_data: bool = True):
        self.path = path
        self.__data: BinarySearchTree | None = self.fetch() if fetch_data else None

    def fetch(self):
        temp_dict = {}
        with open(self.path, 'r') as file:
            temp_dict = json.load(self.path)
        self.__data = BinarySearchTree.import_dict(temp_dict)

    def upload(self):
        with open(self.path, 'w') as file:
            temp_dict = self.data.__dict__() if self.data else None
            json.dump(temp_dict, indent = 4)

    def get(self) -> dict:
        return self.__data

class BstFolderDB:
    def __init__(self, folder_path: str, fetch_data: bool = True):
        if folder_path[-1] == '/':
            folder_path = folder_path[:-1]

        self.folder_path = folder_path
        self.__data: dict[str, BstDB] | None = self.fetch_all() if fetch_data else None

    def insert(self, name):
        if name in self.__data:
            return
        self.__data[name] = BstDB(name + '.json', fetch_data = False)

    def delete(self, name):
        if not(name in self.__data):
            return
        os.remove(self.abs_path(name, 'json'))
        del self.__data[name]

    def fetch(self, file: str):
        if file in self.__data:
            self.__data[file].fetch()

    def fetch_all(self):
        with os.scandir(self.folder_path) as entries:
            for entry in entries:
                if entry.is_file() and os.path.splitext(entry.name)[1] == 'json':
                    #entry.name contains the file ext .json already
                    self.__data[entry.name] = BstDB(self.abs_path(entry.name))

    def upload(self, file: str):
        if file in self.__data:
            self.__data[file].upload()

    def upload_all(self):
        for file in self.__data:
            self.__data[file].upload()

    def get(self, file: str):
        if file in self.__data:
            return self.__data[file].get()
    
    def get_all(self):
        return self.__data

    def rename_file(self, old_name: str, new_name: str):
        if not(old_name in self.__data) or new_name in self.__data:
            return

        old_abs_path = self.abs_path(old_name, 'json')
        new_abs_path = self.abs_path(new_name, 'json')
        os.rename(old_abs_path, new_abs_path)

        self.__data[old_name].path = new_abs_path
        self.__data[new_name] = self.__data[old_name]

        del self.__data[old_name]

    def abs_path(self, filename: str, ext = None) -> str:
        temp_path = self.folder_path + '/' + filename
        if not ext is None:
            temp_path += '.' + ext
        return temp_path
