const asyncHandler = require('../utils/asyncHandler');
const { TeamMember } = require('../models');

const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

function hasOwnProperty(source, key) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

const getTeamMembers = asyncHandler(async (req, res) => {
  const canManageContent = req.user && adminRoles.includes(req.user.role);
  const includeInactive = String(req.query.includeInactive || '').toLowerCase() === 'true';
  const where = {};

  if (!(canManageContent && includeInactive)) {
    where.isActive = true;
  }

  const teamMembers = await TeamMember.findAll({
    where,
    order: [
      ['sortOrder', 'ASC'],
      ['updated_at', 'DESC'],
      ['id', 'DESC'],
    ],
  });

  res.status(200).json({
    data: teamMembers,
    meta: {
      total: teamMembers.length,
    },
  });
});

const createTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    photoUrl: req.body.photoUrl,
    jobTitle: req.body.jobTitle,
    shortDescription: req.body.shortDescription,
    sortOrder: req.body.sortOrder ?? 0,
    isActive: req.body.isActive ?? true,
  });

  res.status(201).json({
    message: 'Team member created successfully.',
    data: teamMember,
  });
});

const updateTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findByPk(req.params.id);

  if (!teamMember) {
    return res.status(404).json({ message: 'Team member not found.' });
  }

  await teamMember.update({
    firstName: hasOwnProperty(req.body, 'firstName') ? req.body.firstName : teamMember.firstName,
    lastName: hasOwnProperty(req.body, 'lastName') ? req.body.lastName : teamMember.lastName,
    photoUrl: hasOwnProperty(req.body, 'photoUrl') ? req.body.photoUrl : teamMember.photoUrl,
    jobTitle: hasOwnProperty(req.body, 'jobTitle') ? req.body.jobTitle : teamMember.jobTitle,
    shortDescription: hasOwnProperty(req.body, 'shortDescription') ? req.body.shortDescription : teamMember.shortDescription,
    sortOrder: hasOwnProperty(req.body, 'sortOrder') ? req.body.sortOrder : teamMember.sortOrder,
    isActive: hasOwnProperty(req.body, 'isActive') ? req.body.isActive : teamMember.isActive,
  });

  res.status(200).json({
    message: 'Team member updated successfully.',
    data: teamMember,
  });
});

const deleteTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findByPk(req.params.id);

  if (!teamMember) {
    return res.status(404).json({ message: 'Team member not found.' });
  }

  await teamMember.destroy();
  res.status(200).json({ message: 'Team member deleted successfully.' });
});

module.exports = {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};