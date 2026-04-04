const router = require('express').Router();
const controller = require('../controllers/teamMember.controller');
const { authenticate, authenticateOptional, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const {
  createTeamMemberValidator,
  updateTeamMemberValidator,
  teamMemberIdParamValidator,
} = require('../validators/teamMember.validator');

router.get('/team-members', authenticateOptional, controller.getTeamMembers);
router.post(
  '/team-members',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  createTeamMemberValidator,
  handleValidation,
  controller.createTeamMember
);
router.put(
  '/team-members/:id',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  teamMemberIdParamValidator,
  updateTeamMemberValidator,
  handleValidation,
  controller.updateTeamMember
);
router.delete(
  '/team-members/:id',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  teamMemberIdParamValidator,
  handleValidation,
  controller.deleteTeamMember
);

module.exports = router;