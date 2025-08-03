const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD);
console.log('POSTGRES_DB:', process.env.POSTGRES_DB);
console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT);

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'afrolearn',
  process.env.POSTGRES_USER || 'postgres',
  process.env.POSTGRES_PASSWORD || 'password',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // null for Google users
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'learner',
  },
  country: DataTypes.STRING,
  grade: DataTypes.STRING,
  birthMonth: DataTypes.STRING,
  birthYear: DataTypes.STRING,
  picture: DataTypes.STRING,
  googleId: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  timestamps: false,
});

module.exports = { sequelize, User }; 