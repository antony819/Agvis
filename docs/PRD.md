# Agvis Product Requirements Document

**版本：** 0.1  
**狀態：** Product direction / implementation roadmap  
**最後更新：** 2026-08-24  
**平台策略：** Windows desktop first，之後延伸至 Raspberry Pi / connected devices

## 1. Product Summary

Agvis 係一個 desktop Jarvis，會根據用戶當下想完成嘅任務，動態建立、執行、檢查同保存一個工作環境。

傳統 Jarvis 通常係固定 dashboard：Chat、Weather、Clock、Calendar 同幾個預先寫死嘅功能。Agvis 嘅核心假設係：

> Jarvis 唔應該只有一個固定 interface；佢應該為每一個任務組合一個合適嘅 workspace。

Agvis 會保留 blocks、typed connections、widget mode、automation mode 同 packs 作為底層機制，但用戶嘅主要入口應該係「我想完成咩」，而唔係「我要拖邊幾個 blocks」。

## 2. Problem Statement

現有 Jarvis 類 project 常見限制：

- UI 及功能位置係固定，新增能力通常只係新增一個 panel。
- Chat、文件、calendar、automation 等功能互相分離，唔容易組合成完整工作流程。
- 用戶要先理解技術元件，先可以開始工作。
- AI 執行結果、來源、prompt 同中間步驟唔透明。
- 一次完成嘅工作難以保存、重跑、修改或分享。

Agvis 要解決嘅唔係「再加一個 AI chat」，而係：

> 讓用戶用自然語言描述任務，然後得到一個可直接使用、可檢查、可修改、可重用嘅 desktop workspace。

## 3. Target Users

### Primary users

- 需要處理大量文件嘅 researcher、student、analyst。
- 需要將多步 AI 工作保存成流程嘅 power user。
- 想由自然語言開始，而唔想先學 node editor 嘅一般 desktop user。

### Secondary users

- 需要 codebase、documentation 或 code review context 嘅 developer。
- 想製作及分享 AI workflow template 嘅 technical creator。

### 非目標用戶

- 只需要固定 smart-home voice assistant 嘅用戶。
- 需要完整 enterprise automation、CRM、ERP integration 嘅團隊。
- 只想自己寫 agent orchestration code 嘅 framework developer。

## 4. Product Principles

1. **Intent first**：用戶先講任務，唔需要先理解 blocks。
2. **Canvas as an escape hatch**：canvas 用嚟檢查及修改 workspace，唔係新用戶必經嘅技術門檻。
3. **Inspectable by default**：每個結果都應該可以追溯來源、input、model、prompt 同執行狀態。
4. **Reusable work**：完成嘅 workspace 應該可以保存、duplicate、export、import 同分享。
5. **Permission-aware**：讀文件、network、execute code、microphone 同 device control 必須清楚顯示及獲得批准。
6. **PC-first, device-ready**：先做好 Windows desktop；底層 capability model 預留將來接 Raspberry Pi。
7. **Reliable over broad**：先完成少數 end-to-end workflows，再擴展 block 數量及 integrations。

## 5. Product Experience

### 5.1 Primary loop

```text
Describe intent
→ Generate or open workspace
→ Use the workspace
→ Inspect results and sources
→ Modify by conversation or canvas
→ Save, duplicate, export, or share
```

### 5.2 Example

用戶輸入：

> 「幫我分析呢幾份文件，整理重點、列出待辦事項，最後保存成研究筆記。」

Agvis 生成：

```text
Documents → Knowledge → Summary / Extract → Action Items → Notes
```

用戶之後可以講：

- 「加入一個比較表。」
- 「只使用最近一個月嘅文件。」
- 「將結果輸出成 Markdown。」
- 「保存成 Research Pack。」

### 5.3 Workspace views

- **Use view**：普通用戶直接使用，顯示 inputs、outputs、sources 同必要 controls。
- **Build view**：拖拉、連線、修改 block config 及 prompt。
- **Inspect view**：查看 execution graph、每一步結果、錯誤、sources、model 同 token / cost metadata。

## 6. Scope Priorities

優先級定義：

- **P0**：第一個可用產品必須有。沒有就無法證明核心概念。
- **P1**：完成核心 loop 後立即改善產品差異化及日常可用性。
- **P2**：令產品變得更完整，但唔應該阻塞第一個可用版本。
- **Future**：需要較大平台、硬件、社群或商業基礎，暫時只保留方向。

## 7. P0 Requirements

