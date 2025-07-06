import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

interface Agent {
  hostname: string
  uptime: number
  os: string
  last_seen: string
  online: boolean
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('/api/agents')
        const data = await res.json()
        setAgents(data.map((agent: any) => ({
          ...agent,
          online: (new Date().getTime() - new Date(agent.last_seen).getTime()) < (1 * 60 * 1000) // Online if last seen within 1 minute
        })))
      } catch (err) {
        console.error('Failed to fetch agents', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
    const interval = setInterval(fetchAgents, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [])

  const reboot = async (hostname: string) => {
    if (confirm(`Are you sure you want to reboot agent ${hostname}?`)) {
      try {
        await fetch(`/api/agent/${hostname}/reboot`, { method: 'POST' })
        alert(`Reboot scheduled for agent ${hostname}`)
      } catch (error) {
        console.error('Failed to reboot agent', error)
        alert(`Failed to schedule reboot for agent ${hostname}`)
      }
    }
  }

  const disable = async (hostname: string) => {
    if (confirm(`Are you sure you want to disable agent ${hostname}?`)) {
      try {
        await fetch(`/api/agent/${hostname}/disable`, { method: 'POST' })
        alert(`Agent ${hostname} disabled`)
      } catch (error) {
        console.error('Failed to disable agent', error)
        alert(`Failed to disable agent ${hostname}`)
      }
    }
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">️ Agent List</h1>

        {loading ? (
          <p className="text-gray-500">Loading agents...</p>
        ) : agents.length === 0 ? (
          <p>No agents found.</p>
        ) : (
          <table className="min-w-full border border-gray-300 rounded shadow">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Hostname</th>
                <th className="p-3">Status</th>
                <th className="p-3">Uptime</th>
                <th className="p-3">OS</th>
                <th className="p-3">Last Seen</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.hostname} className="border-t hover:bg-gray-50">
                  <td className="p-3">{agent.hostname}</td>
                  <td className="p-3">
                    <span className={`font-semibold ${agent.online ? 'text-green-600' : 'text-gray-500'}`}>
                      ● {agent.online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="p-3">{Math.floor(agent.uptime / 60)} min</td>
                  <td className="p-3">{agent.os}</td>
                  <td className="p-3 text-sm text-gray-500">{new Date(agent.last_seen).toLocaleString()}</td>
                  <td className="p-3">
                    <button
                    onClick={() => reboot(agent.hostname)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                  >
                    Reboot
                  </button>
                  <button
                    onClick={() => disable(agent.hostname)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Disable
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}