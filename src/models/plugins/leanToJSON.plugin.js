/* eslint-disable no-param-reassign */

/**
 * A mongoose schema plugin which adds a static method to apply toJSON transformations
 * to lean query results. This is useful when you need the same transformations as toJSON
 * but are using lean() for performance.
 */

const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const leanToJSON = (schema) => {
  /**
   * Apply toJSON transformations to lean query results
   * @param {Object|Array} result - The lean query result
   * @returns {Object|Array} - Transformed result
   */
  schema.statics.leanToJSON = function(result) {
    if (!result) {
      return result;
    }

    // Handle arrays
    if (Array.isArray(result)) {
      return result.map(doc => this.leanToJSON(doc));
    }

    // Handle single documents
    if (typeof result === 'object') {
      const ret = { ...result };

      // Remove private fields
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      // Apply standard transformations
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
      
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;

      return ret;
    }

    return result;
  };

  /**
   * Chainable method to apply leanToJSON to query results
   * Usage: Model.find().lean().applyLeanToJSON()
   */
  schema.methods.applyLeanToJSON = function() {
    const result = this.exec ? this.exec() : this;
    
    if (result && typeof result.then === 'function') {
      // Handle promises
      return result.then(docs => {
        return this.constructor.leanToJSON(docs);
      });
    }
    
    return this.constructor.leanToJSON(result);
  };
};

module.exports = leanToJSON; 