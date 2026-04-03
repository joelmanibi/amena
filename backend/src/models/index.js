const { sequelize } = require('../config/database');
const User = require('./user.model');
const Article = require('./article.model');
const Category = require('./category.model');
const ArticleCategory = require('./articleCategory.model');
const TrainingProgram = require('./trainingProgram.model');
const TrainingSession = require('./trainingSession.model');
const TrainingRegistration = require('./trainingRegistration.model');
const ContactMessage = require('./contactMessage.model');
const CompanyProfile = require('./companyProfile.model');
const SiteContent = require('./siteContent.model');

User.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Article.belongsToMany(Category, {
  through: ArticleCategory,
  foreignKey: 'articleId',
  otherKey: 'categoryId',
  as: 'categories',
});
Category.belongsToMany(Article, {
  through: ArticleCategory,
  foreignKey: 'categoryId',
  otherKey: 'articleId',
  as: 'articles',
});

User.hasMany(TrainingProgram, { foreignKey: 'createdBy', as: 'trainingPrograms' });
TrainingProgram.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

TrainingProgram.hasMany(TrainingSession, { foreignKey: 'programId', as: 'sessions' });
TrainingSession.belongsTo(TrainingProgram, { foreignKey: 'programId', as: 'program' });

TrainingSession.hasMany(TrainingRegistration, { foreignKey: 'sessionId', as: 'registrations' });
TrainingRegistration.belongsTo(TrainingSession, { foreignKey: 'sessionId', as: 'session' });

User.hasMany(ContactMessage, { foreignKey: 'assignedUserId', as: 'assignedMessages' });
ContactMessage.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

module.exports = {
  sequelize,
  User,
  Article,
  Category,
  ArticleCategory,
  TrainingProgram,
  TrainingSession,
  TrainingRegistration,
  ContactMessage,
  CompanyProfile,
  SiteContent,
};
