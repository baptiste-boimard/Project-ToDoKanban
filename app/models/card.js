const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Card extends Model {};

Card.init({
    title: DataTypes.STRING(40),
    position: DataTypes.INTEGER,
    color: DataTypes.CHAR(7),
    list_id: DataTypes.INTEGER
}, {sequelize, tableName: "card"});

module.exports = Card;