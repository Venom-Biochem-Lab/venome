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

/*
 * Proteins Table
 */
CREATE TABLE proteins (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE, -- user specified name of the protein (TODO: consider having a string limit)
    length integer, -- length of amino acid sequence
    mass numeric, -- mass in amu/daltons
    content bytea, -- stored markdown for the protein article (TODO: consider having a limit to how big this can be)
    refs bytea -- bibtex references mentioned in the content/article
);

/*
 * Species Table
 */
CREATE TABLE species (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE  -- combined genus and species name, provided for now by the user
    -- -- removed now to reduce complexity for v0
    -- tax_genus text NOT NULL,
    -- tax_species text NOT NULL,
    -- scientific_name text UNIQUE GENERATED ALWAYS AS (tax_genus || ' ' || tax_species) STORED,
    -- content bytea
);

/*
 * Table: species_proteins
 * Description: Join table for N:M connection between Species and Proteins
 */
 CREATE TABLE species_proteins (
    species_id serial references species(id) ON UPDATE CASCADE ON DELETE CASCADE,
    protein_id serial references proteins(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (species_id, protein_id)
 );

/*
 * Inserts example species into species table
 */
INSERT INTO species(name) VALUES ('ganaspis hookeri'); 
INSERT INTO species(name) VALUES ('leptopilina boulardi'); 
INSERT INTO species(name) VALUES ('leptopilina heterotoma'); 
INSERT INTO species(name) VALUES ('unknown');


