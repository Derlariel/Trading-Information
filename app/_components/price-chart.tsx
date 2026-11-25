import type { PricePoint } from "@/lib/types";
import { formatCompact } from "@/lib/format";

export function PriceChart({ data, symbol }: { data: PricePoint[]; symbol: string }) {
  if (data.length < 2) return <div className="empty-state">ยังไม่มีข้อมูลราคาสำหรับ {symbol}</div>;

  const width = 760;
  const height = 320;
  const padding = 24;
  const priceBottom = 232;
  const values = data.map((point) => point.close);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coords = values.map((value, index) => ({
    x: padding + (index / (values.length - 1)) * (width - padding * 2),
    y: padding + ((max - value) / range) * (priceBottom - padding * 2),
  }));
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padding},${priceBottom} ${line} ${width - padding},${priceBottom}`;
  const change = ((values.at(-1)! - values[0]) / values[0]) * 100;
  const maxVolume = Math.max(...data.map((point) => point.volume));
  const latest = data.at(-1)!;

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
        {[0.25, 0.5, 0.75].map((ratio) => <line className="chart-grid" key={ratio} x1="24" x2="736" y1={priceBottom * ratio} y2={priceBottom * ratio} />)}
        <polygon fill={`url(#${symbol}-area)`} points={area} />
        {data.map((point, index) => {
          const barWidth = Math.max(2, (width - padding * 2) / data.length - 3);
          const barHeight = (point.volume / maxVolume) * 55;
          return <rect className="volume-bar" key={point.date} x={padding + index * ((width - padding * 2) / data.length)} y={height - padding - barHeight} width={barWidth} height={barHeight} />;
        })}
        <polyline className="chart-line" points={line} />
        <circle className="chart-point" cx={coords.at(-1)!.x} cy={coords.at(-1)!.y} r="5" />
        <text className="chart-price-label" x={width - padding} y={coords.at(-1)!.y - 10} textAnchor="end">{latest.close.toFixed(2)}</text>
      </svg>
      <figcaption>
        <span>{data[0].date}</span>
        <strong className={change >= 0 ? "positive" : "negative"}>{change >= 0 ? "+" : ""}{change.toFixed(2)}%</strong>
        <span>{data.at(-1)!.date}</span>
      </figcaption>
      <div className="ohlc-strip" aria-label="ราคาวันล่าสุด">
        <span>O <b>{latest.open.toFixed(2)}</b></span><span>H <b className="positive">{latest.high.toFixed(2)}</b></span><span>L <b className="negative">{latest.low.toFixed(2)}</b></span><span>C <b>{latest.close.toFixed(2)}</b></span><span>VOL <b>{formatCompact(latest.volume)}</b></span>
      </div>
    </figure>
  );
}
