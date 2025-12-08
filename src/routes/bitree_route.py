from flask import Blueprint, render_template, request, jsonify
from src.logic.binary_tree import BinaryTree, Node, Contact 
import json

bitree_bp = Blueprint('bitree', __name__)

filepath = "data/bitree_contacts.json"
temp = None

with open(filepath, 'r') as file:
    temp = json.load(file)

bitree_out = BinaryTree.import_dict(temp, Contact)
isleft = True

@bitree_bp.route('/')
def bitree_update():
    global bitree_out
    return render_template('binary-tree.html')

@bitree_bp.route('/get-contacts')
def get_contacts(is_updated = False):
    global bitree_out
    tree_json = bitree_out.__dict__()

    if is_updated:
        with open(filepath, 'w') as file:
            json.dump(tree_json, file, indent=4)

    return jsonify([tree_json[node_id]["value"] for node_id in tree_json])

@bitree_bp.route('/create', methods=["GET", "POST"])
def create_contact():
    global bitree_out
    global isleft

    value = request.json.get("value")
    contact_detail = Contact.import_dict(value)  

    if isleft:
        bitree_out.insert_left(bitree_out.root, contact_detail, contact_detail.id)
    else:
        bitree_out.insert_right(bitree_out.root, contact_detail, contact_detail.id)
    isleft = not isleft

    return get_contacts(is_updated = True)

@bitree_bp.route('/delete/<int:cid>', methods=["DELETE"])
def delete_contact(cid):
    global bitree_out

    bitree_out.root = bitree_out.delete(bitree_out.root, cid)

    tree_json = bitree_out.__dict__()
    with open(filepath, 'w') as file:
        json.dump(tree_json, file, indent=4)

    return jsonify([tree_json[node_id]["value"] for node_id in tree_json])


@bitree_bp.route('/update/<int:cid>', methods=["GET", "PUT"])
def update_contact(cid):
    global bitree_out
    value = request.json.get("value")

    searched_node = bitree_out.search_by_id(bitree_out.root, cid)
    searched_node.value = Contact.import_dict(value)
    return get_contacts(is_updated = True)

@bitree_bp.route('/toggle-favorite/<int:cid>', methods=["GET", "PUT"])
def toggle_favorite(cid):
    global bitree_out
    
    searched_node = bitree_out.search_by_id(bitree_out.root, cid)
    searched_node.value.is_fav = not searched_node.value.is_fav
    return get_contacts(is_updated = True)
