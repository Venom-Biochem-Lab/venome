-- protein entries (basic) has name and id for a start
--      TODO: add more info for the protein entries (like PDB, other protein info, markdown text)
--      NOTE: text is like varchar but without a length limit
CREATE TABLE protein_entries (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE
);