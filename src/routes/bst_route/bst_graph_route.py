from flask import Blueprint, request, jsonify
from src.binary_search_tree.bst import BinarySearchTree
from src.database.bst_db import BstFolderDB
from src.routes.bst_route import bst_out

bst_graph_bp = Blueprint('graph', __name__)

@bst_graph_bp.route('/fetch/<string:graph_name>', methods=["GET"])
def get_bst_json(graph_name: str, is_updated: bool = False):
    global bst_out
    is_updated = request.args.get("is_updated", default = is_updated)

    graph = bst_out.get(graph_name)
    min_node = graph.get_min(graph.root)
    max_node = graph.get_max(graph.root)

    dict_out = {
        "nodes": graph.export(),
        "min": min_node.value if not min_node is None else None,
        "max": max_node.value if not max_node is None else None,
        "height": graph.get_height(graph.root),
        "order": graph.get_ordered()
    }
 
    if is_updated:
        bst_out.upload(graph_name)
    return jsonify(dict_out)

@bst_graph_bp.route('/fetch/all', methods=["GET"])
def get_bst(is_updated: bool = False):
    global bst_out
    is_updated = request.args.get("is_updated", default = is_updated)

    graphs = bst_out.get_all()
    graphs_out = {}

    for graph_name in graphs:
        temp = graphs[graph_name].get()
        min_node = temp.get_min(temp.root)
        max_node = temp.get_max(temp.root)

        graphs_out[graph_name] = {
            "nodes": temp.export(),
            "min": min_node.value if not min_node is None else None,
            "max": max_node.value if not max_node is None else None,
            "height": temp.get_height(temp.root),
            "order": temp.get_ordered()
        }

    if is_updated:
        bst_out.upload_all()

    return jsonify(graphs_out)

@bst_graph_bp.route('/create/<string:graph_name>', methods=["GET", "POST"])
def insert_bst(graph_name: str):
    global bst_out
    
    bst_out.insert(graph_name)
    return get_bst(is_updated = True)

@bst_graph_bp.route('/delete/<string:graph_name>', methods=["DELETE", "POST"])
def delete_bst(graph_name: str):
    global bst_out

    bst_out.delete(graph_name)
    return get_bst(is_updated = True)

@bst_graph_bp.route('/rename/<string:old_name>', methods=["PUT", "POST"])
def rename_bst():
    global bst_out
    old_name = request.args.get("old_name")
    new_name = request.args.get("new_name")

    bst_out.rename_file(old_name, new_name)
    return get_bst(is_updated = True)
