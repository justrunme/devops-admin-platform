import requests
import time
import socket
import uuid
from datetime import datetime

AGENT_ID = str(uuid.uuid4())
API_URL = "http://api:8080/ping"

def get_hostname():
    return socket.gethostname()

while True:
    try:
        payload = {
            "agent_id": AGENT_ID,
            "hostname": get_hostname(),
            "timestamp": datetime.utcnow().isoformat()
        }
        response = requests.post(API_URL, json=payload)
        print(f"[{datetime.utcnow()}] Sent ping, status: {response.status_code}")
    except Exception as e:
        print(f"Ping failed: {e}")
    time.sleep(10)