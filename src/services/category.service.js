const { BAD_REQUEST, NOT_FOUND } = require('../utils/error.response');
const { Category } = require('../models');

const createCategory = async (categoryBody) => {
  if (categoryBody.slug) {
    const isSlugTaken = await Category.isSlugTaken(categoryBody.slug);
    if (isSlugTaken) {
      throw new BAD_REQUEST('Slug already taken');
    }
  }

  const category = await Category.create(categoryBody);
  return category;
};

const queryCategories = async (filter, options) => {
  const categories = await Category.paginate(filter, {
    ...options,
    populate: ['thumbnail'],
  });
  return categories;
};

const getCategoryById = async (id) => {
  return Category.findById(id).populate('thumbnail');
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

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
