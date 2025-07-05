import Link from 'next/link'

export default function MetricsPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4"> Metrics & Dashboards</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <a className="text-blue-600 underline" href="/grafana/d/uU7wFhMZk/node-exporter-full?orgId=1" target="_blank" rel="noreferrer">
             CPU / Memory Dashboard (Node Exporter)
          </a>
        </li>
        <li>
          <a className="text-blue-600 underline" href="/grafana/d/k8s-logs/logs?orgId=1" target="_blank" rel="noreferrer">
             Loki Logs Dashboard
          </a>
        </li>
      </ul>

      <p style={{ marginTop: '2rem' }}>
        ℹ️ Если Grafana не открывается — убедитесь, что порт 3000 проброшен:
        <br />
        <code>kubectl port-forward svc/grafana -n monitoring 3000:80</code>
      </p>
    </div>
  )
}