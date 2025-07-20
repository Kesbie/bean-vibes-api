const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { categoryService } = require('../services');
const { OK, CREATED, NO_CONTENT } = require('../utils/success.response');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  new CREATED(category).send(res);
});

const getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await categoryService.queryCategories(filter, options);
  new OK(result).send(res);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  new OK(category).send(res);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  new NO_CONTENT().send(res);
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};