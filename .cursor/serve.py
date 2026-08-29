#!/usr/bin/env python3
"""Minimal static dev server with SPA fallback.

Serves the repository root and, like the production Vercel rewrite in
`vercel.json`, falls back to `index.html` for any path that does not map to an
existing file. This lets client-side deep links (e.g. `/projects`,
`/interests/inspirations/<slug>`) load correctly on a hard refresh.
"""

import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class SPARequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        fs_path = self.translate_path(self.path)
        # Serve real static assets directly; fall back to the SPA entrypoint
        # for anything else (client-side routes such as `/projects`).
        is_asset = os.path.isfile(fs_path) or (
            os.path.isdir(fs_path) and os.path.isfile(os.path.join(fs_path, "index.html"))
        )
        if not is_asset:
            self.path = "/index.html"
        return super().do_GET()

    def end_headers(self):
        # Avoid stale assets during development.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    port = int(os.environ.get("PORT", sys.argv[1] if len(sys.argv) > 1 else 8000))
    httpd = ThreadingHTTPServer(("0.0.0.0", port), SPARequestHandler)
    print(f"Serving {ROOT} at http://0.0.0.0:{port} (SPA fallback enabled)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.shutdown()


if __name__ == "__main__":
    main()
