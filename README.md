# Album Archive

JSONPlaceholder의 공개 앨범을 탐색하고 사진을 확인하며 관심 앨범을 모으는 DAY 28–32 누적 복습 프로젝트입니다. Vite + React + JavaScript로 작성했습니다.

## 주요 기능

- 전체 앨범 카드, 제목 검색, 사용자 번호 필터, 검색 결과 개수 및 빈 결과 안내
- 검색 조건을 URL에 반영하고 주소에서 복원
- 앨범 상세의 사진 목록과 사진 한 장의 상세 화면
- 관심 앨범 추가·해제, 페이지 간 목록 및 개수 동기화
- 번호 이동 폼 검증, 로딩·오류·404 안내, 이미지 실패 시 대체 안내
- 모바일 내비게이션, 반응형 그리드, 키보드 포커스와 관심 버튼의 `aria-pressed`

## 실행 방법

React Router 8.4의 요구 사항에 맞춰 **Node.js 22.22.0 이상**을 사용하세요.

```bash
cd day32-review-albums
npm ci
npm run dev
```

개발 서버가 출력하는 Local 주소를 여세요. 품질 확인과 빌드 미리보기:

```bash
npm run lint
npm run build
npm run preview
```

배포 주소: https://goodpineapple.github.io/day32-review-albums/

`main`에 push하면 `.github/workflows/deploy.yml`이 Node.js 22에서 설치 → lint → build → GitHub Pages 배포를 실행합니다. 개발 서버는 `/`에서, 프로덕션 빌드는 `/day32-review-albums/`에서 작동하도록 Vite의 base와 BrowserRouter의 basename을 연결했습니다.

GitHub Pages에는 SPA 재작성 기능이 없어 `public/404.html`이 직접 접근한 경로·검색 조건·해시를 시작 페이지에 전달하고, `index.html`이 React 실행 전에 원래 주소를 복원합니다. 배포 후 `/day32-review-albums/albums/1` 같은 상세 주소를 직접 열거나 새로고침해도 해당 페이지를 표시합니다. 초기 요청은 Pages의 404 응답을 거쳐 홈의 정상 응답으로 이동합니다. 이 Pages 전용 fallback을 다른 호스팅에 배포할 때는 해당 서비스의 SPA 재작성 설정에 맞추세요.

## 페이지와 URL

| URL | 화면 |
| --- | --- |
| `/` | 소개, 주요 기능, 앨범 번호 이동 폼 |
| `/albums` | 전체 앨범 |
| `/albums?userId=3` | 사용자 3의 앨범 |
| `/albums?query=qui` | 제목에 qui가 포함된 앨범 |
| `/albums?userId=3&query=qui` | 두 조건을 함께 적용 |
| `/albums/:id` | 앨범 정보 및 사진 목록 |
| `/photos/:id` | 사진 상세 |
| `/favorites` | 나의 관심 앨범 |
| 그 외 주소 | 없는 페이지 안내 |

## JSONPlaceholder endpoint

기준 주소는 `https://jsonplaceholder.typicode.com`입니다. 각 데이터 요청 페이지 안에 `API` 상수를 두어 해당 페이지의 주소를 조합합니다.

| 메서드 | 경로 | 용도 |
| --- | --- | --- |
| GET | `/albums` | 전체 앨범 한 번 요청 |
| GET | `/albums/:id` | 한 앨범 조회 |
| GET | `/photos?albumId=:id` | 해당 앨범의 사진 조회 |
| GET | `/photos/:id` | 한 사진 조회 |

다른 데이터 endpoint와 쓰기 요청은 사용하지 않습니다. 사용자 번호는 albums 응답의 실제 `userId`에서 구하며 사용자 정보 요청은 하지 않습니다. 이미지는 photos 응답의 `thumbnailUrl`, `url`을 그대로 사용합니다. 외부 이미지 서버가 응답하지 않으면 고정 비율 영역의 안내와 제목이 남습니다.

## 컴포넌트 구조

