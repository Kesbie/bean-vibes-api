const { BAD_REQUEST, NOT_FOUND } = require('../utils/error.response');
const { Category, Place } = require('../models');
const mongoose = require('mongoose');

const createCategory = async (categoryBody) => {
  if (categoryBody.slug) {
    const isSlugTaken = await Category.isSlugTaken(categoryBody.slug);
    if (isSlugTaken) {
      throw new BAD_REQUEST('Slug đã tồn tại, vui lòng chọn slug khác');
    }
  }

  const category = await Category.create(categoryBody);
  return category;
};

const queryCategories = async (filter, options) => {
  // Use aggregation to get categories with place counts
  const aggregationPipeline = [
    {
      $lookup: {
        from: 'places',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$$categoryId', '$categories'] },
                  { $eq: ['$approvalStatus', 'approved'] }
                ]
              }
            }
          }
        ],
        as: 'places'
      }
    },
    {
      $addFields: {
        placeCount: { $size: '$places' }
      }
    },
    {
      $unset: 'places'
    }
  ];

  // Add filter if provided
  if (filter && Object.keys(filter).length > 0) {
    aggregationPipeline.unshift({ $match: filter });
  }

  // Add pagination
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const countPipeline = [...aggregationPipeline, { $count: 'total' }];
  const countResult = await Category.aggregate(countPipeline)
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Add pagination to main pipeline
  aggregationPipeline.push(
    { $skip: skip },
    { $limit: limit }
  );

  // Add sorting if provided
  if (options.sortBy) {
    const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
    aggregationPipeline.push({ $sort: { [options.sortBy]: sortOrder } });
  }

  // Execute aggregation
  const categories = await Category.aggregate(aggregationPipeline)

  // Populate thumbnail for each category
  // const populatedCategories = await Category.populate(categories, {
  //   path: 'thumbnail',
  //   select: 'url'
  // });

  // Format response to match paginate plugin format
  const totalPages = Math.ceil(total / limit);
  
  return {
    results: categories,
    page,
    limit,
    totalPages,
    totalResults: total,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

const getCategoryById = async (id) => {
  const aggregationPipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'places',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$$categoryId', '$categories'] },
                  { $eq: ['$approvalStatus', 'approved'] }
                ]
              }
            }
          }
        ],
        as: 'places'
      }
    },
    {
      $addFields: {
        placeCount: { $size: '$places' }
      }
    },
    {
      $unset: 'places'
    }
  ];

  const categories = await Category.aggregate(aggregationPipeline);
  
  if (categories.length === 0) {
    throw new NOT_FOUND('Category not found');
  }

  // Populate thumbnail
  const populatedCategory = await Category.populate(categories[0], {
    path: 'thumbnail',
    select: 'url'
  });

  return populatedCategory;
};

const getCategoryBySlugs = async (slugs) => {
  const aggregationPipeline = [
    { $match: { slug: { $in: slugs } } },
    {
      $lookup: {
        from: 'places',
        let: { categoryId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$$categoryId', '$categories'] },
                  { $eq: ['$approvalStatus', 'approved'] }
                ]
              }
            }
          }
        ],
        as: 'places'
      }
    },
    {
      $addFields: {
        placeCount: { $size: '$places' }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        description: 1,
        type: 1,
        placeCount: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ];

  const categories = await Category.aggregate(aggregationPipeline);

  if (categories.length === 0) {
    throw new NOT_FOUND('Category not found');
  }

  return categories;
};

const updateCategoryById = async (id, updateBody) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new NOT_FOUND('Category not found');
  }

  // Check if slug is being updated and if it's already taken by another category
  if (updateBody.slug && updateBody.slug !== category.slug) {
    const isSlugTaken = await Category.isSlugTaken(updateBody.slug);
    if (isSlugTaken) {
      throw new BAD_REQUEST('Slug already taken');
    }
  }

  // Update the category fields
  Object.assign(category, updateBody);

  // Save and return the updated category with populated thumbnail
  const updatedCategory = await category.save();
  return Category.findById(updatedCategory._id).populate('thumbnail');
};

const deleteCategoryById = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  return category;
};

const deleteAllCategories = async () => {
  const result = await Category.deleteMany({});
  return result;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  getCategoryBySlugs,
  updateCategoryById,
  deleteCategoryById,
  deleteAllCategories,
};
