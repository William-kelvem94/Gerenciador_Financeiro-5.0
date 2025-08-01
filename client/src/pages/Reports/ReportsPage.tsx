import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Download, Activity, Zap, DollarSign, Target, Eye, Settings } from 'lucide-react';
import { LoadingScreen } from '../../components/ui/LoadingScreen';

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [analysisMode, setAnalysisMode] = useState('overview');

  // This would be implemented with a reports store
  const isLoading = false;
  const mockReports = {
    overview: {
      totalIncome: 15000,
      totalExpenses: 8500,
      netIncome: 6500,
      transactionCount: 45,
    },
    monthlyTrends: [
      { month: '2024-01', income: 12000, expenses: 7000 },
      { month: '2024-02', income: 14000, expenses: 8000 },
      { month: '2024-03', income: 15000, expenses: 8500 },
    ],
    categories: [
      { name: 'Alimentação', amount: 2500, percentage: 30, color: '#00FFFF' },
      { name: 'Transporte', amount: 1800, percentage: 21, color: '#FF00FF' },
      { name: 'Lazer', amount: 1500, percentage: 18, color: '#39FF14' },
      { name: 'Saúde', amount: 1200, percentage: 14, color: '#FFD700' },
      { name: 'Outros', amount: 1500, percentage: 17, color: '#FF6B6B' },
    ],
  };

  if (isLoading) {
    return <LoadingScreen message="🔍 Analyzing Financial Data..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header with Cyber Effects */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Circuit Pattern Background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <pattern id="circuit" patternUnits="userSpaceOnUse" width="100" height="100">
                  <path d="M10,10 L90,10 L90,90 L50,90 L50,50" 
                        stroke="#00FFFF" strokeWidth="1" fill="none" opacity="0.3"/>
                  <circle cx="10" cy="10" r="2" fill="#FF00FF"/>
                  <circle cx="90" cy="90" r="2" fill="#39FF14"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)"/>
            </svg>
          </div>

          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-4 mb-4"
                >
                  <div className="relative">
                    <Activity className="w-10 h-10 text-cyan-400" />
                    <motion.div
                      className="absolute -inset-2 rounded-full border border-cyan-400/30"
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity }
                      }}
                    />
                  </div>
                  <div>
                    <h1 className="text-4xl font-cyber bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      DATA ANALYTICS
                    </h1>
                    <p className="text-gray-300 text-lg">Advanced Financial Intelligence System</p>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-3 bg-gray-800/80 border border-cyan-500/30 rounded-xl text-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 backdrop-blur-sm"
                  >
                    <option value="daily">📊 Daily</option>
                    <option value="weekly">📈 Weekly</option>
                    <option value="monthly">📉 Monthly</option>
                    <option value="yearly">📅 Yearly</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-gray-900 rounded-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg shadow-cyan-500/25"
                  >
                    <Download className="w-5 h-5" />
                    <span>EXPORT DATA</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analysis Mode Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4"
        >
          {[
            { id: 'overview', label: 'OVERVIEW', icon: Eye },
            { id: 'trends', label: 'TRENDS', icon: TrendingUp },
            { id: 'categories', label: 'CATEGORIES', icon: Target },
            { id: 'performance', label: 'PERFORMANCE', icon: Zap },
          ].map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAnalysisMode(mode.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl border transition-all duration-300 ${
                analysisMode === mode.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400'
              }`}
            >
              <mode.icon className="w-5 h-5" />
              <span className="font-semibold">{mode.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: 'TOTAL INCOME',
              value: mockReports.overview.totalIncome,
              change: '+12%',
              icon: DollarSign,
              color: 'from-green-400 to-cyan-400',
              borderColor: 'border-green-400/30'
            },
            {
              title: 'TOTAL EXPENSES',
              value: mockReports.overview.totalExpenses,
              change: '-5%',
              icon: TrendingUp,
              color: 'from-red-400 to-pink-400',
              borderColor: 'border-red-400/30'
            },
            {
              title: 'NET PROFIT',
              value: mockReports.overview.netIncome,
              change: '+25%',
              icon: Zap,
              color: 'from-cyan-400 to-purple-400',
              borderColor: 'border-cyan-400/30'
            },
            {
              title: 'TRANSACTIONS',
              value: mockReports.overview.transactionCount,
              change: 'This Period',
              icon: Activity,
              color: 'from-yellow-400 to-orange-400',
              borderColor: 'border-yellow-400/30'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative bg-gray-900/80 backdrop-blur-xl border ${stat.borderColor} rounded-2xl p-6 group`}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-cyber text-gray-300 tracking-wider">{stat.title}</h3>
                  <div className="relative">
                    <stat.icon className="w-6 h-6 text-cyan-400" />
                    <motion.div
                      className="absolute inset-0 rounded-full border border-cyan-400/30"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
                
                <div className={`text-3xl font-cyber bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {typeof stat.value === 'number' ? `$${stat.value.toLocaleString()}` : stat.value}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-cyan-400 font-semibold">{stat.change}</span>
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Income vs Expenses Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-cyber text-cyan-400">INCOME VS EXPENSES</h3>
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            
            <div className="relative h-64 border border-gray-700/50 rounded-xl bg-gray-800/30 overflow-hidden">
              {/* Simulated Chart Bars */}
              <div className="absolute inset-4 flex items-end justify-around">
                {mockReports.monthlyTrends.map((data, index) => (
                  <div key={data.month} className="flex flex-col items-center space-y-2">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-4 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.income / 20000) * 180}px` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      />
                      <motion.div
                        className="w-4 bg-gradient-to-t from-red-400 to-red-600 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.expenses / 20000) * 180}px` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{data.month.slice(-2)}</span>
                  </div>
                ))}
              </div>
              
              {/* Grid Lines */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full border-t border-cyan-400/30"
                    style={{ top: `${20 + i * 20}%` }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded" />
                <span className="text-sm text-gray-300">Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded" />
                <span className="text-sm text-gray-300">Expenses</span>
              </div>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-cyber text-purple-400">CATEGORY BREAKDOWN</h3>
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            
            <div className="space-y-4">
              {mockReports.categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 font-medium">{category.name}</span>
                      <span className="text-cyan-400 font-semibold">${category.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: category.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-right">{category.percentage}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative bg-gray-900/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-cyber text-yellow-400">PERFORMANCE MATRIX</h3>
            <Settings className="w-6 h-6 text-cyan-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Savings Rate', value: 43, target: 50, color: 'cyan' },
              { label: 'Budget Efficiency', value: 78, target: 80, color: 'purple' },
              { label: 'Investment Growth', value: 92, target: 85, color: 'green' },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {/* Background Circle */}
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-700"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={`${metric.color === 'cyan' ? '#00FFFF' : metric.color === 'purple' ? '#9333EA' : '#10B981'}`}
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: metric.value / 100 }}
                      transition={{ delay: 1 + index * 0.2, duration: 1.5 }}
                      style={{
                        filter: `drop-shadow(0 0 6px ${metric.color === 'cyan' ? '#00FFFF' : metric.color === 'purple' ? '#9333EA' : '#10B981'}40)`
                      }}
                      strokeDasharray="0 1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-cyber ${metric.color === 'cyan' ? 'text-cyan-400' : metric.color === 'purple' ? 'text-purple-400' : 'text-green-400'}`}>
                      {metric.value}%
                    </span>
                  </div>
                </div>
                <h4 className="text-gray-300 font-semibold mb-1">{metric.label}</h4>
                <p className="text-sm text-gray-500">Target: {metric.target}%</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};