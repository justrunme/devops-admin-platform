FROM python:3.11-slim

WORKDIR /agent

COPY agent.py .

RUN pip install requests

CMD ["python", "agent.py"]