const asyncHandler = require('../utils/asyncHandler');
const slugify = require('../utils/slugify');
const { Category } = require('../models');

const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

const getCategories = asyncHandler(async (req, res) => {
  const canManageContent = req.user && adminRoles.includes(req.user.role);
  const where = canManageContent && req.query.includeInactive === 'true' ? {} : { isActive: true };
  const categories = await Category.findAll({
    where,
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
  });

  res.status(200).json({ data: categories });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }
  res.status(200).json({ data: category });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    slug: req.body.slug || slugify(req.body.name),
    description: req.body.description,
    isActive: req.body.isActive ?? true,
    sortOrder: req.body.sortOrder ?? 0,
  });

  res.status(201).json({ message: 'Category created successfully.', data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  await category.update({
    name: req.body.name ?? category.name,
    slug: req.body.slug || (req.body.name ? slugify(req.body.name) : category.slug),
    description: req.body.description ?? category.description,
    isActive: req.body.isActive ?? category.isActive,
    sortOrder: req.body.sortOrder ?? category.sortOrder,
  });

  res.status(200).json({ message: 'Category updated successfully.', data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  await category.destroy();
  res.status(200).json({ message: 'Category deleted successfully.' });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
