"""TM-align wrapper"""

import logging as log
import os

from src.util import bash_cmd


TMALIGN_DIR = "/app/tmalign"
TMALIGN_BIN = f"{TMALIGN_DIR}/tmalign"


def assert_tmalign_installed():
    """Check if TM-align is installed and raise an error if not"""
    if os.path.exists(TMALIGN_BIN):
        return
    else:
        raise ImportError(
            "tmalign executable not installed. Try ./run.sh add_tmalign"
        )


class UniqueTempDir:
    """
    on opening scope will create directory of the given name
    on closing scope will delete directory of the given name
    uses the global `active_caches` above to create a unique dir name
    """

    def __init__(self, base_path):
        self.active_dirs = 0
        self.base_path = base_path
        self.temp_dir = ""

    def __enter__(self):
        self.active_dirs += 1
        self.temp_dir = os.path.join(
            self.base_path,
            f"temp_dir_{self.active_dirs}"
        )

        # create the directory (and override existing one if exists)
        bash_cmd("rm -rf " + self.temp_dir)
        bash_cmd(f"mkdir {self.temp_dir}")

        return self.temp_dir

    def __exit__(self, *args):
        self.active_dirs -= 1
        bash_cmd("rm -rf " + self.temp_dir)


def tm_align(
    protein_a: str,
    pdb_a: str,
    protein_b: str,
    pdb_b: str,
    filetype: str = "_all_atm"
):
    """
    Description:
        Returns two overlaid, aligned, and colored PDB structures
        in a single PDB file.
        The ones without extensions appear to be PDB files.

    Args:
        protein_a:
            The name of the first protein.
        pdb_a:
            The filepath of the first protein.
        protein_b:
            The name of the second protein.
        pdb_b:
            The filepath of the second protein.
        filetype:
            The kind of file you want. Experiment with these!
            Defaults to _all_atm, which shows alpha helices and beta sheets.

            Valid options include:
                "", "_all", "_all_atm", "_all_atm_lig", "_atm",
                ".pml", "_all.pml", "_all_atm.pml", "all_atm_lig.pml",
                "_atm.pml"
    """
    dir_name = protein_a + "-" + protein_b
    full_path = f"{TMALIGN_DIR}/{dir_name}"
    out_file = full_path + "/output"
    desired_file = out_file + filetype

    # If the directory already exists, then we've already run TM align
    # for this protein pair. We can just return the file.
    if os.path.exists(full_path):
        log.warning(
            "Path %s already exists. Do not need to run TM align.",
            full_path
        )

    # If the directory doesn't exist, then we need to run TM align
    # and generate the files.
    else:
        log.warning(
            "Path %s does not exist. Creating directory and returning.",
            full_path
        )
        cmd = f"{TMALIGN_BIN} {pdb_a} {pdb_b} -o {out_file}"
        try:
            bash_cmd(f"mkdir {full_path}")
            log.warning("Attempting to align now with cmd %s", cmd)
            stdout = bash_cmd(cmd)
            log.warning(stdout)

        except Exception as e:
            log.warning(e)
            raise e

    return desired_file


def tm_align_return(pdb_a: str, pdb_b: str, console_output=False) -> str:
    """
    Description:
        Returns two overlaid, aligned, and colored PDB structures
        in a single PDB file.
        The ones without extensions appear to be PDB files.

    Args:
        pdb_a:
            The filepath of the first protein.
        pdb_b:
            The filepath of the second protein.
        console_output:
            If true, the output will be printed to the console.
            If false, the output will be saved to a file.
            Defaults to false.
    Returns:
        str: The path to the output file.
    """

    assert_tmalign_installed()

    with UniqueTempDir(base_path=TMALIGN_DIR) as temp_dir_path:
        try:
            output_location = os.path.join(temp_dir_path, "output")
            args = f"{pdb_a} {pdb_b} -o {output_location}"
            cmd = f"{TMALIGN_BIN} {args} > {output_location}.txt"
            bash_cmd(cmd)

            tmalign_pdb_path = (
                f"{output_location}_all_atm"
                if not console_output
                else f"{output_location}.txt"
            )

            with open(tmalign_pdb_path,
                      "r",
                      encoding="utf-8"
                      ) as tmalign_pdb_file:
                tmalign_pdb_file_str = tmalign_pdb_file.read()
                return tmalign_pdb_file_str

        except Exception as e:
            log.warning(e)
            raise e
