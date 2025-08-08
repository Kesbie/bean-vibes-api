/**
 * Utility function to apply toJSON transformations to lean query results
 * This mimics the behavior of the toJSON plugin for lean queries
 */

const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

/**
 * Apply toJSON transformations to a lean query result
 * @param {Object} doc - The lean document
 * @param {Object} schema - The Mongoose schema (optional, for private field removal)
 * @returns {Object} - Transformed document
 */
const leanToJSON = (doc, schema = null) => {
  if (!doc || typeof doc !== 'object') {
    return doc;
  }

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(item => leanToJSON(item, schema));
  }

  // Create a copy to avoid mutating the original
  const ret = { ...doc };

  // Remove private fields if schema is provided
  if (schema && schema.paths) {
    Object.keys(schema.paths).forEach((path) => {
      if (schema.paths[path].options && schema.paths[path].options.private) {
        deleteAtPath(ret, path.split('.'), 0);
      }
    });
  }

  // Apply standard transformations
  if (ret._id) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
  
  delete ret.__v;
  delete ret.createdAt;
  delete ret.updatedAt;

  return ret;
};

module.exports = leanToJSON; 