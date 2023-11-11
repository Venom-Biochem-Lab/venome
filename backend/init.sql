-- TODO: modify for https://lucid.app/lucidchart/4958d57d-101d-4c33-aef3-717c381af45c/edit?invitationId=inv_94f4d938-33ba-4f8d-a758-4ac7f452a594&page=0_0#
CREATE TABLE proteins (
    -- todo: make the id meaningful, like Lb17_comp535_c2_seq1, discuss this
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- increment id for now
    name text NOT NULL UNIQUE
);

-- Some inserted values for now
-- note: init.sql only runs on first docker compose
-- so need to run: ./run.sh rm-volume && ./run.sh restart
-- to rerun this, but also delete the db 
INSERT INTO proteins (name) VALUES ('Protein 1');
INSERT INTO proteins (name) VALUES ('Protein 2');
INSERT INTO proteins (name) VALUES ('Protein 3');