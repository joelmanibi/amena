const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TeamMember = sequelize.define(
  'TeamMember',
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING(100), allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING(100), allowNull: false, field: 'last_name' },
    photoUrl: { type: DataTypes.STRING(500), allowNull: false, field: 'photo_url' },
    jobTitle: { type: DataTypes.STRING(255), allowNull: false, field: 'job_title' },
    shortDescription: { type: DataTypes.TEXT, allowNull: false, field: 'short_description' },
    sortOrder: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'sort_order' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
  },
  {
    tableName: 'team_members',
    indexes: [{ fields: ['is_active', 'sort_order'] }],
  }
);

module.exports = TeamMember;