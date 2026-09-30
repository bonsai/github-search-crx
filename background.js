const LOG_KEY = "githubSearchJsonl";
const RESULT_KEY = "githubSearchLastResult";

function buildQuery(q, scope) {
  let qualifier = "";
  if (scope) qualifier = /^org:/i.test(scope) ? scope : (/^[^:]+$/.test(scope) ? "user:" + scope : scope);
  return [qualifier, "type:repo", q].filter(Boolean).join(" ");
}

async function appendLog(record) {
  const data = await chrome.storage.local.get(LOG_KEY);
  const lines = data[LOG_KEY] || "";
  await chrome.storage.local.set({[LOG_KEY]: lines + JSON.stringify(record) + "\n"});
}

async function searchGitHub(q, scope) {
  const githubQuery = buildQuery(q, scope);
  const url = "https://api.github.com/search/repositories?per_page=30&q=" + encodeURIComponent(githubQuery);
  const response = await fetch(url, {headers:{"Accept":"application/vnd.github+json"}});
  if (!response.ok) throw new Error("GitHub API: " + response.status + " " + response.statusText);
  const data = await response.json();

  const result = {
    q:q, scope:scope || "", type:"repo", github_query:githubQuery,
    total_count:data.total_count || 0,
    items:(data.items || []).map(repo => ({
      name:repo.full_name, url:repo.html_url, description:repo.description || "",
      stars:repo.stargazers_count || 0, language:repo.language || null
    }))
  };
  await chrome.storage.local.set({[RESULT_KEY]:result});
  await appendLog({q:q, scope:scope || "", type:"repo", ts:new Date().toISOString()});
  return result;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "github-search") return;
  searchGitHub(message.q, message.scope).then(sendResponse).catch(e => sendResponse({error:e.message}));
  return true;
});