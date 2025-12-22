from flask import Blueprint, render_template, jsonify
from src.logic.graph_bfs import Graph, Node
from src.database.train_db import TrainDB
import json

graph_bp = Blueprint('graph_', __name__)
folder_path = "data/railway_fare"
graph_out = TrainDB(folder_path, fetch_data = True)

@graph_bp.route('/')
def graph_update():
    global graph_bp
    return render_template('directions.html')

@graph_bp.route('/search/path/<string:start>/<string:end>')
def search_shortest_path_by_stations(start: str, end: str):
    global graph_bp
    #stations is empty
    if not stations:
        return jsonify(message = "Start or End stations does not exist"), 404

    body = {"stations": stations, "time": 0, "cost": 0}
    return jsonify(
        body
    ), 200

@graph_bp.route('/search/time/<string:start>/<string:end>')
def search_shortest_path_by_time(start: str, end: str):
    raise Exception("API still in development")

@graph_bp.route('/search/cost/<string:start>/<string:end>')
def search_shortest_path_by_cost(start: str, end: str):
    raise Exception("API still in development")