### P0-1. Windows desktop shell

**目標：** Agvis 係可安裝、可啟動嘅 desktop software，而唔係只係瀏覽器頁面。

**要求：**

- 使用 Tauri + React/Vite，保留現有前端架構。
- Windows 開始功能表及 desktop app 啟動。
- 關閉及重開後 workspace 資料仍然存在。
- 處理 backend lifecycle；backend offline 時顯示清晰錯誤。
- 支援基本 window state、minimize、close。

**驗收：** 新用戶安裝後可以直接開 app，重開後仍然見到上次 workspace，唔需要手動開 Vite server。

### P0-2. Local workspace persistence

**目標：** Workspace 係實際資產，而唔係 refresh 後消失嘅暫存 UI。

**要求：**

- 保存 workspace、blocks、edges、viewport、block results 同 metadata。
- 支援 create、rename、open、duplicate、delete、archive。
- 以 versioned schema 保存資料，方便將來 migration。
- 支援 workspace JSON export / import。
- 未保存更改要有 dirty state 及 recovery 提示。

**驗收：** 用戶完成一個 workflow 後重開 app，可以恢復內容、連線、結果及最後 viewport。

### P0-3. Intent-first workspace creation

**目標：** 用戶可以由任務開始，而唔係由空白 canvas 開始。

**要求：**

- 提供全域 AI Composer / onboarding prompt。
- 第一階段支援最少三個受控 templates：Document Q&A、Research Notes、Meeting Notes。
- AI 根據 intent 選擇 template，生成 blocks、edges、名稱及初始 prompt。
- 生成前顯示簡短 plan；用戶可以確認或取消。
- 生成失敗時保留原有 workspace，唔可以破壞用戶資料。

**驗收：** 新用戶輸入一個支援嘅任務後，60 秒內得到一個可操作 workspace，而唔需要手動拖拉及連線。

### P0-4. Reliable document workflow

**目標：** 完成 Agvis 第一條可驗證嘅 end-to-end workflow。

**要求：**

- 支援 PDF、Markdown、TXT 檔案。
- 真正 parsing、chunking、indexing；唔可以只模擬 status。
- 每個 workspace 有獨立 document scope。
- Knowledge block 支援 retrieval，並保存 source chunk metadata。
- Chat 回答要支援 citation，至少包括 filename 及原文 snippet；PDF 可加入 page number。
- 文件 processing 失敗要顯示原因及 retry。
- 用戶可以移除、重新上載或 refresh 文件 index。

**驗收：** 用戶放入測試文件後，問一條只可以由文件回答嘅問題，回答必須包含正確來源；無足夠資料時要明確表示不知道。

### P0-5. Workflow execution state

**目標：** 用戶清楚知道 workflow 是否正在執行、完成或失敗。

**要求：**

- 支援 Run workflow、Run from block、Cancel、Retry。
- Block 狀態至少包括 `idle`、`queued`、`running`、`success`、`failed`、`cancelled`。
- 顯示目前執行步驟及錯誤原因。
- 保留最近一次 execution result。
- 避免因重跑造成重複文件、重複 note 或資料損壞。

**驗收：** 用戶可以由一次 execution 清楚知道邊個 block 失敗，修正後只重跑需要嘅部分。

### P0-6. Core block contract

**目標：** 將 blocks 由純 UI 元件提升為可執行工作單元。

**要求：** 每個 block type 必須定義：

- input / output port type
- config schema
- execution handler
- output schema
- loading / error state
- permission requirements
- version

P0 只需要完成：Document、Knowledge、Chat、Note、Composer。Output、Group、外部工具 blocks 暫不作為核心依賴。

### P0-7. Basic safety and secrets

**目標：** Desktop app 處理本機文件及 API key 時有基本安全邊界。

**要求：**

- API keys 不保存喺普通 workspace JSON。
- 使用 OS secure storage；pack 只保存 provider requirement。
- 每個 workspace 顯示 network access 需求。
- 所有外部請求有明確 provider / endpoint。
- 不支援任意 command execution，除非用戶明確批准並列入後續版本。

## 8. P1 Requirements

### P1-1. Conversational workspace mutation

用戶可以用自然語言修改現有 workspace：

- 新增、刪除、重排 block。
- 建立或移除連線。
- 修改 prompt、model、output format。
- 將 output 連接到 Note 或 Export。
- 顯示 proposed changes，確認後才套用。
- 支援 undo / redo。

例子：

> 「加一個 action items block，將 summary 接過去，並保存到 notes。」

