// ui/pages/api/logs.ts
import type { NextApiRequest, NextApiResponse } from 'next'

const LOKI_URL = 'http://loki:3100/loki/api/v1/query_range'
const DEFAULT_QUERY = '{app="api"}'
const DEFAULT_LIMIT = 100

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query = req.query.query || DEFAULT_QUERY
    const limit = req.query.limit || DEFAULT_LIMIT

    const url = `${LOKI_URL}?query=${encodeURIComponent(query as string)}&limit=${limit}`

    const lokiRes = await fetch(url)
    const data = await lokiRes.json()

    const logs = data?.data?.result?.[0]?.values?.map(([timestamp, message]: [string, string]) => ({
      time: new Date(Number(timestamp) / 1e6).toISOString(),
      message,
      source: 'api'
    })) || []

    res.status(200).json({ logs })
  } catch (err) {
    console.error('Loki fetch failed', err)
    res.status(500).json({ error: 'Failed to fetch logs from Loki' })
  }
}
