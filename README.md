# live-event-schedule
Web app to manage live event schedule

# Backend Startup Instructions

1. Open a terminal and navigate to the backend directory:
   
   cd backend

2. Create and activate a Python virtual environment (recommended):
   
   python3 -m venv venv
   source venv/bin/activate

3. Install required dependencies:
   
   pip install flask flask-cors flasgger

4. Start the Flask backend server:
   
   FLASK_APP=app.py flask run --port 8000

The backend API will be available at http://localhost:8000/api/performances and Swagger docs at http://localhost:8000/.

my first commit

my second commit