# 1) Build React
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# 2) Build Python app
FROM python:3.10-slim
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 3) Copy React build into Python containerr
COPY --from=frontend-build /app/frontend/build ./frontend/build
RUN ls ./frontend/
COPY backend/ .

# 4) Expose and run
EXPOSE 8080
CMD ["python", "main.py"]
