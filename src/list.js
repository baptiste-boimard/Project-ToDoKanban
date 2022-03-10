const cardModule = require('./card');
const utilsModule = require('./utils');
const Sortable = require('sortablejs');



const listModule = {

    url: null,
    setUrl: (baseUrl) => {
        listModule.url = baseUrl + 'lists';
    },


    getAllListsFromAPI: async () => {
        try {
            const result = await fetch(`${listModule.url}`, {
            method: 'GET',
            });

            const data = await result.json();
       
            for (let list of data) {
                listModule.makeListInDOM(list);
                    for (card of list.cards) {
                        cardModule.makeCardInDOM(card);
                    };
                };
        } catch (error) {
            console.log(error);
        };
    },

    deleteListToAPI : async (event) => {
        const list = event.target.closest('.panel');
        const listId = list.dataset.listId;

        const listName = list.querySelector('h2').textContent;
        if (!window.confirm(`Supprimer la liste ${listName} ?`)) {
            return;
        }
        
        try {
            const result = await fetch(`${listModule.url}/${listId}`, {
                method : 'DELETE'
            });
            const data = await result.json();
            list.remove();
        } catch (error) {
            console.log(error);
        };
    },

    //Ajoute la class 'is-active' pour afficher le Modal
    showAddListModal: () => {
        
        //Récupére l'element du formulaire contenant input hidden
        const hiddenInputId = addListModal.querySelector('input[name="listId"]');
         //Attribution de listId comme value de l'input
    },

    // Open form edit list and close title
    showEditListForm: (event) => {

        //Cache le text et on affiche le form
        const list = event.target.closest('.panel');
        utilsModule.showAndHide(list, 'h2', 'form');

        //Custom nom de la list dans le form et select
        const titleList = event.target.closest('div').querySelector('input[name="name"]');
        titleList.value = event.target.textContent;
        titleList.select();
    },

    //Permet de récupérer les informations du formulaire AddList
    handleAddListForm: async (event) => {
        event.preventDefault();
       
        //lors de la création d'une nouvelle => incrémentation de +1 des positions
        // des listes existantes et avant modif vers l'API
        const lists = document.querySelectorAll('.panel');
        lists.forEach( async(list) => {
            const positionId = Number(list.dataset.positionId);
            list.dataset.positionId = positionId + 1;
            const listId = list.dataset.listId;
            const formData = new FormData();
            formData.append('position', list.dataset.positionId);

            try {
                const result = await fetch(`${listModule.url}/${listId}`, {
                    method : 'PATCH',
                    body : formData,
                });
    
                const data = await result.json();
            
            } catch (error) {
                console.log(error);
            };

        });
       
        //création de la nouvelle liste en position 0
        const formData = new FormData(event.target);
        formData.append('position',0);
        try {
            const result = await fetch(`${listModule.url}`, {
                method : 'POST',
                body : formData,
            });

            const data = await result.json();
            //Crée la liste avec les données
            listModule.makeListInDOM(data);
            
        } catch (error) {
            console.log(error);
        };
        
        //Ferme le form
        utilsModule.hideModals();
        
        
        
    },

    //Soumission du form edit list
    handleEditListForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const list = event.target.closest('.panel');
        const listId = list.dataset.listId;

        try {
            const result = await fetch(`${listModule.url}/${listId}`, {
                method : 'PATCH',
                body : formData,
            });
            const data = await result.json();
            //maj du titre de la liste
            list.querySelector('h2').textContent = data.name;
        } catch (error) {
            console.log(error);
        };

        utilsModule.showAndHide(list, 'form', 'h2');

    },

    //Création de la nouvelle liste
    makeListInDOM : (data) => {
     
        
        //On clone notre template
        const list = document.getElementById('listTemplate').content.firstChild;
        const newList = list.cloneNode(true);
        //Récupére le name dans le formulmaire pour nommer notre liste
        const nameList = newList.querySelector('h2');
        nameList.textContent = data.name;  
        //Donne l'id a la nouvelle list
        newList.dataset.listId = data.id;
        //donne la position à la liste aussi
        newList.dataset.positionId = data.position;


        //Insére et affiche notre nouvelle liste
        const parentDiv = document.querySelector('.card-lists');
        parentDiv.insertBefore(newList, parentDiv.firstChild);

        
        //event sur le bouton plus pour ajouter une card
        const addCardModal = document.querySelector('.is-pulled-left');
        addCardModal.addEventListener('click', cardModule.showAddCardModal);
        //event double click sur le nom pour éditer les listes
        nameList.addEventListener('dblclick', listModule.showEditListForm);
        // event sur form edit list
        //Validation du form
        const editListsForm = document.querySelector('#editListForm');
        editListsForm.addEventListener('submit', listModule.handleEditListForm);
        //Appuie ECHAP
        editListsForm.addEventListener('keydown', (event)=> {
            if (event.code == 'Escape') {

                utilsModule.showAndHide(newList, 'form', 'h2');
              
            }
        });
        //Appuie autre part
        editListsForm.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        //event click delete button list
        const delListButton = document.querySelector('.delListButton');
        delListButton.addEventListener('click', listModule.deleteListToAPI);

        //sortable
        const el = document.querySelector('.card-lists');
        const sortable = Sortable.create(el, {
            draggable : '.panel',    //utile ? je sais pas ^^
            chosenClass: "sortable-chosen",  // Permet de donner une classe a l'élément choisit et modif le css après
            dataIdAttr: 'data-list-id', // choisit quel element nous donne un id
            //permet de ne pas drag sur le form et de pouvoir eidter le texte
            filter: '.not-sortable',
            preventOnFilter: false, 

            onEnd: async (evt) => {   // event à la fin du drag
                sortable.toArray().forEach( async (id, position) => {  
                    // récupére l'odre sous forme de tableau qu'on boucle
                    const formData = new FormData();        // on construit un formData
                    formData.append('position', position)
                    try {
                        const result = await fetch(`${listModule.url}/${id}`, {
                            method : 'PATCH',
                            body : formData,
                        });
                        // pas de maj du front puisque c'est le front qui envoie l'info a l'API
                    } catch (error) {
                        console.log(error);
                    };
            
                })
            },
        })


    },


}

module.exports = listModule;