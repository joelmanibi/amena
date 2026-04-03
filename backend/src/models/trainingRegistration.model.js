const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingRegistration = sequelize.define(
  'TrainingRegistration',
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    sessionId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'session_id' },
    fullName: { type: DataTypes.STRING(150), allowNull: false, field: 'full_name' },
    email: { type: DataTypes.STRING(191), allowNull: false },
    phone: { type: DataTypes.STRING(50), allowNull: true },
    company: { type: DataTypes.STRING(150), allowNull: true },
    jobTitle: { type: DataTypes.STRING(150), allowNull: true, field: 'job_title' },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    tableName: 'training_registrations',
    indexes: [
      { unique: true, fields: ['session_id', 'email'] },
      { fields: ['status', 'created_at'] },
      { fields: ['email'] },
    ],
  }
);

module.exports = TrainingRegistration;
