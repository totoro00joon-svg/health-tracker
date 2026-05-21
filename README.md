# 운동 관리 앱

개인이 매일 운동 기록을 입력하고 유산소/근력 운동을 구분해 누적 관리할 수 있는 React 기반 MVP 웹앱입니다.

## 주요 기능

- 유산소/근력 타입별 입력 폼 분리
- 근력 운동 부위 선택 시 해당 부위 운동만 선택
- localStorage 저장으로 새로고침 후에도 기록 유지
- 기록 수정/삭제
- 날짜, 운동 타입, 운동 부위, 검색어 기반 조회
- 최신 기록 우선 정렬
- 총 유산소 거리, 총 운동 횟수, 최근 7일 운동 횟수 요약
- 부위별 근력 운동 횟수
- 주간 운동 현황 차트
- UTF-8 BOM 적용 CSV 내보내기
- 모바일 반응형 UI
- 다크모드 지원

## 기술 스택

- React
- Vite
- Tailwind CSS
- Recharts
- lucide-react

## 데이터 구조

```js
// 유산소 기록
{
  id: string,
  type: 'cardio',
  exercise: string,
  duration: number,
  distance: number,
  memo: string,
  date: 'YYYY-MM-DD',
  createdAt: string,
  updatedAt: string
}

// 근력 기록
{
  id: string,
  type: 'strength',
  bodyPart: 'legs' | 'back' | 'shoulders' | 'chest' | 'abs',
  exercise: string,
  weight: number,
  reps: number,
  sets: number,
  memo: string,
  date: 'YYYY-MM-DD',
  createdAt: string,
  updatedAt: string
}
```

운동 타입과 운동 종류는 `src/data/exercises.js`에서 관리하므로 추후 타입이나 부위를 확장하기 쉽습니다.

## 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 Vite가 안내하는 주소를 열면 앱을 사용할 수 있습니다.

## 빌드

```bash
npm run build
```

## 파일 구조

```text
.
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
├─ README.md
└─ src
   ├─ App.jsx
   ├─ main.jsx
   ├─ styles.css
   ├─ components
   │  ├─ Dashboard.jsx
   │  ├─ Field.jsx
   │  ├─ Filters.jsx
   │  ├─ RecordList.jsx
   │  ├─ SectionHeader.jsx
   │  └─ WorkoutForm.jsx
   ├─ data
   │  └─ exercises.js
   └─ utils
      ├─ storage.js
      └─ workouts.js
```
