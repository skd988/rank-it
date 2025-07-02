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

const compressAndEncodeToBase64 = obj => toBinary(LZString.compress(JSON.stringify(obj))).replaceAll('+', '-');

const decompressAndDecodeFromBase64 = compressed => JSON.parse(LZString.decompress(fromBinary(compressed.replaceAll('-', '+'))));

function toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++)
        codeUnits[i] = string.charCodeAt(i);

    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}

function fromBinary(encoded) {
    console.log(encoded)
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++)
        bytes[i] = binary.charCodeAt(i);

    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}
let config2 = {};
try{

    let params = new URLSearchParams(document.location.search);
    config2 = params.get('config');
}
catch(e){
    console.log(e)
}
document.addEventListener('DOMContentLoaded', () => 
{
    const listElement = document.querySelector('#list');
    const leftButton = document.querySelector('#left-button');
    const rightButton = document.querySelector('#right-button');
    const saveButton = document.querySelector('#save-button');
    const questionElement = document.querySelector('#question');
    const sortListButton = document.querySelector('#sort-list-button');
    const resultsElement = document.querySelector('#results');
    const infoElement = document.querySelector('#info');
    const saveLinkElement = document.querySelector('#save-link');
    const configElement = document.querySelector('#config');
    const configCompress = document.querySelector('#config-compress');
    const config = {'list': []};

    try{
        config2 = decompressAndDecodeFromBase64(config2);

        console.log(config2)
        if (config2)
           list.value = config2['list'].join('\n');
    }
    catch(e){
        console.log(e);
    }
    console.log('hello!')
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
    



    const sortList = async () =>
    {
        resultsElement.innerHTML = '';
        const lst = getInputList();
        config['list'] = lst;
        var string = JSON.stringify(config);
        console.log('string:', string)
        console.log("Size of sample is: " + string.length);
        var compressed = LZString.compress(string);
        console.log('Orig compressed:', compressed);
        console.log("Size of compressed sample is: " + compressed.length);
        var bin_compressed = toBinary(compressed);
        console.log('compressed binary:\n',bin_compressed);
        console.log('compressed binary size:\n', bin_compressed.length);
        console.log(LZString.decompress(fromBinary(bin_compressed)) === string);
        const config64 = toBinary(string);
        configElement.innerText = config64;
        console.log('base64:\n', config64);
        console.log('base64 size:', config64.length);
        console.log(fromBinary(config64) === string)
        console.log(decompressAndDecodeFromBase64(compressAndEncodeToBase64(config)))
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
    saveButton.addEventListener('mousedown', () =>
    {
            console.log('bye!')
        const lst = getInputList();
        config['list'] = lst;
        console.log(compressAndEncodeToBase64(config))
        saveLinkElement.innerText = location.host + location.pathname + '?config=' + compressAndEncodeToBase64(config);
        saveLinkElement.href = location.host + location.pathname + '?config=' + compressAndEncodeToBase64(config);
        //saveLinkElement.innerText = window.location.href + '?config=' + compressAndEncodeToBase64(config);
        //saveLinkElement.href = window.location.href + '?config=' + compressAndEncodeToBase64(config);
    });
    sortListButton.addEventListener('mousedown', sortList);
});