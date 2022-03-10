const Card = require('./card');
const List = require('./list');
const Label = require('./label');

/* Associations */
Card.belongsTo(List, {
    as: 'list',
    foreignKey: 'list_id'
});

List.hasMany(Card, {
    as: 'cards',
    foreignKey: 'list_id'
});

Label.belongsToMany(Card, {
    as: 'cards',
    through: 'card_has_label',
    foreignKey: 'label_id',
    otherKey: 'card_id',
    timestamps: false
});

Card.belongsToMany(Label, {
    as: 'labels',
    through: 'card_has_label',
    foreignKey: 'card_id',
    otherKey: 'label_id',
    timestamps: false
});


module.exports = { Card, List, Label};