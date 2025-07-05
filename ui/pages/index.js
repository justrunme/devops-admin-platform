import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-10 space-y-6">
      <h1 className="text-4xl font-bold text-blue-700">DevOps Admin Dashboard</h1>
      <p className="text-gray-600 text-lg">Welcome, this is your central management console.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Card title=" System Nodes" description="List and status of cluster nodes" link="/nodes" />
        <Card title=" Metrics" description="Grafana & Prometheus dashboards" link="/metrics" />
        <Card title=" Agents" description="Inventory of connected systems" link="/agents" />
        <Card title=" System Status" description="API health and DB connections" link="/status" />
      </div>
    </main>
  )
}

function Card({ title, description, link }) {
  return (
    <Link href={link} className="block border rounded-xl p-6 hover:shadow-md transition">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500">{description}</p>
    </Link>
  )
}
