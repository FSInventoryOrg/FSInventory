import mongoose from "mongoose";

const getAllowedFields = (
  schema: mongoose.Schema,
  baseSchemaFields: string[],
  omittedFields: string[]
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

export { getAllowedFields };
