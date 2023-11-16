from base64 import b64decode


def b64_to_bytes(b64: str):
    """Converts a base64 string to bytes"""
    # there is data:application/octet-stream;base64, at the start of the string, so skip that
    return b64decode(b64[b64.index(",") :])


def valid_pdb_file(file: bytes):
    """Validates the bytes is a pdb file"""
    # TODO: implement
    return False
