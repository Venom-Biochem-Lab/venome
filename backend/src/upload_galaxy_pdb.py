import logging as log
import os
from fastapi.staticfiles import StaticFiles
from .api_types import ProteinEntry, UploadBody, UploadError, EditBody
from .db import Database, bytea_to_str, str_to_bytea
from .protein import parse_protein_pdb, pdb_file_name, protein_name_taken
from .setup import disable_cors, init_fastapi_app



def upload_protein_entry(body: UploadBody):
    body.name = body.name.replace(" ", "_")

    # check that the name is not already taken in the DB
    if protein_name_taken(body.name):
        return UploadError.NAME_NOT_UNIQUE

    # if name is unique, save the pdb file and add the entry to the database
    try:
        # TODO: consider somehow sending the file as a stream instead of a b64 string or send as regular string
        pdb = parse_protein_pdb(body.name, body.pdb_file_base64, encoding="b64")
    except Exception:
        return UploadError.PARSE_ERROR

    try:
        # write to file to data/ folder
        with open(pdb_file_name(pdb.name), "w") as f:
            f.write(pdb.file_contents)

        # save to db
        with Database() as db:
            db.execute(
                """INSERT INTO proteins (name, length, mass, content) VALUES (%s, %s, %s, %s);""",
                [
                    pdb.name,
                    pdb.num_amino_acids,
                    pdb.mass_daltons,
                    str_to_bytea(body.content),
                ],
            )
    except Exception:
        return UploadError.WRITE_ERROR