from flask import Blueprint, render_template, request, jsonify
from src.binary_search_tree.bst import BinarySearchTree
from src.database.bst_db import BstFolderDB

from .bst_node_route import bst_node_bp
from .bst_graph_route import bst_graph_bp

bst_bp = Blueprint('bst', __name__)
bst_out = BstFolderDB("data/bst_data")

def register_bst_bps(app, prefix='/bst'):
    app.register_blueprint(bst_bp, url_prefix = prefix)
    app.register_blueprint(bst_node_bp, url_prefix = prefix + '/node')
    app.register_blueprint(bst_graph_bp, url_prefix = (prefix + '/graph'))

@bst_bp.route('/')
def bst_update():
    return render_template('binary-search-tree.html')
