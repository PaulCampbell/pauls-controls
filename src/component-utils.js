export const upgradeProperty = (element, prop) => {
	if (!element || !prop) {
		return;
	}
	if (Object.prototype.hasOwnProperty.call(element, prop)) {
		const value = element[prop];
		delete element[prop];
		element[prop] = value;
	}
};

export const emit = (
	element,
	type,
	detail,
	options = {
		bubbles: true,
		composed: true,
	}
) => {
	if (!element || !type) {
		return false;
	}

	const eventOptions = {
		detail,
		bubbles: options?.bubbles !== false,
		composed: options?.composed !== false,
	};

	return element.dispatchEvent(new CustomEvent(type, eventOptions));
};

export const parseJsonAttribute = (value, { fallback = null, warnLabel = null } = {}) => {
	if (!value) {
		return fallback;
	}

	try {
		return JSON.parse(value);
	} catch (error) {
		if (warnLabel) {
			console.warn(warnLabel, error);
		}
		return fallback;
	}
};

export const normalizeStringArray = (
	input,
	{ trim = true, removeEmpty = true } = {}
) => {
	if (!Array.isArray(input)) {
		return [];
	}

	const normalized = input.map((item) => {
		if (item == null) {
			return '';
		}
		const stringValue = String(item);
		return trim ? stringValue.trim() : stringValue;
	});

	return removeEmpty ? normalized.filter((item) => item.length > 0) : normalized;
};
