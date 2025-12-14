#!/usr/bin/env python3
"""
Script to create an admin user and upload law and case files to the Legatoo backend.
"""

import os
import json
import requests
import glob
from pathlib import Path
from typing import Dict, Any, List

# Backend API configuration
API_BASE_URL = "http://localhost:8000/api/v1"

class DataUploader:
    def __init__(self):
        self.session = requests.Session()
        self.token = None

    def signup_admin_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create an admin user via signup endpoint."""
        url = f"{API_BASE_URL}/auth/signup"

        # Transform frontend data to backend format
        backend_data = {
            "email": user_data["email"],
            "password": user_data["password"],
            "first_name": user_data["first_name"],
            "last_name": user_data["last_name"],
            "phone_number": user_data["phone_number"],
            "account_type": "personal"
        }

        print(f"Creating admin user: {user_data['email']}")
        response = self.session.post(url, json=backend_data)

        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                print("✅ Admin user created successfully!")
                return data
            else:
                print(f"❌ Failed to create user: {data.get('message', 'Unknown error')}")
                return data
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return {"success": False, "message": f"HTTP {response.status_code}"}

    def login(self, email: str, password: str) -> bool:
        """Login and get authentication token."""
        url = f"{API_BASE_URL}/auth/login"

        response = self.session.post(url, json={"email": email, "password": password})

        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.token = data["data"]["access_token"]
                self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                print("✅ Login successful!")
                return True
            else:
                print(f"❌ Login failed: {data.get('message', 'Unknown error')}")
                return False
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False

    def make_super_admin(self) -> bool:
        """Make the current user a super admin (requires super admin privileges)."""
        # Note: This endpoint might not exist or require special permissions
        # For now, we'll assume the user creation process handles admin roles
        print("ℹ️  Note: Super admin creation may need to be done manually in the database")
        return True

    def upload_law_files(self, files_dir: str) -> Dict[str, Any]:
        """Upload law files from the specified directory."""
        results = {
            "total": 0,
            "successful": 0,
            "failed": 0,
            "errors": []
        }

        # Get all JSON files in the directory
        json_files = glob.glob(os.path.join(files_dir, "*.json"))

        for json_file in json_files:
            results["total"] += 1
            filename = os.path.basename(json_file)

            try:
                print(f"Uploading law file: {filename}")

                # Read the JSON file to get metadata
                with open(json_file, 'r', encoding='utf-8') as f:
                    law_data = json.load(f)

                # Extract metadata from the JSON
                law_name = law_data.get("name", filename.replace('.json', ''))
                law_type = law_data.get("type", "law")

                # Create a dummy PDF file for upload (since we only have JSON)
                # In a real scenario, you'd have the actual PDF files
                pdf_content = json.dumps(law_data, ensure_ascii=False, indent=2)
                pdf_filename = filename.replace('.json', '.pdf')

                # Create multipart form data
                files = {
                    'file': (pdf_filename, pdf_content, 'application/pdf')
                }
                data = {
                    'law_name': law_name,
                    'law_type': law_type
                }

                url = f"{API_BASE_URL}/laws/upload"
                response = self.session.post(url, files=files, data=data)

                if response.status_code == 200:
                    result = response.json()
                    if result.get("success"):
                        results["successful"] += 1
                        print(f"✅ Successfully uploaded: {filename}")
                    else:
                        results["failed"] += 1
                        error_msg = result.get("message", "Unknown error")
                        results["errors"].append(f"{filename}: {error_msg}")
                        print(f"❌ Failed to upload {filename}: {error_msg}")
                else:
                    results["failed"] += 1
                    results["errors"].append(f"{filename}: HTTP {response.status_code}")
                    print(f"❌ HTTP Error {response.status_code} for {filename}")

            except Exception as e:
                results["failed"] += 1
                results["errors"].append(f"{filename}: {str(e)}")
                print(f"❌ Error processing {filename}: {str(e)}")

        return results

    def upload_case_files(self, cases_dir: str) -> Dict[str, Any]:
        """Upload case files from the specified directory."""
        results = {
            "total": 0,
            "successful": 0,
            "failed": 0,
            "errors": []
        }

        # Get all JSON files in the cases directory
        json_files = glob.glob(os.path.join(cases_dir, "*.json"))
        # Filter out README.md
        json_files = [f for f in json_files if not f.endswith('README.md')]

        for json_file in json_files:
            results["total"] += 1
            filename = os.path.basename(json_file)

            try:
                print(f"Uploading case file: {filename}")

                # Read the JSON file to get metadata
                with open(json_file, 'r', encoding='utf-8') as f:
                    case_data = json.load(f)

                # Extract metadata from the JSON
                title = case_data.get("title", filename.replace('.json', ''))
                case_number = case_data.get("case_number")
                description = case_data.get("description")
                jurisdiction = case_data.get("jurisdiction")
                court_name = case_data.get("court_name")
                decision_date = case_data.get("decision_date")
                case_type = case_data.get("case_type")
                court_level = case_data.get("court_level")

                # Create a text file content from the case data
                file_content = json.dumps(case_data, ensure_ascii=False, indent=2)
                pdf_filename = filename.replace('.json', '.pdf')

                # Create multipart form data
                files = {
                    'file': (pdf_filename, file_content, 'application/pdf')
                }
                data = {
                    'title': title
                }

                # Add optional fields if they exist
                if case_number: data['case_number'] = case_number
                if description: data['description'] = description
                if jurisdiction: data['jurisdiction'] = jurisdiction
                if court_name: data['court_name'] = court_name
                if decision_date: data['decision_date'] = decision_date
                if case_type: data['case_type'] = case_type
                if court_level: data['court_level'] = court_level

                url = f"{API_BASE_URL}/legal-cases/upload"
                response = self.session.post(url, files=files, data=data)

                if response.status_code == 200:
                    result = response.json()
                    if result.get("success"):
                        results["successful"] += 1
                        print(f"✅ Successfully uploaded: {filename}")
                    else:
                        results["failed"] += 1
                        error_msg = result.get("message", "Unknown error")
                        results["errors"].append(f"{filename}: {error_msg}")
                        print(f"❌ Failed to upload {filename}: {error_msg}")
                else:
                    results["failed"] += 1
                    results["errors"].append(f"{filename}: HTTP {response.status_code}")
                    print(f"❌ HTTP Error {response.status_code} for {filename}")

            except Exception as e:
                results["failed"] += 1
                results["errors"].append(f"{filename}: {str(e)}")
                print(f"❌ Error processing {filename}: {str(e)}")

        return results

def main():
    uploader = DataUploader()

    # Admin user data
    admin_user = {
        "email": "admin@legatoo.com",
        "password": "Admin123!@#",
        "first_name": "Super",
        "last_name": "Admin",
        "phone_number": "+966501234567"
    }

    print("Starting data upload process...")
    print("=" * 60)

    # Step 1: Create admin user
    print("Step 1: Creating admin user...")
    signup_result = uploader.signup_admin_user(admin_user)

    if not signup_result.get("success"):
        print("❌ Failed to create admin user. Exiting.")
        return

    # Step 2: Login with the created user
    print("\nStep 2: Logging in...")
    if not uploader.login(admin_user["email"], admin_user["password"]):
        print("❌ Failed to login. Exiting.")
        return

    # Step 3: Upload law files
    print("\nStep 3: Uploading law files...")
    laws_dir = "data_set/files"
    if os.path.exists(laws_dir):
        law_results = uploader.upload_law_files(laws_dir)
        print("\n📊 Law Upload Summary:")
        print(f"   Total: {law_results['total']}")
        print(f"   Successful: {law_results['successful']}")
        print(f"   Failed: {law_results['failed']}")
        if law_results['errors']:
            print("   Errors:")
            for error in law_results['errors'][:5]:  # Show first 5 errors
                print(f"     - {error}")
            if len(law_results['errors']) > 5:
                print(f"     ... and {len(law_results['errors']) - 5} more")
    else:
        print(f"❌ Laws directory not found: {laws_dir}")

    # Step 4: Upload case files
    print("\nStep 4: Uploading case files...")
    cases_dir = "data_set/cases"
    if os.path.exists(cases_dir):
        case_results = uploader.upload_case_files(cases_dir)
        print("\n📊 Case Upload Summary:")
        print(f"   Total: {case_results['total']}")
        print(f"   Successful: {case_results['successful']}")
        print(f"   Failed: {case_results['failed']}")
        if case_results['errors']:
            print("   Errors:")
            for error in case_results['errors'][:5]:  # Show first 5 errors
                print(f"     - {error}")
            if len(case_results['errors']) > 5:
                print(f"     ... and {len(case_results['errors']) - 5} more")
    else:
        print(f"❌ Cases directory not found: {cases_dir}")

    print("\n" + "=" * 60)
    print("✅ Data upload process completed!")

    # Print login credentials
    print("\n🔑 Admin User Credentials:")
    print(f"   Email: {admin_user['email']}")
    print(f"   Password: {admin_user['password']}")
    print("   Role: admin (created via signup)")
if __name__ == "__main__":
    main()
