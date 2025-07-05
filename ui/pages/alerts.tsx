import { useEffect, useState } from 'react'

export default function Alerts() {
  const [alerts, setAlerts] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.alerts || []))
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">⚠️ Active Alerts</h2>
      {alerts.length === 0 ? (
        <p className="text-green-600">All systems operational ✅</p>
      ) : (
        <ul className="list-disc pl-5">
          {alerts.map((alert, i) => (
            <li key={i} className="text-red-600">{alert}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
