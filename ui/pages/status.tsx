// ui/pages/status.tsx

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

type ComponentStatus = {
  name: string;
  status: string;
  link: string;
  category: string;
};

export default function StatusPage() {
  const [components, setComponents] = useState<ComponentStatus[]>([]);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setComponents(data.components || []));
  }, []);

  // Получаем уникальные категории
  const categorySet = new Set<string>(components.map(c => c.category));
  const categories = Array.from(categorySet); // Вместо [...new Set(...)] — чтобы не ругался TypeScript

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4"> System Status</h1>
      {categories.map(category => (
        <div key={category} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{category}</h2>
          <ul className="border rounded p-4 shadow">
            {components
              .filter(c => c.category === category)
              .map(component => (
                <li key={component.name} className="flex justify-between py-1">
                  <span>{component.name}</span>
                  <span
                    className={`font-semibold ${
                      component.status === 'Healthy'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {component.status}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </Layout>
  );
}