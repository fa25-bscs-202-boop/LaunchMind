# LaunchMind AI Backend

Basic FastAPI backend skeleton for LaunchMind AI.

## Run Locally

Activate your virtual environment:

```bash
source .venv/bin/activate
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install requirements:

```bash
pip install -r requirements.txt
```

Run the server:

```bash
uvicorn app.main:app --reload
```

Open Swagger docs:

```text
http://127.0.0.1:8000/docs
```

## Database

The default database is SQLite.

The default database file name is `launchmind.db`.

`DATABASE_URL` can be changed in `.env` later.
