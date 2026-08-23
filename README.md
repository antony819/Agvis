# Agvis - Modular AI Workspace

A desktop-first, visual workspace for building AI-powered workflows with drag-and-drop blocks.

## Features

- 🎨 **Visual Canvas** - Drag, drop, and connect AI blocks
- 📄 **Document Integration** - Drop files directly onto canvas for instant indexing
- 🤖 **AI Chat** - Connect documents to chat for context-aware responses
- 📚 **Knowledge Blocks** - Manage multiple documents as queryable collections
- 📝 **Note Blocks** - Markdown editor integrated into workspace
- 🔗 **Typed Connections** - Type-safe connections between blocks
- 📦 **Community Packs** - Share and install pre-built workspace configurations
- 🎛️ **Dual Modes** - Widget mode for direct use, automation mode for workflows

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.10+

### Frontend

```bash
cd Agvis
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Backend (Optional)

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend runs at `http://localhost:8000`

## Project Structure

```
Agvis/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Block types, API client
│   ├── store/         # Zustand state management
│   └── types/         # TypeScript types
├── backend/           # FastAPI backend
├── docs/              # Architecture docs
└── public/            # Static assets
```

## Core Concepts

### Blocks

Blocks are modular components that can operate in two modes:

- **Widget Mode** (default): Direct interaction, like standalone apps
- **Automation Mode**: Shows input/output ports for connections

Built-in block types:
- `Chat`: AI conversation with optional context
- `Document`: PDF/Markdown/TXT file with parsing & indexing
- `Knowledge`: Multi-document collection with retrieval
- `Note`: Markdown editor

### Connections

Blocks can be connected via typed ports:
- `Document → Knowledge`: Add document to collection
- `Knowledge → Chat`: Use collection as context
- Type checking prevents incompatible connections

### Packs

Packs are shareable workspace configurations containing:
- Block instances with positions
- Connections between blocks
- Configuration (excluding API keys)
- Dependencies and permissions

## Development

### Tech Stack

**Frontend:**
- React 19 + TypeScript
- @xyflow/react (canvas)
- Zustand (state)
- Vite (build)

**Backend:**
- FastAPI
- Python 3.13

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Architecture

See `docs/` for detailed architecture:
- `wireframes.md` - UI layouts
- `block-types.md` - Block specifications
- `contracts.md` - Data schemas and APIs
- `interactions.md` - UX patterns

## Roadmap

- [x] Visual canvas with drag & drop
- [x] Document upload & processing
- [x] Basic block types
- [x] Community pack catalog
- [ ] Real AI integration (OpenAI, Anthropic)
- [ ] Vector database (pgvector)
- [ ] Desktop listener (Tauri)
- [ ] Undo/redo history
- [ ] Real-time collaboration
- [ ] Pack marketplace

## License

MIT

## Contributing

Contributions welcome! Please check the issues for areas that need help.
