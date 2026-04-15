const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { TrainingProgram, TrainingSession, TrainingRegistration } = require('../models');

const INTEREST_SESSION_CODE_PREFIX = 'interest-program-';

function getInterestSessionCode(programId) {
  return `${INTEREST_SESSION_CODE_PREFIX}${programId}`;
}

async function getOrCreateInterestSession(program) {
  const sessionCode = getInterestSessionCode(program.id);
  const existingSession = await TrainingSession.findOne({
    where: {
      programId: program.id,
      sessionCode,
    },
  });

  if (existingSession) {
    return existingSession;
  }

  const now = new Date();

  return TrainingSession.create({
    programId: program.id,
    sessionTitle: 'Demande d’inscription sans session',
    sessionCode,
    startDate: now,
    endDate: now,
    capacity: 999999,
    status: 'closed',
  });
}

const getRegistrations = asyncHandler(async (req, res) => {
  const { page, limit, status, sessionId, programId, search } = req.query;
  const pagination = getPagination(page, limit);
  const where = {};
  const trimmedSearch = typeof search === 'string' ? search.trim() : '';

  if (trimmedSearch) {
    where[Op.or] = [
      { fullName: { [Op.iLike]: `%${trimmedSearch}%` } },
      { email: { [Op.iLike]: `%${trimmedSearch}%` } },
      { company: { [Op.iLike]: `%${trimmedSearch}%` } },
    ];
  }

  if (status) where.status = status;

  const sessionInclude = {
    model: TrainingSession,
    as: 'session',
    required: Boolean(sessionId || programId),
    include: [{
      model: TrainingProgram,
      as: 'program',
      ...(programId ? { where: { id: programId }, required: true } : {}),
    }],
    ...(sessionId ? { where: { id: sessionId } } : {}),
  };

  const { rows, count } = await TrainingRegistration.findAndCountAll({
    where,
    include: [sessionInclude],
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
  const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
  let session = null;
  let program = null;
  let isInterestRegistration = false;

  if (req.body.sessionId) {
    session = await TrainingSession.findByPk(req.body.sessionId, {
      include: [{ model: TrainingProgram, as: 'program' }],
    });
    program = session?.program || null;
  } else if (req.body.programId) {
    program = await TrainingProgram.findByPk(req.body.programId);

    if (!program || program.status !== 'published') {
      return res.status(404).json({ message: 'Training program not found.' });
    }

    session = await getOrCreateInterestSession(program);
    isInterestRegistration = true;
  }

  if (!session || !program || program.status !== 'published') {
    return res.status(404).json({ message: 'Training session not found.' });
  }

  if (!isInterestRegistration && session.status !== 'open') {
    return res.status(409).json({ message: 'This training session is no longer open for registration.' });
  }

  if (!isInterestRegistration && session.registrationDeadline && new Date(session.registrationDeadline).getTime() < Date.now()) {
    return res.status(409).json({ message: 'The registration deadline for this session has passed.' });
  }

  const existingRegistration = await TrainingRegistration.findOne({
    where: {
      sessionId: session.id,
      email: normalizedEmail,
    },
  });

  if (existingRegistration) {
    return res.status(409).json({ message: 'A registration already exists for this email address on the selected session.' });
  }

  const activeRegistrationsCount = await TrainingRegistration.count({
    where: {
      sessionId: session.id,
      status: { [Op.ne]: 'cancelled' },
    },
  });

  if (!isInterestRegistration && session.capacity && activeRegistrationsCount >= session.capacity) {
    return res.status(409).json({ message: 'This training session has reached full capacity.' });
  }

  const registration = await TrainingRegistration.create({
    sessionId: session.id,
    fullName: req.body.fullName,
    email: normalizedEmail,
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
