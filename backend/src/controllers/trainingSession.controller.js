const asyncHandler = require('../utils/asyncHandler');
const { TrainingProgram, TrainingSession } = require('../models');

const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

const getTrainingSessions = asyncHandler(async (req, res) => {
  const program = await TrainingProgram.findByPk(req.params.trainingId);
  if (!program) {
    return res.status(404).json({ message: 'Training program not found.' });
  }

  const canManageContent = req.user && adminRoles.includes(req.user.role);
  if (!canManageContent && program.status !== 'published') {
    return res.status(404).json({ message: 'Training program not found.' });
  }

  const sessions = await TrainingSession.findAll({
    where: { programId: req.params.trainingId },
    order: [['startDate', 'ASC']],
  });

  res.status(200).json({ data: sessions });
});

const createTrainingSession = asyncHandler(async (req, res) => {
  const program = await TrainingProgram.findByPk(req.params.trainingId);
  if (!program) {
    return res.status(404).json({ message: 'Training program not found.' });
  }

  const session = await TrainingSession.create({
    programId: program.id,
    sessionTitle: req.body.sessionTitle,
    sessionCode: req.body.sessionCode,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    location: req.body.location,
    capacity: req.body.capacity ?? 1,
    registrationDeadline: req.body.registrationDeadline,
    status: req.body.status || 'open',
  });

  res.status(201).json({ message: 'Training session created successfully.', data: session });
});

const updateTrainingSession = asyncHandler(async (req, res) => {
  const session = await TrainingSession.findByPk(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Training session not found.' });
  }

  await session.update({
    sessionTitle: req.body.sessionTitle ?? session.sessionTitle,
    sessionCode: req.body.sessionCode ?? session.sessionCode,
    startDate: req.body.startDate ?? session.startDate,
    endDate: req.body.endDate ?? session.endDate,
    location: req.body.location ?? session.location,
    capacity: req.body.capacity ?? session.capacity,
    registrationDeadline: req.body.registrationDeadline ?? session.registrationDeadline,
    status: req.body.status ?? session.status,
  });

  res.status(200).json({ message: 'Training session updated successfully.', data: session });
});

const deleteTrainingSession = asyncHandler(async (req, res) => {
  const session = await TrainingSession.findByPk(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Training session not found.' });
  }

  await session.destroy();
  res.status(200).json({ message: 'Training session deleted successfully.' });
});

module.exports = {
  getTrainingSessions,
  createTrainingSession,
  updateTrainingSession,
  deleteTrainingSession,
};
