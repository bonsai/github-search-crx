const q = document.querySelector("#q");
const scope = document.querySelector("#scope");
const status = document.querySelector("#status");

document.querySelector("#search").addEventListener("click", async () => {
  const query = q.value.trim();
  if (!query) return;
  status.textContent = "検索中…";
  try {
    const result = await chrome.runtime.sendMessage({type:"github-search", q:query, scope:scope.value.trim()});
    if (result && result.error) throw new Error(result.error);
    status.textContent = (result.items || []).length + "件";
  } catch (e) { status.textContent = e.message; }
});
q.addEventListener("keydown", e => { if (e.key === "Enter") document.querySelector("#search").click(); });
document.querySelector("#sidebar").addEventListener("click", async () => {
  const win = await chrome.windows.getCurrent();
  await chrome.sidePanel.open({windowId: win.id});
});