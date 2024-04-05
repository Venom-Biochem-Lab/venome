import subprocess
import logging as log
import os


def bash_cmd(cmd: str | list[str]) -> str:
    return subprocess.check_output(cmd, shell=True).decode()


FOLDSEEK_LOCATION = "/app/foldseek"
FOLDSEEK_EXECUTABLE = f"{FOLDSEEK_LOCATION}/bin/foldseek"


def assert_foldseek_installed():
    if os.path.exists(FOLDSEEK_EXECUTABLE):
        return
    else:
        raise ImportError(
            "foldseek executable not installed. Try ./run.sh add_foldseek"
        )


active_caches = 0


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

    def __enter__(self):
        global active_caches
        active_caches += 1
        self.temp_dir = f"{FOLDSEEK_LOCATION}/temp_dir_{active_caches}"
        return self.temp_dir

    def __exit__(self, *args):
        global active_caches
        active_caches -= 1
        bash_cmd("rm -rf " + self.temp_dir)


def parse_easy_search_output(filepath: str) -> list[list]:
    with open(filepath, "r") as f:
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
    TODO: use pybind to call the C++ function instead

    Returns:
        list[list]: a list of the matches from the search where the inner list is the same size as out_format
    """

    assert_foldseek_installed()

    with CreateUniqueDirName() as temp_dir:
        out_file = temp_dir + "/output"

        # Then call the easy-search
        flags = f"--format-output {out_format}" if out_format else ""
        cmd = f"{FOLDSEEK_EXECUTABLE} easy-search {query} {target} {out_file} {temp_dir} {flags}"
        try:
            stdout = bash_cmd(cmd)
        except Exception as e:
            log.warn(e)
            return []

        if print_loading_info:
            log.warn(stdout)

        return parse_easy_search_output(out_file)
