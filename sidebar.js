const meta = document.querySelector("#meta");
const results = document.querySelector("#results");

function render(data) {
  if (!data) { meta.textContent = "検索結果なし"; results.replaceChildren(); return; }
  meta.textContent = data.total_count + "件 / " + data.github_query;
  results.replaceChildren();
  for (const item of data.items || []) {
    const article = document.createElement("article"); article.className = "repo";
    const link = document.createElement("a"); link.href = item.url; link.target = "_blank"; link.textContent = item.name;
    const desc = document.createElement("div"); desc.textContent = item.description;
    const info = document.createElement("div"); info.className = "meta";
    info.textContent = "★ " + item.stars + " / " + (item.language || "-");
    article.append(link, desc, info); results.append(article);
  }
}
chrome.storage.local.get("githubSearchLastResult").then(data => render(data.githubSearchLastResult));
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.githubSearchLastResult) render(changes.githubSearchLastResult.newValue);
});