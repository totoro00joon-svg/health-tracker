import { Search } from 'lucide-react';
import { STRENGTH_EXERCISES } from '../data/exercises';

export default function Filters({ filters, setFilters }) {
  function update(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <section className="card">
      <div className="mb-4 flex items-center gap-2">
        <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">기록 조회</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <input className="input" type="date" value={filters.date} onChange={(event) => update('date', event.target.value)} />
        <select className="input" value={filters.type} onChange={(event) => update('type', event.target.value)}>
          <option value="all">전체 타입</option>
          <option value="cardio">유산소</option>
          <option value="strength">근력</option>
        </select>
        <select className="input" value={filters.bodyPart} onChange={(event) => update('bodyPart', event.target.value)}>
          <option value="all">전체 부위</option>
          {Object.entries(STRENGTH_EXERCISES).map(([key, item]) => (
            <option key={key} value={key}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="search"
          value={filters.query}
          placeholder="운동명, 메모 검색"
          onChange={(event) => update('query', event.target.value)}
        />
      </div>
    </section>
  );
}