### P1-2. First-class artifacts and citations

- Chat answer、summary、table、note、extracted object 都可以成為 artifact。
- Artifact 可以 preview、copy、save、pin、export。
- Citation 可以點擊，定位到 source document / chunk。
- Artifact 保留產生佢嘅 execution、model、prompt version 同 timestamp。

### P1-3. Better widget / automation mode

- Use view 預設隱藏 technical ports。
- Build view 顯示 ports、types 同 connections。
- Block 可由 widget mode 轉 automation mode。
- 完成嘅 automation workflow 可以包裝成簡單 widget。
- Widget 顯示清晰 inputs、outputs 同 run button。

### P1-4. Pack import, export and install

- Pack 可以由 workspace export 成 versioned manifest。
- Install pack 前顯示 blocks、models、API keys、permissions 同 network requirements。
- Install 後真正建立 blocks 同 edges，而唔係只改 UI installed state。
- 支援 placeholder configuration。
- 支援 pack validation、minimum app version 同 basic migration。
- 支援 duplicate / fork pack。

### P1-5. Execution history and debugging

- 保存 execution history、input snapshot、output snapshot、duration、status。
- 由結果跳返來源 block。
- 允許比較兩次 execution。
- 顯示 model、prompt version 及可選 usage / cost metadata。
- 支援 failed run retry。

### P1-6. PC capabilities

將 desktop-specific abilities 以 capability API 提供，唔直接散落喺 UI：

- Open local file / folder。
- File picker 及 drag-and-drop。
- Clipboard read / write。
- Desktop notification。
- Global shortcut 叫出 Composer。
- Capability availability、permission、device metadata。

### P1-7. Guided workspace onboarding

- 首次啟動提供三個 task templates。
- Empty canvas 顯示清楚入口：describe task、drop file、choose template。
- Template 可預覽將會建立嘅 workflow。
- Demo mode 使用 sample data，唔需要 API key 都可以理解產品流程。

## 9. P2 Requirements

### P2-1. Expanded block library

在 P0/P1 execution contract 穩定後加入：

- Web page / URL reader。
- Structured Extract block。
- Summarize block。
- Classification block。
- Table / JSON output block。
- Markdown / PDF export block。
- Folder watcher。
- Email draft block。
- Calendar read block。

每個新 block 必須有 schema、permission、execution state、error handling 及 test fixture。

### P2-2. Local model support

- Ollama 或其他 local model provider。
- Provider abstraction，避免 Chat / Knowledge 寫死 OpenAI。
- Clear local / cloud data route indicator。
- Embedding provider 可獨立設定。
- Offline mode 至少可以開啟及查看已保存 workspace。

### P2-3. Desktop assistant behaviours

- System tray。
- Configurable global hotkey。
- Background workspace triggers。
- Watch folder trigger。
- Scheduled execution。
- Desktop notification on completion / failure。
- Optional microphone input，但唔要求 always-on wake word。

### P2-4. Workspace sharing

- Shareable pack preview。
- Read-only workspace export。
- Import validation report。
- Clear dependency and permission manifest。
- Basic local pack library。

### P2-5. Quality and reliability

- Crash recovery。
- Background job queue。
- Rate limit handling。
- Provider timeout / retry policy。
- Large document processing progress。
- Basic telemetry opt-in，避免上傳文件內容。
- Automated end-to-end test for the three core templates。

## 10. Future Direction

以下功能屬於 Agvis 長期方向，P0-P2 未完成前不應該成為 release blocker。

### Future A. Raspberry Pi / connected device endpoint

Raspberry Pi 係 always-available endpoint，而唔係將 PC canvas 原封不動搬過去。

**PC：** 建立 workspace、編輯 workflow、查看大量 context、debug、管理 packs。  
**Device：** voice input、speaker output、快速查詢、sensor、GPIO、physical trigger。

需要嘅基礎能力：

- Device registration / pairing。
- Capability discovery。
- Device availability。
- Authentication。
- Per-device permissions。
- Remote execution status。
- Offline queue / reconnect。
- Secure transport。

### Future B. Voice-first interaction

- Speech-to-text。
- Text-to-speech。
- Wake word。
- Conversation continuity。
- Voice confirmation for risky actions。
- Push-to-talk fallback。

### Future C. Safe system actions

- Launch application。
- Read / write selected folders。
- Shell command execution with explicit approval。
- Screenshot / screen context。
- Browser control。
- Device and smart-home integrations。

