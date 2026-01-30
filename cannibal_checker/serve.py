import http.server
import webbrowser
import os
import threading

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Quiet logging - only show requests
        pass


def open_browser():
    webbrowser.open(f"http://localhost:{PORT}")


if __name__ == "__main__":
    server = http.server.HTTPServer(("", PORT), Handler)
    print(f"Serving at http://localhost:{PORT}")
    print("Press Ctrl+C to stop")
    threading.Timer(0.5, open_browser).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.server_close()
