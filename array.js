export const swap = (arr, i, j) =>
{
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
};

export const createRandomPermutation = length =>
{
    const permutation = Array.from(Array(length).keys());
    for(let i = length; i--> 0;)
        swap(permutation, i, Math.floor(Math.random() * (i + 1)));

    return permutation;
};

export const shuffleArrayByPermutation = (arr, permutation) =>
{
    if(!permutation || permutation.length !== arr.length)
        permutation = createRandomPermutation(arr.length);

    return permutation.map(i => arr[i]);
};

export const descPred = (left, right) =>
{
    return left < right;
};

export const mergeSort = async (arr, compareFn=descPred) =>
{
    if(arr.length <= 1)
        return arr;
    
    const sortedArr = [...arr];
    const mid = Math.floor(sortedArr.length / 2);
    const leftArr = await mergeSort(sortedArr.slice(0, mid), compareFn);
    const rightArr = await mergeSort(sortedArr.slice(mid, sortedArr.length), compareFn);
    let left = 0;
    let right = 0;
    let answer;
    for(let i = 0; i < arr.length; ++i)
    {
        if(left === leftArr.length)
            answer = false;
        else if(right === rightArr.length)
            answer = true;
        else
            answer = await compareFn(leftArr[left], rightArr[right]);

        if(answer)
            sortedArr[i] = leftArr[left++];
        else
            sortedArr[i] = rightArr[right++];
    }
    return sortedArr;
};
