# HRMS LITE

HRMS LITE is a lightweight Human Resource Management System with:
- Employee management
- Attendance marking
- Attendance search by employee ID
- Today's present employee view

Tech stack:
- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React + Vite + Tailwind CSS + Axios

## Project Structure

```text
HRMS-Lite/
|- backend/
|  |- app/
|  |- requirements.txt
|  |- .env
|  |- hrms.db
|- frontend/
|  |- src/
|  |- package.json
|  |- .env
|- README.md
```

## Prerequisites

- Python 3.10+ (recommended)
- Node.js 18+ and npm
- Git (optional)

## Environment Variables

Create these files before running the app.

### Backend `.env`

File: `backend/.env`

```env
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend `.env`

File: `frontend/.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Backend Setup (FastAPI)

From project root:

### 1) Create virtual environment

Windows (PowerShell):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

### 2) Install Python dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3) Run backend server

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URL: `http://127.0.0.1:8000`  
Swagger docs: `http://127.0.0.1:8000/docs`

## Frontend Setup (React + Vite)

From project root:

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Run development server

```bash
npm run dev
```

Frontend URL (default): `http://localhost:5173`

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Useful Commands

### Backend

```bash
# activate env (Windows PowerShell)
cd backend
.\.venv\Scripts\Activate.ps1

# install/update dependencies
pip install -r requirements.txt

# run API
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

## API Endpoints

### Employee

- `POST /employees/` - Create employee
- `GET /employees/` - List employees
- `DELETE /employees/{employee_id}` - Delete employee by numeric DB ID

### Attendance

- `POST /attendance/` - Mark or update attendance
- `GET /attendance/{employee_id}` - Get attendance by business employee ID
- `GET /attendance/today/present` - Get employees marked present today

## Running Full App (2 terminals)

Terminal 1 (Backend):

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2 (Frontend):

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Notes

- SQLite database file is `backend/hrms.db`.
- Tables are auto-created on backend startup.
- If CORS issues happen, verify `ALLOWED_ORIGINS` in `backend/.env`.
