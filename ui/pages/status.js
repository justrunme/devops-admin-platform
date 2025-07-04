import { useEffect, useState } from 'react';

export default function StatusPage() {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (res.ok) setStatus('✅ API is healthy');
        else setStatus('❌ API error');
      })
      .catch(() => setStatus('❌ Connection failed'));
  }, []);

  return (
    <main>
      <h1>Status</h1>
      <p>{status}</p>
    </main>
  );
}
