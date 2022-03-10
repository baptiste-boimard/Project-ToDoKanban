const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Label extends Model {};

Label.init({
    name: DataTypes.STRING(40),
    color: DataTypes.CHAR(7)
}, {sequelize, tableName: "label"});

module.exports = Label;