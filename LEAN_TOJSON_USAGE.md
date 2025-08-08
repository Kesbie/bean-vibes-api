# Using toJSON with Lean Queries

## Problem
When using Mongoose's `lean()` method for performance optimization, the `toJSON` plugin doesn't work because `lean()` returns plain JavaScript objects instead of Mongoose documents, bypassing the document transformation process.

## Solutions

### Solution 1: Using the leanToJSON utility function

```javascript
const leanToJSON = require('../utils/leanToJSON');
const User = require('../models/user.model');

// Example usage in a service or controller
const getUsers = async () => {
  // This won't have toJSON transformations
  const leanUsers = await User.find().lean();
  
  // Apply transformations manually
  const transformedUsers = leanToJSON(leanUsers, User.schema);
  
  return transformedUsers;
};
```

### Solution 2: Using the leanToJSON plugin (Recommended)

The `leanToJSON` plugin adds static methods to your models for handling lean query transformations.

#### Setup
Add the plugin to your models:

```javascript
const { toJSON, paginate, leanToJSON } = require('./plugins');

// Add all plugins
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(leanToJSON);
```

#### Usage Examples

**Method 1: Using the static method directly**
```javascript
const User = require('../models/user.model');

const getUsers = async () => {
  const leanUsers = await User.find().lean();
  
  // Apply transformations
  const transformedUsers = User.leanToJSON(leanUsers);
  
  return transformedUsers;
};
```

**Method 2: Using with aggregation**
```javascript
const User = require('../models/user.model');

const getUsersWithStats = async () => {
  const result = await User.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]).exec();
  
  // Apply transformations to aggregation results
  const transformedResult = User.leanToJSON(result);
  
  return transformedResult;
};
```

**Method 3: Using with complex queries**
```javascript
const User = require('../models/user.model');

const getUsersWithFavorites = async () => {
  const users = await User.find()
    .populate('favorites')
    .lean()
    .exec();
  
  // Apply transformations
  const transformedUsers = User.leanToJSON(users);
  
  return transformedUsers;
};
```

### Solution 3: Hybrid approach for maximum flexibility

You can combine both approaches for different use cases:

```javascript
const leanToJSON = require('../utils/leanToJSON');
const User = require('../models/user.model');

const userService = {
  // For simple queries, use the plugin
  async getUsers() {
    const users = await User.find().lean();
    return User.leanToJSON(users);
  },
  
  // For complex transformations or when you don't have the model
  async getUsersWithCustomTransform(data) {
    return leanToJSON(data, User.schema);
  },
  
  // For cases where you need to transform data from different models
  async getMixedData() {
    const users = await User.find().lean();
    const places = await Place.find().lean();
    
    return {
      users: leanToJSON(users, User.schema),
      places: leanToJSON(places, Place.schema)
    };
  }
};
```

## What the transformations do

Both solutions apply the same transformations as your `toJSON` plugin:

1. **Remove private fields**: Fields marked with `private: true` in the schema
2. **Convert _id to id**: Rename `_id` to `id` and convert to string
3. **Remove system fields**: Remove `__v`, `createdAt`, `updatedAt`
4. **Handle nested objects**: Properly handle nested private fields
5. **Handle arrays**: Transform arrays of documents

## Performance Considerations

- Use `lean()` when you don't need Mongoose document features (methods, virtuals, etc.)
- The transformation overhead is minimal compared to the performance gain from `lean()`
- For very large datasets, consider applying transformations at the database level using aggregation pipelines

## Migration Guide

If you have existing code using `lean()`, you can easily migrate:

**Before:**
```javascript
const users = await User.find().lean();
// users have _id, __v, createdAt, updatedAt, and private fields
```

**After:**
```javascript
const users = await User.find().lean();
const transformedUsers = User.leanToJSON(users);
// transformedUsers have id, no __v, no timestamps, no private fields
``` 