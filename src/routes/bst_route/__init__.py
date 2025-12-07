from flask import Blueprint, render_template, request, jsonify
from src.binary_search_tree.bst import BinarySearchTree
from src.database.bst_db import BstFolderDB

from .bst_node_route import bst_node_bp
from .bst_graph_route import bst_graph_bp

bst_bp = Blueprint('bst', __name__)
bst_bp.register_blueprint(bst_graph_bp, url_prefix="/graph")
bst_bp.register_blueprint(bst_node_bp, url_prefix="/node")

bst_out = BstFolderDB("data/bst_data")

@bst_bp.route('/')
def bst_update():
    return render_template('binary-search-tree.html')
