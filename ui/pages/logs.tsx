import Link from "next/link";
import { FaClipboardList, FaChartBar } from "react-icons/fa";
import { useEffect } from "react";
import Layout from '../components/Layout'

export default function Logs() {
  // Пример данных, замени на реальные
  const logs = [
    { time: '2024-07-08 12:00', level: 'INFO', message: 'Agent started' },
    { time: '2024-07-08 12:01', level: 'ERROR', message: 'Failed to connect' },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow">Logs</h1>
      <div className="overflow-x-auto rounded-xl shadow-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-pink-400 dark:from-blue-900 dark:to-indigo-900 p-6 mb-6">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-blue-900/60">
            <tr>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Level</th>
              <th className="p-3 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b border-blue-200/30">
                <td className="p-3">{log.time}</td>
                <td className={`p-3 font-semibold ${log.level === 'ERROR' ? 'text-red-200' : 'text-blue-200'}`}>{log.level}</td>
                <td className="p-3">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

function MetricCard({ icon, title, description, url }: { icon: React.ReactNode; title: string; description: string; url: string }) {
  return (
    <Link href={url} target="_blank">
      <div className="border p-6 rounded-2xl hover:shadow-xl transition cursor-pointer flex items-center gap-4 bg-white">
        {icon}
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-500 mt-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
