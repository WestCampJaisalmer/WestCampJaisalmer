"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function TagsField({
  name, label, initial = [], help, placeholder = "Type and press Enter",
}: { name: string; label: string; initial?: string[]; help?: string; placeholder?: string }) {
  const [tags, setTags] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    setTags((t) => [...t, ...parts.filter((p) => !t.includes(p))].slice(0, 50));
    setDraft("");
  };

  return (
    <div>
      <label htmlFor={`${name}-input`} className="adm-label">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
      <div className="flex flex-wrap gap-2 rounded-sm border border-[#DDD2BF] bg-white p-2 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/25">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-cream-alt py-1 pl-3 pr-1.5 text-xs font-semibold text-deep-teal">
            {t}
            <button
              type="button"
              onClick={() => setTags((x) => x.filter((y) => y !== t))}
              className="cursor-pointer rounded-full p-0.5 text-text-muted hover:bg-white hover:text-red-600"
              aria-label={`Remove ${t}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={`${name}-input`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && tags.length) {
              setTags((t) => t.slice(0, -1));
            }
          }}
          onBlur={() => add(draft)}
          placeholder={tags.length ? "" : placeholder}
          className="min-w-[140px] flex-1 bg-transparent px-1.5 py-1 text-sm outline-none placeholder:text-text-light"
        />
      </div>
      {help && <p className="adm-help">{help}</p>}
    </div>
  );
}
