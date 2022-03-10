require('dotenv').config();

const { List } = require('./app/models/');

const run = async ()=>{
    const allLists = await List.findAll({
        include: [
            {
                association: 'cards',
                include: [
                    {
                        association: 'labels'
                    }
                ]
            }
        ],
        order: [
            ['position', 'ASC'],
            ['cards', 'position', 'ASC']
        ]
    });
    allLists.forEach(list=>{
        console.log(`La liste ${list.name} contient les cartes :`);
        list.cards.forEach(card=>{
            console.log(` - ${card.title}`);
            card.labels.forEach(label=>{
                console.log(` - - ${label.name}`);
            })
        })
    })
};

run();