import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

# Enable Swagger at /swagger and Redoc at /redoc
app = FastAPI(docs_url="/swagger", redoc_url="/redoc")

# Define folder with JSON files (place files under this folder)
json_folder = os.path.join(os.path.dirname(__file__), 'json_files')

@app.get("/list-jsons")
async def list_jsons():
    try:
        # List files and return base names (e.g., "json1" for json1.json)
        files = os.listdir(json_folder)
        json_files = [os.path.splitext(f)[0] for f in files if f.endswith('.json')]
        return json_files
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to list JSON files")

@app.get("/json/{id}")
async def get_json(id: str):
    file_path = os.path.join(json_folder, f"{id}.json")
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf8') as f:
                data = json.load(f)
            # Remove 'image_url' from each dictionary in the list if present
            if isinstance(data, list):
                for item in data:
                    item.pop('image_url', None)
            return JSONResponse(content=data)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Error parsing JSON")
    raise HTTPException(status_code=404, detail="JSON file not found")

# Optional: Aggregate all JSON files into one endpoint
@app.get("/api/data")
async def get_all_jsons():
    result = {}
    try:
        for file in os.listdir(json_folder):
            if file.endswith('.json'):
                key = os.path.splitext(file)[0]
                file_path = os.path.join(json_folder, file)
                with open(file_path, 'r', encoding='utf8') as f:
                    data = json.load(f)
                # Remove 'image_url' from each dictionary in the list if present
                if isinstance(data, list):
                    for item in data:
                        item.pop('image_url', None)
                result[key] = data
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error loading JSON files")

# Mount the React frontend build folder if it exists
frontend_build_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")
if os.path.exists(frontend_build_path):
    app.mount("/", StaticFiles(directory=frontend_build_path, html=True), name="frontend")
else:
    print("Warning: Frontend build folder not found. Static files not mounted.")
    # Optionally, you could mount a fallback directory if available

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080)
