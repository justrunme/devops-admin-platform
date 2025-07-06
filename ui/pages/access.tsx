import Layout from "@/components/Layout";

export default function AccessPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6"> Access Information</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Service</th>
            <th className="px-4 py-2 border">URL / Host</th>
            <th className="px-4 py-2 border">Login Info</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr>
            <td className="border px-4 py-2">DevOps UI</td>
            <td className="border px-4 py-2">http://localhost:3000</td>
            <td className="border px-4 py-2">—</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Grafana</td>
            <td className="border px-4 py-2">http://grafana.localhost</td>
            <td className="border px-4 py-2">admin / (see below)</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Prometheus</td>
            <td className="border px-4 py-2">http://prometheus.localhost</td>
            <td className="border px-4 py-2">—</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">API</td>
            <td className="border px-4 py-2">http://localhost:8080</td>
            <td className="border px-4 py-2">—</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">PostgreSQL</td>
            <td className="border px-4 py-2">postgres-service:5432</td>
            <td className="border px-4 py-2">admin / yourpassword</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Redis</td>
            <td className="border px-4 py-2">redis-master:6379</td>
            <td className="border px-4 py-2">—</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 p-4 bg-gray-50 rounded-md shadow">
        <h2 className="font-semibold mb-2"> Grafana Password (CLI)</h2>
        <code className="text-xs block bg-white p-2 rounded border">
          {`kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode`}
        </code>
      </div>
    </Layout>
  );
}
