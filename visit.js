// One anonymous count per page view: which page, and where the visitor came from
// (a link's ?ref=, else the referring site, else direct). No cookie, no identifier.
// A visit that carried ?ref= sends its store taps through /get?c=<ref>, so that
// source's clicks to the App Store are counted beside its visits.
(function () {
  var q = new URLSearchParams(location.search);
  var ref = (q.get("ref") || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  var from = "";
  try { var h = new URL(document.referrer).hostname; if (h && h !== location.hostname) from = h; } catch (e) {}
  var page = location.pathname.split("/").filter(Boolean)[0] || "home";
  var url = "/v1/visit?page=" + encodeURIComponent(page) +
    (ref ? "&ref=" + ref : "") + (from ? "&from=" + encodeURIComponent(from) : "");
  try { fetch(url, { method: "POST", keepalive: true }); } catch (e) {}
  if (!ref) return;
  document.querySelectorAll('a[href^="https://apps.apple.com/app/id6808734717"]').forEach(function (a) {
    a.href = "/get?c=" + ref;
  });
})();

// Google Analytics, beside the count above. Where the law asks first (the EEA, the UK,
// Switzerland, Brazil) it stays cookieless until the visitor says yes; everywhere the
// choice in the small bar at the bottom is kept and respected.
(function () {
  var ID = "G-5N4KGDBRV8", KEY = "todid-analytics-choice";
  var choice = null; try { choice = localStorage.getItem(KEY); } catch (e) {}
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  var off = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  var on = { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  if (choice === "yes") gtag("consent", "default", on);
  else if (choice === "no") gtag("consent", "default", off);
  else {
    gtag("consent", "default", on);
    gtag("consent", "default", Object.assign({ region: ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH","BR"] }, off));
  }
  gtag("js", new Date());
  gtag("config", ID);
  var s = document.createElement("script"); s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID; document.head.appendChild(s);
  if (choice) return;

  var pt = (navigator.language || "").toLowerCase().indexOf("pt") === 0;
  var bar = document.createElement("div");
  bar.setAttribute("role", "dialog");
  bar.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;max-width:560px;margin:0 auto;z-index:50;background:#1A1A19;color:#fff;border-radius:16px;padding:14px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;font:14px/1.4 Archivo,-apple-system,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.18)";
  var text = document.createElement("span"); text.style.cssText = "flex:1 1 220px";
  text.innerHTML = (pt ? "Usamos o Google Analytics para entender as visitas ao site. " : "We use Google Analytics to understand visits to this site. ") +
    '<a href="/privacy/" style="color:#fff;text-decoration:underline">' + (pt ? "Privacidade" : "Privacy") + "</a>";
  function button(label, value, solid) {
    var b = document.createElement("button"); b.textContent = label;
    b.style.cssText = "border:0;border-radius:100px;padding:9px 16px;font:600 14px Archivo,-apple-system,sans-serif;cursor:pointer;" +
      (solid ? "background:#FF2E77;color:#fff" : "background:rgba(255,255,255,.14);color:#fff");
    b.onclick = function () {
      try { localStorage.setItem(KEY, value); } catch (e) {}
      gtag("consent", "update", value === "yes" ? on : off);
      bar.remove();
    };
    return b;
  }
  bar.appendChild(text);
  bar.appendChild(button(pt ? "Recusar" : "Decline", "no", false));
  bar.appendChild(button(pt ? "Aceitar" : "Accept", "yes", true));
  document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(bar); });
  if (document.readyState !== "loading") document.body.appendChild(bar);
})();
