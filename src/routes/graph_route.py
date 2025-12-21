from flask import Blueprint, render_template, jsonify
from src.logic.graph_bfs import Graph, Node
from database.train_db import TrainDB
import json

graph_bp = Blueprint('graph', __name__)
folder_path = "data/railway_fare/"
graph_out = TrainDB(folder_path, fetch_data = True)

@graph_bp.route('/')
def graph_update():
    global graph_bp
    return render_template('directions.html')

@graph_bp.route('/search/path/<string:start>/<string:end>')
def search_shortest_path_by_stations(start: str, end: str):
    global graph_bp
    return jsonify({
        "stations": graph_bp.get().bfs(start, end),
        "time": 0,
        "cost": 0
    )

@graph_bp.route('/search/time/<string:start>/<string:start>')
def search_shortest_path_by_time(start: str, end: str):
    raise Exception("API still in development")

@graph_bp.route('/search/cost/<string:start>/<string:start>')
def search_shortest_path_by_cost(start: str, end: str):
    raise Exception("API still in development")