```text
src/
├── main.jsx                      # BrowserRouter 진입점
├── App.jsx                       # Routes, 관심 앨범 state 및 토글
├── index.css                     # Tailwind, shadcn 테마 토큰
├── lib/utils.js                  # cn 클래스 조합 도구
├── components/
│   ├── Layout.jsx                # NavLink, 관심 개수 Badge, Outlet, footer
│   ├── AlbumCard.jsx             # 앨범 정보·상세 링크·관심 버튼
│   ├── AlbumGrid.jsx             # 재사용 카드 목록
│   ├── AlbumFilters.jsx          # 제어 입력·사용자 선택
│   ├── PhotoCard.jsx             # 사진 미리보기·실패 안내
│   ├── LoadingState.jsx          # 상태 안내·스켈레톤
│   ├── ErrorState.jsx            # 오류 안내·다시 시도
│   └── ui/{button,card,badge,input}.jsx
└── pages/
    ├── HomePage.jsx
    ├── AlbumsPage.jsx
    ├── AlbumPage.jsx
    ├── PhotoPage.jsx
    ├── FavoritesPage.jsx
    └── NotFoundPage.jsx
```

## 사전 분석: 기존 수업 코드와 설정

기존 8개 프로젝트를 읽고 다음 흐름을 확인했습니다. 원본은 수정하지 않았습니다.

| 기존 프로젝트 | 확인 내용 | 새 프로젝트에 적용 |
| --- | --- | --- |
| `day28/hello-react` | Header/Main/Footer 분리, ProfileCard 구조 분해·기본값 | Layout, AlbumCard props 및 기본값 |
| `day29/hello-react` | App의 발표자 state, 콜백 props, 응원 이벤트, 제목 변경 effect | App의 관심 앨범 state와 콜백 |
| `day30/hello-react` | 역할별 filter, map과 id key, 파생 목록 | 검색 결과 계산과 카드 렌더링 |
| `day30/todo-react` | 제어 폼, preventDefault, 검증, map/filter/spread | 번호 폼, 관심 추가·제거 |
| `day31/posts-react` | 중첩 Routes, Layout/Outlet, 동적 경로, URL 필터, fetch | 앨범/사진 라우트와 페이지 effect |
| `day31/todo-react` | 페이지 분리, 부모 state와 props 전달 | 페이지 간 공유 상태를 App에 배치 |
| `day32/posts-react` | Tailwind Vite 플러그인, JS shadcn 소스, 별칭, UI variant | 같은 설정과 4개 UI 소스 재사용 |
| `day32/login-tailwind` | 입력 검증, 모바일 우선 md/lg 레이아웃 | 폼 안내와 반응형 구성 |

기존 fetch 예제에서 응답 검사가 빠진 후속 요청도 확인했습니다. 이 복습 프로젝트에서는 **모든 fetch 응답의 ok를 검사**합니다. 동적 id 변경 시 로딩과 오류를 초기화하고, effect cleanup의 AbortController로 오래된 요청을 취소합니다.

기준 프로젝트의 package.json 선언 / 설치된 버전은 React `^19.2.8 / 19.3.0`, Vite `^8.3.0 / 8.3.4`, React Router `^8.4.0 / 8.4.0`, Tailwind CSS `^4.3.5 / 4.3.5`, shadcn CLI `^4.23.0 / 4.23.0`입니다. 같은 package-lock을 바탕으로 프로젝트 이름만 변경했습니다. shadcn 컴포넌트는 버전 패키지 안에 숨은 UI가 아니라 **이 저장소의 JSX 소스**입니다. `components.json`은 `tsx: false`, `radix-nova`이며, Vite와 jsconfig 양쪽에 `@/* → src/*`를 설정했습니다. UI 소스가 사용하는 Radix는 shadcn의 구성 의존성입니다.

## 데이터 흐름과 DAY 28–32 복습

### URL이 화면으로 연결되는 과정

