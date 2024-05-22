import requests
import os
import zipfile
from master_venom_galaxy import (
    get_login_token,
    get_protein_names_in_zip,
    MASTER_VENOM_GALAXY_ZIP,
    MASTER_VENOM_GALAXY_DIR,
)

CONTENT = "From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold)."
REFS = ""


def upload_protein_file(
    path, name, species_name, content="", refs="", desc="", token=""
):
    with open(os.path.join(".", path), "r") as f:
        pdb_file_str = f.read()
        payload = {
            "name": name,
            "species_name": species_name,
            "content": content,
            "refs": refs,
            "pdb_file_str": pdb_file_str,
            "description": desc,
        }
        out = requests.post(
            "http://localhost:8000/protein/upload",
            json=payload,
            headers={"authorization": "Bearer {}".format(token)},
        )
        return out


if __name__ == "__main__":
    with zipfile.ZipFile(MASTER_VENOM_GALAXY_ZIP, "r") as z:
        z.extractall()  # unzip

        available_species = {
            "Gh": "ganaspis hookeri",
            "Lb": "leptopilina boulardi",
            "Lh": "leptopilina heterotoma",
            "*": "unknown",
        }
        token = get_login_token()
        for protein_name, filepath in get_protein_names_in_zip(z):
            species_name = available_species[protein_name[:2]]
            upload_protein_file(
                filepath,
                protein_name,
                species_name,
                content=CONTENT,
                refs=REFS,
                desc=f"{protein_name.replace('_', ' ')} from the {species_name} wasp venom",
                token=token,
            )
            print("uploaded", protein_name, species_name)

        # delete unzipped files
        os.system(f"rm -rf {MASTER_VENOM_GALAXY_DIR}")
