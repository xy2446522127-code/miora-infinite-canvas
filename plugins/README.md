# Plugin system

The canvas does not ship with personal accounts or provider credentials. A
creator adds a plugin by placing one folder under `plugins/` and restarting the
local service. The plugin loader discovers only folders containing
`plugin.json`.

```text
plugins/
  my-video-provider/
    plugin.json
    README.md
    backend/          # optional Node or Python worker
    ui/               # optional node inspector/editor assets
    data/             # local-only; ignored by Git
```

## Required lifecycle

Each video plugin must implement these operations through its declared runtime:

1. `validateAccount` — verify a locally configured account/profile and read its balance.
2. `estimateCost` — return an estimate when the provider exposes one.
3. `submitTask` — submit an idempotent generation request and return a provider task ID.
4. `pollTask` — report queued, running, needs_attention, failed, or completed.
5. `fetchArtifacts` — download durable local copies and return canvas-ready media metadata.

## Safety rules

- Plugins must declare permissions in `plugin.json`; no implicit browser, network,
  filesystem, or account access.
- Run each plugin in a separate worker process. Do not execute plugin code inside
  the canvas web process.
- A task reserves an account before submission and records balance snapshots
  before and after completion.
- If a provider requires a captcha or a manual confirmation, return
  `needs_attention`; never bypass it.
- Do not commit values under `plugins/*/data/`, including browser profiles,
  email addresses, API tokens, or cookies.
