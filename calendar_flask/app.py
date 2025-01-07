from flask import Flask, request, render_template, redirect, url_for
import sqlite3
from db_interface import *
from data_processing import *
from datetime import datetime, timedelta

app = Flask(__name__)

def is_valid_date(date_str):
    """Check if the date string is a valid date or a placeholder date."""
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False

@app.route('/')
def index():
    # Calculate the date range for the next 7 days
    today = datetime.today().date()  # Current date
    seven_days_later = today + timedelta(days=7)  # Date 7 days from now
    # Fetch all tasks from the database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM calendar 
    ''')
    calendar = cursor.fetchall()  # Fetch all results as a list of Row objects

     # Update task dates based on repeat interval
    updated_tasks = []
    for task in calendar:
        doi = task['doi']
        if not is_valid_date(doi):
            continue
        
        doi = datetime.strptime(doi, "%Y-%m-%d").date()
        if task['repeats'] == 0 and doi < today:
            conn.execute('DELETE FROM calendar WHERE id = ?', (task['id'],))
            conn.commit()
        else:
            repeats = task['repeats']
            while doi < today:
                doi = calculate_new_date(doi, repeats)
            if today <= doi:
                updated_tasks.append((task['id'], doi))
    
    # Update tasks in database with new dates
    conn = get_db_connection()
    cursor = conn.cursor()
    for task_id, new_doi in updated_tasks:
        cursor.execute('''
            UPDATE calendar SET doi = ? WHERE id = ?
        ''', (new_doi, task_id))
    conn.commit()
    conn.close()

    # Fetch updated tasks
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM calendar WHERE doi BETWEEN ? AND ?
    ''', (today, seven_days_later))
    tasks = cursor.fetchall()
    conn.close()

    # Group tasks by day of the week
    grouped_tasks = {}
    for task in tasks:
        doi = task['doi']
        if not is_valid_date(doi):
            continue
        
        date_obj = datetime.strptime(doi, "%Y-%m-%d").date()
        day_of_week = date_obj.strftime("%A")
        
        if day_of_week not in grouped_tasks:
            grouped_tasks[day_of_week] = []
        
        grouped_tasks[day_of_week].append(task)

    # Order days of the week
    order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    sorted_grouped_tasks = {day: grouped_tasks.get(day, []) for day in order}

    today_day = today.strftime("%A")
    return render_template('index.html', calendar=sorted_grouped_tasks, today_day=today_day, today_date = today)

    
# Route to handle form submission
@app.route('/submit_form', methods=['POST'])
def submit_form():
    # Extracting input values from the form
    name = request.form.get('name')
    doi = request.form.get('doi')
    repeats = request.form.get('repeats')
    task_type = request.form.get('type')

    # Process the data or save it to a database
    # Here, we are just printing it to the console
    # Insert form data into the SQLite database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO calendar (name, doi, repeats, type) VALUES (?, ?, ?, ?)
    ''', (name, doi, repeats, task_type))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

# New route to handle task deletion
@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    # Connect to the database and delete the task with the given ID
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM calendar WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()
    
    return redirect(url_for('index'))  # Redirect back to the index page after deletion


@app.route('/add_task')
def add_task():
    default_date = request.args.get('date', '')
    return render_template('add.html', default_date=default_date)
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')