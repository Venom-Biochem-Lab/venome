import requests
import os

DIR = "../backend/src/data/pdbAlphaFold"


def delete_protein_files():
    os.system(f"rm -fr {DIR}")
    os.system(f"mkdir {DIR}")
    os.system(f"echo *.pdb > {DIR}/.gitignore")


delete_protein_files()
