import Link from "next/link";
import { FaServer, FaUserShield, FaClipboardList, FaChartBar, FaBell, FaHeartbeat, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Layout from '../components/Layout'

export default function Metrics() {
  // Пример данных, замени на реальные
  const metrics = [
    { name: 'CPU Usage', value: '45%', trend: 'up' },
    { name: 'Memory Usage', value: '7.2Gi', trend: 'down' },
  ];

  // Пример статусов (можно получать из API)
  const stats = {
    nodes: 5,
    agentsOnline: 4,
    alerts: 2,
    logs: 120,
    metrics: "OK",
    status: "Healthy"
  };

  // Пример мок-метрик
  const [cpuData] = useState([
    { time: "10:00", value: 30 },
    { time: "10:05", value: 45 },
    { time: "10:10", value: 50 },
    { time: "10:15", value: 40 },
    { time: "10:20", value: 60 },
    { time: "10:25", value: 55 },
  ]);
  const [ramData] = useState([
    { time: "10:00", value: 2048 },
    { time: "10:05", value: 2200 },
    { time: "10:10", value: 2100 },
    { time: "10:15", value: 2300 },
    { time: "10:20", value: 2250 },
    { time: "10:25", value: 2400 },
  ]);

  const cards = [
    {
      href: "/nodes",
      icon: <FaServer className="text-blue-500 text-3xl mb-2" />,
      title: "Cluster Nodes",
      desc: "View all Kubernetes nodes in the cluster.",
      status: `${stats.nodes} nodes`
    },
    {
      href: "/agents",
      icon: <FaUserShield className="text-green-500 text-3xl mb-2" />,
      title: "Agents",
      desc: "Manage agents and see their status.",
      status: `${stats.agentsOnline} online`
    },
    {
      href: "/logs",
      icon: <FaClipboardList className="text-yellow-500 text-3xl mb-2" />,
      title: "Logs",
      desc: "View recent logs from the system.",
      status: `${stats.logs} entries`
    },
    {
      href: "/metrics",
      icon: <FaChartBar className="text-purple-500 text-3xl mb-2" />,
      title: "Metrics",
      desc: "Monitor CPU, memory, and other metrics.",
      status: stats.metrics
    },
    {
      href: "/alerts",
      icon: <FaBell className="text-red-500 text-3xl mb-2" />,
      title: "Alerts",
      desc: "Check current alerts from Alertmanager.",
      status: `${stats.alerts} active`
    },
    {
      href: "/status",
      icon: <FaHeartbeat className="text-pink-500 text-3xl mb-2" />,
      title: "System Status",
      desc: "Check health of services and components.",
      status: stats.status
    }
  ];

  // summary
  const readyCount = stats.nodes;

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow">Metrics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {metrics.map(metric => (
          <div key={metric.name} className="rounded-xl shadow-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-pink-400 dark:from-blue-900 dark:to-indigo-900 p-6 text-white">
            <div className="font-bold text-lg">{metric.name}</div>
            <div className="text-2xl">{metric.value}</div>
            <div className={`mt-2 font-semibold ${metric.trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
              {metric.trend === 'up' ? '▲' : '▼'} {metric.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 space-y-6 min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-400 to-blue-400 opacity-20 rounded-full blur-3xl z-0"></div>
        <h1 className="text-2xl font-bold relative z-10">Cluster Metrics</h1>
        <a
          href="http://localhost:3000/grafana"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg font-bold mb-4 shadow-lg"
        >
          Open Grafana Dashboard
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="bg-gradient-to-br from-white via-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-4">
            <h2 className="text-lg font-semibold mb-2">CPU Usage (%)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={cpuData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="CPU" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gradient-to-br from-white via-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-4">
            <h2 className="text-lg font-semibold mb-2">RAM Usage (MiB)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ramData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="RAM" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <Link href={card.href} key={card.href} className="block p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl hover:scale-105 hover:shadow-2xl transition transform duration-200">
              <div className="flex items-center mb-2">
                {card.icon}
                <span className="ml-auto text-sm font-semibold text-gray-400">{card.status}</span>
              </div>
              <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">{card.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{card.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white dark:bg-gray-900 shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Cluster Summary</h2>
          <div className="mb-4 flex gap-6">
            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> <span className="font-bold">{readyCount}</span> Ready
            </div>
            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-2">
              <FaTimesCircle className="text-red-500" /> <span className="font-bold">{stats.nodes - readyCount}</span> Not Ready
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}