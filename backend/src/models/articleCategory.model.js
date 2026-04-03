const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ArticleCategory = sequelize.define(
  'ArticleCategory',
  {
    articleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'article_id',
    },
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'category_id',
    },
    assignedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'assigned_at' },
  },
  {
    tableName: 'article_category_map',
    timestamps: false,
    indexes: [{ fields: ['category_id', 'article_id'] }],
  }
);

module.exports = ArticleCategory;
