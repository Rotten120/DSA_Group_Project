from flask import Blueprint, request, jsonify
from src.binary_search_tree.bst import BinarySearchTree
from src.database.bst_db import BstFolderDB

bst_node_bp = Blueprint('node', __name__)

@bst_bp.route('/node/create/<str: graph_name>', methods=["GET", "POST"])
def insert_node(graph_name: str, value: str = None):
    global bst_out

    try:
        if not value:
            graph = bst_out.get(graph_name)
            graph.insert(graph.root, value)
    except ValueError as err:
        print(err)
    return get_bst_json(graph_name, True)

@bst_bp.route('/node/update/<str: graph_name>', methods=["GET", "PUT"])
def update_node(graph_name: str, old_value: str = None, new_value: str = None):
    global bst_out

    try:
        if not value:
            graph = bst_out.get(graph_name)
            graph.update(graph.root, old_value, new_value)
    except ValueError as err:
        print(err)
    return get_bst_json(graph_name, True)

@bst_bp.route('/node/delete/<str: graph_name>', methods=["DELETE"])
def delete_node(graph_name: str, value: str):
    global bst_out
    graph = bst_out.get(graph_name)
    graph.delete(graph.root, value)
    return get_bst_json(graph_name, True)
