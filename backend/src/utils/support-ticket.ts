import mongoose from "mongoose";

const getAllowedFields = (
  schema: mongoose.Schema,
  baseSchemaFields: string[]
): string[] => {
  const allFields = Object.keys(schema.paths);
  // allow fields that are part of the base interface
  return allFields.concat(baseSchemaFields);
};

export { getAllowedFields };
