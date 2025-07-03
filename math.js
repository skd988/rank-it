export const binomialCoefficient = (() =>
{
    const cache = {};
    return (n, k) => {

        if (k > n)
            return 0;
        
        if (k == 0 || n == 0 || n == k)
            return 1;

        if (!([n,k] in cache))
            cache[[n,k]] = binomialCoefficient(n - 1, k - 1) + binomialCoefficient(n - 1, k);
        
        return cache[[n,k]];
    };
})();

export const getNumOfComparisonsRange = size =>
{
	const ranges = [[0, 0], [0, 0]];
	for (let i = 2; i <= size; ++i)
	{
		let leftSize = Math.floor(i / 2);
		let rightSize = Math.floor(i / 2) + i % 2;
		ranges.push([ranges[leftSize][0] + ranges[rightSize][0] + leftSize, ranges[leftSize][1] + ranges[rightSize][1] + (i - 1) ]);
	}

	return ranges[size];
};

export const getExpectedNumOfComparisons = size =>
{
	const sort_averages = [0, 0];
	for (let n = 2; n <= size; ++n)
	{
		let merge = 0;
		if (n % 2 == 0)
		{
			for (let i = n / 2; i < n; ++i)
				merge += i * binomialCoefficient(i - 1, n / 2 - 1);
			merge /= binomialCoefficient(n - 1, n / 2);
		}
		else
		{
			for (let i = Math.floor(n / 2); i < n; ++i)
				merge += i * (binomialCoefficient(i - 1, Math.floor(n / 2) - 1) + binomialCoefficient(i - 1, Math.floor(n / 2)));
			merge = merge / binomialCoefficient(n, Math.floor(n / 2));
		}
		sort_averages.push(sort_averages[Math.floor(n / 2)] + sort_averages[Math.floor((n + 1) / 2)] + merge);
	}
	return sort_averages[size];
};