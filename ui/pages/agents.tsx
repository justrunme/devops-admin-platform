import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { FaUserShield, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // summary
  const onlineCount = agents.filter(a => a.online).length;
  const offlineCount = agents.length - onlineCount;

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
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow">Agents</h1>
      <div className="overflow-x-auto rounded-xl shadow-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-pink-400 dark:from-blue-900 dark:to-indigo-900 p-6 mb-6">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-blue-900/60">
            <tr>
              <th className="p-3 text-left">Hostname</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Uptime</th>
              <th className="p-3 text-left">OS</th>
              <th className="p-3 text-left">Last Seen</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* ... твои реальные данные ... */}
          </tbody>
        </table>
      </div>
      {/* ... остальной контент ... */}
    </Layout>
  )
}