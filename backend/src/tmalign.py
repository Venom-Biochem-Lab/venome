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

def parse_pdb(filepath: str) -> list[str]:
    with open(filepath, "r") as f:
        lines = f.readlines()
        return lines

def tm_align(
        protein_A: str, pdbA: str,
        protein_B: str, pdbB: str,
        type: str = "_all_atm"):
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
            #log.warn(stdout)
            
        except Exception as e:
            log.warn(e)
            return e
        
    return desired_file
