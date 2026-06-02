import "./styles.css";
import projectsSeed from "../data/demo-projects.json";
import memoriesSeed from "../data/demo-memory-flow.json";
import prompts from "../data/demo-prompts.json";

const state = {
  projects: projectsSeed,
  memories: memoriesSeed,
  activeProjectId: projectsSeed[0].id,
  query: "",
  flowFilter: "all",
  filterOpen: false,
  toast: "",
};

const promptEntries = [
  ["manual", "手动输入"],
  ["conversation", "从对话提取"],
  ["audio", "从录音提取"],
  ["file", "从文件提取"],
];

const statusClass = {
  当前采用: "is-current",
  历史记录: "is-history",
  已替代: "is-replaced",
};

// 记忆流规范 v1：封闭词表 4+1，每个前缀映射到展示样式与三条分拣流。
// 三流：confirmed（已确认·原话）/ judgment（判断）/ current（当前·待确认）；
// 废弃单独成流，仅在「全部」可见，不污染日常筛选。
const TYPE_META = {
  定: { class: "type-decided", stream: "confirmed" },
  原话: { class: "type-quote", stream: "confirmed" },
  判断: { class: "type-judgement", stream: "judgment" },
  待确认: { class: "type-pending", stream: "current" },
  废弃: { class: "type-retired", stream: "retired" },
};

const TYPE_WORDS = Object.keys(TYPE_META);

const flowFilters = [
  ["all", "全部"],
  ["current", "当前 · 待确认"],
  ["confirmed", "已确认 · 原话"],
  ["judgment", "判断"],
];

const app = document.querySelector("#app");

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function typeMeta(type) {
  return TYPE_META[type] ?? { class: "type-pending", stream: "current" };
}

function streamOf(type) {
  return typeMeta(type).stream;
}

// 解析统一格式「类型【来源】：内容」（来源可省）。无前缀则默认待确认。
function parseMemo(raw) {
  const text = String(raw ?? "").trim();
  const pattern = new RegExp(`^(${TYPE_WORDS.join("|")})(?:【([^】]*)】)?\\s*[：:]\\s*([\\s\\S]*)$`);
  const matched = text.match(pattern);
  if (matched) {
    return {
      type: matched[1],
      source: (matched[2] || "").trim() || "手动输入",
      content: matched[3].trim(),
    };
  }
  return { type: "待确认", source: "手动输入", content: text };
}

function activeProject() {
  return state.projects.find((project) => project.id === state.activeProjectId) ?? state.projects[0];
}