`main.jsx`의 BrowserRouter가 브라우저 주소를 React에 알려 줍니다. `App.jsx`의 Routes와 Route가 주소에 맞는 페이지를 고릅니다. 부모 Route의 `Layout`은 공통 메뉴와 footer를 유지하고, 자식 페이지는 그 안의 `Outlet` 자리에 나타납니다. 일치하는 주소가 없으면 `*` Route가 안내 화면을 표시합니다.

`Link`는 클릭으로 페이지를 이동시킵니다. `NavLink`는 현재 메뉴인지도 알려 주므로 `buttonVariants`와 밑줄·굵은 글씨로 활성 메뉴를 표현합니다. 홈의 폼은 먼저 번호를 검사해야 하므로 `preventDefault()` 후 **검증 성공 시에만 useNavigate**로 이동합니다.

`useParams`는 `/albums/3`의 `3`처럼 경로 안의 id를 읽습니다. `useSearchParams`는 `/albums?query=qui&userId=3`처럼 물음표 뒤의 검색 조건을 읽고 바꿉니다. 제목과 사용자 필터는 서로의 조건을 보존하며, 주소를 직접 열어도 입력값과 결과가 일치합니다. 알 수 없는 사용자 번호도 선택 상자에 표시하고 결과 0개로 안내합니다.

### 서버 데이터를 받는 과정과 상태

`AlbumsPage`, `AlbumPage`, `PhotoPage`의 useEffect 안에서 이름 있는 비동기 함수를 선언하고 호출합니다. `await fetch → response.ok 확인 → await response.json → 데이터 state 갱신` 순서입니다. 실패하면 catch에서 오류 메시지를 저장하고 성공하면 이전 오류를 비웁니다.

- **로딩**: 목록의 초기 null 또는 상세의 loading이 참일 때 안내·스켈레톤을 보여 줍니다.
- **오류**: 응답 실패·네트워크 문제·없는 데이터는 ErrorState에서 안내합니다. 다시 시도는 새로고침이므로 관심 목록도 초기화됩니다.
- **성공**: 데이터를 표시합니다. 비어 있는 배열도 정상 응답이므로 로딩과 구분하여 빈 안내를 보여 줍니다.

상태를 구분하면 아직 받지 않은 데이터를 접근하는 오류를 막고, 빈 결과와 통신 실패도 사용자가 구별할 수 있습니다. 상세 effect의 의존성은 `[id]`이므로 id 변경 때 다시 요청합니다. 목록 effect는 `[]`이므로 제목이나 사용자 필터 때문에 다시 요청하지 않습니다. 개발 StrictMode에서는 effect 검사를 위해 취소된 첫 요청과 실제 요청이 함께 보일 수 있습니다.

### 관심 앨범과 파생 값

목록·상세·관심 페이지와 메뉴가 같은 데이터를 사용하므로 가장 가까운 공통 부모인 **App**이 favorites를 갖습니다. 자식에는 일반 props로 배열과 `onToggleFavorite`을 내려 줍니다. 자식 이벤트가 부모 함수를 호출하면 함수형 업데이트로 항상 최신 배열을 받습니다.

- `some`: 같은 id가 있는지 검사하여 관심 여부 계산
- `filter`: 기존 id를 제외한 새 배열로 관심 해제; AlbumsPage에서는 조건에 맞는 목록 계산
- spread: `[...previous, album]`로 기존 배열을 바꾸지 않고 추가
- `map`: AlbumGrid, 사진 그리드, 사용자 옵션, 로딩 스켈레톤 렌더링
- `key`: API 목록에서는 album.id 또는 photo.id 사용

관심 여부·개수·검색 결과·사진 개수는 원본에서 계산할 수 있습니다. 별도 state로 만들면 배열을 바꾸면서 개수나 선택 여부를 함께 갱신하는 일을 빠뜨릴 수 있어 계산으로 유지합니다. 사용자 번호 옵션은 받은 앨범의 userId 중복을 제거해 만듭니다.

서버에는 읽기 요청만 보냅니다. favorites는 App의 메모리에만 있고 브라우저 저장소나 서버에 쓰지 않기 때문에 **새로고침하면 초기화**됩니다.

