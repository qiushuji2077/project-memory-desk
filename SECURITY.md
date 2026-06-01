# Security Policy

Project Memory Desk is designed as a local-first workspace. Security reports and contributions should keep that principle intact.

## Supported versions

The initial open source version is `0.1.x`.

## Reporting a vulnerability

Please report security issues privately to the maintainers before opening a public issue. Include:

- A short description of the problem
- Steps to reproduce
- Affected files or features
- Whether any real project data could be exposed

## Sensitive data

Do not commit real school materials, client materials, interviews, contracts, recordings, screenshots, API keys, tokens, cookies, local workspace paths, or exported private data.

Recommended local-only directories are already ignored:

- `private/`
- `workspace/`
- `uploads/`
- `recordings/`
- `exports/`
- `资料台数据/`

If sensitive data is committed by mistake, remove it from the repository and rotate any exposed credentials.
