const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');
const slugify = require('../utils/slugify');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { Article, Category, User } = require('../models');

const articleInclude = [
  { model: Category, as: 'categories', through: { attributes: [] } },
  { model: User, as: 'author', attributes: ['id', 'fullName', 'email'] },
];

const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

const getArticles = asyncHandler(async (req, res) => {
  const { page, limit, search, status, categoryId, category, categorySlug } = req.query;
  const pagination = getPagination(page, limit);
  const where = {};
  const canManageContent = req.user && adminRoles.includes(req.user.role);

  if (canManageContent) {
    if (status && status !== 'all') {
      where.status = status;
    }
  } else {
    where.status = 'published';
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { excerpt: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } },
    ];
  }

  const include = [...articleInclude];
  const categoryFilter = {};

  if (categoryId) {
    categoryFilter.id = categoryId;
  }

  if (categorySlug || category) {
    categoryFilter.slug = categorySlug || category;
  }

  if (Object.keys(categoryFilter).length) {
    include[0] = {
      ...include[0],
      where: categoryFilter,
      required: true,
    };
  }

  const { rows, count } = await Article.findAndCountAll({
    where,
    include,
    offset: pagination.offset,
    limit: pagination.limit,
    distinct: true,
    order: [['publishedAt', 'DESC'], ['created_at', 'DESC']],
  });

  res.status(200).json({
    data: rows,
    meta: buildPaginationMeta(count, pagination.page, pagination.limit),
  });
});

const getArticleBySlug = asyncHandler(async (req, res) => {
  const article = await Article.findOne({
    where: { slug: req.params.slug, status: 'published' },
    include: articleInclude,
  });

  if (!article) {
    return res.status(404).json({ message: 'Article not found.' });
  }

  res.status(200).json({ data: article });
});

const createArticle = asyncHandler(async (req, res) => {
  const payload = {
    authorId: req.user.id,
    title: req.body.title,
    slug: req.body.slug || slugify(req.body.title),
    excerpt: req.body.excerpt,
    content: req.body.content,
    featuredImageUrl: req.body.featuredImageUrl,
    status: req.body.status || 'draft',
    seoTitle: req.body.seoTitle,
    seoDescription: req.body.seoDescription,
    publishedAt: req.body.status === 'published' ? req.body.publishedAt || new Date() : null,
  };

  const article = await Article.create(payload);

  if (Array.isArray(req.body.categoryIds) && req.body.categoryIds.length) {
    await article.setCategories(req.body.categoryIds);
  }

  const created = await Article.findByPk(article.id, { include: articleInclude });
  res.status(201).json({ message: 'Article created successfully.', data: created });
});

const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByPk(req.params.id);
  if (!article) {
    return res.status(404).json({ message: 'Article not found.' });
  }

  const nextStatus = req.body.status || article.status;

  await article.update({
    title: req.body.title ?? article.title,
    slug: req.body.slug || (req.body.title ? slugify(req.body.title) : article.slug),
    excerpt: req.body.excerpt ?? article.excerpt,
    content: req.body.content ?? article.content,
    featuredImageUrl: req.body.featuredImageUrl ?? article.featuredImageUrl,
    status: nextStatus,
    seoTitle: req.body.seoTitle ?? article.seoTitle,
    seoDescription: req.body.seoDescription ?? article.seoDescription,
    publishedAt:
      nextStatus === 'published'
        ? req.body.publishedAt || article.publishedAt || new Date()
        : req.body.publishedAt ?? article.publishedAt,
  });

  if (Array.isArray(req.body.categoryIds)) {
    await article.setCategories(req.body.categoryIds);
  }

  const updated = await Article.findByPk(article.id, { include: articleInclude });
  res.status(200).json({ message: 'Article updated successfully.', data: updated });
});

const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByPk(req.params.id);
  if (!article) {
    return res.status(404).json({ message: 'Article not found.' });
  }

  await article.destroy();
  res.status(200).json({ message: 'Article deleted successfully.' });
});

module.exports = {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
};
