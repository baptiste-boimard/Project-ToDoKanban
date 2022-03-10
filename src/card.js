const utilsModule = require('./utils');
const Sortable = require('sortablejs');

const cardModule = {

    url: null,
    setUrl: (baseUrl) => {
        cardModule.url = baseUrl + 'cards';
    },


    deleteCardToAPI : async (event) => {
        const card = event.target.closest('.box');
        const cardId = card.dataset.cardId;

        try {
            const result = await fetch(`${cardModule.url}/${cardId}`, {
                method : 'DELETE'
            });
            const data = result.json();
            card.remove();
        } catch (error) {
            console.log(error);
        };
    },

    //Ajoute la classe 'is-active' pour afficher le Modal
    showAddCardModal:(event) => {
        const addCardModal = document.querySelector('#addCardModal');
        addCardModal.classList.add('is-active');
        //Récupére l'input hidden du form de la card modal qui doit contenir
        // l'id de la liste
        const hiddenInputId = addCardModal.querySelector('input[name="list_id"]');
        //Récupére l'élément d'ou vient l'event et extraction de son dataset
        const listId = event.target.closest('.panel').dataset.listId;
        //Attribution de listId comme value de l'input
        hiddenInputId.value = listId;
    },

    showEditCardForm : (event) => {
        //Cache le text et affiche le form
        const card = event.target.closest('.box');
        utilsModule.showAndHide(card, '#nameCard', '#editCardForm')

        
        //Custom nom de la card dans le form et select
        const cardName = event.target.closest('.box').querySelector('#nameCard');
        const titleCard = event.target.closest('.box').querySelector('input[name="title"]');
        titleCard.value = cardName.textContent;
        titleCard.select();

        //affichage de la couleur actuelle dans le form
        const div = event.target.closest('.box');
        //récupére la couleur actuelle de la carte
        const color = div.style.backgroundColor;
        //puis on modifie la value de l'input color 
        const colorCard = event.target.closest('.box').querySelector('input[name="color"]');
        colorCard.value = utilsModule.RGBToHex(color)
    
        
    },

    //Récupération des date du form addCard
    handleAddCardForm: async (event) => {
        event.preventDefault();
        
        //lors de la création de la nouvelle carte, on fait évoluer les positions des
        //cartes existantes en incrémendant +1 et PATCH vers l'API
        //récupé l'id de la liste
        const listId = Object.fromEntries(new FormData(event.target)).list_id;
        //récupére d'abord la liste
        const list = document.querySelector(`[data-list-id="${listId}"]`);
        //puis les cartes de la liste
        const cards = list.querySelectorAll('.box');
        cards.forEach( async(card) => {
            const positionId = Number(card.dataset.positionId);
            card.dataset.positionId = positionId + 1;
            const cardId = card.dataset.cardId;
            const formData = new FormData();
            formData.append('position', card.dataset.positionId);
            formData.append('list_id', listId);

            try {
                const result = await fetch(`${cardModule.url}/${cardId}`, {
                    method : 'PATCH',
                    body : formData,
                });
    
                const data = await result.json();
            
            } catch (error) {
                console.log(error);
            };

        });
       
        //création de la nouvelle carte
        const formData = new FormData(event.target);
        formData.append('position', 0);
        // const formObject = Object.fromEntries(formData);
        // console.log(formObject);

        try {
            const result = await fetch(`${cardModule.url}`, {
                method : 'POST',
                body : formData,
            });
            const data = await result.json();

            cardModule.makeCardInDOM(data);
            
        } catch (error) {
            console.log(error);
        };
        
        //Ferme le form
        utilsModule.hideModals();
    },

    //Soumission du form edit card
    handleEditCardForm : async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        // const object = Object.fromEntries(formData);
        const card = event.target.closest('.box');
        const cardId = card.dataset.cardId;

        try {

            const result = await fetch(`${cardModule.url}/${cardId}`, {
                    method : 'PATCH',
                    body : formData,
                });
                
            const data = await result.json();
            //maj du title de la card
            card.querySelector('#nameCard').textContent = data.title;
            card.style.backgroundColor = `${data.color}`;

        } catch (error) {
            console.log(error);
        };
        
        utilsModule.showAndHide(card, '#editCardForm', '#nameCard')
       
    },

     //Création de la nouvelle card
     makeCardInDOM: (object) => {

        //Clone le template
        const card = document.getElementById('cardTemplate').content.firstChild;
        const newCard = card.cloneNode(true);
        //Récupére les données de notre formulaire pour les injecter dans le template
        const nameCard = newCard.querySelector('#nameCard');
        nameCard.textContent = object.title;
        //Récupére l'element pour changer la couleur 
        newCard.style.backgroundColor = `${object.color}`;

        //donne à la carte son id
        newCard.dataset.cardId = object.id;
        //donne la position à la card aussi
        newCard.dataset.positionId = object.position;
        
        //Récupére la liste correspondant à l'id du formulaire
        const listDiv = document.querySelector(`[data-list-id="${object.list_id}"]`);
        //Récupére la div parente ou insérer la carte
        const parentDiv = listDiv.querySelector('.has-background-light')
        parentDiv.insertBefore(newCard, parentDiv.firstChild);
        
        //Event edition des cards (click icone crayon)
        const editCardButton = newCard.querySelector('.editCardButton');
        editCardButton.addEventListener('click', cardModule.showEditCardForm);
        
        
        //Event Click icone poubelle card
        const delCardButton = newCard.querySelector('.delCardButton');
        delCardButton.addEventListener('click', cardModule.deleteCardToAPI)


        // event sur form edit list
        // Validation du form edit card
        const editCardsForm = newCard.querySelector('#editCardForm');
        editCardsForm.addEventListener('submit', cardModule.handleEditCardForm);
        //Appuie ECHAP
        editCardsForm.addEventListener('keydown', (event)=> {
            if (event.code == 'Escape') {

                utilsModule.showAndHide(newCard, '#editCardForm', '#nameCard')
            
            }
        });
        //Appuie autre part
        editCardsForm.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        //essais de sortable
        const el = document.querySelector('.has-background-light');
        const sortable = Sortable.create(el, {  
            group : 'cards',
            dataIdAttr: 'data-card-id',// choisit quel element nous donne un id
            //permet de ne pas drag sur le form et de pouvoir eidter le texte
            filter: '.not-sortable',
            preventOnFilter: false, 
            

            onEnd: async (evt) => {   // event à la fin du drag
                
                const targetGroup = evt.to;
                const originGroup = evt.from;

                let cards = originGroup.querySelectorAll('.box');
                cards.forEach( async (card, position) => {
                    const id = card.dataset.cardId;
                    const formData = new FormData();
                    // on envoie la position au formData
                    formData.append('position', position);
                    try {
                        const result = await fetch(`${cardModule.url}/${id}`, {
                            method : 'PATCH',
                            body : formData,
                        });
                        // pas de maj du front puisque c'est le front qui envoie l'info a l'API
                    } catch (error) {
                        console.log(error);
                    };

                });

                if (originGroup === targetGroup) {
                    return;
                };

                cards = targetGroup.querySelectorAll('.box');
                const list_id = targetGroup.closest('.panel').dataset.listId;
                cards.forEach( async (card, position) => {
                    const id = card.dataset.cardId;
                    const formData = new FormData();
                    formData.append('position',position);
                    formData.append('list_id',list_id);
                    try {
                        const result = await fetch(`${cardModule.url}/${id}`, {
                            method : 'PATCH',
                            body : formData,
                        });
                        // pas de maj du front puisque c'est le front qui envoie l'info a l'API
                    } catch (error) {
                        console.log(error);
                    };
                });
            }
               
        });
    },


}

module.exports = cardModule;