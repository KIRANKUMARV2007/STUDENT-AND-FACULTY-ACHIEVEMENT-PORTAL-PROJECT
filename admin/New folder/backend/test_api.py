import requests
import json
import sys

BASE_URL = "http://localhost:5000"

def run_tests():
    print("==================================================")
    print("Starting Flask Backend REST API Smoke Tests")
    print("==================================================")

    # 1. Test Base Endpoint
    try:
        r = requests.get(f"{BASE_URL}/")
        print(f"[GET /] Status: {r.status_code} - Result: {r.json().get('status')}")
    except Exception as e:
        print(f"Error connecting to server: {e}")
        print("Please make sure the Flask app is running at http://localhost:5000")
        sys.exit(1)

    # 2. Test Admin Login (Should Succeed)
    login_payload = {
        "admin_id": "admin",
        "password": "admin123"
    }
    r = requests.post(f"{BASE_URL}/api/auth/login", json=login_payload)
    if r.status_code != 200:
        print(f"[POST /api/auth/login] FAILED! Status: {r.status_code} - Body: {r.text}")
        sys.exit(1)
        
    res_data = r.json()
    token = res_data.get("access_token")
    print(f"[POST /api/auth/login] SUCCESS! Admin logged in. Token length: {len(token)}")

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # 3. Test Dashboard Stats (Admin role required)
    r = requests.get(f"{BASE_URL}/api/dashboard/stats", headers=headers)
    if r.status_code == 200:
        stats = r.json().get("stats", {})
        print(f"[GET /api/dashboard/stats] SUCCESS! Stats info:")
        print(f"   - Total Students: {stats.get('total_students')}")
        print(f"   - Total Faculty: {stats.get('total_faculty')}")
        print(f"   - Total Achievements: {stats.get('total_achievements')}")
        print(f"   - Total Points: {stats.get('total_reward_points')}")
    else:
        print(f"[GET /api/dashboard/stats] FAILED! Status: {r.status_code} - Response: {r.text}")

    # 4. Test Student Retrieval
    r = requests.get(f"{BASE_URL}/api/users/students", headers=headers)
    if r.status_code == 200:
        students = r.json().get("students", [])
        print(f"[GET /api/users/students] SUCCESS! Retrieved {len(students)} students.")
        if students:
            print(f"   - Sample student: {students[0]['name']} ({students[0]['roll_number']}) in {students[0]['department_code']}")
    else:
        print(f"[GET /api/users/students] FAILED! Status: {r.status_code} - Response: {r.text}")

    # 5. Test Achievements Retrieval
    r = requests.get(f"{BASE_URL}/api/achievements", headers=headers)
    if r.status_code == 200:
        achievements = r.json().get("achievements", [])
        print(f"[GET /api/achievements] SUCCESS! Retrieved {len(achievements)} achievements.")
        if achievements:
            print(f"   - Sample achievement: '{achievements[0]['title']}' - Status: {achievements[0]['status']}")
    else:
        print(f"[GET /api/achievements] FAILED! Status: {r.status_code} - Response: {r.text}")

    # 6. Test Settings Categories Retrieval
    r = requests.get(f"{BASE_URL}/api/settings/categories", headers=headers)
    if r.status_code == 200:
        cats = r.json().get("categories", [])
        print(f"[GET /api/settings/categories] SUCCESS! Retrieved {len(cats)} categories.")
    else:
        print(f"[GET /api/settings/categories] FAILED! Status: {r.status_code} - Response: {r.text}")

    print("==================================================")
    print("Smoke Tests Completed Successfully!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
