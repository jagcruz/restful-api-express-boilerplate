module.exports.capitalize = str => {
	if (str) {
		if (str.length === 1) {
			return str.toUpperCase();
		}
		if (str.length > 1) {
			return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
		}
	}

	return str;
};
