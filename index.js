//les varaiables d'environnement
require('dotenv').config();
const PORT = process.env.PORT || 3333;



//Express
const express = require('express')
const app = express();

//cors pour les fetch
const cors = require('cors');
app.use(cors());

//gestion des body par url
app.use(express.urlencoded({extended: true}));

//middleware pour le gestion des FormData du FRONT
const multer  = require('multer')
const bodyParser = multer();
app.use( bodyParser.none() );

//le dossier static
app.use(express.static('public'));

//le routage
const router = require ('./app/router');
app.use(router);

//lancement du serveur
app.listen( PORT, () => {
    console.log(`Listening on http://localhost:${PORT}...`)
});