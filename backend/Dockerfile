FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Tuka puskame API-to da slusha
EXPOSE 8000

# Tva puska samiq app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
