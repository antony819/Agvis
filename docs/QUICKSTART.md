# Quick Start Guide

## Running Agvis Locally

### 1. Start Frontend

```bash
cd D:\github\Agvis
npm install  # First time only
npm run dev
```

Open browser to `http://localhost:5173`

### 2. Start Backend (Optional)

```bash
cd D:\github\Agvis\backend
pip install -r requirements.txt  # First time only
python main.py
```

Backend runs at `http://localhost:8000`

## Basic Usage

### Creating Your First Workspace

1. App opens with empty canvas
2. Click blocks in left sidebar to add them
3. Drag files directly onto canvas to create Document blocks

### Adding Blocks

**From Sidebar:**
- Click any block type (Chat, Document, Knowledge, Note)
- Block appears on canvas

**From File Drop:**
- Drag PDF/Markdown/TXT file onto canvas
- Document block auto-created with upload progress

### Connecting Blocks

1. Select a block (click it)
2. Block shows input/output ports
3. Drag from output port to compatible input port
4. Line connects the two blocks

### Using Chat with Documents

1. Add Document block (drag file)
2. Wait for "Parsed ✓" and "Indexed ✓"
3. Add Chat block
4. Select Document block → drag output port to Chat input
5. Type message in Chat block

## Keyboard Shortcuts

- `Delete` - Delete selected blocks
- `Ctrl+Z` - Undo (planned)
- `Ctrl+Y` - Redo (planned)
- `Ctrl+C/V` - Copy/Paste (planned)

## Current Limitations (Prototype)

- Chat uses simulated responses (no real LLM yet)
- Document parsing is simulated
- No actual RAG retrieval yet
- Packs are view-only
- No persistence (refreshing loses work)

## Next Steps

1. Configure AI model API keys (Settings)
2. Install real LLM backend
3. Add vector database for retrieval
4. Enable workspace persistence
