# Agvis Wireframes

## 1. Workspace Canvas (主畫面)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [≡] Workspace    [Library] [Community] [Settings]     [⎚][⟲][⟳][▶] │
├─────────────────────────────────────────────────────────────────────┤
│     │                                                         │      │
│  B  │                                                         │  I   │
│  l  │                                                         │  n   │
│  o  │                                                         │  s   │
│  c  │              Infinite Canvas                            │  p   │
│  k  │                                                         │  e   │
│     │          [Blocks dropped here]                          │  c   │
│  L  │                                                         │  t   │
│  i  │          [Drag files here]                              │  o   │
│  b  │                                                         │  r   │
│  r  │                                                         │      │
│  a  │                                                         │ (選中 │
│  r  │                                                         │  時   │
│  y  │                                                         │  才   │
│     │                                                         │  顯示)│
├─────┴─────────────────────────────────────────────────────────┴──────┤
│ [💬 Ask anything or @mention blocks...]                    [Send]   │
└─────────────────────────────────────────────────────────────────────┘
```

### 元素說明

**頂部工具列 (Top Toolbar)**
- `[≡]` - 展開/收合左側 Block Library
- Navigation: Workspace, Library, Community, Settings
- Tools: Select, Pan/Zoom, Undo, Redo, Run

**左側 Block Library (可收合)**
- 搜尋 blocks
- 分類：Chat, Documents, Knowledge, Notes, Tools, Output
- 拖放到畫布

**中央畫布 (Infinite Canvas)**
- 無限捲動/縮放
- 支援拖放檔案
- 顯示所有 Block instances
- 選中 Block 時才顯示 connection ports

**右側 Inspector (選中時顯示)**
- Block 名稱與類型
- 設定與參數
- Connection 管理
- 刪除/複製

**底部 AI Composer**
- 全局提問輸入框
- 可 @mention 特定 blocks
- 串流回答
