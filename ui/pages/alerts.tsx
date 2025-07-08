import Layout from '../components/Layout'

export default function Alerts() {
  // Пример данных, замени на реальные
  const alerts = [
    { message: 'Node not ready', severity: 'critical', time: '2024-07-08 12:00' },
    { message: 'Disk usage high', severity: 'warning', time: '2024-07-08 11:50' },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow">Alerts</h1>
      <div className="overflow-x-auto rounded-xl shadow-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-pink-400 dark:from-blue-900 dark:to-indigo-900 p-6 mb-6">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-blue-900/60">
            <tr>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Severity</th>
              <th className="p-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, i) => (
              <tr key={i} className="border-b border-blue-200/30">
                <td className="p-3">{alert.message}</td>
                <td className={`p-3 font-semibold ${
                  alert.severity === 'critical' ? 'text-red-200' :
                  alert.severity === 'warning' ? 'text-yellow-200' : 'text-blue-200'
                }`}>{alert.severity}</td>
                <td className="p-3">{alert.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
