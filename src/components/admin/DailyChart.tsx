"use client";

import { useId, useRef, useState } from "react";

interface Point {
  day: string; // yyyy-mm-dd
  n: number;
}

const W = 720;
const H = 220;
const PAD = { top: 16, right: 12, bottom: 28, left: 32 };

function niceMax(max: number) {
  if (max <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

const fmt = (iso: string, long = false) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", long ? { weekday: "short", day: "numeric", month: "short" } : { day: "numeric", month: "short" });

export default function DailyChart({ data }: { data: Point[] }) {
  const gid = useId();
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const max = niceMax(Math.max(...data.map((d) => d.n), 1));
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => PAD.top + ih - (v / max) * ih;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.n).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${PAD.top + ih} L${x(0).toFixed(1)},${PAD.top + ih} Z`;
  const ticks = [0, max / 2, max];
  const total = data.reduce((s, d) => s + d.n, 0);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = ref.current!.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.left) / iw) * (data.length - 1));
    setHover(Math.min(data.length - 1, Math.max(0, i)));
  }

  const hp = hover !== null ? data[hover] : null;
  const tipLeft = hover !== null ? Math.min(Math.max((x(hover) / W) * 100, 12), 88) : 0;

  return (
    <div>
      <div className="relative">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-pan-y"
          role="img"
          aria-label={`Enquiries per day over the last ${data.length} days: ${total} in total.`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C97F2C" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#C97F2C" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#EDE5D8" strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#949089">
                {Number.isInteger(t) ? t : t.toFixed(1)}
              </text>
            </g>
          ))}

          {[0, Math.floor((data.length - 1) / 2), data.length - 1].map((i) => (
            <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} fontSize="11" fill="#949089">
              {fmt(data[i].day)}
            </text>
          ))}

          <path d={area} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke="#C97F2C" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {hover !== null && hp && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + ih} stroke="#123038" strokeOpacity="0.25" strokeDasharray="3 3" />
              <circle cx={x(hover)} cy={y(hp.n)} r="5" fill="#C97F2C" stroke="#fff" strokeWidth="2" />
            </g>
          )}
        </svg>

        {hp && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-sm bg-deep-teal px-3 py-2 text-xs text-white shadow-card"
            style={{ left: `${tipLeft}%` }}
          >
            <p className="text-white/70">{fmt(hp.day, true)}</p>
            <p className="font-bold">
              {hp.n} {hp.n === 1 ? "enquiry" : "enquiries"}
            </p>
          </div>
        )}
      </div>

      <details className="mt-2 text-xs text-text-muted">
        <summary className="cursor-pointer select-none font-semibold hover:text-deep-teal">View as table</summary>
        <div className="mt-2 max-h-48 overflow-auto rounded-sm border border-border-light">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-cream-alt">
              <tr>
                <th className="px-3 py-1.5">Date</th>
                <th className="px-3 py-1.5 text-right">Enquiries</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.day} className="border-t border-border-light">
                  <td className="px-3 py-1.5">{fmt(d.day, true)}</td>
                  <td className="px-3 py-1.5 text-right font-semibold text-text-main">{d.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
