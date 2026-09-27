import os
import kagglehub
from kagglehub import KaggleDatasetAdapter
import pandas as pd

print("1. Downloading/locating dataset via kagglehub...")
path = kagglehub.dataset_download("birendeepsingh/educational-technology-learning-analytics-dataset")
print(f"Dataset downloaded to path: {path}")

# List all files in the downloaded dataset directory
files = os.listdir(path)
print("Files in dataset folder:", files)

# Find the primary data file
for file in files:
    full_path = os.path.join(path, file)
    print(f"\n--- Inspecting {file} (Size: {os.path.getsize(full_path)} bytes) ---")
    if file.endswith('.csv'):
        # Try loading with pandas
        df = pd.read_csv(full_path)
        print(f"Data shape: {df.shape} (Rows: {df.shape[0]}, Columns: {df.shape[1]})")
        print("\nColumns:", list(df.columns))
        print("\nData Types:\n", df.dtypes)
        print("\nMissing values per column:\n", df.isnull().sum())
        print("\nFirst 5 records:\n", df.head())
        print("\nSummary Statistics:\n", df.describe(include='all'))
