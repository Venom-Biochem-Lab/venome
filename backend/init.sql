-- Postgres manual: https://www.postgresql.org/docs/current/
-- IMPORTANT
-- This file only gets run once, when the database is created.
-- If you need to revise this file read:
--      To rerun this file, you'll need to do `sh run.sh reload_init_sql`
--      Keep in mind this will backup the data to `backend/backups` folder and wipe everything in the docker container DB


-- TODO: modify for https://lucid.app/lucidchart/4958d57d-101d-4c33-aef3-717c381af45c/edit?invitationId=inv_94f4d938-33ba-4f8d-a758-4ac7f452a594&page=0_0#
-- Note: "Numeric" data types have arbitrary precision which are good for calculations. This seems like what we want.
-- https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL
CREATE TABLE proteins (
    -- todo: make the id meaningful, like Lb17_comp535_c2_seq1, discuss this
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- increment id for now
    name text NOT NULL UNIQUE,
    length integer,
    mass numeric
);

-- NOTE: These file path links are off-the-cuff, and might not be useful to the frontend, so
-- TODO: Change file path links to something useful
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