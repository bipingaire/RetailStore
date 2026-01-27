import sys
import traceback

try:
    from app.main import app
    with open("app_test_result.txt", "w") as f:
        f.write("✅ App loaded successfully!\n")
        f.write(f"App title: {app.title}\n")
        f.write(f"Docs URL: {app.docs_url}\n")
    print("✅ App loaded successfully! Check app_test_result.txt")
except Exception as e:
    with open("app_test_result.txt", "w") as f:
        f.write("❌ Error loading app:\n\n")
        f.write(traceback.format_exc())
    print("❌ Error loading app. Check app_test_result.txt for details")
    sys.exit(1)
