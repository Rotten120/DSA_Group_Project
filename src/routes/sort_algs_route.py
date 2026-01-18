from flask import Blueprint, request, render_template
from src.logic.sorting_algos import get_alg_iterator
import json

sort_bp = Blueprint('sorting', __name__)

@sort_bp.route('/')
def sort_update():
    return render_template('sorting.html')

@sort_bp.route('/<string:algo>')
def run_sorting_algorithm(algo: str, arr: list = []):
    data = request.get_json()
    arr = data.get("arrToSort", arr)
    sorting_iterator = get_alg_iterator(algo, arr, 0, len(arr) - 1)
    animation_out = []

    try:
        while True:
            temp_arr, red_bar1, red_bar2, blue_bar1, blue_bar2 = next(sorting_iterator)
            copy_arr = temp_arr.copy()
            animation_out.append((copy_arr, red_bar1, red_bar2, blue_bar1, blue_bar2))
    except StopIteration:
        pass

    return animation_out
