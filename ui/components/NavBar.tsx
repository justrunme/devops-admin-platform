import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaBars } from 'react-icons/fa'

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/nodes', label: 'Ноды' },
  { href: '/agents', label: 'Агенты' },
  { href: '/logs', label: 'Логи' },
  { href: '/metrics', label: 'Метрики' },
  { href: '/alerts', label: 'Алерты' },
  { href: '/status', label: 'Статус' },
]

export default function NavBar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const isHome = router.pathname === '/'

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-blue-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          {!isHome && (
            <button
              onClick={() => router.back()}
              className="mr-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring"
              aria-label="Назад"
            >
              ← Назад
            </button>
          )}
          <span className="font-bold text-lg text-blue-700 dark:text-blue-300">DevOps Admin</span>
        </div>
        <div className="hidden sm:flex gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                px-3 py-1 rounded
                hover:bg-blue-100 dark:hover:bg-blue-800
                text-gray-900 dark:text-white
                ${router.pathname === link.href ? 'bg-blue-200 dark:bg-blue-700 font-semibold' : ''}
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          className="sm:hidden p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-800 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700"
          aria-label="Открыть меню"
          onClick={() => setOpen(!open)}
        >
          <FaBars size={22} />
        </button>
      </div>
      {open && (
        <div className="sm:hidden flex flex-col gap-2 px-4 pb-2 bg-white dark:bg-gray-900 border-t border-blue-200 dark:border-gray-700">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                px-3 py-2 rounded
                hover:bg-blue-100 dark:hover:bg-blue-800
                text-gray-900 dark:text-white
                ${router.pathname === link.href ? 'bg-blue-200 dark:bg-blue-700 font-semibold' : ''}
              `}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
} 