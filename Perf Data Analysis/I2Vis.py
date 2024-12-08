from dash import Dash, html, dcc
import plotly.graph_objects as go
from plotly.subplots import make_subplots 
import pandas as pd
import numpy as np

class MemoryAccessAnalyzer:
    """
    A comprehensive analyzer for memory access patterns and cache behavior.
    This class provides visualization and analysis tools to understand memory
    access patterns, cache performance, and system behavior.
    """
    def __init__(self, csv_file):
        """
        Initialize the analyzer with input data file and set up basic parameters.
        
        Args:
            csv_file (str): Path to the CSV file containing memory access data
        """
        # Standard memory parameters (in bytes)
        self.PAGE_SIZE = 4096        # Standard memory page size
        self.CACHE_LINE_SIZE = 64    # Common cache line size
        
        # Load and process the data
        self.df = pd.read_csv(csv_file)
        self.preprocess_data()
        
        # Initialize Dash application
        self.app = Dash(__name__)
        self.setup_layout()

    def preprocess_data(self):
          
        """
        Prepare the data for analysis with proper handling of timestamps and numeric conversions.
        This method carefully processes the data to avoid NaN values and ensure proper type conversions.
        """
        # First, let's handle the address conversion
        def safe_hex_to_int(x):
            try:
                return int(str(x), 16) if isinstance(x, str) and 'x' in str(x) else x
            except (ValueError, TypeError):
                return None

        # Convert addresses and clean invalid values
        self.df['address_num'] = self.df['address'].apply(safe_hex_to_int)
        self.df = self.df.dropna(subset=['address_num'])
        
        # Process timestamps carefully
        self.df['timestamp'] = pd.to_numeric(self.df['timestamp'], errors='coerce')
        self.df = self.df.dropna(subset=['timestamp'])
        
        # Calculate time windows safely
        min_time = self.df['timestamp'].min()
        max_time = self.df['timestamp'].max()
        window_size = (max_time - min_time) / 50  # Using 50 windows
        
        # Create normalized timestamps (as integers) to avoid floating point issues
        self.df['time_normalized'] = (self.df['timestamp'] - min_time)
        
        # Convert to time windows carefully
        self.df['time_window'] = (self.df['time_normalized'] / window_size).apply(np.floor).astype('Int64')
        
        # Calculate memory page numbers safely
        self.base_address = self.df['address_num'].min()
        self.df['address_offset'] = self.df['address_num'] - self.base_address
        
        # Use Int64 dtype which can handle NA values
        self.df['page_number'] = (self.df['address_offset'] // self.PAGE_SIZE).astype('Int64')
        
        # Log processing statistics with proper string formatting
        print("Data Processing Summary:")
        print(f"Total records processed: {len(self.df)}")
        print(f"Time range: {min_time:.2f} to {max_time:.2f}")
        print(f"Address range: 0x{int(self.base_address):x} to 0x{int(self.df['address_num'].max()):x}")
        print(f"Number of unique pages: {self.df['page_number'].nunique()}")


    def create_memory_heatmap(self):
            """
            Create a heatmap visualization of memory access patterns.
            This function carefully handles numeric conversions and creates
            clear address labels for better understanding of memory patterns.
            """
            # First create the pivot table for our heatmap
            heatmap_data = pd.pivot_table(
                self.df,
                values='address_num',
                index='page_number',
                columns='time_window',
                aggfunc='count',
                fill_value=0
            )
            
            # Create address labels with proper integer conversion
            address_labels = [
                f"0x{int(i * self.PAGE_SIZE + self.base_address):04x}" 
                for i in heatmap_data.index
            ]
            
            # Create time window labels
            time_labels = [f"T{i}" for i in range(len(heatmap_data.columns))]
            
            # Create the heatmap visualization
            fig = go.Figure(data=go.Heatmap(
                z=heatmap_data.values,
                x=time_labels,
                y=address_labels,
                colorscale=[
                    [0, '#f8f9fa'],    # Very light gray for no access
                    [0.2, '#c6dbef'],  # Light blue for low access
                    [0.4, '#6baed6'],  # Medium blue for moderate access
                    [0.6, '#3182bd'],  # Darker blue for high access
                    [1.0, '#08519c']   # Very dark blue for intense access
                ],
                hoverongaps=False,
                hovertemplate=(
                    'Memory Page: %{y}<br>' +
                    'Time Window: %{x}<br>' +
                    'Access Count: %{z}<extra></extra>'
                )
            ))
            
            # Add clear annotations to show data characteristics
            fig.update_layout(
                title={
                    'text': (
                        'Memory Access Pattern Heatmap<br>'
                        f'<span style="font-size:12px">Showing {len(self.df)} accesses '
                        f'across {len(address_labels)} pages</span>'
                    ),
                    'y': 0.95,
                    'x': 0.5,
                    'xanchor': 'center',
                    'yanchor': 'top',
                    'font': {'size': 20}
                },
                xaxis={
                    'title': 'Time Progress →',
                    'tickangle': 0,
                    'showgrid': True,
                    'dtick': 1
                },
                yaxis={
                    'title': 'Memory Address Range',
                    'tickangle': 0,
                    'showgrid': True,
                    'tickmode': 'array',
                    'ticktext': address_labels,
                    'tickvals': list(range(len(address_labels)))
                },
                height=500,  # Increased height for better visibility
                margin={'l': 100, 'r': 50, 't': 100, 'b': 50},
                plot_bgcolor='white',
                paper_bgcolor='white'
            )
            
            return fig

    def create_access_pattern_analysis(self):
        """
        Creates a detailed analysis of memory access patterns using two complementary visualizations:
        1. A time-based analysis showing how memory accesses are distributed over time
        2. A spatial analysis showing which addresses are accessed most frequently
        """
        # Create a figure with two subplots side by side
        fig = make_subplots(
            rows=1, cols=2,
            subplot_titles=(
                'Memory Access Frequency Over Time',
                'Memory Address Access Distribution'
            ),
            horizontal_spacing=0.15  # Add space between subplots for clarity
        )

        # Prepare time-based access data
        # Convert timestamps to relative seconds for better readability
        timeline_df = self.df.copy()
        timeline_df['relative_time'] = (
            (timeline_df['timestamp'] - timeline_df['timestamp'].min()) / 1e9  # Convert to seconds
        )

        # Create time-based access pattern (left subplot)
        time_grouped = timeline_df.groupby('time_window').size().reset_index(name='count')
        fig.add_trace(
            go.Scatter(
                x=time_grouped['time_window'],
                y=time_grouped['count'],
                mode='lines+markers',
                name='Accesses',
                line=dict(color='#2ecc71', width=2),
                marker=dict(
                    size=8,
                    symbol='circle',
                    line=dict(color='#27ae60', width=1)
                ),
                hovertemplate='Time Window: %{x}<br>Access Count: %{y}<extra></extra>'
            ),
            row=1, col=1
        )

        # Create address distribution (right subplot)
        address_grouped = timeline_df.groupby('address_num').size().reset_index(name='count')
        address_grouped['address_hex'] = address_grouped['address_num'].apply(
            lambda x: f"0x{int(x):04x}"
        )
        
        fig.add_trace(
            go.Bar(
                x=address_grouped['address_hex'],
                y=address_grouped['count'],
                name='Address Frequency',
                marker_color='#3498db',
                hovertemplate='Address: %{x}<br>Access Count: %{y}<extra></extra>'
            ),
            row=1, col=2
        )

        # Update layout with improved formatting and annotations
        fig.update_layout(
            height=400,
            showlegend=False,
            title={
                'text': 'Memory Access Pattern Analysis',
                'y': 0.95,
                'x': 0.5,
                'xanchor': 'center',
                'yanchor': 'top',
                'font': {'size': 20}
            },
        )

        # Update x and y axes for both subplots
        fig.update_xaxes(
            title_text='Time Window',
            gridcolor='lightgrey',
            showgrid=True,
            row=1, col=1
        )
        fig.update_xaxes(
            title_text='Memory Address',
            gridcolor='lightgrey',
            showgrid=True,
            tickangle=45,  # Angle the address labels for better readability
            row=1, col=2
        )
        fig.update_yaxes(
            title_text='Number of Accesses',
            gridcolor='lightgrey',
            showgrid=True,
            row=1, col=1
        )
        fig.update_yaxes(
            title_text='Number of Accesses',
            gridcolor='lightgrey',
            showgrid=True,
            row=1, col=2
        )

        return fig
    def setup_layout(self):
        """
        Set up the dashboard layout with all visualization components.
        This creates a clean, organized interface for data exploration.
        """
        self.app.layout = html.Div([
            # Header section
            html.Div([
                html.H1(
                    'Memory Access Pattern Analysis',
                    style={
                        'textAlign': 'center',
                        'color': '#2c3e50',
                        'marginBottom': '10px'
                    }
                ),
                html.P(
                    'Interactive visualization of memory access patterns and cache behavior',
                    style={
                        'textAlign': 'center',
                        'color': '#7f8c8d'
                    }
                )
            ], style={'padding': '20px'}),
            
            # Memory access heatmap
            html.Div([
                dcc.Graph(
                    figure=self.create_memory_heatmap()
                )
            ], style={
                'margin': '20px',
                'padding': '20px',
                'backgroundColor': 'white',
                'borderRadius': '10px',
                'boxShadow': '0 2px 4px rgba(0,0,0,0.1)'
            }),
            
            # Access pattern analysis
            html.Div([
                dcc.Graph(
                    figure=self.create_access_pattern_analysis()
                )
            ], style={
                'margin': '20px',
                'padding': '20px',
                'backgroundColor': 'white',
                'borderRadius': '10px',
                'boxShadow': '0 2px 4px rgba(0,0,0,0.1)'
            }),
            
            # Footer
            html.Div([
                html.Hr(),
                html.P(
                    'Hover over elements for detailed information. All visualizations are interactive.',
                    style={
                        'textAlign': 'center',
                        'color': '#7f8c8d',
                        'padding': '20px'
                    }
                )
            ])
        ], style={
            'fontFamily': 'Arial, sans-serif',
            'backgroundColor': '#f0f2f5',
            'minHeight': '100vh',
            'padding': '20px'
        })

    def run_server(self, debug=True):
        """Start the dashboard server."""
        self.app.run_server(debug=debug)

def main():
    """Main function to initialize and run the analyzer."""
    analyzer = MemoryAccessAnalyzer('perf_output_enhanced.csv')
    analyzer.run_server()

if __name__ == '__main__':
    main()