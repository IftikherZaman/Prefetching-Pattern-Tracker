import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Load the CSV file
csv_file = "C:/Users/izcin/OneDrive/Documents/GitHub/Prefetching-Pattern-Tracker/perf_output.csv"

# Load the data
def load_data():
    print("Loading data...")
    df = pd.read_csv(csv_file)
    df['Timestamp'] = pd.to_numeric(df['Timestamp'], errors='coerce')  # Ensure timestamps are numeric
    return df

# 1. Memory Access Frequency Heatmap
def plot_access_frequency_heatmap(df):
    print("Plotting memory access frequency heatmap...")
    address_counts = df['Address'].value_counts().reset_index()
    address_counts.columns = ['Address', 'Frequency']
    address_counts = address_counts.sort_values(by='Address')

    plt.figure(figsize=(12, 6))
    sns.heatmap([address_counts['Frequency']], cmap='YlOrRd', xticklabels=10, cbar_kws={'label': 'Access Frequency'})
    plt.title("Memory Access Frequency Heatmap")
    plt.xlabel("Memory Address")
    plt.xticks(rotation=90)  # Rotate x-axis labels
    plt.tight_layout()
    plt.show()

# 2. Cache Hit vs. Cache Miss Distribution
def plot_cache_hit_miss_distribution(df):
    print("Plotting cache hit vs. cache miss distribution...")
    event_counts = df['Event'].value_counts()
    plt.figure(figsize=(8, 5))
    event_counts.plot(kind='bar', color=['green', 'red'], alpha=0.7)
    plt.title("Cache Hit vs. Cache Miss")
    plt.xlabel("Event Type")
    plt.ylabel("Count")
    plt.xticks(rotation=0)
    plt.tight_layout()
    plt.show()

# 3. Temporal Analysis of Memory Accesses (Grouped Timestamps)
def plot_temporal_accesses(df):
    print("Plotting memory accesses over time...")
    # Group timestamps into bins
    df['Timestamp_Bin'] = pd.cut(df['Timestamp'], bins=10)
    time_series = df['Timestamp_Bin'].value_counts().sort_index()

    plt.figure(figsize=(12, 6))
    time_series.plot(kind='bar', color='blue', alpha=0.7)
    plt.title("Memory Accesses Grouped Over Time")
    plt.xlabel("Timestamp Ranges")
    plt.ylabel("Number of Accesses")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# 4. Memory Address Hotspots Histogram (Grouped Addresses)
def plot_address_hotspots(df):
    print("Plotting memory address hotspots...")
    # Group addresses into bins
    df['Address_Bin'] = pd.cut(df['Address'], bins=10)
    address_counts = df['Address_Bin'].value_counts().sort_index()

    plt.figure(figsize=(12, 6))
    address_counts.plot(kind='bar', color='orange', alpha=0.7)
    plt.title("Distribution of Memory Address Accesses")
    plt.xlabel("Memory Address Ranges")
    plt.ylabel("Frequency")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# 5. Event Type Breakdown Over Time (Improved Legend Placement)
def plot_events_over_time(df):
    print("Plotting cache events over time...")
    events_over_time = df.groupby(['Timestamp', 'Event']).size().unstack(fill_value=0)
    plt.figure(figsize=(12, 6))
    events_over_time.plot(kind='area', stacked=True, colormap='viridis', alpha=0.8)
    plt.title("Cache Events Over Time")
    plt.xlabel("Timestamp")
    plt.ylabel("Event Count")
    plt.legend(title="Event Type", bbox_to_anchor=(1.05, 1), loc='upper left')  # Move legend outside
    plt.grid()
    plt.tight_layout()
    plt.show()

# Main function to execute all visualizations
def main():
    df = load_data()
    print("Data Loaded. Generating plots...")

    # Run all the plots one after another
    plot_access_frequency_heatmap(df)
    plot_cache_hit_miss_distribution(df)
    plot_temporal_accesses(df)
    plot_address_hotspots(df)
    plot_events_over_time(df)

if __name__ == "__main__":
    main()
