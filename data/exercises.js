export const WORKOUT_TYPES = {
  cardio: {
    label: '유산소',
    color: 'blue',
  },
  strength: {
    label: '근력',
    color: 'green',
  },
};

export const CARDIO_EXERCISES = ['러닝'];

export const STRENGTH_EXERCISES = {
  legs: {
    label: '다리',
    exercises: ['스쿼트', '런지', '레그프레스', '핵스쿼트', '레그컬', '레그익스텐션'],
  },
  back: {
    label: '등',
    exercises: ['렛풀다운', '시티드로우', '바벨로우', '친업', '풀업', '데드리프트'],
  },
  shoulders: {
    label: '어깨',
    exercises: ['숄더프레스', '사이드레터럴레이즈', '프론트레이즈', '리어델트플라이'],
  },
  chest: {
    label: '가슴',
    exercises: ['벤치프레스', '푸쉬업', '체스트프레스', '덤벨프레스', '케이블플라이'],
  },
  abs: {
    label: '배',
    exercises: ['크런치', '플랭크', '레그레이즈', '싯업', '바이시클크런치'],
  },
};

export const DEFAULT_CARDIO_FORM = {
  type: 'cardio',
  exercise: CARDIO_EXERCISES[0],
  duration: '',
  distance: '',
  memo: '',
  date: new Date().toISOString().slice(0, 10),
};

export const DEFAULT_STRENGTH_FORM = {
  type: 'strength',
  bodyPart: 'legs',
  exercise: STRENGTH_EXERCISES.legs.exercises[0],
  weight: '',
  reps: '',
  sets: '',
  memo: '',
  date: new Date().toISOString().slice(0, 10),
};
