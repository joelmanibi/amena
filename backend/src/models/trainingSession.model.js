const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingSession = sequelize.define(
  'TrainingSession',
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    programId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'program_id' },
    sessionTitle: { type: DataTypes.STRING(255), allowNull: false, field: 'session_title' },
    sessionCode: { type: DataTypes.STRING(50), allowNull: true, unique: true, field: 'session_code' },
    startDate: { type: DataTypes.DATE, allowNull: false, field: 'start_date' },
    endDate: { type: DataTypes.DATE, allowNull: false, field: 'end_date' },
    location: { type: DataTypes.STRING(255), allowNull: true },
    capacity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
    registrationDeadline: { type: DataTypes.DATE, allowNull: true, field: 'registration_deadline' },
    status: {
      type: DataTypes.ENUM('open', 'closed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'open',
    },
  },
  {
    tableName: 'training_sessions',
    indexes: [
      { fields: ['program_id', 'status', 'start_date'] },
      { fields: ['registration_deadline'] },
    ],
  }
);

module.exports = TrainingSession;
