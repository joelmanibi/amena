const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingProgram = sequelize.define(
  'TrainingProgram',
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    createdBy: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true, field: 'created_by' },
    title: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(191), allowNull: false, unique: true },
    summary: { type: DataTypes.STRING(500), allowNull: true },
    description: { type: DataTypes.TEXT('long'), allowNull: false },
    audience: { type: DataTypes.TEXT, allowNull: true },
    deliveryMode: {
      type: DataTypes.ENUM('online', 'onsite', 'hybrid'),
      allowNull: false,
      defaultValue: 'onsite',
      field: 'delivery_mode',
    },
    durationText: { type: DataTypes.STRING(100), allowNull: true, field: 'duration_text' },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
  },
  {
    tableName: 'training_programs',
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['status', 'delivery_mode'] },
    ],
  }
);

module.exports = TrainingProgram;
