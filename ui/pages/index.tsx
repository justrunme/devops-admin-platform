import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>DevOps Admin Panel</title>
      </Head>
      <main className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800"> DevOps Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Nodes */}
          <Link href="/nodes" className="block p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2"> Cluster Nodes</h2>
            <p className="text-gray-600">View all Kubernetes nodes in the cluster.</p>
          </Link>

          {/* Agents */}
          <Link href="/agents" className="block p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2"> Agents</h2>
            <p className="text-gray-600">Manage agents and see their status.</p>
          </Link>

          {/* Logs */}
          <Link href="/logs" className="block p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2"> Logs</h2>
            <p className="text-gray-600">View recent logs from the system.</p>
          </Link>

          {/* Metrics */}
          <Link href="/metrics" className="block p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2"> Metrics</h2>
            <p className="text-gray-600">Monitor CPU, memory, and other metrics.</p>
          </Link>

          {/* Alerts */}
          <Link href="/alerts" className="block p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2"> Alerts</h2>
            <p className="text-gray-600">Check current alerts from Alertmanager.</p>
          </Link>

          {/* Status */}
          <Link href="/status" className="block p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2"> System Status</h2>
            <p className="text-gray-600">Check health of services and components.</p>
          </Link>

        </div>

        {/* Grafana iframe (optional preview) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800"> Quick View: Cluster Dashboard</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="http://localhost:3000/d/YOUR_DASHBOARD_UID/k8s-cluster-overview?orgId=1&refresh=30s&kiosk"
              width="100%"
              height="500"
              frameBorder="0"
              className="rounded-xl border shadow"
              allowFullScreen
            />
          </div>
        </div>
      </main>
    </>
  );
}