const buildNestedUpdateFields = (source, parentKey, updateFields) => {
  if (!source || typeof source !== "object") return;

  Object.entries(source).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      updateFields[`${parentKey}.${key}`] = value;
    }
  });
};

module.exports = buildNestedUpdateFields;