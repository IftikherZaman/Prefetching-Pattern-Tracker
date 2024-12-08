import React from 'react';
import { Github, Linkedin, Download, Mail } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-white border-b px-6 py-8 shadow-sm">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Personal Introduction */}
        <div className="flex justify-between items-start">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800">Memory Access Pattern Analysis</h1>
            <p className="text-gray-600 leading-relaxed">
              As a Computer Architecture enthusiast, I've developed this dashboard to analyze memory access patterns
              and prefetching behavior. Using Linux Perf for tracing, this tool provides insights into how programs
              interact with memory and cache systems.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/perf_output.csv"
              download
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              <span>Download Dataset</span>
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 pt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Memory Accesses</p>
            <p className="text-2xl font-semibold text-gray-800">72</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Traced Program</p>
            <p className="text-2xl font-semibold text-gray-800">test.c</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Analysis Period</p>
            <p className="text-2xl font-semibold text-gray-800">3.04s</p>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-white border-t py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact and Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Connect With Me</h3>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-600 hover:text-gray-900 transition-colors">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-600 hover:text-gray-900 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:your.email@example.com"
                 className="text-gray-600 hover:text-gray-900 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">About This Project</h3>
            <p className="text-gray-600">
              This dashboard is part of my research into memory access patterns and prefetching optimizations.
              The data is collected using Linux Perf tools and analyzed to understand memory access behavior
              in real programs.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>© {currentYear} Memory Access Pattern Analysis. Built with React and Linux Perf.</p>
        </div>
      </div>
    </footer>
  );
};

// Main layout wrapper
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
