# Interaction Patterns

## Connection Visualization

### 連線狀態

```
[Document Block]
      │
      │ content
      ▼
[Knowledge Block]
      │
      │ context
      ▼
[Chat Block]
```

### 選中時顯示 Ports

```
        ●─── (unconnected input)
        │
┌───────┴─────────┐
│   Block Name    │
│   [Content...]  │
└───────┬─────────┘
        │
        ●─── (output: hovering shows type)
```

### 連線拖動

```
[Source Block]
      │
      │ dragging...
      ↓ (animated line following cursor)
      
[Target Block]
      ●─── (input port highlights when compatible)
```

## File Drop Interaction

1. User drags file over canvas
2. Canvas shows drop zone indicator
3. On drop, Document Block appears at cursor position
4. Block shows upload progress
5. After upload, shows parsing/indexing status
6. User can immediately click "Ask" to start chat

## Block Actions

### Widget Mode Actions
- Click block → select & show inspector
- Double-click → open in full view
- Right-click → context menu (duplicate, delete, convert to automation)
- Drag → move position
- Drag corner → resize

### Automation Mode Actions
- Hover port → show type tooltip
- Click port → start connection
- Drag from port → animated line follows cursor
- Drop on compatible port → create connection
- Drop on incompatible → show error feedback
- Click connection → select & show in inspector
- Delete key on connection → remove connection

## Design Principles

1. **乾淨優先**: 預設只顯示 Block 本身，不顯示 ports 和連線
2. **選中展開**: 選中 Block 才顯示 automation ports
3. **型別安全**: 只有相容類型的 ports 才能連接
4. **即時反饋**: 拖動時顯示可連接的目標
5. **狀態清晰**: Document parsing/indexing 顯示進度
6. **引用可點**: Chat 回答中的 citation 可點擊定位到原文
7. **復原支援**: 所有操作都可 undo/redo
8. **鍵盤優先**: 支援快捷鍵操作常見任務
