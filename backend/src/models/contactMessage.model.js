const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContactMessage = sequelize.define(
  'ContactMessage',
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING(150), allowNull: false, field: 'full_name' },
    email: { type: DataTypes.STRING(191), allowNull: false },
    phone: { type: DataTypes.STRING(50), allowNull: true },
    company: { type: DataTypes.STRING(150), allowNull: true },
    subject: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('new', 'read', 'replied', 'archived'),
      allowNull: false,
      defaultValue: 'new',
    },
    assignedUserId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true, field: 'assigned_user_id' },
  },
  {
    tableName: 'contact_messages',
    indexes: [
      { fields: ['status', 'created_at'] },
      { fields: ['email'] },
      { fields: ['assigned_user_id'] },
    ],
  }
);

module.exports = ContactMessage;
