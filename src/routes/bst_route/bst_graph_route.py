from flask import Blueprint, request, jsonify
from src.binary_search_tree.bst import BinarySearchTree
from src.database.bst_db import BstFolderDB

bst_graph_bp = Blueprint('graph', __name__)

@bst_bp.route('/fetch/<str: graph_name>', methods=["GET"])
def get_bst_json(graph_name: str, is_updated: bool = False):
    global bst_out
    graph = bst_out.get(graph_name)

    dict_out = {
        "nodes": graph.__dict__(),
        "min": graph.get_min(graph.root),
        "max": graph.get_max(graph.root),
        "height": graph.get_height(graph.root),
        "order": graph.get_ordered()
    }
    
    if is_updated:
        bst_out.upload(graph_name)
    return jsonify(dict_out)

@bst_bp.route('/fetch/all', methods=["GET"])
def get_bst(is_updated: bool = False):
    global bst_out
    graphs = bst_out.get_all()
    graphs_out = {}

    for graph_name in graphs:
        temp = graphs[graph_name].get()
        graphs_out[graph_name] = {
            "nodes": temp.__dict__(),
            "min": temp.get_min(temp.root),
            "max": temp.get_max(temp.root),
            "height": temp.get_height(temp.root),
            "order:" temp.get_ordered()
        }

    if is_updated:
        bst_out.upload_all()
    return jsonify(graphs_out)

@bst_bp.route('/create/<str: graph_name>', methods=["GET", "POST"])
def insert_bst(graph_name: str):
    global bst_out
    
    bst_out.insert(graph_name)
    return get_bst(is_updated = True)

@bst_bp.route('/delete/<str: graph_name>', methods=["DELETE", "POST"])
def delete_bst(graph_name: str):
    global bst_out

    bst_out.delete(graph_name)
    return get_bst(is_updated = True)

@bst_bp.route('/rename/<str: old_name>', methods=["PUT", "POST"])
def rename_bst(old_name: str, new_name: str):
    global bst_out

    bst_out.rename_file(old_name, new_name)
    return get_bst(is_updated = True)
