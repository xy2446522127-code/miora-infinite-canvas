# Miora Video local plugin

This folder is the local Miora provider package. It contains no browser
profile, mail address, API token, cookie, password, or generated media.

Private state is created only here and is ignored by Git:

```text
data/local/plugins/miora-video/
  mail-cx.json
  accounts.json
  registration-jobs.json
  downloads/
  logs/
```

The plugin bridge will connect the Canvas host to the existing local Miora
worker at `http://127.0.0.1:5210`. That worker is responsible for connecting
to BitBrowser profiles and interacting with Miora. Edge is used only for the
Canvas user interface.

Before enabling real task submission, configure Mail.cx and a BitBrowser
profile locally. Never add those values to `plugin.json` or commit them.