所有 system action 都必須經 permission、confirmation、audit log 同可撤銷設計，唔應該以「AI 自動幫你做晒」作為無限制權限理由。

### Future D. Collaboration and ecosystem

- Real-time collaboration。
- Pack marketplace。
- Pack reviews、signing、trust levels。
- Creator analytics。
- Team workspaces。
- Organization policy and admin controls。

### Future E. Adaptive UI research

- AI 自動決定 layout。
- Task-specific temporary views。
- User preference memory。
- Workspace state transition，例如 research mode → presentation mode。
- Multi-device continuity。

## 11. Non-goals for the First Release

以下內容唔納入第一個可用 desktop release：

- Raspberry Pi hardware control。
- Always-on microphone / wake word。
- Smart home automation。
- Arbitrary code execution。
- Real-time multiplayer collaboration。
- Public marketplace。
- 支援大量第三方 integrations。
- 自主 agent 長時間無人監督執行。
- 取代 ChatGPT、Cursor 或 n8n 所有用途。

## 12. Success Metrics

### Product metrics

第一個公開 desktop beta 以以下指標衡量：

- 新用戶可以喺 5 分鐘內建立第一個 workspace。
- 至少 70% 測試用戶可以由 intent 完成一個 core template。
- Document Q&A 測試問題 citation accuracy 至少 90%。
- Core template execution success rate 至少 95%（排除 provider outage）。
- Workspace 重開後資料恢復率 100%。
- Pack export / import round-trip 不遺失 blocks、edges 及必要 config。
- 新用戶可以用一句話完成最少一次 workspace mutation。

### Community metrics

GitHub 早期唔應只追 stars，應觀察：

- Demo / README 到 clone 嘅轉換。
- 首次成功 run 比例。
- Issue 是否集中於真實 workflow，而唔係安裝失敗。
- Pack export / import 使用量。
- 重複開啟 workspace 嘅用戶比例。
- 有冇人分享自己嘅 template / pack。

## 13. Suggested Milestones

### Milestone 0：Foundation

- Tauri desktop shell。
- Local persistence。
- Versioned workspace schema。
- Secure secrets storage。
- Basic app/backend lifecycle。

### Milestone 1：Proof of value

- Document Q&A template。
- 真 parsing、indexing、retrieval、citations。
- Run state、retry、error display。
- Demo mode。
- Windows installer。

### Milestone 2：Dynamic Jarvis loop

- Intent composer。
- Template selection and generation。
- Conversational workspace mutation。
- Use / Build / Inspect views。
- Workspace save、duplicate、export/import。

### Milestone 3：Reusable ecosystem

- Pack install、validation、permissions。
- Execution history。
- More blocks and export types。
- Local model provider。
- PC capabilities：hotkey、notification、file access。

### Milestone 4：Device extension

- Capability API 穩定化。
- Device pairing。
- Raspberry Pi daemon。
- Voice endpoint。
- Remote execution and reconnect。

## 14. Architecture Decisions to Preserve

現有 implementation 已經有幾個適合長期保留嘅方向：

- `BlockTypeDefinition` versioning。
- Typed ports and connection validation。
- Widget mode / automation mode。
- Pack manifest with dependencies and permissions。
- Workspace、block、edge 分開建模。
- Frontend React/Vite 與 backend API 分離。

需要優先補強嘅地方：

- 將 execution contract 加入 block definition。
- 將 result、execution、error、permission 變成正式資料模型。
- 將 workspace persistence 由 memory state 升級成 versioned storage。
- 將 mock document processing、mock pack catalog、simulated chat 清楚分開於 demo mode。
- 以 provider abstraction 取代 backend 對單一 OpenAI implementation 嘅依賴。
- 以 capability API 為將來 PC、Raspberry Pi 及其他 device 提供一致介面。

## 15. Release Gate

Agvis 唔應該以「有幾多 blocks」作為 release gate。第一個 desktop beta 必須滿足：

- 安裝後可以獨立啟動。
- Workspace 可以保存及恢復。
- 至少一條 document workflow 真正 end-to-end 運行。
- 回答有可驗證 citations。
- Run 失敗時用戶知道原因並可以 retry。
- Intent 可以生成一個可操作 template。
- API key、文件權限及 network access 有清楚邊界。
- Demo、README 同產品 UI 對功能狀態描述一致。

如果以上條件未完成，應該繼續視為 prototype，而唔係擴展到 marketplace、Raspberry Pi 或大量 integrations。
