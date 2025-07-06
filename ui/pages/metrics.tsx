import Link from "next/link";

export default function MetricsPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold"> Cluster Metrics</h1>

      {/* Кнопка для перехода в Grafana */}
      <a
        href="http://localhost:3000/grafana"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "10px 16px",
          backgroundColor: "#1f2937",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
         Open Grafana Dashboard
      </a>

      {/* Сюда можно добавить embedded панели потом */}
    </div>
  );
}