| 날짜 | 적용 위치 |
| --- | --- |
| DAY 28 | 함수 컴포넌트, JSX, import/export, AlbumCard의 props 구조 분해·기본값, 조건부 className |
| DAY 29 | App 상태 끌어올리기·함수형 업데이트·콜백 props, 각 데이터 페이지의 useEffect·의존성 |
| DAY 30 | AlbumGrid의 map/key, 검색 filter, 제어 폼과 preventDefault, 빈 목록, 불변 spread/filter |
| DAY 31 | App의 중첩 라우트, Layout/Outlet, NavLink/Link, 홈 useNavigate, 상세 useParams, 목록 useSearchParams, fetch |
| DAY 32 | 모든 페이지의 Tailwind 클래스, 사진 grid-cols-2/md:grid-cols-3/lg:grid-cols-4, UI variant, @ 별칭 |

## Tailwind와 shadcn/ui의 역할

Tailwind는 그리드·간격·너비·반응형·색상 같은 작은 CSS 유틸리티를 제공합니다. shadcn/ui는 그 유틸리티와 동작을 조합한 **수정 가능한 컴포넌트 소스**입니다. Button은 버튼/링크 표현, Card는 정보 묶음, Badge는 개수/분류/오류, Input은 입력에 사용합니다. variant로 관심 상태와 메뉴 모양을 바꾸며, 레이아웃은 Tailwind로 배치합니다. 로딩과 오류는 Card·Badge로 표현해 추가 UI 설치를 줄였습니다.

## 직접 확인하기

1. 홈에서 빈 값, 0, 101, 1.5, 글자를 제출해 오류를 확인한 뒤 1로 이동합니다.
2. 위 URL 표의 주소를 직접 엽니다. 검색어·사용자 조건이 입력과 결과에 함께 반영되는지 확인합니다.
3. 목록에서 관심 추가 → 상세에서 보관 상태 확인 → 관심 목록에서 해제합니다. 연속 토글해도 같은 id가 중복되지 않는지 확인합니다.
4. `/albums/999`, `/photos/99999`, `/존재하지않는주소`를 확인합니다.
5. 브라우저 개발자 도구에서 느린 네트워크와 오프라인으로 로딩·오류를 확인합니다.
6. 좁은 화면과 넓은 화면, Tab 키, 이미지 실패 시에도 카드와 제목이 유지되는지 확인합니다.

## 추가 연습 문제

1. URL의 `sort=title` 값으로 앨범 제목순 정렬을 추가하세요. 받은 배열을 spread로 복사한 뒤 정렬하고 결과를 state로 저장하지 마세요.
2. 관심 앨범 페이지에 제어 입력을 추가해 관심 목록 안에서 제목을 검색하고 결과 개수를 계산하세요.
3. 홈에 자주 여는 앨범 3개의 Link를 데이터 배열과 map으로 렌더링하세요. 안정적인 id를 key로 쓰세요.

## 이번 구현의 검증 결과

- `npm run lint`: 통과(종료 코드 0)
- `npm run build`: 통과(Vite 8.3.4, 종료 코드 0)
- 브라우저 확인: 홈 번호 검증과 이동, 전체 앨범 100개, 사용자 3의 앨범 10개, `qui` 검색 34개, 두 조건 결합 2개, 빈 검색 결과
- 앨범 1의 사진 50장, 사진 1 상세, 관심 추가→해제→추가 후 관심 카드 1개, 페이지 간 상태 공유 확인
- `/albums/999`, `/photos/99999` 오류 안내 및 없는 주소의 404 화면 확인
- 로딩 화면을 실제 요청 중 확인했습니다. 이후 별도 로컬 검증 서버에서 연결 실패와 재시도까지 확인했습니다(아래 추가 검증 참조).
- 데스크톱 1280px에서 사진 4열 확인. 브라우저 배율을 보정한 실제 CSS 너비 320px·390px에서 홈의 가로 넘침이 없었고, 320px에서 목록 1열·사진 2열, 검색·관심 추가/해제를 확인했습니다. md 3열은 코드 설정이며 해당 너비의 실측 검증은 별도로 수행하지 않았습니다.
- 기존 day28–day32 및 cafe-order의 소스·설정 파일 259개의 작업 전후 SHA-256 비교 결과 변경 없음
- npm registry DNS 연결 실패 및 빈 오프라인 캐시로 `npm ci` 설치는 완료하지 못했습니다. 기존 `day32/posts-react/node_modules`를 새 폴더로 복사하여 같은 의존성으로 lint·build·브라우저 검증을 수행했습니다. 새 프로젝트의 잠금 파일을 포함했으므로 네트워크가 가능한 환경에서는 `npm ci`로 설치할 수 있습니다.
- 데스크톱 화면: `preview-desktop.jpg`


