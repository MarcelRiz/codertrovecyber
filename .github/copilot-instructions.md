# Copilot instructions for codertrovecyber

Read `CLAUDE.md` in the repo root first. It is the single source of project rules. This file repeats only the points that matter most for code review and suggestions.

## Project

- `app/`: user portal, Next.js 11, JavaScript.
- `admin/`: admin portal, Next.js 11, TypeScript, next-auth.
- `api/`: Strapi 3.6.8 on Postgres, Node 14.
- Run locally with `docker compose up`.

## When writing code

- Match the existing style of the folder you are in. Use yarn.
- Code must run on Node 14. Do not use newer Node or Next.js APIs.
- Read secrets from environment variables only. No hardcoded fallbacks.
- Never put a secret in a `NEXT_PUBLIC_` variable.
- Do not introduce new uses of the name Continuum.

## When reviewing a pull request

Check for:

1. Secrets, keys, tokens or passwords in code, config or example files.
2. Missing permission checks on Strapi routes and controllers.
3. User input used in queries, file paths, HTML or shell commands without validation.
4. Changes outside the stated topic of the pull request.
5. Claims in the description that the diff does not support.

Say clearly when you are unsure. Short comments, plain English.
