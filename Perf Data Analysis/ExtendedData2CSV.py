import pandas as pd
import re
from datetime import datetime
import logging

class PerfDataProcessor:
    def __init__(self, input_file, output_file):
        self.input_file = input_file
        self.output_file = output_file
        self.setup_logging()
        
    def setup_logging(self):
        """Configure logging for debugging and monitoring."""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)

    def parse_event_record(self, lines):
        """Parse a single event record from perf output."""
        event_data = {
            'timestamp': None,
            'address': None,
            'event_type': None,
            'event_size': None,
            'thread_id': None,
            'process_id': None,
            'raw_data': None,
            'dso': None,
            'period': None,
            'ip_address': None,
            'event_specific_data': None
        }
        
        # First line contains basic event information
        header_match = re.match(r'(\d+)\s+(0x[0-9a-f]+)\s+\[(0x[0-9a-f]+)\]:\s*(.*)', lines[0])
        if header_match:
            event_data['timestamp'] = int(header_match.group(1)) if header_match.group(1) != '.' else None
            event_data['address'] = header_match.group(2)
            event_data['event_size'] = header_match.group(3)
            event_data['event_type'] = header_match.group(4)

        # Parse thread/process information
        thread_match = re.search(r'thread:\s*(\d+)/(\d+)', '\n'.join(lines))
        if thread_match:
            event_data['thread_id'] = thread_match.group(1)
            event_data['process_id'] = thread_match.group(2)

        # Parse DSO information
        dso_match = re.search(r'dso:\s*([^\n]+)', '\n'.join(lines))
        if dso_match:
            event_data['dso'] = dso_match.group(1)

        # Parse period information
        period_match = re.search(r'period:\s*(\d+)', '\n'.join(lines))
        if period_match:
            event_data['period'] = int(period_match.group(1))

        # Parse IP address
        ip_match = re.search(r'IP.*?:\s*(0x[0-9a-f]+)', '\n'.join(lines))
        if ip_match:
            event_data['ip_address'] = ip_match.group(1)

        # Store raw event data if present
        raw_data_lines = [line.strip() for line in lines if 'raw event:' in line or line.strip().startswith('.')]
        if raw_data_lines:
            event_data['raw_data'] = '\n'.join(raw_data_lines)

        return event_data

    def process_perf_output(self):
        """Process the entire perf output file and convert to structured data."""
        self.logger.info(f"Starting to process {self.input_file}")
        
        events_data = []
        current_event_lines = []
        
        with open(self.input_file, 'r') as file:
            for line in file:
                line = line.strip()
                
                # Skip empty lines and comments
                if not line or line.startswith('#'):
                    continue
                
                # New event starts with a timestamp or address
                if re.match(r'^(\d+|\.)\s+0x', line) or re.match(r'^0x', line):
                    if current_event_lines:
                        events_data.append(self.parse_event_record(current_event_lines))
                    current_event_lines = [line]
                else:
                    current_event_lines.append(line)
            
            # Process the last event
            if current_event_lines:
                events_data.append(self.parse_event_record(current_event_lines))
        
        # Convert to DataFrame
        df = pd.DataFrame(events_data)
        
        # Add derived columns
        df['timestamp_readable'] = pd.to_datetime(df['timestamp'], unit='ns')
        df['address_numeric'] = df['address'].apply(lambda x: int(x, 16) if pd.notnull(x) and isinstance(x, str) else None)
        
        # Save to CSV with all columns
        df.to_csv(self.output_file, index=False)
        self.logger.info(f"Processed data saved to {self.output_file}")
        
        # Print summary statistics
        self.print_summary_stats(df)
        
        return df
    
    def print_summary_stats(self, df):
        """Print summary statistics about the processed data."""
        self.logger.info("\nData Processing Summary:")
        self.logger.info(f"Total events processed: {len(df)}")
        self.logger.info(f"Unique event types: {df['event_type'].nunique()}")
        self.logger.info("\nEvent type distribution:")
        for event_type, count in df['event_type'].value_counts().items():
            self.logger.info(f"  {event_type}: {count}")
        self.logger.info(f"\nTime range: {df['timestamp_readable'].min()} to {df['timestamp_readable'].max()}")
        self.logger.info(f"Number of unique addresses: {df['address'].nunique()}")
        
def main():
    processor = PerfDataProcessor(
        input_file=r"\\wsl.localhost\Ubuntu\home\iftikher\perf_output.txt",
        output_file="perf_output_enhanced.csv"
    )
    df = processor.process_perf_output()
    
if __name__ == "__main__":
    main()