### 추가 동작 검증 (2026-11-17)

지연·장애 조건은 인앱 브라우저의 네트워크 설정 대신 **별도 로컬 Vite 검증 서버**에서 재현했습니다. 실제 JSONPlaceholder 응답을 중계하고 특정 응답만 지연하거나 API 연결 소켓을 강제로 끊었습니다. 페이지의 effect와 상태 처리 코드는 그대로 실행했으며, 검증 서버에서만 API 주소를 중계 경로로 바꿨습니다. 임시 설정·QA 버튼은 검증 후 제거하여 서비스 코드와 빌드에는 포함되지 않습니다.

| 시나리오 | 직접 수행한 조작 | 결과 |
| --- | --- | --- |
| 앨범 응답 순서 역전 | 앨범 1 응답을 8초 지연 → 로딩 중 앨범 2로 이동 → 이전 응답 완료 후 재확인 | 앨범 2 제목과 사진 유지. 서버 로그에서 이전 클라이언트 요청 취소 및 닫힌 연결에 대한 늦은 응답 확인 |
| 사진 응답 순서 역전 | 사진 1 응답을 8초 지연 → 로딩 중 사진 2로 이동 → 이전 응답 완료 후 재확인 | 사진 2 제목·ID 유지. 이전 요청 취소 확인 |
| 앨범 연결 실패 → 복구 | API 소켓 강제 종료 → 오류 안내 확인 → 정상 모드 복구 → 다시 시도 | 앨범 1과 사진 50장 정상 표시 |
| 목록 연결 실패 → 복구 | API 소켓 강제 종료 → 네트워크 오류 안내 확인 → 정상 모드 복구 → 다시 시도 | 전체 앨범 100개 정상 표시 |
| 검색 후 뒤로·앞으로 | 홈 → 목록 → qui 검색 → 뒤로 → 앞으로 | 홈을 거쳐 qui 입력·URL·34개 결과가 함께 복원 |
| 필터 초기화 후 뒤로·앞으로 | qui + 사용자 3(2개) → 초기화(100개) → 뒤로 → 앞으로 | 뒤로 시 두 조건과 2개 결과 복원, 앞으로 시 빈 조건과 100개 결과 복원 |

입력 중의 URL 변경은 `replace: true`이므로 글자마다 방문 기록을 만들지 않습니다. 따라서 검색 직후 뒤로 가기는 이전 페이지로 이동하며, 앞으로 가면 마지막 검색 조건으로 돌아옵니다. 필터 초기화는 새 방문 기록을 남겨 초기화 전 조건을 뒤로 가기로 복원할 수 있습니다. 이 동작에서 URL과 입력·선택·결과의 불일치는 발견되지 않았습니다.

장애 재현 시에는 의도한 연결 실패 로그가 발생합니다. 이는 실제 인터넷 전체를 끊거나 Chrome의 오프라인 모드를 켠 검증은 아니며, API 요청의 연결 실패를 통제해 재현한 검증입니다. 세 항목에서 기능 수정이 필요한 결함은 발견되지 않았습니다. 결과 화면은 `preview-verification.jpg`에 저장했습니다.
