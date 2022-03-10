const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class List extends Model {};

List.init({
    name: DataTypes.STRING(40),
    position: DataTypes.INTEGER
}, {sequelize, tableName: "list"});

module.exports = List;