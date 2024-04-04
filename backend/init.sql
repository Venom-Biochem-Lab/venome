-- Postgres manual: https://www.postgresql.org/docs/current/
-- IMPORTANT
-- This file only gets run once, when the database is created.
-- If you need to revise this file read:
--      To rerun this file, you'll need to do `sh run.sh reload_init_sql`
--      Keep in mind this will backup the data to `backend/backups` folder and wipe everything in the docker container DB

-- Note: "Numeric" data types have arbitrary precision which are good for calculations, which seems ideal for this project.
-- https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL

-- Generated columns:
-- https://www.postgresql.org/docs/current/ddl-generated-columns.html

CREATE EXTENSION pg_trgm; -- for trigram matching fuzzy search similarity() func

/*
 * Species Table
 */
CREATE TABLE species (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE  -- combined genus and species name, provided for now by the user
);

/*
 * Proteins Table
 */
CREATE TABLE proteins (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE, -- user specified name of the protein (TODO: consider having a string limit)
    description text,
    length integer, -- length of amino acid sequence
    mass numeric, -- mass in amu/daltons
    content text, -- stored markdown for the protein article (TODO: consider having a limit to how big this can be)
    refs text, -- bibtex references mentioned in the content/article
    species_id integer NOT NULL,
    thumbnail bytea, -- thumbnail image of the protein in base64 format
    date_published timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (species_id) REFERENCES species(id) ON UPDATE CASCADE ON DELETE CASCADE
);

/*
* Users Table
*/
CREATE TABLE users (
    id serial PRIMARY KEY,
    username text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    pword text NOT NULL,
    admin boolean NOT NULL
);


/*
* Tutorials Table
*/
CREATE TABLE tutorials (
    id serial PRIMARY KEY,
    header text NOT NULL,
    title text,
    description text
);


/*
 * Inserts example species into species table
 */
INSERT INTO species(name) VALUES ('ganaspis hookeri');
INSERT INTO species(name) VALUES ('leptopilina boulardi');
INSERT INTO species(name) VALUES ('leptopilina heterotoma');
INSERT INTO species(name) VALUES ('unknown');

/*
 * Inserts test user into user table
 * Email: test
 * Password: test
 */
INSERT INTO users(username, email, pword, admin) VALUES ('test', 'test', '$2b$12$PFoNf7YM0KNIPP8WGsJjveIOhiJjitsMtfwRcCjdcyTuqjdk/q//u', '1');


INSERT INTO tutorials(header, title, description) VALUES('Tutorial Page', 'General Information', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida tristique est, a sollicitudin nulla varius ac. Duis sed lacus arcu. Mauris eget condimentum justo. Vestibulum iaculis cursus accumsan. Mauris eget diam consequat, viverra dui malesuada, maximus nisl. Etiam laoreet venenatis odio ut tempus. Praesent risus est, eleifend id purus non, varius rutrum nisi. Fusce sagittis lorem nec tristique efficitur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium, sapien et volutpat tempus, elit urna congue massa, id consequat leo dolor in ligula. Sed vestibulum tristique eros eu aliquet.');
INSERT INTO tutorials(header, title, description) VALUES('Tutorial 1', 'Biology', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
INSERT INTO tutorials(header, title, description) VALUES('Tutorial 2', 'How to Use the Site', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
INSERT INTO tutorials(header, title, description) VALUES('Tutorial 3', 'Other Reading', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

