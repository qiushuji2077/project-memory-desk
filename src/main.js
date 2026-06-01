import "./styles.css";
import projectsSeed from "../data/demo-projects.json";
import memoriesSeed from "../data/demo-memory-flow.json";
import prompts from "../data/demo-prompts.json";

const state = {
  projects: projectsSeed,
  memories: memoriesSeed,
  activeProjectId: projectsSeed[0].id,
  query: "",
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

const typeClass = {
  当前: "type-current",
  校方确认: "type-confirmed",
  客户确认: "type-confirmed",
  我方判断: "type-judgement",
  待确认: "type-pending",
};

const app = document.querySelector("#app");

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function activeProject() {
  return state.projects.find((project) => project.id === state.activeProjectId) ?? state.projects[0];
}

function projectMemories(projectId) {
  return state.memories
    .filter((item) => item.projectId === projectId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
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

function render() {
  const project = activeProject();
  const memories = projectMemories(project.id);

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
            <p class="eyebrow">Final Memory</p>
            <h3>最终记忆</h3>
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
              placeholder="写下一条项目记忆，支持粘贴会议纪要、访谈结论或当前判断。"
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
          <span>${memories.length} 条</span>
        </div>
        <div class="flow-list">
          ${memories.map(renderMemoryItem).join("")}
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
  return `
    <article class="flow-item">
      <div class="flow-meta">
        <time>${esc(item.date)}</time>
        <span class="type-tag ${typeClass[item.type] ?? ""}">${esc(item.type)}</span>
      </div>
      <p>${esc(item.content)}</p>
      <div class="flow-footer">
        <span class="memory-status ${statusClass[item.status] ?? ""}">${esc(item.status)}</span>
        <span class="source-chip">${esc(item.source)}</span>
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

  document.querySelector("#memory-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#memory-input");
    const content = input.value.trim();
    if (!content) {
      showToast("请先写入一条记忆");
      return;
    }
    const now = new Date();
    const isoDate = now.toISOString().slice(0, 10);
    state.memories = [
      {
        id: `local-${now.getTime()}`,
        projectId: activeProject().id,
        date: isoDate,
        type: "我方判断",
        content,
        status: "历史记录",
        source: "手动输入",
        relatedFiles: ["MD"],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      ...state.memories,
    ];
    input.value = "";
    showToast("已保存到本地状态");
    render();
  });
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

render();
