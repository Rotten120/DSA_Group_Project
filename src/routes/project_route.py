from flask import Blueprint, render_template, request, jsonify

projects_bp = Blueprint('projects', __name__)
filepath = "data/project_details.json"
project_details = None

@projects_bp.route('/')
def projects():
    return render_template('project.html')

@projects_bp.route('/fetch/all', methods=["GET"])
def fetch_project_details():
    if project_details is None:
        with open(filepath, 'r') as file:
            project_details = json.load(file)

    return jsonify(project_details)
