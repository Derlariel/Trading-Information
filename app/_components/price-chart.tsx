import type { PricePoint } from "@/lib/types";

export function PriceChart({ data, symbol }: { data: PricePoint[]; symbol: string }) {
  if (data.length < 2) return <div className="empty-state">ยังไม่มีข้อมูลราคาสำหรับ {symbol}</div>;

  const width = 760;
  const height = 260;
  const padding = 16;
  const values = data.map((point) => point.close);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coords = values.map((value, index) => ({
    x: padding + (index / (values.length - 1)) * (width - padding * 2),
    y: padding + ((max - value) / range) * (height - padding * 2),
  }));
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;
  const change = ((values.at(-1)! - values[0]) / values[0]) * 100;

  return (
    <figure className="price-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${symbol}-chart-title ${symbol}-chart-desc`}>
        <title id={`${symbol}-chart-title`}>{`กราฟราคาปิดของ ${symbol}`}</title>
        <desc id={`${symbol}-chart-desc`}>{`ราคาเปลี่ยนแปลง ${change.toFixed(2)} เปอร์เซ็นต์ในช่วง ${data.length} วัน`}</desc>
        <defs>
          <linearGradient id={`${symbol}-area`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity=".24" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => <line className="chart-grid" key={ratio} x1="16" x2="744" y1={height * ratio} y2={height * ratio} />)}
        <polygon fill={`url(#${symbol}-area)`} points={area} />
        <polyline className="chart-line" points={line} />
        <circle className="chart-point" cx={coords.at(-1)!.x} cy={coords.at(-1)!.y} r="5" />
      </svg>
      <figcaption>
        <span>{data[0].date}</span>
        <strong className={change >= 0 ? "positive" : "negative"}>{change >= 0 ? "+" : ""}{change.toFixed(2)}%</strong>
        <span>{data.at(-1)!.date}</span>
      </figcaption>
    </figure>
  );
}
