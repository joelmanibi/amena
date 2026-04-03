const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');
const slugify = require('../utils/slugify');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { TrainingProgram, TrainingSession, User } = require('../models');

const trainingInclude = [
  { model: User, as: 'creator', attributes: ['id', 'fullName', 'email'] },
  { model: TrainingSession, as: 'sessions' },
];

const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

const getTrainings = asyncHandler(async (req, res) => {
  const { page, limit, search, status, deliveryMode } = req.query;
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

  if (deliveryMode) where.deliveryMode = deliveryMode;
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { summary: { [Op.like]: `%${search}%` } },
    ];
  }

  const { rows, count } = await TrainingProgram.findAndCountAll({
    where,
    include: trainingInclude,
    offset: pagination.offset,
    limit: pagination.limit,
    distinct: true,
    order: [['created_at', 'DESC']],
  });

  res.status(200).json({
    data: rows,
    meta: buildPaginationMeta(count, pagination.page, pagination.limit),
  });
});

const getTrainingById = asyncHandler(async (req, res) => {
  const training = await TrainingProgram.findByPk(req.params.id, { include: trainingInclude });
  if (!training) {
    return res.status(404).json({ message: 'Training program not found.' });
  }

  const canManageContent = req.user && adminRoles.includes(req.user.role);
  if (!canManageContent && training.status !== 'published') {
    return res.status(404).json({ message: 'Training program not found.' });
  }

  res.status(200).json({ data: training });
});

const getTrainingBySlug = asyncHandler(async (req, res) => {
  const canManageContent = req.user && adminRoles.includes(req.user.role);
  const where = {
    slug: req.params.slug,
    ...(canManageContent ? {} : { status: 'published' }),
  };

  const training = await TrainingProgram.findOne({
    where,
    include: trainingInclude,
  });

  if (!training) {
    return res.status(404).json({ message: 'Training program not found.' });
  }

  res.status(200).json({ data: training });
});

const createTraining = asyncHandler(async (req, res) => {
  const training = await TrainingProgram.create({
    createdBy: req.user.id,
    title: req.body.title,
    slug: req.body.slug || slugify(req.body.title),
    summary: req.body.summary,
    description: req.body.description,
    audience: req.body.audience,
    deliveryMode: req.body.deliveryMode || 'onsite',
    durationText: req.body.durationText,
    price: req.body.price,
    currency: req.body.currency || 'USD',
    status: req.body.status || 'draft',
  });

  const created = await TrainingProgram.findByPk(training.id, { include: trainingInclude });
  res.status(201).json({ message: 'Training program created successfully.', data: created });
});

const updateTraining = asyncHandler(async (req, res) => {
  const training = await TrainingProgram.findByPk(req.params.id);
  if (!training) {
    return res.status(404).json({ message: 'Training program not found.' });
  }

  await training.update({
    title: req.body.title ?? training.title,
    slug: req.body.slug || (req.body.title ? slugify(req.body.title) : training.slug),
    summary: req.body.summary ?? training.summary,
    description: req.body.description ?? training.description,
    audience: req.body.audience ?? training.audience,
    deliveryMode: req.body.deliveryMode ?? training.deliveryMode,
    durationText: req.body.durationText ?? training.durationText,
    price: req.body.price ?? training.price,
    currency: req.body.currency ?? training.currency,
    status: req.body.status ?? training.status,
  });

  const updated = await TrainingProgram.findByPk(training.id, { include: trainingInclude });
  res.status(200).json({ message: 'Training program updated successfully.', data: updated });
});

const deleteTraining = asyncHandler(async (req, res) => {
  const training = await TrainingProgram.findByPk(req.params.id);
  if (!training) {
    return res.status(404).json({ message: 'Training program not found.' });
  }

  await training.destroy();
  res.status(200).json({ message: 'Training program deleted successfully.' });
});

module.exports = {
  getTrainings,
  getTrainingById,
  getTrainingBySlug,
  createTraining,
  updateTraining,
  deleteTraining,
};
