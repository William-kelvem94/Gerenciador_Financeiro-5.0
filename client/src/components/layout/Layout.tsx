import React from 'react';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 p-4">
        <h1 className="text-white text-xl">Will Finance 5.0</h1>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}