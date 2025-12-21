from flask import Blueprint, render_template, request, jsonify, send_from_directory

projects_bp = Blueprint('projects', __name__)
filepath = "data/project_details.json"
project_details = None

def load_project_details():
    if not project_details is None:
        return

    with open(filepath, 'r') as file:
        projects = json.load(file)

@projects_bp.route('/')
def projects():
    return render_template('project.html')

@projects_bp.route('/fetch/desc/<string:title>', methods=["GET"])
def fetch_project_details(title: str):
    load_project_details()

    if title in project_details:
        return jsonify(project_details[title])
    return jsonify(project_details["template_"])

@projects_bp.route('/fetch/image/<string:title>')
def fetch_project_image(title: str):
    load_project_details()

    if title in project_details:
        return send_from_directory('data', project_details[title]["bg-img"])
    return send_from_directory('data', project_details["template_"]["bg-img"])
