const asyncHandler = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { ContactMessage, User } = require('../models');

const getContactMessages = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const pagination = getPagination(page, limit);
  const where = {};

  if (status) where.status = status;

  const { rows, count } = await ContactMessage.findAndCountAll({
    where,
    include: [{ model: User, as: 'assignedUser', attributes: ['id', 'fullName', 'email'] }],
    offset: pagination.offset,
    limit: pagination.limit,
    order: [['created_at', 'DESC']],
  });

  res.status(200).json({
    data: rows,
    meta: buildPaginationMeta(count, pagination.page, pagination.limit),
  });
});

const getContactMessageById = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByPk(req.params.id, {
    include: [{ model: User, as: 'assignedUser', attributes: ['id', 'fullName', 'email'] }],
  });

  if (!message) {
    return res.status(404).json({ message: 'Contact message not found.' });
  }

  res.status(200).json({ data: message });
});

const createContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create({
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    company: req.body.company,
    subject: req.body.subject,
    message: req.body.message,
    status: 'new',
  });

  res.status(201).json({ message: 'Contact message submitted successfully.', data: message });
});

const updateContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByPk(req.params.id);
  if (!message) {
    return res.status(404).json({ message: 'Contact message not found.' });
  }

  await message.update({
    status: req.body.status ?? message.status,
    assignedUserId: req.body.assignedUserId ?? message.assignedUserId,
  });

  res.status(200).json({ message: 'Contact message updated successfully.', data: message });
});

const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByPk(req.params.id);
  if (!message) {
    return res.status(404).json({ message: 'Contact message not found.' });
  }

  await message.destroy();
  res.status(200).json({ message: 'Contact message deleted successfully.' });
});

module.exports = {
  getContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
};
