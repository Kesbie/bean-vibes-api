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
  const categories = await Category.paginate(filter, options);
  return categories;
};

const getCategoryById = async (id) => {
  return Category.findById(id);
};

const updateCategoryById = async (id, updateBody) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new NOT_FOUND('Category not found');
  }

  Object.assign(category, updateBody);

  return category.save();
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