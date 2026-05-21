import { Download, Pencil, Trash2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { DEFAULT_CARDIO_FORM, DEFAULT_STRENGTH_FORM } from '../data/exercises';
import { exportRecordsToCsv, formatBodyPart } from '../utils/workouts';

function toForm(record) {
  if (record.type === 'cardio') {
    return {
      ...DEFAULT_CARDIO_FORM,
      exercise: record.exercise,
      duration: String(record.duration),
      distance: String(record.distance),
      memo: record.memo,
      date: record.date,
    };
  }

  return {
    ...DEFAULT_STRENGTH_FORM,
    bodyPart: record.bodyPart,
    exercise: record.exercise,
    weight: String(record.weight),
    reps: String(record.reps),
    sets: String(record.sets),
    memo: record.memo,
    date: record.date,
  };
}

export default function RecordList({ records, allRecords, onDelete, setForm, setEditingRecord }) {
  function editRecord(record) {
    setEditingRecord(record);
    setForm(toForm(record));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="card">
      <SectionHeader eyebrow="History" title={`운동 기록 ${records.length}개`}>
        <button
          className="btn btn-secondary w-full sm:w-auto"
          type="button"
          onClick={() => exportRecordsToCsv(allRecords)}
          disabled={allRecords.length === 0}
          title={allRecords.length === 0 ? '내보낼 기록이 없습니다.' : '전체 기록을 CSV로 다운로드'}
        >
          <Download className="h-4 w-4" />
          CSV 내보내기
        </button>
      </SectionHeader>

      {allRecords.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          아직 저장된 운동 기록이 없습니다.
        </div>
      )}

      {allRecords.length > 0 && records.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          현재 조회 조건에 맞는 기록이 없습니다.
        </div>
      )}

      <div className="grid gap-3">
        {records.map((record) => {
          const isCardio = record.type === 'cardio';
          return (
            <article
              key={record.id}
              className={`rounded-lg border p-4 ${
                isCardio
                  ? 'border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/30'
                  : 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30'
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`pill ${isCardio ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {isCardio ? '유산소' : '근력'}
                    </span>
                    {!isCardio && (
                      <span className="pill bg-white text-emerald-700 dark:bg-slate-900 dark:text-emerald-300">
                        {formatBodyPart(record.bodyPart)}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{record.date}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">{record.exercise}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {isCardio
                      ? `${record.duration}분 · ${record.distance}km`
                      : `${record.weight}kg · ${record.reps}회 · ${record.sets}세트`}
                  </p>
                  {record.memo && <p className="mt-2 break-words text-sm text-slate-600 dark:text-slate-300">{record.memo}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:min-w-32">
                  <button className="btn btn-secondary" type="button" onClick={() => editRecord(record)}>
                    <Pencil className="h-4 w-4" />
                    수정
                  </button>
                  <button className="btn btn-danger" type="button" onClick={() => onDelete(record.id)}>
                    <Trash2 className="h-4 w-4" />
                    삭제
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
