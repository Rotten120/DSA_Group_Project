from flask import Blueprint, render_template, request, jsonify
from src.binary_search_tree.bst import BinarySearchTree

bst_bp = Blueprint('bst', __name__)
bst_out = BinarySearchTree()

@bst_bp.route('/')
def bst_update():
    return render_template('binary-search-tree.html')

@bst_bp.route('/create', methods=["GET", "POST"])
def insert_node(value: str = None):
    global bst_out

    try:
        if not value:
            bst_out.insert(bst.root, value)
    except ValueError as err:
        print(err)
    return get_bst_json()

@bst_bp.route('/update', methods=["GET", "PUT"])
def update_node(old_value: str = None, new_value: str = None):
    global bst_out

    try:
        if not value:
            bst_out.update(bst.root, old_value, new_value)
    except ValueError as err:
        print(err)
    return get_bst_json()

@bst_bp.route('/delete', methods=["DELETE"])
def delete_node(value: str = None):
    global bst_out
    bst_out.delete(bst.root, value)
    return get_bst_json()

@bst_bp.route('/bst/list/fetch', methods=["GET"])
def get_inorder_traversal():
    global bst_out
    return jsonify(bst_out.get_ordered())

@bst_bp.route('/bst/list/fetch', methods=["GET"])
def get_bst_json():
    global bst_out
    dict_out = {
        "value": list(bst_out),
        "min": bst_out.get_min(bst_out.root),
        "max": bst_out.get_max(bst_out.root),
        "height": bst_out.get_height(bst_out.root)
    }
    return jsonify(dict_out)
