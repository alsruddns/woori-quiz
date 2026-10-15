# woori-quiz

`woori.today`의 퀴즈테스트 서비스입니다. 서비스는 `/quiz` prefix, 개발 포트 `3005`를 사용합니다.

## 개발

```bash
pnpm install
pnpm dev
```

개발 서버: <http://localhost:3005/quiz/ko>

## Branch workflow

- `main` is the production branch; `develop` is the regular development branch.
- Start all work on `develop`. Verify the change, commit and push `develop`, then merge it into `main` and push `main`.
- Return to `develop` after the production push. Do not create release branches.

## Project documents

- [Common rules](docs/common-rules.md)
- [UI guidelines](docs/ui-guidelines.md)
- [Service catalog](docs/service-catalog.md)
- [Quiz catalog](docs/quiz-catalog.md)

## Scripts

`pnpm test`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`
