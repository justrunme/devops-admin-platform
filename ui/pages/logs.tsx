import Link from "next/link";

export default function LogsPage() {
  return (
    <div className="p-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold"> Real-Time Logs</h1>
        <p className="text-gray-600 mb-4">Container logs from Loki + Grafana</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Grafana Logs Dashboard"
            description="Open full Grafana dashboard"
            url="http://localhost:3001"
          />
          <MetricCard
            title="Loki"
            description="Explore raw logs in Prometheus stack"
            url="http://localhost:3100"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold"> Embedded Log View</h2>

        <div className="border rounded-xl overflow-hidden shadow-lg">
          <div className="bg-gray-100 px-4 py-2 font-semibold">Agent Logs (last 1 hour)</div>
          <iframe
            src="http://localhost:3001/d-solo/f1eaaaef-b409-42fc-a69c-eefbe177dff3/loki-logs-dashboard?orgId=1&from=now-1h&to=now&theme=light&panelId=1"
            width="100%"
            height="300"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <Link href={url} target="_blank">
      <div className="border p-6 rounded-2xl hover:shadow-xl transition cursor-pointer">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-500 mt-2">{description}</p>
      </div>
    </Link>
  );
}