function projectMemories(projectId) {
  return state.memories
    .filter((item) => item.projectId === projectId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function filteredMemories(projectId) {
  const all = projectMemories(projectId);
  if (state.flowFilter === "all") return all;
  return all.filter((item) => streamOf(item.type) === state.flowFilter);
}

function visibleProjects() {
  const q = state.query.trim().toLowerCase();
  if (!q) return state.projects;
  return state.projects.filter((project) => {
    const hay = [project.name, project.status, project.summary, ...project.tags].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

function blockLabel(key) {
  return {
    current: "当前状态",
    decided: "已定",
    pending: "待定",
    nextStep: "下一步",
  }[key];
}

function flowFilterLabel() {
  if (state.flowFilter === "all") return "筛选";
  return flowFilters.find(([key]) => key === state.flowFilter)?.[1] ?? "筛选";
}

function render() {
  const project = activeProject();
  const allMemories = projectMemories(project.id);
  const memories = filteredMemories(project.id);

  app.innerHTML = `
    <main class="workspace">
      <aside class="project-rail">
        <div class="brand">
          <div class="brand-mark">PMD</div>
          <div>
            <p class="eyebrow">Project Memory Desk</p>
            <h1>项目记忆台</h1>
          </div>
        </div>
        <label class="search-wrap">
          <span>搜索</span>
          <input id="project-search" value="${esc(state.query)}" placeholder="搜索项目" autocomplete="off" />
        </label>
        <div class="project-list">
          ${visibleProjects().map(renderProjectButton).join("")}
        </div>
      </aside>

      <section class="memory-stage">
        <header class="stage-header">
          <div>
            <p class="eyebrow">${esc(project.tags.join(" · "))}</p>
            <h2>${esc(project.name)}</h2>
          </div>
          <span class="date-pill">最近更新 ${esc(project.lastUpdated)}</span>
        </header>

        <section class="state-grid" aria-label="项目状态">
          ${Object.entries(project.stateBlocks).map(([key, value]) => `
            <article class="state-card">
              <span>${blockLabel(key)}</span>
              <strong>${esc(value)}</strong>
            </article>
          `).join("")}
        </section>

        <section class="final-memory">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Final Memory</p>
              <h3>最终记忆</h3>
            </div>
            <button type="button" class="ghost-button" id="copy-final-prompt">复制整理提示词</button>
          </div>
          <p>${esc(project.finalMemory)}</p>
        </section>

        <section class="entry-panel">
          <div class="section-heading">
            <p class="eyebrow">Capture</p>
            <h3>录入记忆</h3>
          </div>
          <div class="prompt-grid">
            ${promptEntries.map(([key, label]) => renderPromptCard(key, label)).join("")}
          </div>
          <form id="memory-form" class="memory-form">
            <textarea
              id="memory-input"
              placeholder="按「类型【来源】：内容」写一条记忆，如「定【对方确认】：主题与结构方向已拍板」。类型限定 / 判断 / 原话 / 待确认 / 废弃，不写前缀默认进入待确认。"
            ></textarea>
            <button type="submit">保存记忆</button>
          </form>
        </section>
      </section>

      <aside class="flow-panel">
        <div class="flow-title">
          <div>
            <p class="eyebrow">Memory Flow</p>
            <h2>记忆流</h2>
          </div>
          <div class="flow-tools">
            <span class="flow-count">${memories.length}/${allMemories.length}</span>
            <button type="button" class="flow-tool" id="flow-export" title="导出最终记忆 + 完整记忆流为 Markdown 快照">导出</button>
            <div class="flow-filter">
              <button type="button" class="flow-tool ${state.flowFilter === "all" ? "" : "active"}" id="flow-filter-toggle">${esc(flowFilterLabel())}</button>
              <div class="flow-filter-pop ${state.filterOpen ? "open" : ""}">
                ${flowFilters.map(([key, label]) => `
                  <button type="button" class="flow-filter-chip ${state.flowFilter === key ? "on" : ""}" data-filter="${esc(key)}">${esc(label)}</button>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
        <div class="flow-list">
          ${memories.length
            ? memories.map(renderMemoryItem).join("")
            : `<p class="flow-empty">该筛选下暂无记忆</p>`}
        </div>
      </aside>
    </main>
    <div class="toast ${state.toast ? "show" : ""}">${esc(state.toast)}</div>
  `;

  bindEvents();
}

function renderProjectButton(project) {
  const active = project.id === state.activeProjectId;
  return `
    <button class="project-button ${active ? "active" : ""}" data-project-id="${esc(project.id)}">
      <span class="status-dot" aria-hidden="true"></span>
      <span class="project-copy">
        <strong>${esc(project.name)}</strong>
        <small>${esc(project.status)} · ${esc(project.lastUpdated)}</small>
        <span class="project-tags">${project.tags.map((tag) => `<em>${esc(tag)}</em>`).join("")}</span>
      </span>
    </button>
  `;
}

function renderPromptCard(key, label) {
  const item = prompts[key];
  return `
    <article class="prompt-card">
      <div>
        <strong>${esc(label)}</strong>
        <p>${esc(item.description)}</p>
      </div>
      <pre>${esc(item.prompt)}</pre>
      <button type="button" data-copy-prompt="${esc(key)}">一键复制提示词</button>
    </article>
  `;
}

function renderMemoryItem(item) {
  const meta = typeMeta(item.type);
  return `
    <article class="flow-item">
      <div class="flow-meta">
        <time>${esc(item.date)}</time>
        <span class="type-tag ${meta.class}">${esc(item.type)}</span>
      </div>
      <p>${esc(item.content)}</p>
      <div class="flow-footer">
        <span class="memory-status ${statusClass[item.status] ?? ""}">${esc(item.status)}</span>
        ${item.source ? `<span class="source-chip">${esc(item.source)}</span>` : ""}
        <span class="file-chips">
          ${item.relatedFiles.map((file) => `<i>${esc(file)}</i>`).join("")}
        </span>
      </div>
    </article>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-project-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeProjectId = button.dataset.projectId;
      state.filterOpen = false;
      render();
    });
  });

  document.querySelector("#project-search").addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  document.querySelectorAll("[data-copy-prompt]").forEach((button) => {
    button.addEventListener("click", async () => {
      const promptKey = button.dataset.copyPrompt;
      await copyText(prompts[promptKey].prompt);
      showToast("提示词已复制");
    });
  });

  document.querySelector("#copy-final-prompt").addEventListener("click", async () => {
    await copyText(prompts.finalMemoryFromFlow.prompt);
    showToast("整理提示词已复制");
  });

  document.querySelector("#flow-export").addEventListener("click", exportSnapshot);

  document.querySelector("#flow-filter-toggle").addEventListener("click", (event) => {
    event.stopPropagation();
    state.filterOpen = !state.filterOpen;
    render();
  });

  document.querySelectorAll("[data-filter]").forEach((chip) => {
    chip.addEventListener("click", (event) => {
      event.stopPropagation();
      state.flowFilter = chip.dataset.filter;
      state.filterOpen = false;
      render();
    });
  });

  document.querySelector("#memory-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#memory-input");
    const raw = input.value.trim();
    if (!raw) {
      showToast("请先写入一条记忆");
      return;
    }
    const now = new Date();
    const isoDate = now.toISOString().slice(0, 10);
    const parsed = parseMemo(raw);
    state.memories = [
      {
        id: `local-${now.getTime()}`,
        projectId: activeProject().id,
        date: isoDate,
        type: parsed.type,
        content: parsed.content,
        status: "历史记录",
        source: parsed.source,
        relatedFiles: ["MD"],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      ...state.memories,
    ];
    input.value = "";
    showToast(`已保存为「${parsed.type}」`);
    render();
  });
}

