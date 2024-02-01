import subprocess
import logging as log

EXTERNAL_DATABASES = [
    "Alphafold/UniProt",
    "Alphafold/UniProt50",
    "Alphafold/Proteome",
    "Alphafold/Swiss",
    "ESMAtlas30",
    "PDB",
]


def bash_cmd(cmd: str | list[str]) -> str:
    return subprocess.check_output(cmd, shell=True).decode()


def to_columnar_array(arr: list[list]) -> list[list]:
    columnar = []
    for i in range(len(arr[0])):
        columnar.append([])
        for j in range(len(arr)):
            columnar[i].append(arr[j][i])
    return columnar


def parse_output(filepath: str) -> list[list]:
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
    out_format: list[str] = ["query", "target", "prob"],
    out_file=".foldseek_cache/output",
    temp_dir=".foldseek_cache",
    print_stdout=False,
    foldseek_executable="./foldseek/bin/foldseek",
    columnar=False,
) -> list[list]:
    """easy_search just calls foldseek easy-search under the hood
    TODO: use pybind to call the C++ function instead

    Returns:
        list[list]: a list of the matches from the search
    """

    # Then call the easy-search
    flags = f"--format-output {','.join(out_format)}" if len(out_format) > 0 else ""
    cmd = f"{foldseek_executable} easy-search {query} {target} {out_file} {temp_dir} {flags}"
    try:
        stdout = bash_cmd(cmd)
    except Exception as e:
        log.warn(e)
        return []

    if print_stdout:
        log.warn(stdout)

    if columnar:
        return to_columnar_array(parse_output(out_file))
    else:
        return parse_output(out_file)


def create_db(
    dir: str,
    db_name: str,
    foldseek_executable="foldseek/bin/foldseek",
    print_stdout=False,
    temp_dir=".foldseek_cache",
):
    # check that our dir exists
    try:
        bash_cmd(f"ls {dir}")
    except Exception:
        if dir not in EXTERNAL_DATABASES:
            raise Exception(f"Directory {dir} not found")

    # if database already exists, don't create another
    try:
        bash_cmd(f"ls {db_name}")
    except Exception:
        if dir not in EXTERNAL_DATABASES:
            cmd = f"{foldseek_executable} createdb {dir} {db_name}"
        else:
            cmd = f"{foldseek_executable} databases {dir} {db_name} {temp_dir}"
        stdout = bash_cmd(cmd)
        if print_stdout:
            print(stdout)

    return db_name


if __name__ == "__main__":
    # search each protein in test_examples/ with every other one
    test_targets = create_db(dir="test_examples", db_name="test")
    output = easy_search(
        query=test_targets,
        target=test_targets,
        out_format=["query", "target", "prob"],
    )
    print(output)
