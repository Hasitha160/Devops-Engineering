import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      title: "Gmail",
      username: "user@gmail.com",
      category: "Email",
      lastModified: "2 days ago",
    },
    {
      id: 2,
      title: "GitHub",
      username: "developer123",
      category: "Development",
      lastModified: "1 week ago",
    },
    {
      id: 3,
      title: "AWS Console",
      username: "admin@company.com",
      category: "Cloud",
      lastModified: "3 days ago",
    },
  ]);

  const stats = [
    { name: "Total Passwords", value: credentials.length, icon: "🔑" },
    { name: "Strong Passwords", value: credentials.length - 1, icon: "💪" },
    { name: "Weak Passwords", value: 1, icon: "⚠️" },
    { name: "Categories", value: 3, icon: "📁" },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="btn btn-primary">+ Add Password</button>
              <button className="btn btn-secondary">Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left">
              <div className="text-2xl mb-2">🔐</div>
              <div className="text-white font-medium">Generate Password</div>
              <div className="text-sm text-gray-400">
                Create a strong password
              </div>
            </button>
            <button className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-white font-medium">Import Passwords</div>
              <div className="text-sm text-gray-400">
                Import from file or browser
              </div>
            </button>
            <button className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-white font-medium">Security Checkup</div>
              <div className="text-sm text-gray-400">
                Scan for weak passwords
              </div>
            </button>
          </div>
        </div>

        {/* Credentials List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Recent Passwords
            </h2>
            <input
              type="search"
              placeholder="Search passwords..."
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {credentials.map((credential) => (
                  <tr
                    key={credential.id}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {credential.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {credential.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-900/50 text-indigo-300">
                        {credential.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {credential.lastModified}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-400 hover:text-indigo-300 mr-4">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {credentials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No passwords saved yet.</p>
              <button className="mt-4 btn btn-primary">
                Add Your First Password
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
