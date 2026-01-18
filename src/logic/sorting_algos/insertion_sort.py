def insertion_sort(arr, *args):
    n = len(arr)
    for i in range(0, n):
        j = i-1
        key = arr[i]
        while j >= 0 and arr[j] > key:
            yield arr, j, -1, i, -1
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    yield arr, -1, -1, -1, -1
