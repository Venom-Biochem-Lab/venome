import requests
import os
import zipfile

MASTER_VENOM_GALAXY_ZIP = "./master_venom_galaxy.zip"
# when unzipped, name the unzipped dir this
MASTER_VENOM_GALAXY_DIR = "./master_venom_galaxy/"


def is_pdb_filepath(fp):
    return fp.endswith(".pdb")


def parse_protein_name(full_path_pdb_file):
    remove_pdb_extenstion = os.path.splitext(full_path_pdb_file)[0]
    remove_path = os.path.split(remove_pdb_extenstion)[1]
    return remove_path


def get_filepaths_in_zip(zip_file_reader: zipfile.ZipFile):
    # don't unzip, just read the filenames in the zipfile
    file_info_list = zip_file_reader.infolist()
    for file_info in file_info_list:
        yield file_info.filename


def get_protein_names_in_zip(zip_file_reader: zipfile.ZipFile):
    for filepath in get_filepaths_in_zip(zip_file_reader):
        if is_pdb_filepath(filepath):
            yield parse_protein_name(filepath), filepath


def get_login_token():
    info = {"email": "test", "password": "test"}
    res = requests.post("http://localhost:8000/users/login", json=info)
    if res.json()["error"]:
        print("Login error:", res.json()["error"])
        exit()
    return res.json()["token"]
