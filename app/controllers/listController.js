const { List } = require ('../models');

const listController = {

    //POST
    createList: async (req, res) => {
        const { name, position }= req.body;

        if (!name) {
            return res.status(400).json('Name cannot be empty');
        };

        try {
            const newList = await List.create(req.body);
            res.json(newList);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //GET
    getAllLists : async (req, res) => {
        try {
            const lists = await List.findAll({
                include : [{ association : 'cards', include : [{ association : 'labels'}]}], 
                order : [['position', 'DESC'],['cards', 'position', 'DESC']],
            })
            res.json(lists)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //GET
    getOneList : async (req, res) => {
        const idList = parseInt(req.params.id);
        
        try {
            const list = await List.findByPk(idList, {
                include : [{ association : 'cards', include : [{ association : 'labels'}]}]
            });

            if (!list) 
                return res.status(400).json('id not exist');

            res.json(list)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

     //PATCH
     patchOneList : async (req, res) => {
        const idList = parseInt(req.params.id);
        const { name, position }= req.body;

        try {
            const list = await List.findByPk(idList);

            if(!list) {
                res.status(400).json('List not exist');
                return;
            };

            if (name)
                list.name = name;
            if (position)
                list.position = Number(position);

            await list.save();
            res.json(list)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //DELETE
    deleteOneList : async (req, res) => {
        const idList = parseInt(req.params.id);

        try {
            const list = await List.findByPk(idList);

            if (list)
                list.destroy();

            res.json(list)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }

    },

     //GET
     getAllCardsOfOneList : async (req, res) => {
        const idList = Number(req.params.list_id);

        try {
            const list = await List.findByPk( idList, {
                include: [{ association : 'cards'}],
                order: [['cards', 'position', 'ASC']]
            })

            if (!list) {
                res.status(400).json('List not exist');
                return;
            };

            if(!list.cards.length) {
                res.status(400).json('List contains no card');
                return;
            };
              
            res.json(list.cards)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //DELETE
    deleteAllCardsOfOneList : async (req, res) => {
        const idList = Number(req.params.list_id);

        try {

            const list = await List.findByPk(idList, {
                include : [{ association : 'cards'}],
            });

            //POSIBILITE CORRECTION
            // const cards = await Card.destroy(
            //     {
            //         where: {
            //             list_id: listId 
            //         }
            //     }
            // );

            list.cards.forEach(card => {
                card.destroy();
            });
            
            res.json('OK')
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },


};

module.exports = listController;
