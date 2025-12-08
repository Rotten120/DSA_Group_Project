from flask import Blueprint, request, jsonify
from src.binary_search_tree.bst import BinarySearchTree
from src.database.bst_db import BstFolderDB
from src.routes.bst_route import bst_out
from src.routes.bst_route.bst_graph_route import get_bst_json

bst_node_bp = Blueprint('node', __name__)

@bst_node_bp.route('/create/<string:graph_name>', methods=["GET", "POST"])
def insert_node(graph_name: str):
    global bst_out
    value = request.args.get("value")

    try:
        if value:
            graph = bst_out.get(graph_name)
            graph.insert(graph.root, value)
    except ValueError as err:
        print(err)
    return get_bst_json(graph_name, True)

@bst_node_bp.route('/update/<string:graph_name>', methods=["GET", "PUT"])
def update_node(graph_name: str):
    global bst_out
    old_value = request.args.get("old_value")
    new_value = request.args.get("new_value")

    try:
        if value:
            graph = bst_out.get(graph_name)
            graph.update(graph.root, old_value, new_value)
    except ValueError as err:
        print(err)
    return get_bst_json(graph_name, True)

@bst_node_bp.route('/delete/<string:graph_name>', methods=["GET", "DELETE"])
def delete_node(graph_name: str):
    global bst_out
    value = request.args.get("value")

    graph = bst_out.get(graph_name)
    graph.delete(graph.root, value)
    return get_bst_json(graph_name, True)
