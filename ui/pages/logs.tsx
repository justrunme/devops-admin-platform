import { useEffect, useState } from 'react'

interface LogEntry {
  time: string
  message: string
  source: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs')
        const data = await res.json()
        setLogs(data.logs)
      } catch (err) {
        console.error('Failed to fetch logs', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1> Application Logs</h1>
      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Source</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td style={tdStyle}>{log.time}</td>
                <td style={tdStyle}>{log.message}</td>
                <td style={tdStyle}>{log.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const thStyle = {
  textAlign: 'left' as const,
  padding: '8px',
  borderBottom: '2px solid #ccc',
  background: '#f0f0f0'
}

const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #eee'
}