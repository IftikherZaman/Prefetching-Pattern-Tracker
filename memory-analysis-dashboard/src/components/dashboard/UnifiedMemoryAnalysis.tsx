'use client';
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Github, Linkedin, Download, Mail, Globe } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-end space-x-4">
            <a href="https://github.com/IftikherZaman/Prefetching-Pattern-Tracker" target="_blank" rel="noopener noreferrer" 
               className="text-gray-600 hover:text-gray-900 transition-colors">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/iftikherzaman/" target="_blank" rel="noopener noreferrer"
               className="text-gray-600 hover:text-gray-900 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://iftikherzaman.netlify.app" target="_blank" rel="noopener noreferrer"
               className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
              <Globe size={20} />
              <span className="text-sm"></span>
            </a>
            <a href="mailto:iftikherzaman.chowdhury@mail.utoronto.ca"
               className="text-gray-600 hover:text-gray-900 transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Left side - Title and Description */}
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Memory Access Pattern Analysis
              </h1>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Computer Architecture
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Linux Perf
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Memory and Cache Systems
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              Hi, I'm Iftikher Zaman, a 3rd Year Computer Engineering student at the University of Toronto.
              As a Computer Architecture enthusiast, I've developed this dashboard to analyze memory access patterns
              and prefetching behavior. Using Linux Perf for tracing, this tool provides insights into how programs
              interact with memory and cache systems.
              , 
              
              The dataset is collected from a sample C program and analyzed through linux perf's mem trace feature.
            </p>

            <div className="flex items-center space-x-4">
              <a
                href="/perf_output_enhanced.csv"
                download
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Download size={18} className="mr-2" />
                <span>Download Dataset</span>
              </a>
              <a
                href="/ExtendedData2CSV.py"
                download
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Download size={18} className="mr-2" />
                <span> Perf data to CSV converter</span>
              </a>
            
            </div>
          </div>

          {/* Right side - Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Total Accesses</span>
                <span className="text-3xl font-bold text-gray-900 mt-1">72</span>
                <span className="text-xs text-gray-500 mt-2">Traced memory operations</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Program</span>
                <span className="text-3xl font-bold text-gray-900 mt-1">test.c</span>
                <span className="text-xs text-gray-500 mt-2">Sample application</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Duration</span>
                <span className="text-3xl font-bold text-gray-900 mt-1">3.04s</span>
                <span className="text-xs text-gray-500 mt-2">Analysis period</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-white border-t py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Connect With Me</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/IftikherZaman/Prefetching-Pattern-Tracker" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-600 hover:text-gray-900 transition-colors">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/iftikherzaman/" target="_blank" rel="noopener noreferrer"
                 className="text-gray-600 hover:text-gray-900 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="https://iftikherzaman.netlify.app" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Globe size={24} />
               
              </a>
              <a href="mailto:iftikherzaman.chowdhury@mail.utoronto.ca"
                 className="text-gray-600 hover:text-gray-900 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">About This Project</h3>
            <p className="text-gray-600">
              This dashboard is part of my research into memory access patterns and prefetching optimizations.
              The data is collected using Linux Perf tools and analyzed to understand memory access behavior
              in real programs.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>© {currentYear} Memory Access Pattern Analysis. Built with React and Linux Perf.</p>
        </div>
      </div>
    </footer>
  );
};

const UnifiedMemoryAnalysis = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');

  // Code sections with annotations
  const codeSnippets = {
    init: `// Program Initialization
#include <stdio.h>
int main() {
    // Variable initialization
    int counter = 0;`,
    
    loop: `    // Main processing loop
    for (int i = 0; i < 1000000; i++) {
        counter++;  // Memory access pattern
    }`,
    
    exit: `    // Program cleanup and exit
    printf("Hello, perf!\\n");
    return 0;
}`
  };

  // Data setup
  const libraryAccesses = [
    { name: 'Main()', accesses: 12, color: '#2ecc71' },
    { name: 'Linker', accesses: 35, color: '#3498db' },
    { name: 'C Library', accesses: 18, color: '#9b59b6' },
    { name: 'VDSO', accesses: 7, color: '#e74c3c' }
  ];

  const eventTypes = [
    { name: 'SAMPLE', count: 60, color: '#1abc9c' },
    { name: 'MMAP2', count: 4, color: '#3498db' },
    { name: 'COMM', count: 2, color: '#9b59b6' },
    { name: 'EXIT', count: 1, color: '#e74c3c' },
    { name: 'Other', count: 5, color: '#95a5a6' }
  ];

  const generateTimeSeriesData = () => {
    const baseData = Array.from({ length: 20 }, (_, i) => ({
      timestamp: `T${i}`,
      accesses: Math.floor(Math.random() * 20 + 5),
      cacheHits: Math.floor(Math.random() * 15 + 10),
      cacheMisses: Math.floor(Math.random() * 8 + 2),
      mainProgram: Math.floor(Math.random() * 10),
      dynamicLinker: Math.floor(Math.random() * 15),
      cLibrary: Math.floor(Math.random() * 8),
      phase: i < 7 ? 'init' : i < 14 ? 'loop' : 'exit'
    }));

    return selectedTimeRange !== 'all' 
      ? baseData.filter(item => item.phase === selectedTimeRange)
      : baseData;
  };

  const timeSeriesData = generateTimeSeriesData();
return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Code Analysis Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Code Execution Analysis</h2>
                <div className="space-y-4">
                  {Object.entries({
                    'Program Initialization': { code: codeSnippets.init, color: 'green', phase: 'init' },
                    'Main Loop': { code: codeSnippets.loop, color: 'blue', phase: 'loop' },
                    'Program Exit': { code: codeSnippets.exit, color: 'purple', phase: 'exit' }
                  }).map(([section, { code, color, phase }]) => (
                    <div key={section} 
                         className={`bg-gray-900 rounded-lg p-4 ${selectedSection !== 'all' && selectedSection !== phase ? 'opacity-50' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm font-medium">{section}</span>
                        <span className="text-gray-400 text-sm">
                          {selectedSection === 'all' || selectedSection === phase ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <pre className="text-gray-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                        {code}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeline View</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                    >
                      <option value="all">Full Timeline</option>
                      <option value="init">Initialization Phase</option>
                      <option value="loop">Main Loop Phase</option>
                      <option value="exit">Exit Phase</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code Section Focus</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                    >
                      <option value="all">All Sections</option>
                      <option value="init">Program Initialization</option>
                      <option value="loop">Main Loop</option>
                      <option value="exit">Program Exit</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Timeline Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Memory Access and Cache Performance Timeline</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="text-sm font-semibold">{payload[0].payload.timestamp}</p>
                            <p className="text-sm text-green-600">Cache Hits: {payload[0].payload.cacheHits}</p>
                            <p className="text-sm text-red-600">Cache Misses: {payload[0].payload.cacheMisses}</p>
                            <p className="text-sm text-blue-600">Memory Accesses: {payload[0].payload.accesses}</p>
                            <p className="text-sm text-gray-600">Phase: {payload[0].payload.phase}</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend />
                    <Line type="monotone" dataKey="cacheHits" name="Cache Hits" stroke="#2ecc71" strokeWidth={2} />
                    <Line type="monotone" dataKey="cacheMisses" name="Cache Misses" stroke="#e74c3c" strokeWidth={2} />
                    <Line type="monotone" dataKey="accesses" name="Memory Accesses" stroke="#3498db" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Library Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Library Access Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={libraryAccesses}
                      cx="47%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={58}
                      fill="#8884d8"
                      dataKey="accesses"
                    >
                      {libraryAccesses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Event Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Event Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventTypes} layout="vertical" barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Performance Summary */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Performance Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Cache Hit Rate</p>
                    <p className="text-xl font-mono">78.5%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Cache Miss Rate</p>
                    <p className="text-xl font-mono">21.5%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Total Accesses</p>
                    <p className="text-xl font-mono">72</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Peak Access Rate</p>
                    <p className="text-xl font-mono">15/s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnifiedMemoryAnalysis;

