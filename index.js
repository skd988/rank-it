import {getNumOfComparisonsRange, getExpectedNumOfComparisons} from "./math.js";

const createElementFromHtml = htmlString => 
{
	const elem = document.createElement('template');
	elem.innerHTML = htmlString.trim();
	return elem.content;
};

const shuffleArray = arr =>
{
	const shuffledArr = [...arr];
	for(let i = shuffledArr.length; i--> 0;)
	{
		const randIndex = Math.floor(Math.random() * (i + 1));
		const temp = shuffledArr[i];
		shuffledArr[i] = shuffledArr[randIndex];
		shuffledArr[randIndex] = temp;
	}
	return shuffledArr;
};

const descPred = (left, right) =>
{
    return left < right;
};

const mergeSort = async (arr, compareFn=descPred) =>
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

const initConfig = () =>
{
    const params = new URLSearchParams(document.location.search);
    let config;
    try
    {
        config = JSON.parse(LZString.decompressFromBase64(params.get('config').replace('-', '+' )));

        if(!typeof(config['list'].constructor === Array))
            throw 'Invalid config';
    }
    catch(e)
    {
        config = {'list': []};
    }
    return config;
}

document.addEventListener('DOMContentLoaded', () => 
{
    const listElement = document.querySelector('#list');
    const leftButton = document.querySelector('#left-button');
    const rightButton = document.querySelector('#right-button');
    const questionElement = document.querySelector('#question');
    const sortListButton = document.querySelector('#sort-list-button');
    const shareButton = document.querySelector('#share-button');
    const resultsElement = document.querySelector('#results');
    const infoElement = document.querySelector('#info');
    const shuffleCheckbox = document.querySelector('#shuffle');
    const linkElement = document.querySelector('#link');

    const config = initConfig();

    if(config['list'].length)
        listElement.value = config['list'].join('\n');

    const getInputList = () => 
    {
        return listElement.value.split('\n').filter(i => i);
    };
    
    const renderComparisons = size =>
    {
        const range = getNumOfComparisonsRange(size);
        const avg = getExpectedNumOfComparisons(size);
        infoElement.innerHTML = '';
        infoElement.appendChild(createElementFromHtml(`<h4>List's length: ${size}</h4>`));
        infoElement.appendChild(createElementFromHtml(`<h4>Comparisons Range: ${range[0]}-${range[1]}</h4>`));
        infoElement.appendChild(createElementFromHtml(`<h4>Comparisons Average: ${avg}</h4>`));
    };

    const sortList = async () =>
    {
        resultsElement.innerHTML = '';
        config['list'] = getInputList();
        if(shuffleCheckbox.checked)
            config['list'] = shuffleArray(config['list']);
        renderComparisons(config['list'].length);
        mergeSort(config['list'], inputCompare).then(sorted =>
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

    const share = () =>
    {
        config['list'] = getInputList();
        const compressedConfig = LZString.compressToBase64(JSON.stringify(config));
        const link = location.protocol + '//' + location.host + location.pathname + '?config=' + compressedConfig.replace('+', '-');
        linkElement.href = link;
        linkElement.innerText = 'Link!';
        navigator.clipboard.writeText(link);
    };

    sortListButton.addEventListener('mousedown', sortList);
    shareButton.addEventListener('mousedown', share);
});