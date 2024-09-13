import { ObjectId } from "mongodb";

// Convert text id to MongoDB Object Id
export const convertIdToDocumentObjectId = (doc: any) => {
	if (doc._id && typeof doc._id === 'string') {
		doc._id = new ObjectId(doc._id);
	}
	return doc;
};

// Convert MongoDB Object Id to string id
export const convertIdObjectIdToDocument = (doc: any) => {
	const { _id, ...rest } = doc;
	return { ...rest, _id: _id.toString() };
};