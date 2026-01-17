from .bubble_sort import bubble_sort
from .insertion_sort import insertion_sort
from .merge_sort import merge_sort
from .quick_sort import quick_sort
from .selection_sort import selection_sort

algo_dict = {
    "bubbleSort": bubbleSort,
    "insertionSort": insertion_sort,
    "mergeSort": merge_sort,
    "quickSort": quick_sort,
    "selectionSort": selection_sort
}

def alg_exec(algo_name: str, arr: list, left: int, right: int):
    return algo_dict.get(algo_name, "bubbleSort")(arr, left, right)
