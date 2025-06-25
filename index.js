import {getNumOfQuestionsRange, getAverageNumOfQuestions} from "./math.js";

const createElementFromHtml = htmlString => 
{
	const elem = document.createElement('template');
	elem.innerHTML = htmlString.trim();
	return elem.content;
};

const shuffleArray = arr =>
{
	arr = [...arr];
	for(let i = arr.length - 1; i > 0; --i)
	{
		const randIndex = Math.floor(Math.random() * (i + 1));
		const temp = arr[i];
		arr[i] = arr[randIndex];
		arr[randIndex] = temp;
	}
	return arr;
};

const autoSort = (left, right) =>
{
    return left < right;
};

const mergeSort = async (arr, compareFn=autoSort) =>
{
    if(arr.length <= 1)
        return arr;
    
    arr = [...arr];
    const mid = Math.floor(arr.length / 2);
    const leftArr = await mergeSort(arr.slice(0, mid), compareFn);
    const rightArr = await mergeSort(arr.slice(mid, arr.length), compareFn);
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
    const sortListButton = document.querySelector('#sort-list-button');
    const resultsElement = document.querySelector('#results');
    const infoElement = document.querySelector('#info');
    const shuffleCheckbox = document.querySelector('#shuffle');


    const getInputList = () => 
    {
        return listElement.value.split('\n').filter(i => i);
    };
    
    const addInfo = size =>
    {
        const range = getNumOfQuestionsRange(size);
        const avg = getAverageNumOfQuestions(size);
        infoElement.innerHTML = '';
        infoElement.appendChild(createElementFromHtml(`<h4>List's length: ${size}</h4>`));
        infoElement.appendChild(createElementFromHtml(`<h4>Comparisons Range: ${range[0]}-${range[1]}</h4>`));
        infoElement.appendChild(createElementFromHtml(`<h4>Comparisons Average: ${avg}</h4>`));
    };

    const sortList = async () =>
    {
        resultsElement.innerHTML = '';
        let lst = getInputList();
        if(shuffleCheckbox.checked)
            lst = shuffleArray(lst);
        addInfo(lst.length);
        mergeSort(lst, inputCompare).then(sorted =>
        {
            questionElement.innerText = '';
            sorted.forEach(val => resultsElement.appendChild(createElementFromHtml(`<li>${val}</li>`)));
        })
        .catch(e => console.log(e))
    };

    
    const inputCompare = async (left, right) => 
    {
        let leftButtonFn, rightButtonFn, resortingFn, inputCompareKeysFn;
        return new Promise((resolve, reject) => 
        {
            leftButtonFn = () => resolve(true);
            rightButtonFn = () => resolve(false);
            resortingFn = () => reject('Resorting');
            inputCompareKeysFn = e => 
            {
                const key = e.key;
                if (key === 'ArrowLeft')
                    resolve(true);
                else if (key === 'ArrowRight')
                    resolve(false);
                else if (key === 's')
                    reject('Resorting')
            };

            questionElement.innerText = `${left} VS ${right}`;
            leftButton.addEventListener('mousedown', leftButtonFn);
            rightButton.addEventListener('mousedown', rightButtonFn);
            sortListButton.addEventListener('mousedown', resortingFn);
            document.addEventListener('keydown', inputCompareKeysFn);
        })
        .finally(() => 
        {
            document.removeEventListener('keydown', inputCompareKeysFn);
            document.removeEventListener('mousedown', leftButtonFn);
            document.removeEventListener('mousedown', rightButtonFn);
            document.removeEventListener('mousedown', resortingFn);
        });
    };

    sortListButton.addEventListener('mousedown', sortList);
});