function buildSnapshot(project, memories) {
  const lines = [];
  lines.push(`# ${project.name} · 记忆快照`);
  lines.push("");
  lines.push(`导出时间：${new Date().toLocaleString()}`);
  lines.push(`最近更新：${project.lastUpdated}`);
  lines.push("");
  lines.push("## 最终记忆");
  Object.entries(project.stateBlocks).forEach(([key, value]) => {
    lines.push(`- ${blockLabel(key)}：${value}`);
  });
  lines.push("");
  lines.push(project.finalMemory);
  lines.push("");
  lines.push(`## 记忆流（${memories.length} 条）`);
  memories.forEach((item) => {
    const source = item.source ? `【${item.source}】` : "";
    lines.push(`- [${item.date}] ${item.type}${source}：${item.content}（${item.status}）`);
  });
  lines.push("");
  return lines.join("\n");
}

function exportSnapshot() {
  const project = activeProject();
  const memories = projectMemories(project.id);
  const markdown = buildSnapshot(project, memories);
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[-:T]/g, "");
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${project.name}-记忆快照-${stamp}.md`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("已导出记忆快照");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function showToast(message) {
  state.toast = message;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    state.toast = "";
    render();
  }, 1800);
}

// 点击筛选面板以外的区域时收起下拉（toggle/chip 自身已 stopPropagation）。
document.addEventListener("click", () => {
  if (state.filterOpen) {
    state.filterOpen = false;
    render();
  }
});

render();
