const buildNestedUpdateFields = (source, parentKey, updateFields) => {
  if (!source) return;

  for (const key in source) {
    const value = source[key];

    if (value !== "" && value !== null && value !== undefined) {
      updateFields[`${parentKey}.${key}`] = value;
    }
  }
};

module.exports =  buildNestedUpdateFields