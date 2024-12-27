# init_db.py

import sqlite3

def init_db():
    # Connect to the SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect('calendar.db')
    cursor = conn.cursor()
    
    # Create a table for storing calendar
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS calendar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        doi TEXT NOT NULL,
        repeats INTEGER NOT NULL,
        type TEXT NOT NULL
    )
    ''')
    
    # Commit changes and close the connection
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")