import { ObjectId } from "mongodb";

/**
 * 
 * @param doc 
 * @returns document with id coverted to MongoDB ObjectId
 */
export const convertIdToObjectId = (doc: any) => {
	if (doc._id && typeof doc._id === 'string') {
		doc._id = new ObjectId(doc._id);
	}
	return doc;
};

/**
 * 
 * @param doc 
 * @returns object with id coverted to string
 */
export const convertObjectIdToId = (doc: any) => {
	const { _id, ...rest } = doc;
	return { ...rest, _id: _id.toString() };
};

/**
 * 
 * @param doc 
 * @param dateFields 
 * @returns formatted date
 */
export const formatDate = (doc: any, dateFields: string[]) => {
	const formattedDoc = { ...doc };
	for (const field of dateFields) {
		if (formattedDoc[field]) {
			const date = new Date(formattedDoc[field]);
			if (!isNaN(date.getTime())) {
				formattedDoc[field] = date.toISOString();
			}
		}
	}
	return formattedDoc;
};

/**
 * 
 * @param obj 
 * @param parentKey 
 * @param res 
 * @returns coverted nested object from nested object
 * example: name.firstname => name_firstname
 */
export const flattenObject = (obj: any, parentKey = '', res: any = {}) => {
	for (const [key, value] of Object.entries(obj)) {
		const newKey = parentKey ? `${parentKey}_${key}` : key;
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			flattenObject(value, newKey, res);
		} else if (Array.isArray(value)) {
			value.forEach((item, index) => {
				flattenObject(item, `${newKey}[${index}]`, res);
			});
		} else {
			res[newKey] = value;
		}
	}
	return res;
}

/**
 * 
 * @param doc 
 * @returns coverts all nested fields into stringified field
 */
export const stringifyNestedFields = (doc: any) => {
	return Object.fromEntries(
		Object.entries(doc).map(([key, value]) => {
			if (typeof value === 'object' && value !== null) {
				return [key, JSON.stringify(value)];
			}
			return [key, value];
		})
	);
}