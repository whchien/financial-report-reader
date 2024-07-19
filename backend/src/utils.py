import os
import uuid
from typing import List


def text_to_uuid(text: str) -> str:
    # Use uuid.NAMESPACE_DNS as the namespace for consistency
    namespace = uuid.NAMESPACE_DNS
    return str(uuid.uuid5(namespace, text))


def check_env_var(vars: List[str]) -> None:
    missing = [var for var in vars if not os.environ.get(var)]
    if len(missing) > 0:
        raise ValueError(f"The following env variables are missing: {missing}")