# API REST

5 Contraintes pour être REST :

- Séparation client-serveur : affichage et données séparées
- Stateless : sans état, une même requête fait la même chose pour tout le monde sans prendre en compte ce qui s'est passé avant (pas de session)
- Mise en cache
- Le client ne sait pas s'il s'adresse directement au site principal
- Interface uniforme : les mêmes appels quelque soit la ressource (listes, cartes, label, images, etc...), une ressource dipose d'un identifiant

## HTTP

Requête HTTP : POST, GET, DELETE, PUT (Remplacer), PATCH

CRUD : Create, Read, Update, Delete

| URL | POST | GET | PATCH | DELETE |
|---|---|---|---|---|
| /lists | créer une liste | récupérer toutes les listes | màj de toutes les listes (ne pas faire) | supprimer toutes les lists (ne pas faire) |
| /lists/:id | créer une liste en fixant l'id (ne pas faire) | récupérer la liste avec l'id correspondant | mise à jour de la liste avec l'id | supprimer la liste avec l'id |
| /cards | x | x | | |
| /cards/:id |  | x | x | x |
| /lists/:list_id/cards |  | récupérer toutes les cartes d'une liste | | supprimer toutes les cartes d'une liste |
| /labels | x | x | | |
| /labels/:id |  | x | x| x|
| /cards/:card_id/label | mettre un label sur une carte | récupérer tous les labels d'une carte | | |
| /cards/:card_id/label/:label_id |  |  | | enlever un label d'une carte |
