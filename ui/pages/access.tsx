import Layout from '../components/Layout';

export default function AccessPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-white drop-shadow">Access Information</h1>
      <div className="overflow-x-auto rounded-xl shadow-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-pink-400 dark:from-blue-900 dark:to-indigo-900 p-6 mb-6">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-blue-900/60">
            <tr>
              <th className="px-4 py-2 border">Service</th>
              <th className="px-4 py-2 border">URL / Host</th>
              <th className="px-4 py-2 border">Login Info</th>
            </tr>
          </thead>
          <tbody>
            {/* ... твои реальные данные ... */}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl shadow-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-pink-400 dark:from-blue-900 dark:to-indigo-900 p-6">
        <h2 className="font-semibold mb-2 text-white">Grafana Password (CLI)</h2>
        <code className="text-xs block bg-white/80 text-gray-800 p-2 rounded border">
          {`kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode`}
        </code>
      </div>
    </Layout>
  );
}
