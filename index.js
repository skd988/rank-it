import {getNumOfQuestionsRange, getAverageNumOfQuestions} from "./math.js";

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
    let params = new URLSearchParams(document.location.search);
    let v = params.get("v"); // is the string "Jonathan"
    console.log(v)
    const listElement = document.querySelector('#list');
    const leftButton = document.querySelector('#left-button');
    const rightButton = document.querySelector('#right-button');
    const questionElement = document.querySelector('#question');
    const sortListButton = document.querySelector('#sort-list-button');
    const resultsElement = document.querySelector('#results');
    const infoElement = document.querySelector('#info');
    const configElement = document.querySelector('#config');
    const configCompress = document.querySelector('#config-compress');
    const config = {'list': []};

    const getInputList = () => 
    {
        return listElement.value.split('\n').filter(i => i);
    };
    
    const addInfo = size =>
    {
        const range = getNumOfQuestionsRange(size);
        const avg = getAverageNumOfQuestions(size);
        infoElement.innerHTML = '';
        infoElement.appendChild(createElementFromHtml(`<h4>List's Length: ${size}</h4>`));
        infoElement.appendChild(createElementFromHtml(`<h4>Comparisons Range: ${range[0]}-${range[1]}</h4>`));
        infoElement.appendChild(createElementFromHtml(`<h4>Comparisons Average: ${avg}</h4>`));
    }
    
    function toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
    }
    function fromBinary(encoded) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
    }

    const sortList = async () =>
    {
        resultsElement.innerHTML = '';
        const lst = getInputList();
        config['list'] = lst;
        const config64 = toBinary(JSON.stringify(config));
        var string = JSON.stringify(config);
        console.log("Size of sample is: " + string.length);
        var compressed = LZString.compress(string);
        console.log("Size of compressed sample is: " + compressed.length);
        console.log('compressed:\n',toBinary(compressed));
        console.log(fromBinary(toBinary(compressed)));
        string = LZString.decompress(compressed);
        console.log("Sample is: " + string);
        configElement.innerText = config64;
        console.log('base64:\n', config64);
        console.log(fromBinary(config64))

        console.log(toBinary(compressed).length)
        console.log(config64.length)
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