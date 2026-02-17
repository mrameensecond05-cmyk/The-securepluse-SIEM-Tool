from fastapi import FastAPI, HTTPException, Request
import requests
import os
import json

app = FastAPI()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://ollama:11434")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-service"}

@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        
        # Default to phi3 if model not specified
        if "model" not in data:
            data["model"] = "phi3" 
            
        # Forward to Ollama
        # We use stream=True to potentially support streaming, 
        # but for now we might just return the full response or stream it back.
        # Simple proxy for now:
        
        ollama_url = f"{OLLAMA_HOST}/api/chat"
        
        # Note: In a real prod env, we'd use aiohttp for async non-blocking requests 
        # or run requests in a threadpool. For MVP, requests is fine.
        response = requests.post(ollama_url, json=data, stream=True)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Ollama Error: {response.text}")

        # For simple non-streaming to frontend (MVP):
        # We'll collect the stream and return JSON. 
        # TODO: Implement proper SSE streaming to frontend.
        
        full_response = ""
        context = []
        
        for line in response.iter_lines():
            if line:
                json_line = json.loads(line.decode('utf-8'))
                if "message" in json_line and "content" in json_line["message"]:
                    full_response += json_line["message"]["content"]
                if "done" in json_line and json_line["done"]:
                    # context = json_line.get("context", []) # if needed
                    pass
                    
        return {
            "role": "assistant",
            "content": full_response
        }

    except Exception as e:
        print(f"Error calling Ollama: {e}")
        raise HTTPException(status_code=500, detail=str(e))
