import sqlite3

# Function to connect to the SQLite database
def get_db_connection():
    conn = sqlite3.connect('calendar.db')
    conn.row_factory = sqlite3.Row  # This allows us to access columns by name
    return conn