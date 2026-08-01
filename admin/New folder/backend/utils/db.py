import pymysql
import sqlite3
import os
import re
from datetime import datetime
from config import Config

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'achievement_portal.db')
USE_SQLITE = False

def sqlite_date_format(date_str, format_str):
    if not date_str:
        return ""
    format_str = format_str.replace('%%', '%')
    mysql_to_python = {
        '%Y': '%Y',
        '%m': '%m',
        '%d': '%d',
        '%H': '%H',
        '%i': '%M',
        '%s': '%S',
        '%b': '%b'
    }
    py_format = format_str
    for my_s, py_s in mysql_to_python.items():
        py_format = py_format.replace(my_s, py_s)
    
    for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M:%S.%f', '%Y-%m-%d'):
        try:
            dt = datetime.strptime(str(date_str), fmt)
            return dt.strftime(py_format)
        except ValueError:
            pass
    return str(date_str)

def sqlite_year(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(str(date_str).split()[0], '%Y-%m-%d').year
    except:
        return None

def sqlite_month(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(str(date_str).split()[0], '%Y-%m-%d').month
    except:
        return None

def get_db_connection():
    """Establishes and returns a connection to MySQL, falling back to SQLite if needed."""
    global USE_SQLITE
    
    # Try MySQL first (if not already forced to SQLite)
    if not USE_SQLITE:
        try:
            conn = pymysql.connect(
                host=Config.DB_HOST,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                database=Config.DB_NAME,
                port=Config.DB_PORT,
                cursorclass=pymysql.cursors.DictCursor,
                autocommit=True
            )
            return conn
        except Exception as mysql_err:
            print(f"MySQL connection failed: {mysql_err}. Falling back to SQLite...")
            USE_SQLITE = True

    # SQLite fallback
    conn = sqlite3.connect(DB_FILE)
    conn.execute("PRAGMA foreign_keys = ON;")
    
    # Row factory to emulate DictCursor
    def dict_factory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d
    conn.row_factory = dict_factory
    
    # Register MySQL equivalent SQL functions
    conn.create_function("DATE_FORMAT", 2, sqlite_date_format)
    conn.create_function("YEAR", 1, sqlite_year)
    conn.create_function("MONTH", 1, sqlite_month)
    
    # Check if database is initialized. If not, auto-initialize
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT 1 FROM admins LIMIT 1")
    except sqlite3.OperationalError:
        print("SQLite database not initialized. Running schema and seeding data...")
        init_sqlite_db(conn)
        
    return conn

def init_sqlite_db(conn):
    """Initializes the SQLite database with schema and seeds it."""
    # 1. Run SQLite-converted schema
    schema_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'schema.sql')
    if os.path.exists(schema_path):
        with open(schema_path, 'r', encoding='utf-8') as f:
            mysql_schema = f.read()
        
        # Convert schema to SQLite compatibility
        sqlite_schema = mysql_schema
        # Remove ENGINE=InnoDB
        sqlite_schema = re.sub(r'ENGINE\s*=\s*\w+\s*(DEFAULT\s+CHARSET\s*=\s*\w+)?;?', '', sqlite_schema, flags=re.IGNORECASE)
        # Convert INT AUTO_INCREMENT PRIMARY KEY to INTEGER PRIMARY KEY AUTOINCREMENT
        sqlite_schema = re.sub(r'\bINT\b\s+AUTO_INCREMENT\s+PRIMARY\s+KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT', sqlite_schema, flags=re.IGNORECASE)
        # Convert ENUM to TEXT
        sqlite_schema = re.sub(r'\bENUM\s*\([^)]*\)', 'TEXT', sqlite_schema, flags=re.IGNORECASE)
        # Remove ON UPDATE CURRENT_TIMESTAMP
        sqlite_schema = re.sub(r'ON\s+UPDATE\s+CURRENT_TIMESTAMP', '', sqlite_schema, flags=re.IGNORECASE)
        
        # Split and execute statements
        statements = sqlite_schema.split(';')
        cursor = conn.cursor()
        for stmt in statements:
            stmt = stmt.strip()
            if not stmt or stmt.startswith('--'):
                continue
            cursor.execute(stmt)
        conn.commit()
    
    # 2. Seed data
    import bcrypt
    def hash_password(password: str) -> str:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        
    cursor = conn.cursor()
    
    # Departments
    departments = [
        ('Computer Science & Engineering', 'CSE'),
        ('Mechanical Engineering', 'ME'),
        ('Electronics & Communication Engineering', 'ECE'),
        ('Information Technology', 'IT')
    ]
    for name, code in departments:
        cursor.execute("INSERT OR IGNORE INTO departments (name, code) VALUES (?, ?)", (name, code))
    
    # Get dept IDs
    cursor.execute("SELECT code, id FROM departments")
    dept_map = {row['code']: row['id'] for row in cursor.fetchall()}
    
    # Admins
    hashed_admin1 = hash_password('admin123')
    cursor.execute(
        "INSERT OR IGNORE INTO admins (admin_id, name, email, password_hash) VALUES (?, ?, ?, ?)",
        ('admin', 'System Administrator', 'admin@achievementportal.com', hashed_admin1)
    )
    
    hashed_admin2 = hash_password('praveen12')
    cursor.execute(
        "INSERT OR IGNORE INTO admins (admin_id, name, email, password_hash) VALUES (?, ?, ?, ?)",
        ('praveen', 'Praveen Kumar', 'praveenkumarj.it24@bitsathy.ac.in', hashed_admin2)
    )
    
    # Categories
    cursor.execute("SELECT id FROM admins LIMIT 1")
    admin_db_id = cursor.fetchone()['id']
    
    categories = [
        ('Hackathon Winner', 100, 'Winner of a regional, national, or international hackathon event.'),
        ('Certification', 40, 'Industry recognized certification (e.g., AWS, Azure, Google, Oracle).'),
        ('Internship', 60, 'Completed internship of 4+ weeks with a recognized organization.'),
        ('Sports', 50, 'Representation or placement in inter-college/state/national sports meet.'),
        ('Research Paper', 80, 'Publication of research paper in Scopus/Indexed Journals or IEEE Conferences.'),
        ('Workshop', 20, 'Participation in 3+ days technical workshop or boot camp.')
    ]
    for name, pts, desc in categories:
        cursor.execute(
            "INSERT OR IGNORE INTO achievement_categories (name, default_points, description) VALUES (?, ?, ?)",
            (name, pts, desc)
        )
        cat_id = cursor.lastrowid
        cursor.execute(
            "INSERT OR IGNORE INTO reward_point_rules (category_id, points, updated_by_admin_id) VALUES (?, ?, ?)",
            (cat_id, pts, admin_db_id)
        )
        
    # Get category IDs mapping
    cursor.execute("SELECT name, id FROM achievement_categories")
    cat_map = {row['name']: row['id'] for row in cursor.fetchall()}
    
    # Faculty
    faculties = [
        ('fac01', 'Dr. Aris Thorne', 'aris.thorne@portal.edu', dept_map['CSE'], 'Professor'),
        ('fac02', 'Prof. Clara Oswald', 'clara.oswald@portal.edu', dept_map['ECE'], 'Associate Professor'),
        ('fac03', 'Dr. James Moriarty', 'james.moriarty@portal.edu', dept_map['CSE'], 'Assistant Professor')
    ]
    for fid, name, email, dept_id, desig in faculties:
        hashed_pw = hash_password('faculty123')
        cursor.execute(
            "INSERT OR IGNORE INTO faculty (faculty_id, name, email, password_hash, department_id, designation) VALUES (?, ?, ?, ?, ?, ?)",
            (fid, name, email, hashed_pw, dept_id, desig)
        )
        
    # Get faculty IDs
    cursor.execute("SELECT faculty_id, id FROM faculty")
    fac_map = {row['faculty_id']: row['id'] for row in cursor.fetchall()}
    
    # Students
    students = [
        ('stu01', 'Sarah Jenkins', 'sarah.jenkins@portal.edu', dept_map['CSE'], 'ROLL-2023-CS-04', '2023-2027', 150),
        ('stu02', 'David Kim', 'david.kim@portal.edu', dept_map['IT'], 'ROLL-2023-IT-12', '2023-2027', 0),
        ('stu03', 'Emma Watson', 'emma.watson@portal.edu', dept_map['ECE'], 'ROLL-2023-EC-55', '2023-2027', 50),
        ('stu04', 'Alex Johnson', 'alex.johnson@portal.edu', dept_map['CSE'], 'ROLL-2023-CS-01', '2023-2027', 100)
    ]
    for sid, name, email, dept_id, roll, ac_yr, pts in students:
        hashed_pw = hash_password('student123')
        cursor.execute(
            "INSERT OR IGNORE INTO students (student_id, name, email, password_hash, department_id, roll_number, academic_year, reward_points) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (sid, name, email, hashed_pw, dept_id, roll, ac_yr, pts)
        )
        
    # Get student IDs
    cursor.execute("SELECT student_id, id FROM students")
    stu_map = {row['student_id']: row['id'] for row in cursor.fetchall()}
    
    # Achievements
    achievements = [
        ('Quantum Computing Algorithms for Optimization', stu_map['stu01'], cat_map['Research Paper'], 'Published a high-impact paper in the International Journal of Quantum Computing.', '2026-07-28', 'Pending', 0, None, None),
        ('Gold Medal in Inter-University Swimming', stu_map['stu01'], cat_map['Sports'], 'Secured first place and broke the university record in the 200m individual medley.', '2026-07-25', 'Approved', 50, fac_map['fac01'], '2026-07-26 10:00:00'),
        ('First Place in National Mathematics Olympiad', stu_map['stu02'], cat_map['Hackathon Winner'], 'Competed against 400 top students nationwide to win the gold trophy.', '2026-07-22', 'Pending', 0, None, None),
        ('AI-Powered Smart Grid Energy Distribution System', stu_map['stu03'], cat_map['Research Paper'], 'Decentralized hardware sensor mesh that balances grid load.', '2026-07-15', 'Approved', 50, fac_map['fac02'], '2026-07-16 11:30:00'),
        ('Best Delegate Award at Harvard MUN', stu_map['stu03'], cat_map['Workshop'], 'Represented France in the UN Security Council simulation.', '2026-07-10', 'Rejected', 0, fac_map['fac02'], '2026-07-11 14:00:00'),
        ('Inter-University Hackathon 1st Place', stu_map['stu04'], cat_map['Hackathon Winner'], 'Won 1st place in smart-cities track.', '2026-07-20', 'Approved', 100, fac_map['fac03'], '2026-07-21 09:15:00')
    ]
    for title, s_id, c_id, desc, date, status, pts, f_id, v_date in achievements:
        cursor.execute(
            "INSERT OR IGNORE INTO achievements (title, student_id, category_id, description, date_of_achievement, status, reward_points_awarded, faculty_id, verification_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (title, s_id, c_id, desc, date, status, pts, f_id, v_date)
        )
        
    # Notifications
    notifications = [
        ('Welcome to the Achievement Portal', 'The achievement portal is now online. Submit your certificates to earn reward points.', 'All', admin_db_id),
        ('Faculty Verifications Due', 'Please verify pending student submissions by the end of the academic year.', 'Faculty', admin_db_id),
        ('Annual Sports Meet Registration', 'Sign up for state-level sports events and earn reward points for medals.', 'Student', admin_db_id)
    ]
    for title, msg, role, adm_id in notifications:
        cursor.execute(
            "INSERT OR IGNORE INTO notifications (title, message, target_role, created_by_admin_id) VALUES (?, ?, ?, ?)",
            (title, msg, role, adm_id)
        )
        
    conn.commit()
    print("SQLite database seeded successfully!")

def translate_query(query):
    """Translates MySQL query to SQLite syntax."""
    global USE_SQLITE
    if not USE_SQLITE:
        return query
    
    # 1. Replace parameter placeholder %s with ?
    query = query.replace('%s', '?')
    
    # 2. Replace DATE_SUB(NOW(), INTERVAL 6 MONTH) with datetime('now', '-6 month')
    query = re.sub(
        r'DATE_SUB\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+6\s+MONTH\s*\)', 
        "datetime('now', '-6 month')", 
        query, 
        flags=re.IGNORECASE
    )
    
    # 3. Replace NOW() with datetime('now')
    query = re.sub(r'\bNOW\(\)', "datetime('now')", query, flags=re.IGNORECASE)
    
    return query

def execute_query(query, params=None):
    """Executes a SELECT query and returns the results as a list of dictionaries."""
    connection = get_db_connection()
    try:
        translated = translate_query(query)
        if USE_SQLITE:
            res = connection.execute(translated, params or ()).fetchall()
            return res
        else:
            with connection.cursor() as cursor:
                cursor.execute(translated, params or ())
                return cursor.fetchall()
    finally:
        connection.close()

def execute_one(query, params=None):
    """Executes a SELECT query and returns the first matching record (or None)."""
    connection = get_db_connection()
    try:
        translated = translate_query(query)
        if USE_SQLITE:
            res = connection.execute(translated, params or ()).fetchone()
            return res
        else:
            with connection.cursor() as cursor:
                cursor.execute(translated, params or ())
                return cursor.fetchone()
    finally:
        connection.close()

def execute_update(query, params=None, return_id=False):
    """Executes an INSERT, UPDATE, or DELETE query."""
    connection = get_db_connection()
    try:
        translated = translate_query(query)
        if USE_SQLITE:
            cursor = connection.cursor()
            cursor.execute(translated, params or ())
            connection.commit()
            if return_id:
                return cursor.lastrowid
            return cursor.rowcount
        else:
            with connection.cursor() as cursor:
                affected_rows = cursor.execute(translated, params or ())
                if return_id:
                    return cursor.lastrowid
                return affected_rows
    finally:
        connection.close()
