# codertrovecyber

Internal cyber security platform for Coder Trove. Owner: Marcel Rizzolo.
The code was imported from an older product called Continuum. We are rebuilding it for internal use.

## Layout

| Folder | What | Stack | Local URL |
|---|---|---|---|
| `app/` | User portal | Next.js 11, React 17, JavaScript | http://localhost:3000 |
| `admin/` | Admin portal | Next.js 11, React 17, TypeScript, next-auth (Google sign-in) | http://localhost:3001 |
| `api/` | Backend API | Strapi 3.6.8, Postgres, Node 14 | http://localhost:1337/admin |

Custom Strapi plugins live in `api/plugins/` (`cnc-core`, `cnc-cron`, `cnc-migrator`, `main`).
Content types live in `api/api/`.

## Run it

Docker Desktop must be running.

```
docker compose up
```

- Stop: Ctrl+C. Remove containers: `docker compose down`. Wipe the database: `docker compose down -v`.
- All three apps need Node 14. Do not run them with a newer Node outside Docker.
- Each app uses yarn. Ignore `package-lock.json`.

## Checks

- `app/` and `admin/`: `yarn lint`
- `admin/`: `yarn typeCheck`
- There are no automated tests yet. When you add or change behaviour, add a test where practical and say so in the pull request.

Run checks inside the container, for example: `docker compose exec admin yarn lint`.

## Rules for every change

1. Never commit to `main`. Create a branch, push it, open a pull request. `main` is protected.
2. One topic per pull request. Keep it small enough to review.
3. Marcel merges. Do not merge your own pull request.
4. Pull requests are squash merged. Write a clear title, it becomes the commit message.
5. In the pull request description say: what changed, why, how you tested it, and anything you did not test.
6. Do not claim something works unless you ran it. If you could not run it, say that.

## Security rules

- Never commit secrets, keys, tokens or passwords. This includes `.env.example` files and fallback values in code such as `process.env.X || 'real-value'`.
- All secrets come from environment variables. Local throwaway values live in `docker-compose.yml` only.
- Never put a secret in a variable that starts with `NEXT_PUBLIC_`. Those are sent to the browser.
- Do not add credentials, URLs or accounts that belong to Continuum. That platform may still be live. Do not call its servers or services.
- Flag any security problem you notice, even if it is outside your task.

## Naming

- The product name is `codertrovecyber`. Do not introduce new uses of the name Continuum.
- Old tenant names (`continuum`, `scotpac`, `mackay`) still exist in assets and styles. Leave them unless the task is about branding.

## Known issues

- API startup logs an error inserting into `cron_tasks` (invalid date). Non-fatal.
- Portal logins do not work locally yet. Admin needs a Google OAuth client. The user portal needs an email service for one-time codes.
- `NEXT_PUBLIC_STRIPE_SECRET_KEY` in `app/` exposes a Stripe secret key to the browser.
- Branding is still Continuum.
- The stack is old: Strapi 3 is end of life, Next.js 11 and Node 14 are out of support.
- Old `bitbucket-pipelines.yml` files are unused.

## Writing style

Plain, short sentences. The team includes people who use English as a second language. No marketing tone.
