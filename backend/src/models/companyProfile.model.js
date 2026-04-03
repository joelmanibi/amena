const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CompanyProfile = sequelize.define(
  'CompanyProfile',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, defaultValue: 1 },
    address: { type: DataTypes.TEXT, allowNull: true },
    email: { type: DataTypes.STRING(191), allowNull: true },
    phone: { type: DataTypes.STRING(50), allowNull: true },
    websiteUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'website_url' },
    facebookUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'facebook_url' },
    linkedinUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'linkedin_url' },
    instagramUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'instagram_url' },
  },
  {
    tableName: 'company_profile',
  }
);

module.exports = CompanyProfile;