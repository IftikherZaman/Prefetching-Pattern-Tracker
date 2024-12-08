import pandas as pd
import os
import time

# Input and output file paths
input_file = r"\\wsl.localhost\Ubuntu\home\iftikher\perf_output.txt"
output_file = "C:/Users/izcin\OneDrive/Documents/GitHub/Prefetching-Pattern-Tracker/perf_output.csv"

# To keep track of the last read position
last_position = 0

# Check if CSV exists; if not, initialize it with headers
if not os.path.exists(output_file):
    pd.DataFrame(columns=["Timestamp", "Address", "Event"]).to_csv(output_file, index=False)

# Function to process new lines and append them to the CSV file
def process_new_lines():
    global last_position
    
    new_data = []  # List to store parsed rows
    with open(input_file, "r") as file:
        file.seek(last_position)  # Move to the last read position
        for line in file:
            parts = line.strip().split()
            if len(parts) >= 3:
                timestamp = parts[0].replace(":", "")
                event = parts[1]
                address = parts[2]
                new_data.append([timestamp, address, event])
        
        # Update the last position
        last_position = file.tell()

    # Append new data to the existing CSV
    if new_data:
        df = pd.DataFrame(new_data, columns=["Timestamp", "Address", "Event"])
        df.to_csv(output_file, mode='a', header=False, index=False)
        print(f"Added {len(new_data)} new rows to {output_file}")

# Continuously monitor the input file for new data
try:
    print("Monitoring perf_output.txt for updates... Press Ctrl+C to stop.")
    while True:
        process_new_lines()
        time.sleep(1)  # Check every second for updates
except KeyboardInterrupt:
    print("Monitoring stopped.")
