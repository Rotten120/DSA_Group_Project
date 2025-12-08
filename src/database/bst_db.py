from src.logic.binary_search_tree import BinarySearchTree
import json
import os

"""
WARNING:

BstFolderDB, BstDB, and BinarySearchTree all
contains attributed called val_import and val_export
which are all stored and passed around until they are
needed for node.value #refer to documentation#

Better if this pain the rear is changed (by: be-dev)
"""

class BstDB:
    def __init__(
        self,
        path: str,
        fetch_data: bool = True,
        val_import = None,
        val_export = None
    ):
        self.path = path
        self.__data = BinarySearchTree()
        self.val_import = val_import
        self.val_export = val_export

        if fetch_data:
            self.fetch()

    def fetch(self):
        temp_dict = {}
        with open(self.path, 'r') as file:
            temp_dict = json.load(file)
        self.__data = BinarySearchTree.import_dict(
            temp_dict,
            val_import = self.val_import,
            val_export = self.val_export
        )

    def upload(self):
        with open(self.path, 'w') as file:
            json.dump(self.__data.export(), file, indent = 4)

    def get(self) -> dict:
        return self.__data

class BstFolderDB:
    def __init__(
        self,
        folder_path: str,
        fetch_data: bool = True,
        val_import = None,
        val_export = None
    ):
        if folder_path[-1] == '/':
            folder_path = folder_path[:-1]

        self.folder_path = folder_path
        self.__data: dict[str, BstDB] = {}
        self.val_import = val_import
        self.val_export = val_export

        if fetch_data:
            self.fetch_all()

    def insert(self, name):
        if name in self.__data:
            return
        self.__data[name] = BstDB(self.abs_path(name, 'json'), fetch_data = False)

    def delete(self, name):
        if not(name in self.__data):
            return
        os.remove(self.abs_path(name, 'json'))
        del self.__data[name]

    def fetch(self, file: str):
        if file in self.__data:
            self.__data[file].fetch()

    def fetch_all(self):
        def fetch_entry(entry_name):
            filename = entry_name[:entry_name.find('.')]
            self.__data[filename] = BstDB(
                self.abs_path(entry_name),
                val_import = self.val_import,
                val_export = self.val_export
            )

        with os.scandir(self.folder_path) as entries:
            for entry in entries:
                ext = entry.name[entry.name.find('.') + 1:]
                if entry.is_file() and ext == 'json':
                    fetch_entry(entry.name)
                
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
