from base64 import b64decode
from Bio.PDB import PDBParser
from Bio.SeqUtils import molecular_weight, seq1
from io import StringIO

PDB_FILE_DIR = "data/pdbAlphaFold"


def decode_base64(b64_header_and_data: str):
    """Converts a base64 string to bytes"""
    # only decode after the header (data:application/octet-stream;base64,)
    end_of_header = b64_header_and_data.index(",")
    b64_data_only = b64_header_and_data[end_of_header:]
    return b64decode(b64_data_only).decode("utf-8")


def valid_pdb_file(file: str):
    """Validates the bytes is a pdb file"""
    # TODO: implement
    return False


class PDB:
    def __init__(self, file_name, file_contents):
        self.file_name = file_name
        self.file_contents = file_contents

        try:
            self.parser = PDBParser()
            self.structure = self.parser.get_structure(
                id="id", file=StringIO(file_contents)
            )
        except Exception as e:
            raise e  # raise to the user who calls this PDB class

    def num_amino_acids(self) -> int:
        return len(self.amino_acids())

    def computed_mass(self):
        return molecular_weight(seq="".join(self.amino_acids()), seq_type="protein")

    def amino_acids(self, one_letter_code=True):
        return [
            seq1(residue.resname) if one_letter_code else residue.resname
            for residue in self.structure.get_residues()
        ]

    def __repr__(self):
        return f"PDB(file={self.file_name}, num_amino_acids={self.num_amino_acids})"
