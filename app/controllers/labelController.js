const { Label } = require ('../models');

const labelController = {

    //POST
    createLabel: async (req, res) => {
        const { name, color } = req.body;

        if (!name) {
            res.status(400).json('Name cannot be empty');
            return;
        };

        try {
            const newLabel = await Label.create(req.body);
            res.json(newLabel);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //GET
    getAllLabels : async (req, res) => {
        try {
            const labels = await Label.findAll()
            res.json(labels)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //GET
    getOneLabel : async (req, res) => {
        const idLabel = parseInt(req.params.id);

        try {
            const label = await Label.findByPk(idLabel)

            if(!label) {
                res.status(400).json('label not exist');
                return;
            };

            res.json(label)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

     //PATCH
     patchOneLabel : async (req, res) => {
        const idLabel = parseInt(req.params.id);
        const { name, color } = req.body;

        try {
            const label = await Label.findByPk(idLabel);

            if(!label) {
                res.status(400).json('label not exist');
                return;
            };

            if(name)
                label.name = name;
            if (color)
                label.color = color;

            await label.save();
            res.json(label)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },

    //PATCH
    deleteOneLabel : async (req, res) => {
        const idLabel = parseInt(req.params.id);

        try {
            const label = await Label.findByPk(idLabel);

            if(label)
                label.destroy();
                
            res.json(label)
        } catch (err) {
            console.trace(err);
            res.status(500).json(err);
        }
    },
}

module.exports = labelController;