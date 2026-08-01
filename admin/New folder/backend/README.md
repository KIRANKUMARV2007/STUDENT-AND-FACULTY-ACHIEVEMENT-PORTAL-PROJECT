# Faculty & Student Achievement Portal - Admin Module Backend

This is a Python Flask REST backend designed for the Admin Module of the Faculty & Student Achievement Portal. It uses MySQL for storage, `bcrypt` for secure passwords, and `Flask-JWT-Extended` for role-based authentication.

## Project Structure

```
backend/
├── app.py                  # Entrypoint & configurations
├── config.py               # Settings (JWT_SECRET, SQL_URI, uploads folder)
├── requirements.txt        # Python dependency packages
├── schema.sql              # MySQL DDL Schema structure
├── seed.py                 # DB initialization & sample data injection
├── routes/                 # Blueprint modules for REST API resources
│   ├── auth.py             # Login, profile
│   ├── dashboard.py        # Statistics and recent activity
│   ├── users.py            # Student & Faculty CRUD
│   ├── achievements.py     # Approval status, deletion, CSV export
│   ├── rewards.py          # Category points rules configuration
│   ├── reports.py          # Charts analytics & rankings
│   ├── notifications.py    # Broadcast logs and announcements
│   ├── leaderboard.py      # College and department rank lists
│   ├── settings.py         # Category, department, toggle modules configuration
│   └── files.py            # Certificate preview, download, and delete
└── utils/                  # Middleware & verification helpers
    ├── db.py               # Direct MySQL connector (PyMySQL wrapper)
    ├── decorators.py       # JWT & Admin role verification decorators
    └── validators.py       # Email, password strength, and schema validations
```

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- MySQL Server running locally or remotely (default port `3306`)

### 2. Configure Database Connection
Edit connection variables in `config.py` or specify environment variables:
```bash
export DB_HOST="localhost"
export DB_USER="root"
export DB_PASSWORD=""
export DB_NAME="achievement_portal"
export DB_PORT=3306
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create and Seed Database
Run the seeder script. It executes `schema.sql` automatically, creates the database structure, and populates it with default admin (`admin` / `admin123`), faculty logs, student records, and dummy achievements.
```bash
python seed.py
```

### 5. Run the Server
Run the Flask server:
```bash
python app.py
```
By default, the server runs on **[http://localhost:5000](http://localhost:5000)**.
