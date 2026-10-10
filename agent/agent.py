import os
import socket
import time
import uuid
from datetime import datetime, timezone

import requests

AGENT_ID = str(uuid.uuid4())
API_URL = os.environ.get("API_URL", "http://api:8080/ping")


def get_hostname():
    return socket.gethostname()


while True:
    try:
        payload = {
            "agent_id": AGENT_ID,
            "hostname": get_hostname(),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        response = requests.post(API_URL, json=payload, timeout=10)
        print(f"[{datetime.now(timezone.utc)}] Sent ping, status: {response.status_code}")
    except Exception as e:
        print(f"Ping failed: {e}")
    time.sleep(10)
