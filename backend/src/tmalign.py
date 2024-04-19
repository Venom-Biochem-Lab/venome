import subprocess
import logging as log
import os


def bash_cmd(cmd: str | list[str]) -> str:
    return subprocess.check_output(cmd, shell=True).decode()


TMALIGN_LOCATION = "/app/tmalign"
TMALIGN_EXECUTABLE = f"{TMALIGN_LOCATION}/tmalign"


def assert_tmalign_installed():
    if os.path.exists(TMALIGN_EXECUTABLE):
        return
    else:
        raise ImportError(
            "tm align executable not installed. Please install manually - Automatic install TODO."
        )


temp_dirs_active = 0


class UniqueTempDir:
    """
    on opening scope will create directory of the given name
    on closing scope will delete directory of the given name
    uses the global `active_caches` above to create a unique dir name
    """

    def __init__(self, base_path):
        self.base_path = base_path

    def __enter__(self):
        global temp_dirs_active
        temp_dirs_active += 1
        self.temp_dir = os.path.join(self.base_path, f"temp_dir_{temp_dirs_active}")

        # create the directory (and override existing one if exists)
        bash_cmd("rm -rf " + self.temp_dir)
        bash_cmd(f"mkdir {self.temp_dir}")

        return self.temp_dir

    def __exit__(self, *args):
        global temp_dirs_active

        # get rid of the temp directory
        temp_dirs_active -= 1
        bash_cmd("rm -rf " + self.temp_dir)


def tm_align(
    protein_A: str, pdbA: str, protein_B: str, pdbB: str, type: str = "_all_atm"
):
    """
    Description:
        Returns two overlaid, aligned, and colored PDB structures in a single PDB file.
        The ones without extensions appear to be PDB files.

    Params:
        protein_A:
            The name of the first protein.
        pdbA:
            The filepath of the first protein.
        protein_B:
            The name of the second protein.
        pdbB:
            The filepath of the second protein.
        type:
            The kind of file you want. Experiment with these! Defaults to _all_atm,
            which shows alpha helices and beta sheets. Valid options include:
                "", "_all", "_all_atm", "_all_atm_lig", "_atm",
                ".pml", "_all.pml", "_all_atm.pml", "all_atm_lig.pml", "_atm.pml"
    """
    dir_name = protein_A + "-" + protein_B
    full_path = f"{TMALIGN_LOCATION}/{dir_name}"
    out_file = full_path + "/output"
    desired_file = out_file + type

    # If the directory already exists, then we've already run TM align for this protein pair. We can just return the file.
    if os.path.exists(full_path):
        log.warn(f"Path {full_path} already exists. Do not need to run TM align.")

    # If the directory doesn't exist, then we need to run TM align and generate the files.
    else:
        log.warn(f"Path {full_path} does not exist. Creating directory and returning.")
        cmd = f"{TMALIGN_EXECUTABLE} {pdbA} {pdbB} -o {out_file}"
        try:
            bash_cmd(f"mkdir {full_path}")
            log.warn(f"Attempting to align now with cmd {cmd}")
            stdout = bash_cmd(cmd)
            log.warn(stdout)

        except Exception as e:
            log.warn(e)
            raise e

    return desired_file


def tm_align_return(pdbA: str, pdbB: str, consoleOutput = False) -> str:
    """
    Description:
        Returns two overlaid, aligned, and colored PDB structures in a single PDB file.
        The ones without extensions appear to be PDB files.

    Params:
        pdbA:
            The filepath of the first protein.
        pdbB:
            The filepath of the second protein.

    Returns: the str contents of the pdbA superimposed on pdbB with TMAlgin
    """

    assert_tmalign_installed()

    with UniqueTempDir(base_path=TMALIGN_LOCATION) as temp_dir_path:
        try:
            output_location = os.path.join(temp_dir_path, "output")
            cmd = f"{TMALIGN_EXECUTABLE} {pdbA} {pdbB} -o {output_location} > {output_location}.txt"
            bash_cmd(cmd)

            tmalign_pdb_path = f"{output_location}_all_atm" if not consoleOutput else f"{output_location}.txt"

            with open(tmalign_pdb_path, "r") as tmalign_pdb_file:
                tmalign_pdb_file_str = tmalign_pdb_file.read()
                return tmalign_pdb_file_str

        except Exception as e:
            log.warn(e)
            raise e
