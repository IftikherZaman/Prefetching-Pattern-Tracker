from dash import Dash, html, dcc, Output, Input
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from plotly.subplots import make_subplots

class MemoryAccessDashboard:
    def __init__(self, csv_file):
        """Initialize dashboard with the enhanced CSV file."""
        # Load and preprocess data
        self.df = pd.read_csv(csv_file)
        self.preprocess_data()
        
        # Initialize Dash app
        self.app = Dash(__name__)
        self.setup_layout()
        self.setup_callbacks()
    
    def preprocess_data(self):
       
        """Prepare data for visualization with robust time bucket creation."""
        # Convert hexadecimal addresses to numeric
        self.df['address_num'] = self.df['address'].apply(
            lambda x: int(str(x), 16) if isinstance(x, str) and 'x' in str(x) else x
        )
        
        # Convert timestamps to numeric, handling any non-numeric values
        self.df['timestamp'] = pd.to_numeric(self.df['timestamp'], errors='coerce')
        
        # Create time buckets more robustly
        # First check if we have enough unique values for 100 bins
        unique_timestamps = self.df['timestamp'].nunique()
        n_bins = min(unique_timestamps, 100)  # Use fewer bins if we have fewer unique values
        
        try:
            self.df['time_bucket'] = pd.qcut(
                self.df['timestamp'],
                q=n_bins,
                duplicates='drop',
                labels=[f'T{i}' for i in range(n_bins)]
            )
        except ValueError:
            # If qcut fails, fall back to cut with evenly spaced bins
            self.df['time_bucket'] = pd.cut(
                self.df['timestamp'],
                bins=n_bins,
                labels=[f'T{i}' for i in range(n_bins)]
            )
        
        # Create address ranges similarly
        unique_addresses = self.df['address_num'].nunique()
        n_addr_bins = min(unique_addresses, 50)  # Use fewer bins if we have fewer unique values
        
        try:
            self.df['addr_bucket'] = pd.qcut(
                self.df['address_num'],
                q=n_addr_bins,
                duplicates='drop',
                labels=[f'A{i}' for i in range(n_addr_bins)]
            )
        except ValueError:
            # Fall back to cut with evenly spaced bins
            self.df['addr_bucket'] = pd.cut(
                self.df['address_num'],
                bins=n_addr_bins,
                labels=[f'A{i}' for i in range(n_addr_bins)]
            )
    
    def create_heatmap(self):
        """Create interactive heatmap of memory access patterns."""
        # Create access frequency matrix
        heatmap_data = pd.crosstab(
            self.df['addr_bucket'],
            self.df['time_bucket']
        )
        
        # Create heatmap using Plotly
        fig = go.Figure(data=go.Heatmap(
            z=heatmap_data.values,
            x=heatmap_data.columns,
            y=heatmap_data.index,
            colorscale='Viridis',
            hoverongaps=False,
            hovertemplate=(
                'Address Range: %{y}<br>' +
                'Time Bucket: %{x}<br>' +
                'Access Count: %{z}<extra></extra>'
            )
        ))
        
        fig.update_layout(
            title='Memory Access Pattern Heatmap',
            xaxis_title='Time',
            yaxis_title='Memory Address Range',
            height=600
        )
        
        return fig
    
    def create_timeline(self):
        """Create interactive timeline of memory events."""
        events_over_time = self.df.groupby(['time_bucket', 'event_type']).size().unstack(fill_value=0)
        
        fig = go.Figure()
        
        # Add traces for each event type
        for column in events_over_time.columns:
            fig.add_trace(go.Scatter(
                x=events_over_time.index,
                y=events_over_time[column],
                name=column,
                mode='lines',
                stackgroup='one',
                hovertemplate=(
                    'Time: %{x}<br>' +
                    'Count: %{y}<br>' +
                    f'Event: {column}<extra></extra>'
                )
            ))
        
        fig.update_layout(
            title='Memory Events Timeline',
            xaxis_title='Time',
            yaxis_title='Number of Events',
            height=400,
            showlegend=True,
            hovermode='x unified'
        )
        
        return fig
    
    def create_address_distribution(self):
        """Create interactive distribution of memory accesses."""
        fig = go.Figure()
        
        # Add histogram for each event type
        for event_type in self.df['event_type'].unique():
            event_data = self.df[self.df['event_type'] == event_type]
            
            fig.add_trace(go.Histogram(
                x=event_data['address_num'],
                name=event_type,
                opacity=0.7,
                nbinsx=50,
                hovertemplate=(
                    'Address Range: %{x}<br>' +
                    'Count: %{y}<br>' +
                    f'Event: {event_type}<extra></extra>'
                )
            ))
        
        fig.update_layout(
            title='Memory Access Distribution by Event Type',
            xaxis_title='Memory Address',
            yaxis_title='Frequency',
            height=400,
            barmode='overlay',
            showlegend=True
        )
        
        return fig
    
    def create_event_summary(self):
        """Create interactive summary of event statistics."""
        event_counts = self.df['event_type'].value_counts()
        
        fig = go.Figure(data=[
            go.Pie(
                labels=event_counts.index,
                values=event_counts.values,
                hole=.3,
                hovertemplate=(
                    'Event: %{label}<br>' +
                    'Count: %{value}<br>' +
                    'Percentage: %{percent}<extra></extra>'
                )
            )
        ])
        
        fig.update_layout(
            title='Event Type Distribution',
            height=400,
            showlegend=True
        )
        
        return fig
    
    def setup_layout(self):
        """
        Set up the dashboard layout with dynamic time range and organized sections.
        This function creates a responsive, well-structured layout with clear visual
        hierarchy and intuitive controls.
        """
        # Calculate the number of time bins for the slider
        n_bins = len(self.df['time_bucket'].unique())
        
        self.app.layout = html.Div([
            # Header section with title and description
            html.Div([
                html.H1(
                    'Memory Access Pattern Analysis Dashboard',
                    style={
                        'textAlign': 'center',
                        'color': '#2c3e50',
                        'fontFamily': 'Arial, sans-serif',
                        'marginBottom': '10px'
                    }
                ),
                html.P(
                    'Interactive visualization of memory access patterns and events',
                    style={
                        'textAlign': 'center',
                        'color': '#7f8c8d',
                        'marginBottom': '30px'
                    }
                ),
            ], style={'padding': '20px'}),
            
            # Control panel section
            html.Div([
                # Time range selection
                html.Div([
                    html.H4(
                        'Time Range Selection',
                        style={'color': '#2c3e50', 'marginBottom': '10px'}
                    ),
                    dcc.RangeSlider(
                        id='time-slider',
                        min=0,
                        max=n_bins - 1,
                        value=[0, n_bins - 1],
                        marks={
                            i: {'label': str(i), 'style': {'transform': 'rotate(45deg)'}}
                            for i in range(0, n_bins, max(1, n_bins // 10))
                        },
                        step=1,
                        tooltip={'placement': 'bottom', 'always_visible': True}
                    ),
                ], style={
                    'margin': '20px',
                    'padding': '20px',
                    'backgroundColor': '#f8f9fa',
                    'borderRadius': '10px',
                    'boxShadow': '0 2px 4px rgba(0,0,0,0.1)'
                }),
                
                # Additional controls can be added here
            ]),
            
            # Main visualization section
            html.Div([
                # Memory access heatmap
                html.Div([
                    dcc.Graph(
                        id='heatmap-graph',
                        style={'height': '600px'}
                    )
                ], style={
                    'margin': '20px',
                    'padding': '20px',
                    'backgroundColor': 'white',
                    'borderRadius': '10px',
                    'boxShadow': '0 2px 4px rgba(0,0,0,0.1)'
                }),
                
                # Timeline and distribution section
                html.Div([
                    # Timeline graph
                    html.Div([
                        dcc.Graph(
                            id='timeline-graph',
                            style={'height': '400px'}
                        )
                    ], style={
                        'width': '50%',
                        'display': 'inline-block',
                        'padding': '10px'
                    }),
                    
                    # Distribution graph
                    html.Div([
                        dcc.Graph(
                            id='distribution-graph',
                            style={'height': '400px'}
                        )
                    ], style={
                        'width': '50%',
                        'display': 'inline-block',
                        'padding': '10px'
                    })
                ], style={
                    'margin': '20px',
                    'padding': '20px',
                    'backgroundColor': 'white',
                    'borderRadius': '10px',
                    'boxShadow': '0 2px 4px rgba(0,0,0,0.1)'
                }),
                
                # Summary section
                html.Div([
                    dcc.Graph(
                        id='summary-graph',
                        style={'height': '400px'}
                    )
                ], style={
                    'width': '50%',
                    'margin': 'auto',
                    'padding': '20px',
                    'backgroundColor': 'white',
                    'borderRadius': '10px',
                    'boxShadow': '0 2px 4px rgba(0,0,0,0.1)'
                })
            ]),
            
            # Footer section with additional information
            html.Div([
                html.Hr(),
                html.P(
                    'Dashboard updates automatically based on time range selection. '
                    'Hover over elements for detailed information.',
                    style={
                        'textAlign': 'center',
                        'color': '#7f8c8d',
                        'fontSize': '0.9em',
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
        
    def setup_callbacks(self):
        """Set up interactive callbacks."""
        @self.app.callback(
            [Output('heatmap-graph', 'figure'),
             Output('timeline-graph', 'figure'),
             Output('distribution-graph', 'figure'),
             Output('summary-graph', 'figure')],
            [Input('time-slider', 'value')]
        )
        def update_graphs(time_range):
            # Filter data based on time range
            time_buckets = [f'T{i}' for i in range(time_range[0], time_range[1] + 1)]
            filtered_df = self.df[self.df['time_bucket'].isin(time_buckets)]
            
            # Update all visualizations with filtered data
            heatmap = self.create_heatmap()
            timeline = self.create_timeline()
            distribution = self.create_address_distribution()
            summary = self.create_event_summary()
            
            return heatmap, timeline, distribution, summary
    
    def run_server(self, debug=True):
        """Run the dashboard server."""
        self.app.run_server(debug=debug)

def main():
    # Create and run dashboard
    dashboard = MemoryAccessDashboard('perf_output_enhanced.csv')
    dashboard.run_server()

if __name__ == '__main__':
    main()