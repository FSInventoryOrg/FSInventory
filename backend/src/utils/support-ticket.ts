import mongoose from "mongoose";

const getAllowedFields = (
  schema: mongoose.Schema,
  baseSchemaFields: string[],
  omittedFields: string[] = []
): string[] => {
  const allFields = Object.keys(schema.paths);
  // allow fields that are part of the base interface
  // except for omitted fields.
  return allFields.concat(
    baseSchemaFields.filter((field) => {
      return !omittedFields.includes(field);
    })
  );
};

// Helper to exclude Mongoose-specific fields
const getSearchableFields = (schema: mongoose.Schema) => {
  return Object.entries(schema.paths)
    .filter(([path, schemaType]) => {
      return (
        !["_id", "__v", "createdAt", "updatedAt"].includes(path) &&
        schemaType.instance === "String"
      ); // Only include string fields
    })
    .map(([path]) => path);
};

export { getAllowedFields, getSearchableFields };
