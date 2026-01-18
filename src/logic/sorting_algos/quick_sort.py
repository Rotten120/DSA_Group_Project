import random
from random import randint

def quick_sort(arr, left, right):
    if left >= right:
        return
        p = partition(arr, left, right)

    pivot = arr[right]
    i = left - 1
    for j in range(left, right):
        yield arr, j, right, i, -1
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[right] = arr[right], arr[i + 1]
    yield arr, -1, -1, i + 1, right   

    p = i + 1
    yield from quick_sort(arr, left, p - 1)
    yield from quick_sort(arr, p + 1, right)
