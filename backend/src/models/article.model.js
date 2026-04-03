const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Article = sequelize.define(
  'Article',
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    authorId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true, field: 'author_id' },
    title: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(191), allowNull: false, unique: true },
    excerpt: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.TEXT('long'), allowNull: false },
    featuredImageUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'featured_image_url' },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    seoTitle: { type: DataTypes.STRING(255), allowNull: true, field: 'seo_title' },
    seoDescription: { type: DataTypes.STRING(500), allowNull: true, field: 'seo_description' },
    publishedAt: { type: DataTypes.DATE, allowNull: true, field: 'published_at' },
  },
  {
    tableName: 'news_articles',
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['status', 'published_at'] },
      { fields: ['author_id'] },
    ],
  }
);

module.exports = Article;
