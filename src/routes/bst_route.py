from flask import Blueprint, render_template, request
from src.binary_search_tree.bst import BinarySearchTree

bst_bp = Blueprint('bst', __name__)
bst_out = BinarySearchTree()

@bst_bp.route('/')
def bst_update():
    return render_template('binary-search-tree.html')

@bst_bp.route('/create', methods=["GET", "POST"])
def insert_node(value: str = None):
    pass

@bst_bp.route('/update', methods=["GET", "PUT"])
def update_node(old_value: str = None, new_value: str = None):
    pass

@bst_bp.route('/delete', methods=["DELETE"])
def delete_node(value: str = None):
    pass

@bst_bp.route('/bst/list/fetch', methods=["GET"])
def get_inorder_traversal():
    pass

@bst_bp.route('/bst/list/fetch', methods=["GET"])
def get_bst():
    pass
