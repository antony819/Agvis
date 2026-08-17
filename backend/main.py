from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import json
from datetime import datetime
from pathlib import Path

app = FastAPI(title="Agvis API")

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory storage for prototype
documents = {}
workspaces = {}

# Models
class UploadDocumentResponse(BaseModel):
    documentId: str
    filename: str
    size: int
    mimeType: str
    status: str

class DocumentStatusResponse(BaseModel):
    documentId: str
    parsingStatus: str
    indexingStatus: str
    chunks: Optional[int] = None
    error: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    model: str
    temperature: Optional[float] = 0.7
    contextBlockId: Optional[str] = None


@app.get("/")
async def root():
    return {"status": "ok", "message": "Agvis API"}


@app.post("/api/documents/upload", response_model=UploadDocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document"""
    
    # Generate document ID
    doc_id = f"doc_{datetime.now().timestamp()}"
    
    # Save file content
    content = await file.read()
    
    # Store document metadata
    documents[doc_id] = {
        "id": doc_id,
        "filename": file.filename,
        "size": len(content),
        "mimeType": file.content_type or "application/octet-stream",
        "content": content,
        "parsingStatus": "pending",
        "indexingStatus": "pending",
        "chunks": 0,
    }
    
    # Simulate async processing
    asyncio.create_task(process_document(doc_id))
    
    return UploadDocumentResponse(
        documentId=doc_id,
        filename=file.filename or "untitled",
        size=len(content),
        mimeType=file.content_type or "application/octet-stream",
        status="uploaded",
    )


async def process_document(doc_id: str):
    """Simulate document processing"""
    await asyncio.sleep(1)
    documents[doc_id]["parsingStatus"] = "parsing"
    
    await asyncio.sleep(2)
    documents[doc_id]["parsingStatus"] = "parsed"
    documents[doc_id]["indexingStatus"] = "indexing"
    
    await asyncio.sleep(2)
    # Simulate chunking
    content_length = len(documents[doc_id]["content"])
    chunks = max(1, content_length // 500)
    
    documents[doc_id]["indexingStatus"] = "indexed"
    documents[doc_id]["chunks"] = chunks


@app.get("/api/documents/{document_id}/status", response_model=DocumentStatusResponse)
async def get_document_status(document_id: str):
    """Get document processing status"""
    if document_id not in documents:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc = documents[document_id]
    return DocumentStatusResponse(
        documentId=document_id,
        parsingStatus=doc["parsingStatus"],
        indexingStatus=doc["indexingStatus"],
        chunks=doc.get("chunks"),
    )


@app.post("/api/chat/completion")
async def chat_completion(request: ChatCompletionRequest):
    """Stream chat completion (SSE)"""
    
    async def generate():
        # Simulate streaming response
        response = "This is a simulated AI response. In production, this would call an actual LLM API."
        
        if request.contextBlockId:
            response += f" (Using context from block: {request.contextBlockId})"
        
        # Stream tokens
        for word in response.split():
            yield f"data: {json.dumps({'type': 'token', 'content': word + ' '})}\n\n"
            await asyncio.sleep(0.05)
        
        # Send done
        yield f"data: {json.dumps({'type': 'done'})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/api/packs")
async def list_packs():
    """List available packs"""
    # Mock pack catalog
    return {
        "packs": [
            {
                "id": "research-assistant",
                "name": "Research Assistant",
                "description": "A complete workspace for academic research",
                "author": "@agvis",
                "version": "1.0.0",
                "installs": 1200,
                "rating": 4.8,
            }
        ],
        "total": 1,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
