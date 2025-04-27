"""Foldseek wrapper for easy-search"""

import subprocess
import logging as log
import os

from src.util import bash_cmd

FOLDSEEK_DIR = "/app/foldseek"
FOLDSEEK_BIN = f"{FOLDSEEK_DIR}/bin/foldseek"


def assert_foldseek_installed():
    """Check if foldseek is installed and raise an error if not"""
    if os.path.exists(FOLDSEEK_BIN):
        return
    else:
        raise ImportError(
            "foldseek executable not installed. Try ./run.sh add_foldseek"
        )


class CreateUniqueDirName:
    """
    Generates a new directory name
    use this like
    ```python
       with GenerateDirName() as name:
           print(name)
    ```
    on opening scope will create directory of the given name
    on closing scope will delete directory of the given name
    uses the global `active_caches` above to create a unique dir name
    """

    def __init__(self):
        self.caches = 0
        self.temp_dir = ""

    def __enter__(self):
        self.caches += 1
        self.temp_dir = f"{FOLDSEEK_DIR}/temp_dir_{self.caches}"
        return self.temp_dir

    def __exit__(self, *args):
        self.caches -= 1
        bash_cmd("rm -rf " + self.temp_dir)


def parse_easy_search_output(filepath: str) -> list[list]:
    """Parse the output of foldseek easy-search"""
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()

        parsed_lines = []
        for line in lines:
            parsed_line = []
            for column in line.strip("\n").split("\t"):
                try:
                    column = float(column)
                except ValueError:
                    pass
                parsed_line.append(column)
            parsed_lines.append(parsed_line)

    return parsed_lines


def easy_search(
    query: str,
    target: str,
    out_format: str = "query,target,prob",
    print_loading_info=False,
) -> list[list]:
    """easy_search just calls foldseek easy-search under the hood

    Args:
        query (str): the query file
        target (str): the target file
        out_format (str): the output format, default is "query,target,prob"
        print_loading_info (bool): whether to print loading info
    Returns:
        list[list]: a list of the matches from the search where
        the inner list is the same size as out_format
    """
    # TODO: use pybind to call the C++ function instead

    assert_foldseek_installed()

    with CreateUniqueDirName() as temp_dir:
        out_file = temp_dir + "/output"

        # Then call the easy-search
        flags = f"--format-output {out_format}" if out_format else ""
        args = f"{query} {target} {out_file} {temp_dir}"
        cmd = f"{FOLDSEEK_BIN} easy-search {args} {flags}"
        try:
            stdout = bash_cmd(cmd)
        except ValueError as e:
            log.warning(e)
            return []
        except subprocess.CalledProcessError as e:
            log.warning(e)
            return []

        if print_loading_info:
            log.warning(stdout)

        return parse_easy_search_output(out_file)
