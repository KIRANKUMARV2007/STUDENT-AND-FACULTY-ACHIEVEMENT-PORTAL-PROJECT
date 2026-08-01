import pymysql
import bcrypt
import os
from config import Config

def hash_password(password: str) -> str:
    """Hashes a password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def run_sql_schema(cursor):
    """Executes the DDL statements in schema.sql."""
    schema_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'schema.sql')
    print(f"Reading schema from {schema_path}...")
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    # Split commands by semicolon, ignoring comments/empty statements
    statements = schema_sql.split(';')
    for statement in statements:
        statement = statement.strip()
        if not statement or statement.startswith('--'):
            continue
        try:
            cursor.execute(statement)
        except Exception as e:
            print(f"Error executing statement: {statement[:50]}...\nError: {e}")

def seed_data():
    # 1. Connect to MySQL (without DB initially to ensure DB creation)
    print("Connecting to MySQL...")
    connection = pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        port=Config.DB_PORT,
        autocommit=True
    )
    
    try:
        with connection.cursor() as cursor:
            # Run schema DDL
            run_sql_schema(cursor)
            
            # Select the DB
            cursor.execute(f"USE {Config.DB_NAME};")
            print(f"Using database {Config.DB_NAME}")

            # 2. Seed Departments
            departments = [
                ('Computer Science & Engineering', 'CSE'),
                ('Mechanical Engineering', 'ME'),
                ('Electronics & Communication Engineering', 'ECE'),
                ('Information Technology', 'IT')
            ]
            for name, code in departments:
                cursor.execute("SELECT id FROM departments WHERE code = %s", (code,))
                if not cursor.fetchone():
                    cursor.execute("INSERT INTO departments (name, code) VALUES (%s, %s)", (name, code))
                    print(f"Seeded Department: {code}")

            # Get dept IDs
            cursor.execute("SELECT code, id FROM departments")
            dept_map = {row[0]: row[1] for row in cursor.fetchall()}

            # 3. Seed Admin
            admin_username = 'admin'
            cursor.execute("SELECT id FROM admins WHERE admin_id = %s", (admin_username,))
            if not cursor.fetchone():
                hashed_pw = hash_password('admin123')
                cursor.execute(
                    "INSERT INTO admins (admin_id, name, email, password_hash) VALUES (%s, %s, %s, %s)",
                    (admin_username, 'System Administrator', 'admin@achievementportal.com', hashed_pw)
                )
                print("Seeded Admin: admin / admin123")

            # Seed User Admin
            praveen_email = 'praveenkumarj.it24@bitsathy.ac.in'
            cursor.execute("SELECT id FROM admins WHERE email = %s", (praveen_email,))
            if not cursor.fetchone():
                hashed_pw = hash_password('praveen12')
                cursor.execute(
                    "INSERT INTO admins (admin_id, name, email, password_hash) VALUES (%s, %s, %s, %s)",
                    ('praveen', 'Praveen Kumar', praveen_email, hashed_pw)
                )
                print(f"Seeded Admin: praveen / praveen12 ({praveen_email})")

            # Get admin ID
            cursor.execute("SELECT id FROM admins LIMIT 1")
            admin_db_id = cursor.fetchone()[0]

            # 4. Seed Achievement Categories
            categories = [
                ('Hackathon Winner', 100, 'Winner of a regional, national, or international hackathon event.'),
                ('Certification', 40, 'Industry recognized certification (e.g., AWS, Azure, Google, Oracle).'),
                ('Internship', 60, 'Completed internship of 4+ weeks with a recognized organization.'),
                ('Sports', 50, 'Representation or placement in inter-college/state/national sports meet.'),
                ('Research Paper', 80, 'Publication of research paper in Scopus/Indexed Journals or IEEE Conferences.'),
                ('Workshop', 20, 'Participation in 3+ days technical workshop or boot camp.')
            ]
            for name, pts, desc in categories:
                cursor.execute("SELECT id FROM achievement_categories WHERE name = %s", (name,))
                cat_row = cursor.fetchone()
                if not cat_row:
                    cursor.execute(
                        "INSERT INTO achievement_categories (name, default_points, description) VALUES (%s, %s, %s)",
                        (name, pts, desc)
                    )
                    cat_id = cursor.lastrowid
                    print(f"Seeded Category: {name} ({pts} pts)")
                    # Add to reward point rules history
                    cursor.execute(
                        "INSERT INTO reward_point_rules (category_id, points, updated_by_admin_id) VALUES (%s, %s, %s)",
                        (cat_id, pts, admin_db_id)
                    )
                else:
                    cat_id = cat_row[0]

            # Get category IDs mapping
            cursor.execute("SELECT name, id FROM achievement_categories")
            cat_map = {row[0]: row[1] for row in cursor.fetchall()}

            # 5. Seed Faculty Logs
            faculties = [
                ('fac01', 'Dr. Aris Thorne', 'aris.thorne@portal.edu', dept_map['CSE'], 'Professor'),
                ('fac02', 'Prof. Clara Oswald', 'clara.oswald@portal.edu', dept_map['ECE'], 'Associate Professor'),
                ('fac03', 'Dr. James Moriarty', 'james.moriarty@portal.edu', dept_map['CSE'], 'Assistant Professor')
            ]
            for fid, name, email, dept_id, desig in faculties:
                cursor.execute("SELECT id FROM faculty WHERE faculty_id = %s", (fid,))
                if not cursor.fetchone():
                    hashed_pw = hash_password('faculty123')
                    cursor.execute(
                        "INSERT INTO faculty (faculty_id, name, email, password_hash, department_id, designation) VALUES (%s, %s, %s, %s, %s, %s)",
                        (fid, name, email, hashed_pw, dept_id, desig)
                    )
                    print(f"Seeded Faculty: {name} (ID: {fid})")

            # Get faculty IDs
            cursor.execute("SELECT faculty_id, id FROM faculty")
            fac_map = {row[0]: row[1] for row in cursor.fetchall()}

            # 6. Seed Students
            students = [
                ('stu01', 'Sarah Jenkins', 'sarah.jenkins@portal.edu', dept_map['CSE'], 'ROLL-2023-CS-04', '2023-2027', 150),
                ('stu02', 'David Kim', 'david.kim@portal.edu', dept_map['IT'], 'ROLL-2023-IT-12', '2023-2027', 0),
                ('stu03', 'Emma Watson', 'emma.watson@portal.edu', dept_map['ECE'], 'ROLL-2023-EC-55', '2023-2027', 50),
                ('stu04', 'Alex Johnson', 'alex.johnson@portal.edu', dept_map['CSE'], 'ROLL-2023-CS-01', '2023-2027', 100)
            ]
            for sid, name, email, dept_id, roll, ac_yr, pts in students:
                cursor.execute("SELECT id FROM students WHERE student_id = %s", (sid,))
                if not cursor.fetchone():
                    hashed_pw = hash_password('student123')
                    cursor.execute(
                        "INSERT INTO students (student_id, name, email, password_hash, department_id, roll_number, academic_year, reward_points) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                        (sid, name, email, hashed_pw, dept_id, roll, ac_yr, pts)
                    )
                    print(f"Seeded Student: {name} (ID: {sid})")

            # Get student IDs
            cursor.execute("SELECT student_id, id FROM students")
            stu_map = {row[0]: row[1] for row in cursor.fetchall()}

            # 7. Seed Achievements
            achievements = [
                ('Quantum Computing Algorithms for Optimization', stu_map['stu01'], cat_map['Research Paper'], 'Published a high-impact paper in the International Journal of Quantum Computing.', '2026-07-28', 'Pending', 0, None, None),
                ('Gold Medal in Inter-University Swimming', stu_map['stu01'], cat_map['Sports'], 'Secured first place and broke the university record in the 200m individual medley.', '2026-07-25', 'Approved', 50, fac_map['fac01'], '2026-07-26 10:00:00'),
                ('First Place in National Mathematics Olympiad', stu_map['stu02'], cat_map['Hackathon Winner'], 'Competed against 400 top students nationwide to win the gold trophy.', '2026-07-22', 'Pending', 0, None, None),
                ('AI-Powered Smart Grid Energy Distribution System', stu_map['stu03'], cat_map['Research Paper'], 'Decentralized hardware sensor mesh that balances grid load.', '2026-07-15', 'Approved', 50, fac_map['fac02'], '2026-07-16 11:30:00'),
                ('Best Delegate Award at Harvard MUN', stu_map['stu03'], cat_map['Workshop'], 'Represented France in the UN Security Council simulation.', '2026-07-10', 'Rejected', 0, fac_map['fac02'], '2026-07-11 14:00:00'),
                ('Inter-University Hackathon 1st Place', stu_map['stu04'], cat_map['Hackathon Winner'], 'Won 1st place in smart-cities track.', '2026-07-20', 'Approved', 100, fac_map['fac03'], '2026-07-21 09:15:00')
            ]
            for title, s_id, c_id, desc, date, status, pts, f_id, v_date in achievements:
                cursor.execute("SELECT id FROM achievements WHERE title = %s AND student_id = %s", (title, s_id))
                if not cursor.fetchone():
                    cursor.execute(
                        "INSERT INTO achievements (title, student_id, category_id, description, date_of_achievement, status, reward_points_awarded, faculty_id, verification_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                        (title, s_id, c_id, desc, date, status, pts, f_id, v_date)
                    )
                    print(f"Seeded Achievement: '{title}' status: {status}")

            # 8. Seed Notifications
            notifications = [
                ('Welcome to the Achievement Portal', 'The achievement portal is now online. Submit your certificates to earn reward points.', 'All', admin_db_id),
                ('Faculty Verifications Due', 'Please verify pending student submissions by the end of the academic year.', 'Faculty', admin_db_id),
                ('Annual Sports Meet Registration', 'Sign up for state-level sports events and earn reward points for medals.', 'Student', admin_db_id)
            ]
            for title, msg, role, adm_id in notifications:
                cursor.execute("SELECT id FROM notifications WHERE title = %s", (title,))
                if not cursor.fetchone():
                    cursor.execute(
                        "INSERT INTO notifications (title, message, target_role, created_by_admin_id) VALUES (%s, %s, %s, %s)",
                        (title, msg, role, adm_id)
                    )
                    print(f"Seeded Notification: {title}")

            print("\nDatabase seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        connection.close()

if __name__ == '__main__':
    seed_data()
