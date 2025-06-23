const createElementFromHtml = htmlString => 
{
	const elem = document.createElement('template');
	elem.innerHTML = htmlString.trim();
	return elem.content;
};

const autoSort = (left, right) =>
{
    return left < right;
};

const mergeSort = async (arr, compareFn=autoSort) =>
{
    arr = [...arr];
    if(arr.length <= 1)
        return arr;
	
    const mid = Math.floor(arr.length / 2);
    const leftArr = await mergeSort(arr.slice(0, mid), compareFn);
    const rightArr = await mergeSort(arr.slice(mid, arr.length), compareFn);
    let left = 0;
    let right = 0;
	let answer;
    for(let i = 0; i < arr.length; ++i)
    {
		if(left == leftArr.length)
			answer = false;
		else if(right == rightArr.length)
			answer = true;
		else
            answer = await compareFn(leftArr[left], rightArr[right]);

        if(answer)
            arr[i] = leftArr[left++];
        else
            arr[i] = rightArr[right++];
    }
    return arr;
};


document.addEventListener('DOMContentLoaded', () => 
{
    const listElement = document.querySelector('#list');
    const leftButton = document.querySelector('#left-button');
    const rightButton = document.querySelector('#right-button');
    const questionElement = document.querySelector('#question');
    const addRowButton = document.querySelector('#add-to-list-button');
    const sortListButton = document.querySelector('#sort-list-button');
    const resultsElement = document.querySelector('#results');
    
    const getInputList = () => 
    {
        return listElement.value.split('\n').filter(i => i);
    };
    
    const sortList = async () =>
    {
        const lst = getInputList();
        mergeSort(lst, inputCompare).then(sorted =>
        {
            questionElement.innerText = '';
            resultsElement.innerHTML = '';
            sorted.forEach(val => resultsElement.appendChild(createElementFromHtml(`<li>${val}</li>`)));
        })
        .catch(e => console.log(e))
    };

    const inputCompare = async (left, right) => 
    {
        return new Promise((resolve, reject) => 
        {
            questionElement.innerText = `${left} VS ${right}`;
            leftButton.addEventListener('mousedown', () => resolve(true));
            rightButton.addEventListener('mousedown', () => resolve(false));
            sortListButton.addEventListener('mousedown', () => reject('Resorting'));
            document.addEventListener('keydown', e => 
            {
                const key = e.key;
                if (key === 'ArrowLeft')
                    resolve(true);
                else if (key === 'ArrowRight')
                    resolve(false);
            });
        });
    };

    sortListButton.addEventListener('mousedown', sortList);
});
