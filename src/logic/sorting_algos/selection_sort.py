def selection_sort(arr, *args):
    n = len(arr)
    for i in range(n - 1):
        min_index = i
        for j in range(i, size):
            yield arr, j, -1, i, -1
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]
