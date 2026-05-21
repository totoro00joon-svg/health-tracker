import { CalendarDays, Dumbbell, HeartPulse, Save, X } from 'lucide-react';
import Field from './Field';
import {
  CARDIO_EXERCISES,
  DEFAULT_CARDIO_FORM,
  DEFAULT_STRENGTH_FORM,
  STRENGTH_EXERCISES,
  WORKOUT_TYPES,
} from '../data/exercises';
import { createWorkoutRecord, updateWorkoutRecord, validateWorkout } from '../utils/workouts';

function numberInputProps({ decimal = true } = {}) {
  return {
    inputMode: 'decimal',
    min: '0',
    step: decimal ? '0.1' : '1',
    onKeyDown: (event) => {
      const blockedKeys = decimal ? ['e', 'E', '+', '-'] : ['e', 'E', '+', '-', '.'];
      if (blockedKeys.includes(event.key)) event.preventDefault();
    },
    onWheel: (event) => event.currentTarget.blur(),
  };
}

export default function WorkoutForm({
  form,
  setForm,
  onSave,
  editingRecord,
  setEditingRecord,
  errors,
  setErrors,
}) {
  const isCardio = form.type === 'cardio';
  const strengthExercises = STRENGTH_EXERCISES[form.bodyPart]?.exercises ?? [];

  function changeType(type) {
    setErrors({});
    setForm(type === 'cardio' ? DEFAULT_CARDIO_FORM : DEFAULT_STRENGTH_FORM);
    setEditingRecord(null);
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  }

  function updateBodyPart(bodyPart) {
    const exercise = STRENGTH_EXERCISES[bodyPart].exercises[0];
    setForm((current) => ({ ...current, bodyPart, exercise }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateWorkout(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const record = editingRecord ? updateWorkoutRecord(editingRecord, form) : createWorkoutRecord(form);
    onSave(record);
  }

  function cancelEdit() {
    setEditingRecord(null);
    setErrors({});
    setForm(form.type === 'cardio' ? DEFAULT_CARDIO_FORM : DEFAULT_STRENGTH_FORM);
  }

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Record</p>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">운동 입력</h2>
        </div>
        <CalendarDays className="h-6 w-6 text-slate-400" aria-hidden="true" />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-950">
        {Object.entries(WORKOUT_TYPES).map(([type, item]) => {
          const active = form.type === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => changeType(type)}
              className={`btn ${active ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {type === 'cardio' ? <HeartPulse className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
              {item.label}
            </button>
          );
        })}
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {isCardio ? (
          <>
            <Field label="운동 종류" error={errors.exercise}>
              <select className="input" value={form.exercise} onChange={(event) => updateField('exercise', event.target.value)}>
                {CARDIO_EXERCISES.map((exercise) => (
                  <option key={exercise}>{exercise}</option>
                ))}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="운동 시간(분)" error={errors.duration}>
                <input
                  className="input"
                  type="number"
                  value={form.duration}
                  onChange={(event) => updateField('duration', event.target.value)}
                  {...numberInputProps({ decimal: false })}
                />
              </Field>
              <Field label="운동 거리(km)" error={errors.distance}>
                <input
                  className="input"
                  type="number"
                  value={form.distance}
                  onChange={(event) => updateField('distance', event.target.value)}
                  {...numberInputProps({ decimal: true })}
                />
              </Field>
            </div>
          </>
        ) : (
          <>
            <Field label="운동 부위" error={errors.bodyPart}>
              <select className="input" value={form.bodyPart} onChange={(event) => updateBodyPart(event.target.value)}>
                {Object.entries(STRENGTH_EXERCISES).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="운동 종류" error={errors.exercise}>
              <select className="input" value={form.exercise} onChange={(event) => updateField('exercise', event.target.value)}>
                {strengthExercises.map((exercise) => (
                  <option key={exercise}>{exercise}</option>
                ))}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="무게(kg)" error={errors.weight}>
                <input
                  className="input"
                  type="number"
                  value={form.weight}
                  onChange={(event) => updateField('weight', event.target.value)}
                  {...numberInputProps({ decimal: true })}
                />
              </Field>
              <Field label="횟수" error={errors.reps}>
                <input
                  className="input"
                  type="number"
                  value={form.reps}
                  onChange={(event) => updateField('reps', event.target.value)}
                  {...numberInputProps({ decimal: false })}
                />
              </Field>
              <Field label="세트 수" error={errors.sets}>
                <input
                  className="input"
                  type="number"
                  value={form.sets}
                  onChange={(event) => updateField('sets', event.target.value)}
                  {...numberInputProps({ decimal: false })}
                />
              </Field>
            </div>
          </>
        )}

        <Field label="운동 날짜" error={errors.date}>
          <input className="input" type="date" value={form.date} onChange={(event) => updateField('date', event.target.value)} />
        </Field>

        <Field label="운동 후 느낌 메모">
          <textarea
            className="input min-h-28 resize-y py-3"
            value={form.memo}
            onChange={(event) => updateField('memo', event.target.value)}
            placeholder="오늘 컨디션, 난이도, 다음에 기억할 점을 적어보세요."
          />
        </Field>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button className={`btn flex-1 text-white ${isCardio ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`} type="submit">
            <Save className="h-4 w-4" />
            {editingRecord ? '수정 저장' : '기록 저장'}
          </button>
          {editingRecord && (
            <button className="btn btn-secondary" type="button" onClick={cancelEdit}>
              <X className="h-4 w-4" />
              취소
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
