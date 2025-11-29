from flask import Blueprint, render_template, request, jsonify
from src.binary_tree import *

bitree_bp = Blueprint('bitree', __name__)
bitree_out = BinaryTree()
isleft = True

@bitree_bp.route('/')
def bitree_update():
    global bitree_out
    return render_template(
        'binary-tree.html',
    )

@bitree_bp.route('/get-contacts')
def get_contacts():
    global bitree_out
    tree_list = bitree_out.to_list()
    return jsonify([temp_node.value.to_dict() for temp_node in tree_list])

@bitree_bp.route('/create', methods=["GET", "POST"])
def create_contact():
    global bitree_out
    global isleft
    value = request.json.get("value")
   
    if isleft:
        bitree_out.insert_left(bitree_out.root, Contact.import_dict(value))
    else:
        bitree_out.insert_right(bitree_out.root, Contact.import_dict(value))
    isleft = not isleft

    return get_contacts()

@bitree_bp.route('/delete/<int:cid>', methods=["GET", "DELETE"])
def delete_contact(cid):
    global bitree_out
    
    rm_node = bitree_out.search(bitree_out.root, cid, is_root_iterable=True)
    bitree_out.delete(bitree_out.root, rm_node)
    return get_contacts()

@bitree_bp.route('/update/<int:cid>', methods=["GET", "PUT"])
def update_contact(cid):
    global bitree_out
    value = request.json.get("value")

    searched_node = bitree_out.search(bitree_out.root, cid, is_root_iterable=True)
    searched_node.value = Contact.import_dict(value)
    return get_contacts()

@bitree_bp.route('/toggle-favorite/<int:cid>', methods=["GET", "PUT"])
def toggle_favorite(cid):
    global bitree_out
    
    searched_node = bitree_out.search(bitree_out.root, cid, is_root_iterable=True)
    searched_node.value.is_fav = not searched_node.value.is_fav
    return get_contacts()
