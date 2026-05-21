import { Activity, Dumbbell, Footprints, ListChecks } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SectionHeader from './SectionHeader';
import { STRENGTH_EXERCISES } from '../data/exercises';
import { getDashboardStats } from '../utils/workouts';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <Icon className={`h-5 w-5 ${accent}`} aria-hidden="true" />
      </div>
      <p className="text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

export default function Dashboard({ records }) {
  const stats = getDashboardStats(records);

  return (
    <section className="card">
      <SectionHeader eyebrow="Dashboard" title="운동 요약" />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Footprints} label="총 유산소 거리" value={`${stats.totalCardioDistance.toFixed(1)} km`} accent="text-blue-500" />
        <StatCard icon={ListChecks} label="총 운동 횟수" value={`${stats.totalWorkoutCount}회`} accent="text-slate-500" />
        <StatCard icon={Activity} label="최근 7일 운동" value={`${stats.recentSevenDayCount}회`} accent="text-emerald-500" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Dumbbell className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            부위별 근력 운동 횟수
          </h3>
          <div className="grid gap-2">
            {Object.entries(STRENGTH_EXERCISES).map(([key, item]) => (
              <div key={key} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                <span className="pill bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {stats.strengthByBodyPart[key]}회
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-64">
          <h3 className="mb-3 text-base font-bold text-slate-900 dark:text-white">주간 운동 현황</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbe3ef" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.18)' }} />
                <Bar dataKey="count" name="운동 횟수" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
