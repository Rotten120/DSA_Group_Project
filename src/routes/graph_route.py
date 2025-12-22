from flask import Blueprint, render_template, jsonify
from src.logic.graph_bfs import Graph, Node, TrainWeight
from src.database.train_db import TrainDB
import json

graph_bp = Blueprint('graph_', __name__)
folder_path = "data/railway_fare"
graph_out = TrainDB(folder_path, fetch_data = True) -> dict:

def parse_bfs(path: List[str], weight: TrainWeight, tags: List[str]):
    parsed_dict = {
        "path": [],
        "stored value": weight.stored,
        "single journey": weight.single,
        "time": weight.time
    }

    temp_arr = [tags[0]]
    for p, t in zip(path, tags):
        if t != temp_arr[0]:
            parsed_dict["path"].append(temp_arr)
            temp_arr = [t]
        temp_arr.append(p)
    return parsed_dict
     
@graph_bp.route('/')
def graph_update():
    return render_template('directions.html')

@graph_bp.route('/search/path/<string:start>/<string:end>')
def search_shortest_path_by_stations(start: str, end: str):
    try:
        path, weight, tags = graph_out.get().bfs(
            start,
            end,
            initial_weight = TrainWeight,
            include_tags = True
        )

        if not raw_stations or len(raw_stations) == 0:
            return jsonify(message="Start or End stations does not exist"), 404
    
        if len(stations) == 0:
            return jsonify(message="No valid route found"), 404
     
        return jsonify({parse_bfs(path, weight, tags)}), 200
        
    except Exception as e:
        return jsonify(message=f"Error processing route: {str(e)}"), 500
    
@graph_bp.route('/search/time/<string:start>/<string:end>')
def search_shortest_path_by_time(start: str, end: str):
    raise Exception("API still in development")

@graph_bp.route('/search/cost/<string:start>/<string:end>')
def search_shortest_path_by_cost(start: str, end: str):
    raise Exception("API still in development")
