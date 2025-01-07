from datetime import datetime, timedelta

def calculate_new_date(task_date, repeat_interval):
    """
    Calculate the new date for a repeating task using datetime functions.
    
    Args:
        task_date (datetime.date): The original date of the task.
        repeat_interval (int): The repeat interval (0 = no repeat, 366 = annual, 367 = monthly, other values = daily interval).
        
    Returns:
        datetime.date: The new date for the repeating task.
    """
    if repeat_interval == 367:  # Monthly repeat
        new_month = task_date.month + 1
        new_year = task_date.year
        
        if new_month > 12:  # If it's December, move to January of the next year
            new_month = 1
            new_year += 1
        
        # Try to create the new date; if it fails due to a day out of range, move to the last day of the new month
        try:
            new_date = task_date.replace(year=new_year, month=new_month)
        except ValueError:
            # Handle end-of-month case by moving to the last day of the new month
            next_month = task_date.replace(day=1, month=new_month) + timedelta(days=32)
            new_date = next_month.replace(day=1) - timedelta(days=1)
    
    elif repeat_interval == 366:  # Annual repeat
        try:
            new_date = task_date.replace(year=task_date.year + 1)
        except ValueError:
            # Handle February 29 case by moving to February 28 on non-leap years
            new_date = task_date.replace(year=task_date.year + 1, day=28)
    
    else:  # Custom daily repeat interval
        new_date = task_date + timedelta(days=repeat_interval)
    
    return new_date