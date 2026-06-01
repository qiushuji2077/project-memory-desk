# Architecture

Project Memory Desk uses a simple three-layer structure for the initial open source version.

## Frontend interface

The frontend is a Vite app with a three-column workspace:

- Left project list
- Center final memory and memory entry area
- Right memory flow

The current version is intentionally semi-automatic. Prompt templates can be copied, but no model call is made inside the demo.

## Local data

Demo data is stored in `data/` as JSON:

- `demo-projects.json`
- `demo-memory-flow.json`
- `demo-prompts.json`

Future local workspaces can keep project data outside the public repository, for example under `workspace/` or `private/`.

## Future AI automation

Future versions can add:

- Local file indexing
- Final memory generation from memory flow
- Conflict detection
- Replaced-memory marking
- Local model integration
- User-owned API key integration
- Multi-model routing

Automation should preserve local-first defaults and user control.
