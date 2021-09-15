const query = {
	price: {
		min: 1000,
		max: 10000,
	},
	sort: 'spec_score',
	exclude: 'exclude_out_of_stock-exclude_upcoming-exclude_global-stock',
};

const queryGenerator = (maxPrice) => {
	const queryObj = { ...query, price: { ...query.price, max: maxPrice } };
	return `price-${queryObj.price.min}_to_${queryObj.price.max}/${queryObj.exclude}?uq=1&sort=${queryObj.sort}&asc=0`;
};

module.exports = {
	queryGenerator,
};
