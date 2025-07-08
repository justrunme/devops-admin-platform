// ui/pages/status.tsx

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { FaHeartbeat, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type ComponentStatus = {
  name: string;
  status: string;
  link: string;
  category: string;
};

export default function Status() {
  // Пример данных, замени на реальные
  const status = { health: 'Healthy', updated: '2024-07-08 12:00' };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-white drop-shadow">Cluster Status</h1>
      <div className="rounded-xl shadow-xl bg-gradient-to-br from-green-400 via-blue-400 to-blue-600 dark:from-green-900 dark:to-blue-900 p-8 text-white text-center mb-6">
        <div className="text-3xl font-bold mb-2">{status.health}</div>
        <div className="text-sm">Last updated: {status.updated}</div>
      </div>
    </Layout>
  );
}