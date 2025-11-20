import os
import subprocess
from pathlib import Path


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]

    # On ne veut jamais initialiser la DB juste pour générer le schéma
    os.environ.setdefault("SKIP_DB_INIT", "1")

    output_path = project_root / "openapi" / "openapi.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        ["flask", "openapi", "--output", str(output_path), "--format", "json"],
        check=True,
        cwd=project_root,
    )


if __name__ == "__main__":
    main()
