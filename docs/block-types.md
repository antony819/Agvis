# Block Types - Widget vs Automation Mode

## Chat Block

### Widget Mode (預設)
```
┌─────────────────────────────┐
│ 💬 Chat                 [⋮] │
├─────────────────────────────┤
│                             │
│  User: What is this?        │
│                             │
│  AI: This is a document...  │
│     [Source: doc.pdf p.3]   │
│                             │
├─────────────────────────────┤
│ [Type message...]    [Send] │
└─────────────────────────────┘
```

### Automation Mode (選中後)
```
        ●─── context (Knowledge)
        │
┌───────┴─────────────────────┐
│ 💬 Chat                 [⋮] │
├─────────────────────────────┤
│  [Conversation history...]  │
├─────────────────────────────┤
│ [Type message...]    [Send] │
└───────┬─────────────────────┘
        │
        ●─── response (Text)
```

## Document Block

### Widget Mode
```
┌─────────────────────────────┐
│ 📄 report.pdf           [⋮] │
├─────────────────────────────┤
│  ✓ Parsed                   │
│  ✓ Indexed (234 chunks)     │
│                             │
│  [Preview thumbnail]        │
│                             │
│  12 pages • 2.3 MB          │
├─────────────────────────────┤
│ [Ask] [View] [Download]     │
└─────────────────────────────┘
```

### Automation Mode
```
┌─────────────────────────────┐
│ 📄 report.pdf           [⋮] │
├─────────────────────────────┤
│  ✓ Indexed (234 chunks)     │
│  [Preview...]               │
└───────┬─────────────────────┘
        │
        ●─── content (Document)
        ●─── metadata (Object)
```

## Knowledge Block

### Widget Mode
```
┌─────────────────────────────┐
│ 📚 Project Docs         [⋮] │
├─────────────────────────────┤
│  3 documents               │
│  • report.pdf              │
│  • notes.md                │
│  • specs.txt               │
│                            │
│  Embedding: OpenAI         │
│  Chunk size: 512           │
├────────────────────────────┤
│ [+ Add Document]           │
└────────────────────────────┘
```

### Automation Mode
```
        ●─── documents (Document[])
        │
┌───────┴────────────────────┐
│ 📚 Project Docs        [⋮] │
├────────────────────────────┤
│  3 documents               │
│  [List...]                 │
└───────┬────────────────────┘
        │
        ●─── context (KnowledgeContext)
```

## Note Block

### Widget Mode
```
┌─────────────────────────────┐
│ 📝 My Notes             [⋮] │
├─────────────────────────────┤
│                             │
│  # Meeting Notes            │
│                             │
│  - Decision: Use React      │
│  - TODO: Setup DB           │
│                             │
│  [Markdown editor...]       │
│                             │
└─────────────────────────────┘
```

### Automation Mode
```
        ●─── input (Text)
        │
┌───────┴─────────────────────┐
│ 📝 My Notes             [⋮] │
├─────────────────────────────┤
│  [Markdown content...]      │
└───────┬─────────────────────┘
        │
        ●─── content (Text)
```
