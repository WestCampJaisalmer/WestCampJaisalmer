"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ItineraryDay } from "@/lib/resources";

export default function ItineraryField({ name, label, initial = [] }: { name: string; label: string; initial?: ItineraryDay[] }) {
  const [days, setDays] = useState<ItineraryDay[]>(initial);

  const set = (i: number, patch: Partial<ItineraryDay>) => setDays((d) => d.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, dir: -1 | 1) =>
    setDays((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.length) return d;
      const n = [...d];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  return (
    <div>
      <label className="adm-label">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(days)} />
      <div className="space-y-3">
        {days.map((d, i) => (
          <div key={i} className="rounded-sm border border-border-light bg-cream/60 p-3">
            <div className="mb-2 flex items-center gap-2">
              <input
                value={d.day}
                onChange={(e) => set(i, { day: e.target.value })}
                placeholder={`Day ${i + 1}`}
                aria-label={`Day ${i + 1} label`}
                className="adm-input !w-24 !py-1.5 text-xs font-bold"
              />
              <input
                value={d.title}
                onChange={(e) => set(i, { title: e.target.value })}
                placeholder="Title, e.g. Golden Fort & Haveli Heritage"
                aria-label={`Day ${i + 1} title`}
                className="adm-input !py-1.5"
              />
              <div className="flex shrink-0">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="cursor-pointer rounded-sm p-1.5 text-text-muted hover:bg-white disabled:opacity-30" aria-label="Move day up"><ArrowUp size={15} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === days.length - 1} className="cursor-pointer rounded-sm p-1.5 text-text-muted hover:bg-white disabled:opacity-30" aria-label="Move day down"><ArrowDown size={15} /></button>
                <button type="button" onClick={() => setDays((x) => x.filter((_, j) => j !== i))} className="cursor-pointer rounded-sm p-1.5 text-red-500 hover:bg-white" aria-label="Remove day"><Trash2 size={15} /></button>
              </div>
            </div>
            <textarea
              value={d.desc}
              onChange={(e) => set(i, { desc: e.target.value })}
              rows={2}
              placeholder="What happens on this day?"
              aria-label={`Day ${i + 1} description`}
              className="adm-input text-[13px]"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setDays((d) => [...d, { day: `Day ${d.length + 1}`, title: "", desc: "" }])}
        className="adm-btn-ghost adm-btn-sm mt-3"
      >
        <Plus size={14} /> Add day
      </button>
    </div>
  );
}
