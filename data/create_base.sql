BEGIN;

-- Il faut supprimer les tables avant de les créer
DROP TABLE IF EXISTS "list", "card", "label", "card_has_label" CASCADE;

/* Table liste */
CREATE TABLE "list"(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(40) NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP
);

/* Table carte */
CREATE TABLE "card"(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" VARCHAR(40) NOT NULL DEFAULT '',
    "position" INTEGER DEFAULT 0,
    "color" CHAR(7) DEFAULT '#ffffff',
    "list_id" INTEGER NOT NULL REFERENCES "list"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP
);

/* Table label */
CREATE TABLE "label"(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(40) NOT NULL DEFAULT '',
    "color" CHAR(7),
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP
);

/* Table de liaison entre label et carte */
CREATE TABLE "card_has_label"(
    "label_id" INTEGER NOT NULL REFERENCES "label"("id") ON DELETE CASCADE,
    "card_id" INTEGER NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
    -- pas d'update car on ajoute ou supprime le label juste
);

/* Seeding */

INSERT INTO "list" ("name", "position")
VALUES  ('Liste de course', 1 ),
        ('Javascript', 2),
        ('Jeux à faire', 3);

INSERT INTO "card" ("title", "position", "color", "list_id")
VALUES ('Poireaux',1 ,'#aef9a4',1),
       ('Tomates',2, '#f9a4a4',1),
       ('Biscuit',3 , '#ffffff',1),
       ('Finir OKanban',1 , '#aef9a4',2),
       ('Alan Wake',1 , '#f9a4a4',3),
       ('Elden Ring',2 , '#ffffff',3);

INSERT INTO "label" ("name", "color")
VALUES ('Urgent', '#F00');

INSERT INTO "card_has_label" ("card_id", "label_id")
VALUES (1,1);

COMMIT;