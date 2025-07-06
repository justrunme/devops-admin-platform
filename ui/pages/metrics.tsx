import Layout from '../components/Layout'
import Head from 'next/head'

export default function MetricsPage() {
  return (
    <Layout>
      <Head>
        <title>Metrics | DevOps Admin Panel</title>
      </Head>
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold"> Cluster Metrics</h1>
        <p className="text-gray-600">Real-time metrics via Grafana dashboards embedded below.</p>

        <div>
          <h2 className="text-xl font-semibold mb-2"> CPU Usage by Node</h2>
          <iframe
            src="http://localhost:3001/d-solo/k8s-cluster/kubernetes-cluster-monitoring?orgId=1&panelId=2&refresh=30s"
            width="100%"
            height="300"
            frameBorder="0"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2"> Memory Usage by Node</h2>
          <iframe
            src="http://localhost:3001/d-solo/k8s-cluster/kubernetes-cluster-monitoring?orgId=1&panelId=4&refresh=30s"
            width="100%"
            height="300"
            frameBorder="0"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2"> Pod Status</h2>
          <iframe
            src="http://localhost:3001/d-solo/k8s-cluster/kubernetes-cluster-monitoring?orgId=1&panelId=6&refresh=30s"
            width="100%"
            height="300"
            frameBorder="0"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2"> Logs from Namespace `default`</h2>
          <iframe
            src="http://localhost:3001/d-solo/loki-logs/loki-logs-dashboard?orgId=1&panelId=1&refresh=30s"
            width="100%"
            height="300"
            frameBorder="0"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2"> Active Alerts</h2>
          <iframe
            src="http://localhost:3001/d-solo/alerts/alerts-overview?orgId=1&panelId=0&refresh=30s"
            width="100%"
            height="300"
            frameBorder="0"
          />
        </div>
      </div>
    </Layout>
  )
}
