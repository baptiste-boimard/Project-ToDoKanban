// express
const express = require ('express');
// router
const router = express.Router();
//controller
const listController = require ('./controllers/listController');
const cardController = require ('./controllers/cardController');
const labelController = require ('./controllers/labelController');

// //DB LIGN HEROKU
// router.get('/db', async (req, res) => {
//     try {
//       const client = await pool.connect();
//       const result = await client.query('SELECT * FROM list');
//       const results = { 'results': (result) ? result.rows : null};
//       res.send('pages/db', results );
//       client.release();
//     } catch (err) {
//       console.error(err);
//       res.send("Error " + err);
//     }
//   })



//page lists
//----------
router.route('/lists')
    .post(listController.createList)
    .get(listController.getAllLists);

router.route('/lists/:id')
    .get(listController.getOneList)
    .patch(listController.patchOneList)
    .delete(listController.deleteOneList);

router.route('/lists/:list_id/cards')
    .get(listController.getAllCardsOfOneList)
    .delete(listController.deleteAllCardsOfOneList);

//page cards
//----------
router.route('/cards')
    .post(cardController.createCard)
    .get(cardController.getAllCards);
router.route('/cards/:id')
    .get(cardController.getOneCard)
    .patch(cardController.patchOneCard)
    .delete(cardController.deleteOneCard);

router.route('/cards/:card_id/labels')
    .get(cardController.getAllLabelsOfOneCard)
    .post(cardController.addLabelToCard);

router.route('/cards/:card_id/labels/:label_id')
    .delete(cardController.deleteLabelOfOneCard);

//page labels
//-----------
router.post ('/labels', labelController.createLabel);
router.get ('/labels', labelController.getAllLabels);
router.get ('/labels/:id', labelController.getOneLabel);
router.patch ('/labels/:id', labelController.patchOneLabel);
router.delete ('/labels/:id', labelController.deleteOneLabel);





module.exports = router;