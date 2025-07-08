import Layout from '../components/Layout'
import { useEffect, useState } from "react";
import { FaServer, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type Node = {
  metadata: { name: string; uid: string };
  status: {
    conditions: Array<{ type: string; status: string }>;
    nodeInfo: { osImage: string; kubeletVersion: string };
    capacity: { cpu: string; memory: string };
  };
};

const COLORS = ["#22c55e", "#ef4444"];

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

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // summary
  const readyCount = nodes.filter(node =>
    node.status.conditions.find(cond => cond.type === "Ready")?.status === "True"
  ).length;
  const notReadyCount = nodes.length - readyCount;

  const pieData = [
    { name: "Ready", value: readyCount },
    { name: "Not Ready", value: notReadyCount }
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow">Cluster Nodes</h1>
      {/* summary, графики и т.д. — просто с padding и shadow, но без bg-gradient */}
      {/* Таблица — только скругление, тень, padding, НО без bg-gradient! */}
      <div className="overflow-x-auto rounded-xl shadow-xl bg-white/10 dark:bg-white/10 p-6 mb-6">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-blue-900/60">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Version</th>
              <th className="p-3 text-left">CPU</th>
              <th className="p-3 text-left">Memory</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(node => (
              <tr key={node.metadata.name} className="border-b border-blue-200/30">
                <td className="p-3">{node.metadata.name}</td>
                <td className={`p-3 font-semibold ${node.status.conditions.find(cond => cond.type === "Ready")?.status === "True" ? 'text-green-200' : 'text-red-200'}`}>
                  {node.status.conditions.find(cond => cond.type === "Ready")?.status === "True" ? "Ready" : "Not Ready"}
                </td>
                <td className="p-3">{node.status.nodeInfo.kubeletVersion}</td>
                <td className="p-3">{node.status.capacity.cpu}</td>
                <td className="p-3">{node.status.capacity.memory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : nodes.length === 0 ? (
        <p>No nodes found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-pink-400 dark:from-blue-900 dark:to-indigo-900 p-6">
          <table className="min-w-full text-sm text-white">
            <thead>
              <tr className="bg-blue-900/60">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Version</th>
                <th className="p-3 text-left">CPU</th>
                <th className="p-3 text-left">Memory</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(node => (
                <tr key={node.metadata.name} className="border-b border-blue-200/30">
                  <td className="p-3">{node.metadata.name}</td>
                  <td className={`p-3 font-semibold ${node.status.conditions.find(cond => cond.type === "Ready")?.status === "True" ? 'text-green-200' : 'text-red-200'}`}>
                    {node.status.conditions.find(cond => cond.type === "Ready")?.status === "True" ? "Ready" : "Not Ready"}
                  </td>
                  <td className="p-3">{node.status.nodeInfo.kubeletVersion}</td>
                  <td className="p-3">{node.status.capacity.cpu}</td>
                  <td className="p-3">{node.status.capacity.memory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}