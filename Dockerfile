FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir torch==2.10.0 torchvision==0.25.0 --index-url https://download.pytorch.org/whl/cpu

COPY requirements-deploy.txt .

RUN pip install --no-cache-dir -r requirements-deploy.txt

COPY app ./app
COPY models/best_siamese_resnet18.pth ./models/best_siamese_resnet18.pth

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
