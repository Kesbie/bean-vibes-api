const pick = require('../utils/pick');
const { NOT_FOUND } = require('../utils/error.response');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { CREATED, OK, NO_CONTENT } = require('../utils/success.response');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  new CREATED(user).send(res);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  new OK(result).send(res);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new NOT_FOUND('User not found');
  }
  new OK(user).send(res);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  new OK(user).send(res);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  new NO_CONTENT().send(res);
});

const changePassword = catchAsync(async (req, res) => {
  await userService.changePassword(req.user.id, req.body.password);
  new OK().send(res);
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  new OK(user).send(res);
});

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  new OK(user).send(res);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  updateProfile,
  getProfile,
};
