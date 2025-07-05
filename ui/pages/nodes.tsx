import { useEffect, useState } from "react";

type Node = {
  metadata: { name: string; uid: string };
  status: {
    conditions: Array<{ type: string; status: string }>;
    nodeInfo: { osImage: string; kubeletVersion: string };
    capacity: { cpu: string; memory: string };
  };
};

export default function Nodes() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchNodes() {
      try {
        const response = await fetch("/api/nodes");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNodes(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchNodes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">️ Cluster Nodes</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : nodes.length === 0 ? (
        <p>No nodes found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Node Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">OS Image</th>
              <th className="p-3">Kubelet Version</th>
              <th className="p-3">CPU (Cores)</th>
              <th className="p-3">Memory (MiB)</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr key={node.metadata.uid} className="border-t hover:bg-gray-50">
                <td className="p-3">{node.metadata.name}</td>
                <td className="p-3">
                  {node.status.conditions.find(
                    (cond) => cond.type === "Ready"
                  )?.status === "True" ? (
                    <span className="text-green-600 font-semibold">Ready</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Not Ready</span>
                  )}
                </td>
                <td className="p-3">{node.status.nodeInfo.osImage}</td>
                <td className="p-3">{node.status.nodeInfo.kubeletVersion}</td>
                <td className="p-3">{node.status.capacity.cpu}</td>
                <td className="p-3">
                  {parseInt(node.status.capacity.memory) / (1024 * 1024)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
