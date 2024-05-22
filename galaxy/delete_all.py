import requests
import zipfile
from master_venom_galaxy import (
    get_login_token,
    get_protein_names_in_zip,
    MASTER_VENOM_GALAXY_ZIP,
)


def delete_protein_file(name, token):
    requests.delete(
        f"http://localhost:8000/protein/entry/{name}",
        headers={"authorization": "Bearer {}".format(token)},
    )


def get_filepaths_in_zip(zip_file_reader: zipfile.ZipFile):
    # don't unzip, just read the filenames in the zipfile
    file_info_list = zip_file_reader.infolist()
    for file_info in file_info_list:
        yield file_info.filename


if __name__ == "__main__":
    with zipfile.ZipFile(MASTER_VENOM_GALAXY_ZIP, "r") as z:
        token = get_login_token()  # needed for delete request
        for protein_name, _ in get_protein_names_in_zip(z):
            # delete request to the backend directly
            delete_protein_file(protein_name, token)
            print("deleted", protein_name)
