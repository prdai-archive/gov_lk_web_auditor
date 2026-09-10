(function () {
  var search = document.getElementById("q");
  var level = document.getElementById("f-level");
  var status = document.getElementById("f-status");
  var rows = Array.prototype.slice.call(document.querySelectorAll("tbody tr[data-search]"));
  var page = 1;
  var perPage = parseInt(document.getElementById("page-size") ? document.getElementById("page-size").value : "25", 10);
  var filtered = [];
  function apply() {
    var q = search.value.toLowerCase();
    filtered = [];
    rows.forEach(function (row) {
      var ok =
        row.dataset.search.indexOf(q) !== -1 &&
        (level.value === "" || row.dataset.level === level.value) &&
        (status.value === "" || row.dataset.status === status.value);
      if (ok) filtered.push(row);
      row.style.display = "none";
    });
    page = 1;
    paginate();
  }
  function paginate() {
    var shown = filtered;
    var total = shown.length;
    var start = (page - 1) * perPage;
    var end = start + perPage;
    rows.forEach(function (row) { row.style.display = "none"; });
    for (var i = start; i < end && i < total; i++) { shown[i].style.display = ""; }
    var countEl = document.getElementById("result-count");
    if (countEl) countEl.textContent = (total === rows.length ? rows.length : start + 1 + "\u2013" + Math.min(end, total) + " of " + total) + " sites shown";
    renderPagination(total, start, end);
  }
  function renderPagination(total, start, end) {
    var wrap = document.getElementById("pagination");
    if (!wrap) return;
    if (total <= perPage) { wrap.innerHTML = ""; return; }
    var pages = Math.ceil(total / perPage);
    var html = "";
    if (page > 1) html += '<button data-pg="' + (page - 1) + '">Prev</button>';
    for (var i = 1; i <= pages; i++) {
      if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - page) > 1) { if (i === 3 || i === pages - 2) html += '<span>...</span>'; continue; }
      html += '<button data-pg="' + i + '"' + (i === page ? ' aria-current="page"' : '') + '>' + i + '</button>';
    }
    if (page < pages) html += '<button data-pg="' + (page + 1) + '">Next</button>';
    wrap.innerHTML = html;
    wrap.querySelectorAll("button[data-pg]").forEach(function (b) {
      b.addEventListener("click", function () { page = parseInt(b.dataset.pg, 10); paginate(); });
    });
  }
  function makeRowClickable() {
    rows.forEach(function (row) {
      row.addEventListener("click", function (e) {
        if (e.target.tagName === "A") return;
        var link = row.querySelector("a");
        if (link) window.location.href = link.href;
      });
    });
  }
  function initCollapsibles() {
    document.querySelectorAll(".collapsible").forEach(function (el) {
      el.addEventListener("click", function () {
        var target = el.nextElementSibling;
        if (!target) return;
        var open = target.classList.toggle("open");
        el.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }
  [search, level, status].forEach(function (el) { el.addEventListener("input", apply); });
  var ps = document.getElementById("page-size");
  if (ps) ps.addEventListener("change", function () { perPage = parseInt(ps.value, 10); page = 1; paginate(); });
  document.querySelectorAll("th button[data-sort]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.dataset.sort;
      var asc = btn.getAttribute("aria-sort") !== "ascending";
      var tbody = document.querySelector("tbody");
      rows.sort(function (a, b) {
        var x = a.dataset[key], y = b.dataset[key];
        var nx = parseFloat(x), ny = parseFloat(y);
        if (!isNaN(nx) && !isNaN(ny)) return asc ? nx - ny : ny - nx;
        return asc ? x.localeCompare(y) : y.localeCompare(x);
      });
      rows.forEach(function (row) { tbody.appendChild(row); });
      btn.setAttribute("aria-sort", asc ? "ascending" : "descending");
    });
  });
  apply();
  makeRowClickable();
  initCollapsibles();
})();
