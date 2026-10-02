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
