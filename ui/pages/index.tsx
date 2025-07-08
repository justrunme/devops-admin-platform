import Layout from '../components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import { FaServer, FaUserShield, FaClipboardList, FaChartBar, FaBell, FaHeartbeat } from "react-icons/fa";

export default function Home() {
  const cards = [
    {
      href: "/nodes",
      icon: <FaServer className="text-white text-3xl mb-2 drop-shadow" />,
      title: "Cluster Nodes",
      desc: "View all Kubernetes nodes in the cluster.",
    },
    {
      href: "/agents",
      icon: <FaUserShield className="text-white text-3xl mb-2 drop-shadow" />,
      title: "Agents",
      desc: "Manage connected agents and their status.",
    },
    {
      href: "/logs",
      icon: <FaClipboardList className="text-white text-3xl mb-2 drop-shadow" />,
      title: "Logs",
      desc: "Browse and search cluster logs.",
    },
    {
      href: "/metrics",
      icon: <FaChartBar className="text-white text-3xl mb-2 drop-shadow" />,
      title: "Metrics",
      desc: "Monitor cluster metrics and trends.",
    },
    {
      href: "/alerts",
      icon: <FaBell className="text-white text-3xl mb-2 drop-shadow" />,
      title: "Alerts",
      desc: "View and manage alerts.",
    },
    {
      href: "/status",
      icon: <FaHeartbeat className="text-white text-3xl mb-2 drop-shadow" />,
      title: "Status",
      desc: "Cluster health and status overview.",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>DevOps Admin Panel</title>
      </Head>
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold mb-2 text-white drop-shadow">DevOps Admin Panel</h1>
        <p className="text-gray-200 mb-8">Welcome! Monitor and manage your infrastructure in one place.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map(card => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl shadow-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-pink-500 dark:from-blue-900 dark:to-indigo-900 p-6 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="mb-2">{card.icon}</div>
            <div className="font-bold text-lg mb-1 text-white drop-shadow">{card.title}</div>
            <div className="text-white/90 text-sm text-center">{card.desc}</div>
          </Link>
        ))}
      </div>
      <section className="mt-8">
        <h2 className="font-bold text-xl mb-2 text-white">Quick View: Cluster Dashboard</h2>
        <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 p-8 text-center text-gray-400 dark:text-gray-500">
          Здесь будет график или внешний дашборд
        </div>
      </section>
      <div className="overflow-x-auto">
        <table className="min-w-full ...">...</table>
      </div>
    </Layout>
  )
}