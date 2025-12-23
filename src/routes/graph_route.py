from flask import Blueprint, render_template, jsonify
from src.logic.graph_bfs import Graph, Node, TrainWeight
from src.database.train_db import TrainDB
import json

graph_bp = Blueprint('graph_', __name__)
folder_path = "data/railway_fare"
graph_out = TrainDB(folder_path, fetch_data = True)

def parse_bfs(path: list[str], tags: list[str]):
    parsed_path = []
    parsed_weight = TrainWeight()
    from_station = path[0]
    temp_arr = [tags[0]]
  
    def update_weights(from_s, to_s, train = None):
        nonlocal parsed_weight
        nonlocal parsed_path
        nonlocal temp_arr

        parsed_weight += graph_out.get_weights(from_s, to_s)
        parsed_path.append(temp_arr)
        temp_arr = [train]

    for p, t in zip(path, tags):
        if t != temp_arr[0]:
            #adds the weight when transferring trains
            parsed_weight += graph_out.get_weights(temp_arr[-1], p)

            update_weights(from_station, temp_arr[-1], t)
            from_station = p
        temp_arr.append(p)
    update_weights(from_station, path[-1])

    parsed_dict = {
        "path": parsed_path,
        "stored value": parsed_weight.stored,
        "single journey": parsed_weight.single,
        "time": parsed_weight.time
    }
    return parsed_dict
     
@graph_bp.route('/')
def graph_update():
    return render_template('directions.html')

@graph_bp.route('/search/path/<string:start>/<string:end>')
def search_shortest_path_by_stations(start: str, end: str):
    try:
        path, tags = graph_out.get_graph().bfs(
            start,
            end,
            include_tags = True
        )

        if not path or len(path) == 0:
            return jsonify(message="Start or End stations does not exist"), 404
    
        if len(path) == 0:
            return jsonify(message="No valid route found"), 404
    
        return jsonify(parse_bfs(path, tags)), 200
        
    except Exception as e:
        raise Exception(e)
        return jsonify(message=f"Error processing route: {str(e)}"), 500
    
@graph_bp.route('/search/time/<string:start>/<string:end>')
def search_shortest_path_by_time(start: str, end: str):
    raise Exception("API still in development")

@graph_bp.route('/search/cost/<string:start>/<string:end>')
def search_shortest_path_by_cost(start: str, end: str):
    raise Exception("API still in development")
