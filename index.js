import {getNumOfComparisonsRange, getExpectedNumOfComparisons} from "./math.js";
import {createRandomPermutation, shuffleArrayByPermutation, mergeSort} from "./array.js";

const createElementFromHtml = htmlString => 
{
    const elem = document.createElement('template');
    elem.innerHTML = htmlString.trim();
    return elem.content;
};

const loadConfig = () =>
{
    const params = new URLSearchParams(document.location.search);
    let config = {};
    try
    {
        if(!params.has('config'))
            return config;
        
        config = JSON.parse(LZString.decompressFromBase64(params.get('config').replaceAll('-', '+' )));

        if(!typeof(config['list'].constructor === Array))
            throw 'Invalid config';
    }
    catch(e)
    {
        console.error(e);
    }

    return config;
};

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

    const config = loadConfig();
    let list = config['list']? config['list'] : [];
    let save = config['save']? config['save'].map(i => Boolean(i)) : [];
    let permutation = config['permutation']? config['permutation'] : null;

    let saveIndex = 0;

    shuffleCheckbox.checked = save.length === 0 || permutation !== null;

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

    const rankList = async list =>
    {
        resultsElement.innerHTML = '';
        renderComparisons(list.length);
        mergeSort([...list], inputCompare).then(sorted =>
        {
            questionElement.innerText = '';
            save = [];
            permutation = null;
            sorted.forEach(val => resultsElement.appendChild(createElementFromHtml(`<li>${val}</li>`)));
        })
        .catch(e => 
        {
            if(e !== 'Resorting')
                console.error(e);
        })
    };

    
    const inputCompare = async (left, right) => 
    {
        let leftButtonFn, rightButtonFn, resortingFn, inputCompareKeysFn;
        
        return new Promise((resolve, reject) => 
        {
            if(saveIndex < save.length)
                return resolve(save[saveIndex]);

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
        .then(answer =>
        {
            if(saveIndex >= save.length)
                save.push(answer);

            ++saveIndex;
            return answer;
        })
        .finally(() => 
        {
            document.removeEventListener('keydown', inputCompareKeysFn);
            leftButton.removeEventListener('mousedown', leftButtonFn);
            rightButton.removeEventListener('mousedown', rightButtonFn);
            sortListButton.removeEventListener('mousedown', resortingFn);
        });
    };

    const share = () =>
    {
        config['list'] = list.length? list : getInputList();
        config['save'] = save.map(i => +i);
        config['permutation'] = permutation? permutation : null;
        const compressedConfig = LZString.compressToBase64(JSON.stringify(config));
        const link = location.protocol + '//' + location.host + location.pathname + '?config=' + compressedConfig.replaceAll('+', '-');
        linkElement.href = link;
        linkElement.innerText = 'Link!';
        navigator.clipboard.writeText(link);
    };

    if(list.length)
    {
        listElement.value = list.join('\n');
        let listToRank;
        if(save.length && permutation !== null)
            listToRank = shuffleArrayByPermutation(list, permutation);
        else if(shuffleCheckbox.checked)
        {
            permutation = createRandomPermutation(list.length);
            listToRank = shuffleArrayByPermutation(list, permutation);
        }
        else
        {
            listToRank = [...list];
            permutation = null;
        }
        rankList(listToRank);
    }

    sortListButton.addEventListener('mousedown', () => 
    {
        list = getInputList();
        save = [];
        saveIndex = 0;
        let listToRank;
        if(shuffleCheckbox.checked)
        {
            permutation = createRandomPermutation(list.length);
            listToRank = shuffleArrayByPermutation(list, permutation);
        }
        else
        {
            listToRank = [...list];
            permutation = null;
        }
        rankList(listToRank);    
    });
    shareButton.addEventListener('mousedown', share);
});