// Defines the structure of our time series data points
export interface TimeSeriesDataPoint {
    // Timestamp for the data point
    timestamp: string;
    
    // Memory access metrics
    accesses: number;      // Total memory accesses
    cacheHits: number;     // Number of cache hits
    cacheMisses: number;   // Number of cache misses
    
    // Program section metrics
    mainProgram: number;   // Main program memory accesses
    dynamicLinker: number; // Dynamic linker accesses
    cLibrary: number;      // C library accesses
    
    // Execution phase identifier
    phase: 'init' | 'loop' | 'exit';
  }
  
  // Represents library access statistics
  export interface LibraryAccess {
    name: string;       // Name of the library
    accesses: number;   // Number of times accessed
    color: string;      // Color for visualization
  }
  
  // Represents different types of memory events
  export interface EventType {
    name: string;     // Event name (e.g., 'SAMPLE', 'MMAP2')
    count: number;    // Number of occurrences
    color: string;    // Color for visualization
  }
  
  // Code snippet interface for visualization
  export interface CodeSnippet {
    code: string;     // The actual code
    color: string;    // Color for UI highlighting
    phase: string;    // Execution phase this code belongs to
  }
  
  // Interface for organizing code sections
  export interface CodeSection {
    [key: string]: {
      code: string;     // The code content
      color: string;    // UI color theme
      phase: string;    // Execution phase
    };
  }
  
  // Performance metrics interface
  export interface PerformanceMetrics {
    cacheHitRate: number;    // Cache hit percentage
    cacheMissRate: number;   // Cache miss percentage
    totalAccesses: number;   // Total memory accesses
    peakAccessRate: number;  // Maximum accesses per second
  }

  
  // Type for timeline selection
  export type TimeRangeSelection = 'all' | 'init' | 'loop' | 'exit';
  
  // Type for code section selection
  export type SectionSelection = 'all' | 'init' | 'loop' | 'exit';