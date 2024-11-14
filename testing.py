arr = [0 , 1 , 1]

for i  in range(2 ,10):
    arr.append(arr[i-1] + arr[i])

print(arr)