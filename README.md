# FastAPI Mini-Chat

This project is a minimalistic chat application built with FastAPI for the backend API, SQLAlchemy for database interaction, and a simple frontend interface for user engagement. The application includes two primary models: **User** and **Message**, enabling users to send and receive messages in real-time.

## Tech Stack
- **Backend:** FastAPI + WebSockets
- **Frontend:** HTML, CSS, JavaScript
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy

## Features
- **Authorization:** User registration and login through HTML forms with JavaScript, and an API for data handling and validation.
- **Chat:** Users can select contacts from a list to chat with, and messages are displayed in the chat window.
- **Message Sending:** Instant text message delivery via WebSocket, with server polling for loading older messages.
- **Interface:** A responsive design built with CSS, optimized for smooth usage across devices.

## Example

<img src="https://github.com/user-attachments/assets/939d8ced-0587-437d-a8d0-0ca5a76d8cec" width="600" alt="Mini Chat Demo" />

## Project Structure
```
project-root/
│
├── app/               # FastAPI application code
├── frontend/          # HTML, CSS, and JavaScript files
├── alembic/           # Alembic migrations folder
├── .env               # Environment variables
├── requirements.txt   # Python dependencies
└── README.md          # Project documentation
```

## How to run

### Environment Configuration

Create an .env file in the project root and fill it with the following variables:
```bash
DB_HOST=your_host
DB_PORT=your_port
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
SECRET_KEY=your_secret_key
ALGORITHM=HS256
```

### Database Setup:

Start a PostgreSQL instance using Docker. Replace mysecretpassword with your preferred password:
```bash
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

### Installation:

Install the required dependencies:
```bash
pip install -r requirements.txt
```

### Run Database Migrations:

Apply Alembic migrations to create the necessary tables:
```bash
alembic upgrade head
```

### Running the Application:

Launch the application with Uvicorn:
```bash
uvicorn app.main:app
```
