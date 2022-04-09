const listModule = require('./list');
const cardModule = require('./card');
const utilsModule = require('./utils');


const app = {
    
    baseUrl : 'https://punkyproject-todokanban.herokuapp.com//',
    
    
    //TODO GROUPER DANS LE MEME PROJET QUE LE BACK
    //TODO FINIR LES TAGS
    
    // fonction d'initialisation, lancée au chargement de la page
    init: () => {
        console.log('app.init !');
        app.addListenerToActions();
        listModule.setUrl(app.baseUrl);
        cardModule.setUrl(app.baseUrl);
        listModule.getAllListsFromAPI();


    },
   


    addListenerToActions: () => {

        //Event click sur ajouter une liste
        const addListButton = document.querySelector('#addListButton');
        addListButton.addEventListener('click', () => {
            const addListModal = document.querySelector('#addListModal');
            addListModal.classList.add('is-active');
        });

        //Event pour récupérer la data du formulaire Modal List
        const addListModalForm = document.querySelector('#addListModalForm');
        addListModalForm.addEventListener('submit', listModule.handleAddListForm);
        
        //Action pour récupérer le formulaire Modal Card
        const addCardModalForm = document.querySelector('#addCardModalForm');
        addCardModalForm.addEventListener('submit', cardModule.handleAddCardForm);
        
        //Event pour fermer les modals
        const removeButtonsModal = document.querySelectorAll('.close, .modal-background');
        removeButtonsModal.forEach(button => {
            button.addEventListener('click', utilsModule.hideModals);
        });

    },

   
}; 


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);