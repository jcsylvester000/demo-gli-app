import { RegMark } from "@/components/brand/print-marks";

export function MarkList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={columns === 2 ? "grid gap-x-8 gap-y-3 sm:grid-cols-2" : "space-y-3"}>
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <RegMark className="mt-1 shrink-0 text-gli-signal" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
