const listElement = document.querySelector('#list');
const leftButton = document.querySelector('#left-button');
const rightButton = document.querySelector('#right-button');
const questionElement = document.querySelector('#question');
const addRowButton = document.querySelector('#add-to-list-button');
const sortListButton = document.querySelector('#sort-list-button');
const resultsElement = document.querySelector('#results');
let lst = [];

const createElementFromHtml = htmlString => 
{
	const elem = document.createElement('template');
	elem.innerHTML = htmlString.trim();
	return elem.content;
};

const addToList = () =>
{
    listElement.appendChild(createElementFromHtml(`<li><input type="textbox"></li>`));
};

const mergeSort = async arr =>
{
    if(arr.length <= 1)
        return arr;
	
    const mid = Math.floor(arr.length / 2);
    const leftArr = await mergeSort([...arr.slice(0, mid)]);
    const rightArr = await mergeSort([...arr.slice(mid, arr.length)]);

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
		{
            //answer = leftArr[left] < rightArr[right];
            answer = await new Promise(resolve => 
            {
                questionElement.innerText = `${leftArr[left]} VS ${rightArr[right]}`;
                leftButton.addEventListener('mousedown', () => resolve(false));
                rightButton.addEventListener('mousedown', () => resolve(true));
            });
		}
        if(answer)
            arr[i] = leftArr[left++];
        else
            arr[i] = rightArr[right++];
    }
    return arr;
};

const sortList = async () =>
{
    let lst = Array.from(listElement.children).map(item => item.querySelector('input').value);
    lst = await mergeSort(lst);
    questionElement.innerText = '';
    resultsElement.innerHTML = ''
    lst.forEach(val => resultsElement.appendChild(createElementFromHtml(`<li>${val}</li>`)));
};

addToList();

addRowButton.addEventListener('mousedown', addToList);
sortListButton.addEventListener('mousedown', sortList);