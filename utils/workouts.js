import { STRENGTH_EXERCISES, WORKOUT_TYPES } from '../data/exercises';

export function createWorkoutRecord(form) {
  const base = {
    id: crypto.randomUUID(),
    type: form.type,
    exercise: form.exercise,
    memo: form.memo.trim(),
    date: form.date,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (form.type === 'cardio') {
    return {
      ...base,
      duration: Number(form.duration),
      distance: Number(form.distance),
    };
  }

  return {
    ...base,
    bodyPart: form.bodyPart,
    weight: Number(form.weight),
    reps: Number(form.reps),
    sets: Number(form.sets),
  };
}

export function updateWorkoutRecord(existing, form) {
  return {
    ...createWorkoutRecord(form),
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

export function sortByLatest(records) {
  return [...records].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    return dateCompare || b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function formatType(type) {
  return WORKOUT_TYPES[type]?.label ?? type;
}

export function formatBodyPart(bodyPart) {
  return bodyPart ? STRENGTH_EXERCISES[bodyPart]?.label ?? bodyPart : '';
}

export function validateWorkout(form) {
  const errors = {};

  if (!form.date) errors.date = '운동 날짜를 입력해주세요.';
  if (!form.exercise) errors.exercise = '운동 종류를 선택해주세요.';

  if (form.type === 'cardio') {
    if (!form.duration || Number(form.duration) <= 0) errors.duration = '운동 시간을 1분 이상 입력해주세요.';
    if (form.duration && !Number.isInteger(Number(form.duration))) errors.duration = '운동 시간은 분 단위 정수로 입력해주세요.';
    if (!form.distance || Number(form.distance) <= 0) errors.distance = '운동 거리를 0보다 크게 입력해주세요.';
  }

  if (form.type === 'strength') {
    if (!form.bodyPart) errors.bodyPart = '운동 부위를 선택해주세요.';
    if (form.weight === '' || Number(form.weight) < 0) errors.weight = '무게를 0kg 이상 입력해주세요.';
    if (!form.reps || Number(form.reps) <= 0) errors.reps = '횟수를 1회 이상 입력해주세요.';
    if (form.reps && !Number.isInteger(Number(form.reps))) errors.reps = '횟수는 정수로 입력해주세요.';
    if (!form.sets || Number(form.sets) <= 0) errors.sets = '세트 수를 1세트 이상 입력해주세요.';
    if (form.sets && !Number.isInteger(Number(form.sets))) errors.sets = '세트 수는 정수로 입력해주세요.';
  }

  return errors;
}

export function getFilteredRecords(records, filters) {
  return sortByLatest(records).filter((record) => {
    const matchesDate = !filters.date || record.date === filters.date;
    const matchesType = filters.type === 'all' || record.type === filters.type;
    const matchesBodyPart =
      filters.bodyPart === 'all' || (record.type === 'strength' && record.bodyPart === filters.bodyPart);
    const keyword = filters.query.trim().toLowerCase();
    const text = [
      record.exercise,
      record.memo,
      formatType(record.type),
      formatBodyPart(record.bodyPart),
      record.date,
    ]
      .join(' ')
      .toLowerCase();

    return matchesDate && matchesType && matchesBodyPart && (!keyword || text.includes(keyword));
  });
}

export function getDashboardStats(records) {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const totalCardioDistance = records
    .filter((record) => record.type === 'cardio')
    .reduce((sum, record) => sum + Number(record.distance || 0), 0);

  const recentSevenDayCount = records.filter((record) => {
    const recordDate = new Date(`${record.date}T00:00:00`);
    return recordDate >= sevenDaysAgo && recordDate <= today;
  }).length;

  const strengthByBodyPart = Object.fromEntries(
    Object.keys(STRENGTH_EXERCISES).map((key) => [key, 0]),
  );

  records.forEach((record) => {
    if (record.type === 'strength' && record.bodyPart) {
      strengthByBodyPart[record.bodyPart] = (strengthByBodyPart[record.bodyPart] || 0) + 1;
    }
  });

  const weeklyChartData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const dateKey = date.toISOString().slice(0, 10);
    return {
      date: dateKey.slice(5),
      count: records.filter((record) => record.date === dateKey).length,
    };
  });

  return {
    totalCardioDistance,
    totalWorkoutCount: records.length,
    recentSevenDayCount,
    strengthByBodyPart,
    weeklyChartData,
  };
}

export function exportRecordsToCsv(records) {
  const header = [
    '날짜',
    '운동 대분류',
    '운동 부위',
    '운동 종류',
    '시간(분)',
    '거리(km)',
    '무게(kg)',
    '횟수',
    '세트 수',
    '운동 후 느낌 메모',
  ];

  const rows = sortByLatest(records).map((record) => [
    record.date,
    formatType(record.type),
    formatBodyPart(record.bodyPart),
    record.exercise,
    record.type === 'cardio' ? record.duration : '',
    record.type === 'cardio' ? record.distance : '',
    record.type === 'strength' ? record.weight : '',
    record.type === 'strength' ? record.reps : '',
    record.type === 'strength' ? record.sets : '',
    record.memo,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\r\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  link.href = URL.createObjectURL(blob);
  link.download = `workout_records_${today}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
