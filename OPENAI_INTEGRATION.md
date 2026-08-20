# OpenAI 整合使用指南

## 已完成功能

### Backend
- ✅ 整合 OpenAI Python SDK
- ✅ 真實 streaming chat completion (SSE)
- ✅ API key 驗證端點
- ✅ 支援 document context 注入

### Frontend
- ✅ Settings store (localStorage 持久化)
- ✅ API key 管理與測試
- ✅ Model 選擇 (gpt-4, gpt-4o, gpt-3.5-turbo)
- ✅ ChatBlock 整合真實 AI

## 使用步驟

### 1. 安裝 Backend 依賴

```bash
cd backend
pip install -r requirements.txt
```

### 2. 啟動 Backend

```bash
cd backend
python main.py
```

Backend 會在 `http://localhost:8000` 啟動

### 3. 啟動 Frontend

```bash
npm run dev
```

Frontend 會在 `http://localhost:5173` 啟動

### 4. 設定 API Key

1. 開啟 Agvis
2. 點擊右上角設定圖示 (⚙️)
3. 在 "OpenAI API key" 欄位輸入你的 API key (格式: `sk-...`)
4. 點擊 **Test** 按鈕驗證
5. 看到 "✓ Connection successful" 即可使用

### 5. 使用 Chat Block

1. 回到 Workspace
2. 新增一個 Chat Block (從 Add Block panel)
3. 在 Chat Block 中輸入訊息
4. 真實的 AI 回應會即時 streaming 顯示

## 設定說明

### Model 選擇
- **gpt-4o**: 最新、最快、最便宜的旗艦模型 (推薦)
- **gpt-4**: 原始旗艦模型，更保守
- **gpt-3.5-turbo**: 最便宜，速度快，適合簡單任務

### 錯誤處理

**"⚠ No API key configured"**
→ 到 Settings 設定 API key

**"✗ Connection failed"**
→ 檢查 API key 是否正確、是否有額度

**"Backend is offline"**
→ 確認 backend 是否在 localhost:8000 運行

## 已持久化的設定

以下設定會自動儲存到 localStorage：
- ✅ API Key
- ✅ Model selection
- ✅ Embedding model
- ✅ Chunk size
- ✅ Chunk overlap

重新整理頁面後設定會保留。

## 下一步建議

1. **Workspace 持久化** - workspace 狀態也存到 localStorage
2. **真實 RAG** - backend 接入 PyMuPDF + vector DB
3. **Tauri desktop listener** - 全域快捷鍵
4. **多 provider 支援** - Anthropic, Gemini, etc.
