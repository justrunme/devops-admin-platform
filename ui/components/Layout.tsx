'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import NavBar from './NavBar'

const navItems = [
  { name: 'Nodes', href: '/nodes' },
  { name: 'Agents', href: '/agents' },
  { name: 'Metrics', href: '/metrics' },
  { name: 'Status', href: '/status' },
  { name: 'Access', href: '/access' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [nodes, setNodes] = useState<any[] | null>(null)

  useEffect(() => {
    // fetch('/api/nodes').then(...)
    setNodes([
      { name: 'node-1', status: 'Ready', version: 'v1.28.0', cpu: '4', mem: '16Gi' },
      // ...
    ])
  }, [])

  if (nodes === null) {
    return <div className="text-center text-white">Загрузка...</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <NavBar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 py-6">{children}</main>
      {nodes.length > 0 ? (
        <div className="overflow-x-auto ...">
          <table>...</table>
        </div>
      ) : (
        <div className="text-center text-white">Загрузка...</div>
      )}
    </div>
  )
}