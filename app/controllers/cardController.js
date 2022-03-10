const { Card, Label } = require ('../models');

const cardController = {

    //POST
    createCard: async (req, res) => {
        const {title, position, color, list_id} = req.body;

        if (!title) {
            res.status(400).json('Title cannot be empty');
            return;
        };

        if (!list_id) {
            res.status(400).json('Card must have a list');
            return;
        };

        try {
            const newCard = await Card.create(req.body);
            res.json(newCard);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //GET
    getAllCards : async (req, res) => {
        try {
            const cards = await Card.findAll({
                include: [{ association : 'labels'}]
            })
            res.json(cards)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //GET
    getOneCard : async (req, res) => {
        const idCard = parseInt(req.params.id);

        try {
            const card = await Card.findByPk(idCard,{
                include: [{ association : 'labels'}]
            });

            if(!card) {
                res.status(400).json('id not exists');
                return;
            };

            res.json(card)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

     //PATCH
     patchOneCard : async (req, res) => {
        const idCard = parseInt(req.params.id);
        const { title, position, color, list_id} = req.body;

        try {
            const card = await Card.findByPk(idCard);

            if(!card) {
                res.status(400).json('Card not exist');
                return;
            };


            if(title)
                card.title = title;
            if(position)
                card.position = position;
            if(color)
                card.color = color;
            if(list_id)
                card.list_id = list_id;

            await card.save();
            res.json(card)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //PATCH
    deleteOneCard : async (req, res) => {
        const idCard = parseInt(req.params.id);

        try {
            const card = await Card.findByPk(idCard);

            if(card)
                card.destroy();

            res.json(card)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //POST
    addLabelToCard: async (req, res) => {
        const card_id = Number(req.params.card_id); 

        if (!card_id) {
            res.status(400).json('Card not exist');
            return;
        };

        const { label_id } = req.body;
        
        if (!label_id) {
            res.status(400).json('Label must be choose')
            return;
        };

        try {
            
            const card = await Card.findByPk(card_id, {
                include: ['labels']
            });

            const label = await Label.findByPk(label_id);
            await card.addLabel(label);

            res.json(card);
                
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //GET
    getAllLabelsOfOneCard : async (req, res) => {
        const idCard = Number(req.params.card_id);

        try {
            const card = await Card.findByPk( idCard, {
                include: [{ association : 'labels'}]
            })

            if (!card) {
                res.status(400).json('Card not exist')
                return;
            };

            res.json(card.labels)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //DELETE
    deleteLabelOfOneCard : async (req, res) => {
        const idCard = Number(req.params.card_id);
        const idLabel = Number(req.params.label_id);

        try {

            const card = await Card.findByPk(idCard);
            const label = await Label.findByPk(idLabel);

            if (!card || !label) {
                res.status(400).json('Card or Label not exist')
                return;
            };
          
            await card.removeLabel(label);
                
            res.json('OK')
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },
}

module.exports = cardController;