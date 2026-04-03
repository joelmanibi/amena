const asyncHandler = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { TrainingProgram, TrainingSession, TrainingRegistration } = require('../models');

const getRegistrations = asyncHandler(async (req, res) => {
  const { page, limit, status, sessionId } = req.query;
  const pagination = getPagination(page, limit);
  const where = {};

  if (status) where.status = status;
  if (sessionId) where.sessionId = sessionId;

  const { rows, count } = await TrainingRegistration.findAndCountAll({
    where,
    include: [{
      model: TrainingSession,
      as: 'session',
      include: [{ model: TrainingProgram, as: 'program' }],
    }],
    offset: pagination.offset,
    limit: pagination.limit,
    order: [['created_at', 'DESC']],
  });

  res.status(200).json({
    data: rows,
    meta: buildPaginationMeta(count, pagination.page, pagination.limit),
  });
});

const getRegistrationById = asyncHandler(async (req, res) => {
  const registration = await TrainingRegistration.findByPk(req.params.id, {
    include: [{
      model: TrainingSession,
      as: 'session',
      include: [{ model: TrainingProgram, as: 'program' }],
    }],
  });

  if (!registration) {
    return res.status(404).json({ message: 'Registration not found.' });
  }

  res.status(200).json({ data: registration });
});

const createRegistration = asyncHandler(async (req, res) => {
  const session = await TrainingSession.findByPk(req.body.sessionId);
  if (!session) {
    return res.status(404).json({ message: 'Training session not found.' });
  }

  const registration = await TrainingRegistration.create({
    sessionId: req.body.sessionId,
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    company: req.body.company,
    jobTitle: req.body.jobTitle,
    message: req.body.message,
    status: 'pending',
  });

  res.status(201).json({ message: 'Registration submitted successfully.', data: registration });
});

const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const registration = await TrainingRegistration.findByPk(req.params.id);
  if (!registration) {
    return res.status(404).json({ message: 'Registration not found.' });
  }

  await registration.update({ status: req.body.status });
  res.status(200).json({ message: 'Registration status updated successfully.', data: registration });
});

module.exports = {
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistrationStatus,
};
