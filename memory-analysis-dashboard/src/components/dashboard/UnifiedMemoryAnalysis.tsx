'use client';
import React, { useState } from 'react';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
    { name: 'Links', accesses: 35, color: '#3498db' },
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
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Comprehensive Memory Analysis Dashboard</h1>
        <p className="text-gray-600">Unified view of memory access patterns, cache performance, and code execution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
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

          {/* Selection Controls */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
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

          {/* Memory Cache Performance Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Library Access Distribution</h2>
            <ResponsiveContainer width="200%" height={400}>
              <PieChart>
                <Pie
                  data={libraryAccesses}
                  cx="25%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
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
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
  );
};

export default UnifiedMemoryAnalysis;