import Layout from '../components/Layout'
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <div className="p-10 space-y-8">
        <h1 className="text-4xl font-bold">⚙️ DevOps Admin Panel</h1>
        <p className="text-gray-600">A real dashboard to manage and monitor your Kubernetes cluster.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Card title="️ Nodes" description="List all cluster nodes" link="/nodes" />
          <Card title=" Metrics" description="View CPU/Memory usage & logs" link="/metrics" />
          <Card title=" Deployments" description="ArgoCD applications and sync status" link="/deployments" />
          <Card title=" System Info" description="Agent & DB status" link="/system" />
          <Card title=" Logs" description="Access logs from Loki" link="/logs" />
          <Card title=" Database" description="View stored agents & Redis state" link="/database" />
        </div>
      </div>
    </Layout>
  );
}

function Card({ title, description, link }: { title: string, description: string, link: string }) {
  return (
    <Link href={link}>
      <div className="border rounded-2xl p-6 hover:shadow-xl transition cursor-pointer">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-500 text-sm mt-2">{description}</p>
      </div>
    </Link>
  );
}
