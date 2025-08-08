/* eslint-disable no-param-reassign */

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const transformDoc = (doc) => {

  if (doc._id) {
    doc.id = doc._id.toString();
  }
  delete doc._id;
  delete doc.__v;
  // delete doc.createdAt;
  // delete doc.updatedAt;
};

const toJSON = (schema) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.post(['find', 'findOne'], function (res) {
    console.log('--------------------------------');
    console.log(this.mongooseOptions());
    console.log('--------------------------------');

    if (!res || !this.mongooseOptions().lean) {
      return;
    }

    if (Array.isArray(res)) {
      res.forEach(transformDoc);
    } else {
      transformDoc(res);
    }
  });

  schema.post('aggregate', function (res) {
    if (Array.isArray(res)) {
      res.forEach(transformDoc);
    } else {
      transformDoc(res);
    }
  });

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      transformDoc(ret);
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

module.exports = toJSON;
