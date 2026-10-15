FROM python:3.14-slim

WORKDIR /agent

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY agent.py .

CMD ["python", "agent.py"]
