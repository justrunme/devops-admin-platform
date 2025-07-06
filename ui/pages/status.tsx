import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from '../components/Layout';

type Component = {
  name: string;
  status: string;
  link: string;
  category: string;
};

export default function StatusPage() {
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setComponents(data));
  }, []);

  const categories = [...new Set(components.map(c => c.category))];

  return (
    <Layout>
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6"> System Status Dashboard</h1>
        {categories.map(category => (
          <div key={category} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {components.filter(c => c.category === category).map((comp, idx) => (
                <div key={idx} className="border rounded-xl p-4 shadow-sm bg-white">
                  <div className="flex justify-between">
                    <span className="font-medium">{comp.name}</span>
                    <span>{comp.status}</span>
                  </div>
                  <a
                    href={comp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline mt-1 inline-block"
                  >
                    {comp.link}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
