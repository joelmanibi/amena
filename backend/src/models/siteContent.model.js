const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SiteContent = sequelize.define(
  'SiteContent',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, defaultValue: 1 },
    fr: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    en: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  },
  {
    tableName: 'site_content',
  }
);

module.exports = SiteContent;