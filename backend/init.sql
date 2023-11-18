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
    name text NOT NULL UNIQUE PRIMARY KEY,
    length integer, -- 
    mass numeric
);

/*
 * Species Table
 */
CREATE TABLE species (
    id text NOT NULL UNIQUE PRIMARY KEY, -- This should be the first letters in the scientific name - e.g. "gh", the prefix to the files, for simplicity.
    tax_genus text NOT NULL,
    tax_species text NOT NULL,
    scientific_name text UNIQUE GENERATED ALWAYS AS (tax_genus || ' ' || tax_species) STORED,
    content bytea
);

/*
 * Table: species_proteins
 * Description: Join table for N:M connection between Species and Proteins
 */
 CREATE TABLE species_proteins (
    species_id text references species(id) ON UPDATE CASCADE ON DELETE CASCADE,
    protein_id text references proteins(name) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (species_id, protein_id)
 );

/*
 * Inserts example proteins into proteins table
 */
INSERT INTO proteins (name, length, mass) VALUES (
    'Gh_comp271_c0_seq1', 
    0,
    0.0);

INSERT INTO proteins (name, length, mass) VALUES (
    'Lb17_comp535_c2_seq1', 
    0,
    0.0);

INSERT INTO proteins (name, length, mass) VALUES (
    'Lh14_comp2336_c0_seq1', 
    0,
    0.0);

/*
 * Inserts example species into species table
 */
INSERT INTO species(id, tax_genus, tax_species, content) VALUES (
    'Gh',
    'Ganaspis',
    'hookeri',
    null
);

INSERT INTO species(id, tax_genus, tax_species, content) VALUES (
    'Lb',
    'Leptopilina',
    'boulardi',
    null
);

INSERT INTO species(id, tax_genus, tax_species, content) VALUES (
    'Lh',
    'Leptopilina',
    'heterotoma',
    null
);

 /*
  * Inserts connections between species and proteins
  */ 
INSERT INTO species_proteins(species_id, protein_id) VALUES (
    'Gh',
    'Gh_comp271_c0_seq1'
 );

  /*
  * Inserts connections between species and proteins
  */ 
INSERT INTO species_proteins(species_id, protein_id) VALUES (
    'Lb',
    'Lb17_comp535_c2_seq1'
 );

 /*
  * Inserts connections between species and proteins
  */ 
INSERT INTO species_proteins(species_id, protein_id) VALUES (
    'Lh',
    'Lh14_comp2336_c0_seq1'
 );

