import { Moon, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import Filters from './components/Filters';
import RecordList from './components/RecordList';
import WorkoutForm from './components/WorkoutForm';
import { DEFAULT_CARDIO_FORM, DEFAULT_STRENGTH_FORM } from './data/exercises';
import { loadRecords, saveRecords } from './utils/storage';
import { getFilteredRecords } from './utils/workouts';

export default function App() {
  const [records, setRecords] = useState(() => loadRecords());
  const [form, setForm] = useState(DEFAULT_CARDIO_FORM);
  const [errors, setErrors] = useState({});
  const [editingRecord, setEditingRecord] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('workout-dark-mode') === 'true');
  const [filters, setFilters] = useState({
    date: '',
    type: 'all',
    bodyPart: 'all',
    query: '',
  });

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('workout-dark-mode', String(darkMode));
  }, [darkMode]);

  const filteredRecords = useMemo(() => getFilteredRecords(records, filters), [records, filters]);

  function saveRecord(record) {
    setRecords((current) => {
      const exists = current.some((item) => item.id === record.id);
      return exists ? current.map((item) => (item.id === record.id ? record : item)) : [record, ...current];
    });
    setEditingRecord(null);
    setErrors({});
    const defaultForm = record.type === 'strength' ? DEFAULT_STRENGTH_FORM : DEFAULT_CARDIO_FORM;
    setForm({ ...defaultForm, date: new Date().toISOString().slice(0, 10) });
  }

  function deleteRecord(id) {
    const shouldDelete = confirm('이 운동 기록을 삭제할까요?');
    if (!shouldDelete) return;

    setRecords((current) => current.filter((record) => record.id !== id));
    if (editingRecord?.id === id) {
      setEditingRecord(null);
      setForm(DEFAULT_CARDIO_FORM);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Workout Manager</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">매일 운동 기록</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              유산소와 근력 운동을 나누어 입력하고, 날짜와 부위별로 누적 기록을 확인하세요.
            </p>
          </div>
          <button className="btn btn-secondary self-start sm:self-center" type="button" onClick={() => setDarkMode((value) => !value)}>
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {darkMode ? '라이트모드' : '다크모드'}
          </button>
        </header>

        <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
          <WorkoutForm
            form={form}
            setForm={setForm}
            onSave={saveRecord}
            editingRecord={editingRecord}
            setEditingRecord={setEditingRecord}
            errors={errors}
            setErrors={setErrors}
          />

          <div className="grid gap-5">
            <Dashboard records={records} />
            <Filters filters={filters} setFilters={setFilters} />
            <RecordList
              records={filteredRecords}
              allRecords={records}
              onDelete={deleteRecord}
              setForm={setForm}
              setEditingRecord={setEditingRecord}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
