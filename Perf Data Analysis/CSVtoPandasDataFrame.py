import pandas as pd

# Load the CSV file
csv_file = "C:/Users/izcin/OneDrive/Documents/GitHub/Prefetching-Pattern-Tracker/perf_output.csv"
data = pd.read_csv(csv_file)

# Display the first few rows
print(data.head())
