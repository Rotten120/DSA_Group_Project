def merge_sort(arr, left, right):
    if left < right:
        mid = (left + right) // 2
        yield from merge_sort(arr, left, mid)
        yield from merge_sort(arr, mid + 1, right)
        yield from merge(arr, left, mid, right)

def merge(arr, left, mid, right):
    L = arr[left:mid+1]
    R = arr[mid+1:right+1]
    i = 0
    j = 0
    k = left

    while i < len(L) and j < len(R):
        # The two lines below are not part of the algorithm
        yield arr, left+i, mid+j, left, right
        if L[i] < R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1

    while i < len(L):
        arr[k] = L[i]
        i += 1
        k += 1

    while j < len(R):
        arr[k] = R[j]
        j += 1
        k += 1
