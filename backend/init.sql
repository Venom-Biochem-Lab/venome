-- Postgres manual: https://www.postgresql.org/docs/current/
-- IMPORTANT
-- This file only gets run once, when the database is created.
-- If you need to revise this file read:
--      To rerun this file, you'll need to do `sh run.sh reload_init_sql`
--      Keep in mind this will backup the data to `backend/data/backups` folder and wipe everything in the docker container DB


-- TODO: modify for https://lucid.app/lucidchart/4958d57d-101d-4c33-aef3-717c381af45c/edit?invitationId=inv_94f4d938-33ba-4f8d-a758-4ac7f452a594&page=0_0#
CREATE TABLE proteins (
    -- todo: make the id meaningful, like Lb17_comp535_c2_seq1, discuss this
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- increment id for now
    name text NOT NULL UNIQUE
    -- TODO: filePDBAlphaFold (string)
    -- TODO: length (int)
    -- TODO: mass (float)
);

-- Some inserted values for now
INSERT INTO proteins (name) VALUES ('Protein 1');
INSERT INTO proteins (name) VALUES ('Protein 2');
INSERT INTO proteins (name) VALUES ('Protein 3');