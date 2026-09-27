import os
import pandas as pd

data_dir = os.path.join(os.path.dirname(__file__), "data", "edtech_dataset")
print(f"=== EDTECH DATASET ANALYSIS (From archive.zip) ===")
print(f"Directory: {data_dir}\n")

# 1. Courses
courses_path = os.path.join(data_dir, "edtech_courses.csv")
df_courses = pd.read_csv(courses_path)
print(f"[1] edtech_courses.csv")
print(f"    Rows: {len(df_courses)}, Columns: {len(df_courses.columns)}")
print(f"    Columns: {list(df_courses.columns)}")
print(f"    Top Subject Areas: {df_courses['subject_area'].value_counts().to_dict()}")
print(f"    Difficulty Levels: {df_courses['difficulty_level'].value_counts().to_dict()}")
print(f"    Average Instructor Rating: {df_courses['instructor_rating'].mean():.2f}/5.0")
print("    First 3 Courses:")
for idx, r in df_courses.head(3).iterrows():
    print(f"      - {r['course_id']}: {r['course_title']} ({r['subject_area']} | {r['difficulty_level']} | {r['duration_weeks']} wks)")

# 2. Students
students_path = os.path.join(data_dir, "edtech_students.csv")
df_students = pd.read_csv(students_path)
print(f"\n[2] edtech_students.csv")
print(f"    Rows: {len(df_students)}, Columns: {len(df_students.columns)}")
print(f"    Columns: {list(df_students.columns)}")
print(f"    Age Range: {df_students['age'].min()} to {df_students['age'].max()} years (Mean: {df_students['age'].mean():.1f})")
print(f"    Learning Styles: {df_students['learning_style'].value_counts().to_dict()}")
print(f"    Device Preferences: {df_students['device_preference'].value_counts().to_dict()}")
print(f"    Motivation Distribution: {df_students['motivation_level'].value_counts().to_dict()}")
print("    First 3 Students:")
for idx, r in df_students.head(3).iterrows():
    print(f"      - {r['student_id']}: Age {r['age']} | {r['education_level']} | {r['learning_style']} learner | {r['motivation_level']} motivation")

# 3. Interactions
interactions_path = os.path.join(data_dir, "edtech_interactions.csv")
df_interactions = pd.read_csv(interactions_path)
print(f"\n[3] edtech_interactions.csv")
print(f"    Rows: {len(df_interactions)}, Columns: {len(df_interactions.columns)}")
print(f"    Columns: {list(df_interactions.columns)}")
print(f"    Activity Types: {df_interactions['activity_type'].value_counts().to_dict()}")
print(f"    Average Interaction Duration: {df_interactions['duration_seconds'].mean() / 60:.1f} minutes")
print(f"    Average Completion Rate: {df_interactions['completion_rate'].mean() * 100:.1f}%")
print(f"    Average Quiz/Exam Score: {df_interactions['score'].dropna().mean():.1f}/100 (from {df_interactions['score'].notnull().sum()} scored events)")
print("    First 3 Interactions:")
for idx, r in df_interactions.head(3).iterrows():
    score_str = f"{r['score']}" if pd.notnull(r['score']) else "N/A"
    print(f"      - {r['interaction_id']}: Student {r['student_id']} in {r['course_id']} | {r['activity_type']} ({r['duration_seconds']}s, Score: {score_str})")

print("\nAll 3 files loaded and verified successfully from your archive!")
