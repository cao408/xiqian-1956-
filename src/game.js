/* 《西迁·1956》引擎：五章流程、拖拽交互、结算与分享图。
 * 依赖 data.js（内容）、art.js（SVG）；纯原生 JS，无外部库。
 */
(function () {
  "use strict";

  /* ===================== 工具 ===================== */
  const $ = (s, r) => (r || document).querySelector(s);
  const el = (tag, cls, html) => {
    const d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (n) => Math.floor(Math.random() * n);
  /* 图片取址：开发时走 assets/ 相对路径；单文件版由 build 注入 window.IMG（base64） */
  const imgURL = (n) => (window.IMG && window.IMG[n]) ? window.IMG[n] : "assets/" + n;

  const G = {
    res: { teachers: 0, load: 0, intact: 0 },
    stamina: 100,
    delay: 0,
    picks: [],          // 第①章选择的结果标签
    packed: [],         // 第②章装上车
    left: [],           // 留在上海
    notes: [],          // 第③章每一步
    sites: {},          // 第④章工地进度
    lit: 0,             // 第⑤章调通台数
    maxLit: 8,
    flags: {},          // 成就标记
    courseCount: 0,
    bedCount: 0,
    score: 0
  };

  function resetGame() {
    G.res.teachers = DATA.res.teachers.init;
    G.res.load = DATA.res.load.init;
    G.res.intact = DATA.res.intact.init;
    G.stamina = 100; G.delay = 0;
    G.picks = []; G.packed = []; G.left = []; G.notes = [];
    G.sites = {}; G.lit = 0; G.flags = {};
    DATA.ch4.sites.forEach(s => { G.sites[s.id] = { done: 0, wk: 0 }; });
  }

  /* ===================== 屏幕切换 ===================== */
  let cur = null;
  function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
    const s = document.getElementById(id);
    s.classList.add("on");
    cur = id;
    const b = $(".body", s);
    if (b) b.scrollTop = 0;
  }

  /* ===================== 顶部资源条 ===================== */
  function renderRes(pane) {
    const host = pane || $(".topbar .res");
    if (!host) return;
    const cfg = DATA.res;
    const rows = [
      ["teachers", G.res.teachers, cfg.teachers.min, cfg.teachers.max],
      ["load", G.res.load, cfg.load.min, cfg.load.max],
      ["intact", G.res.intact, cfg.intact.min, cfg.intact.max]
    ];
    host.innerHTML = rows.map(([k, v, lo, hi]) => {
      const p = clamp((v - lo) / (hi - lo), 0, 1) * 100;
      const unit = cfg[k].unit;
      const low = (k === "teachers" && v <= 4) || (k === "intact" && v < 78) || (k === "load" && v <= 30);
      return `<div class="r ${low ? "low" : ""}">
        <div class="lab"><span>${cfg[k].name}</span><span>${v}${unit}</span></div>
        <div class="bar"><i style="width:${p}%"></i></div></div>`;
    }).join("");
  }

  function topbar(chapter, period) {
    return `<div class="topbar">
      <div class="ch"><b>${chapter}</b><span>${period || ""}</span></div>
      <div class="res"></div></div>`;
  }

  /* ===================== 史料卡片（弹层） ===================== */
  function cardModal(card, done) {
    const m = $("#modal-card");
    m.querySelector(".sheet").innerHTML =
      `<h4>史料</h4>
       <img class="photo" id="card-photo" src="${imgURL(card.img)}" alt="${card.alt || ""}">
       <div class="q">「${card.quote}」</div>
       <div class="who">—— ${card.who}</div>
       <div class="src">${card.src}</div>
       <button class="btn" id="card-ok">继续</button>`;
    m.classList.add("on");
    const im = $("#card-photo", m);
    const reveal = () => im.classList.add("ld");
    if (im.complete && im.naturalWidth) reveal();
    else { im.onload = reveal; im.onerror = reveal; }
    $("#card-ok").onclick = () => { m.classList.remove("on"); done && done(); };
  }

  /* 开屏时把所有史料照片预载并解码，避免每章结算卡片弹出时闪白 */
  function preloadImages() {
    const names = [];
    ["ch1", "ch2", "ch3", "ch4", "ch5"].forEach(k => {
      if (DATA[k] && DATA[k].card) names.push(DATA[k].card.img);
    });
    (DATA.epilogue.imgs || []).forEach(n => names.push(n));
    names.forEach(n => {
      const im = new Image();
      im.src = imgURL(n);
      if (im.decode) im.decode().catch(() => {});
    });
  }

  /* ===================== 第①章 ===================== */
  function chapter1() {
    const C = DATA.ch1;
    let i = 0;
    const pane = $("#scr-ch1");

    function q() {
      if (i >= C.questions.length) {
        renderRes($(".topbar .res", pane));
        cardModal(C.card, chapter2);
        return;
      }
      const qq = C.questions[i];
      pane.innerHTML = topbar(C.title, C.period) + `<div class="body">
        ${i === 0 ? `<div class="lead">${C.lead}</div>` : ""}
        <div class="scene"><b>${qq.year}</b>　${qq.scene}</div>
        <div class="asker">${qq.asker}</div>
        <div class="quote">「${qq.quote}」</div>
        <div class="opts" id="opts"></div>
        <div id="fb"></div>
      </div>`;
      renderRes($(".topbar .res", pane));
      const box = $("#opts", pane);
      qq.options.forEach((o, k) => {
        const b = el("button", "opt", `<span class="k">${"甲乙丙"[k]}</span>${o.text}<span class="tag">${o.tag}</span>`);
        b.onclick = () => pick(k, o);
        box.appendChild(b);
      });
      let answered = false;
      function pick(k, o) {
        if (answered) return;
        answered = true;
        Array.from(box.children).forEach((c, ci) => c.classList.add(ci === k ? "picked" : "locked"));
        Array.from(box.children).forEach(c => c.classList.add("locked"));
        for (const key in o.d) G.res[key] = clamp(G.res[key] + o.d[key], DATA.res[key].min, DATA.res[key].max);
        G.picks.push(o.tag);
        renderRes($(".topbar .res", pane));
        $("#fb", pane).innerHTML = `<div class="feedback">${o.tag}　${effectText(o.d)}</div>`;
        const next = el("button", "btn", i === C.questions.length - 1 ? "合上这一页" : "下一条");
        next.onclick = () => { i++; q(); };
        $("#fb", pane).appendChild(next);
      }
    }
    function effectText(d) {
      const nm = { teachers: "师资", load: "载重", intact: "完好率" };
      const parts = [];
      for (const k in d) if (d[k]) parts.push(`${nm[k]}${d[k] > 0 ? "＋" : "－"}${Math.abs(d[k])}${k === "intact" ? "%" : ""}`);
      return parts.length ? parts.join("，") : "";
    }
    q();
  }

  /* ===================== 第②章 装箱 ===================== */
  /* 物品柜里用短名，正文与结算用全名 */
  const SHORT = { charts: "教学挂图", med: "医疗器械", type: "打字机", cards: "卡片目录",
    organ: "风琴", seal: "校史印章", meter: "精密仪器", glass: "实验器皿", motor: "电机设备" };

  function chapter2() {
    const C = DATA.ch2;
    const pane = $("#scr-ch2");
    show("scr-ch2");
    let sel = null;                      // 选中的待装物品
    let placed = {};                     // id -> {col,row,cells:[[x,y]…]}
    const rotMap = {};                   // id -> 旋转次数 0..3
    let usedW = 0;

    /* —— 形状：默认矩形，item.shape 可给异形（如 L 形、T 形）；可整体旋转 —— */
    function baseCells(it) {
      if (it.shape) return it.shape.map(s => s.slice());
      const cells = [];
      for (let y = 0; y < it.h; y++) for (let x = 0; x < it.w; x++) cells.push([x, y]);
      return cells;
    }
    function rot90(cells) {
      const h = Math.max.apply(null, cells.map(c => c[1])) + 1;
      return cells.map(c => [h - 1 - c[1], c[0]]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    }
    function maskOf(it) {
      let cells = baseCells(it);
      const r = rotMap[it.id] || 0;
      for (let i = 0; i < r; i++) cells = rot90(cells);
      return cells;
    }
    function bbox(cells) {
      return { w: Math.max.apply(null, cells.map(c => c[0])) + 1,
               h: Math.max.apply(null, cells.map(c => c[1])) + 1 };
    }
    function rotatedSize(it) {
      const b = bbox(maskOf(it)); return b.w + "×" + b.h;
    }
    function canRotate(it) { return (rotMap[it.id] || 0) !== 2; }   // 只为尺寸变化的形状显示旋转

    pane.innerHTML = topbar(C.title, C.period) + `<div class="body">
      <div class="lead">${C.lead}</div>
      <div class="gauge"><span>车皮 ${C.grid.cols}×${C.grid.rows}</span><span>载重 <b id="g-load">0</b> / ${G.res.load} 吨</span><span>已装 <b id="g-n">0</b> 件</span></div>
      <div class="wrap2">
        <div class="wagon" id="wagon"><div class="grid" id="grid"></div></div>
        <div class="note" id="note2">拖动放进格子；点物品选中后可用「旋转」换方向；点已装的取下。</div>
        <div class="tools" id="tools" hidden></div>
        <div class="tray" id="tray"></div>
      </div>
      <div id="fb2"></div>
      </div>
      <div class="foot" id="foot2"><button class="btn" id="done2">装车完成</button></div>`;
    renderRes($(".topbar .res", pane));

    const grid = $("#grid", pane), wagon = $("#wagon", pane), tools = $("#tools", pane);
    const COLS = C.grid.cols, ROWS = C.grid.rows;
    let cell = 0, gap = 2;

    function layout() {
      const w = wagon.clientWidth - 12;
      cell = Math.floor((w - gap * (COLS - 1)) / COLS);
      grid.style.gridTemplateColumns = `repeat(${COLS},${cell}px)`;
      grid.style.gridAutoRows = cell + "px";
      grid.innerHTML = new Array(COLS * ROWS).fill('<div class="c"></div>').join("");
      drawPlaced();
    }

    function occMap(exceptId) {
      const set = {};
      for (const id in placed) {
        if (id === exceptId) continue;
        const p = placed[id];
        p.cells.forEach(c => { set[(p.col + c[0]) + "," + (p.row + c[1])] = true; });
      }
      return set;
    }
    function fits(col, row, cells, exceptId) {
      const b = bbox(cells);
      if (col < 0 || row < 0 || col + b.w > COLS || row + b.h > ROWS) return false;
      const occ = occMap(exceptId);
      return cells.every(c => !occ[(col + c[0]) + "," + (row + c[1])]);
    }
    function cellAt(x, y) {
      const r = grid.getBoundingClientRect();
      return { col: Math.floor((x - r.left) / (cell + gap)),
               row: Math.floor((y - r.top) / (cell + gap)) };
    }
    function weightOf(id) { return C.items.find(t => t.id === id).wt; }

    /* 依次尝试左上对齐的多个锚点，找到能放下的位置 */
    function autoPlace(id, col, row) {
      const it = C.items.find(t => t.id === id), cells = maskOf(it), b = bbox(cells);
      for (let dr = 0; dr < b.h; dr++)
        for (let dc = 0; dc < b.w; dc++)
          if (fits(col - dc, row - dr, cells, id) &&
              usedW + it.wt <= G.res.load && place(id, col - dc, row - dr)) return true;
      return false;
    }
    function place(id, col, row) {
      const it = C.items.find(t => t.id === id), cells = maskOf(it);
      if (!fits(col, row, cells, id)) return false;
      if (usedW + it.wt > G.res.load) {
        toast("载重不够了：再加这一件就超了 " + G.res.load + " 吨");
        return false;
      }
      placed[id] = { col: col, row: row, cells: cells };
      usedW += it.wt;
      if (it.fragile) G.flags.loadedFragile = true;
      refresh();
      return true;
    }
    function unplace(id) {
      if (!placed[id]) return;
      usedW -= weightOf(id);
      delete placed[id];
      refresh();
    }
    function countCells(id) { return baseCells(C.items.find(t => t.id === id)).length; }

    function drawPlaced() {
      wagon.querySelectorAll(".pcell,.pic").forEach(n => n.remove());
      const pad = 6;
      for (const id in placed) {
        const p = placed[id], it = C.items.find(t => t.id === id), b = bbox(p.cells);
        p.cells.forEach(c => {                       // 逐格描出形状
          const d = el("div", "pcell");
          d.style.left = (pad + (p.col + c[0]) * (cell + gap)) + "px";
          d.style.top = (pad + (p.row + c[1]) * (cell + gap)) + "px";
          d.style.width = cell + "px";
          d.style.height = cell + "px";
          d.onclick = () => unplace(id);
          wagon.appendChild(d);
        });
        const d = el("div", "pic", ART.icon(it.icon) + `<span class="nm">${SHORT[it.id] || it.name}</span>`);
        d.style.left = (pad + p.col * (cell + gap)) + "px";
        d.style.top = (pad + p.row * (cell + gap)) + "px";
        d.style.width = (b.w * cell + (b.w - 1) * gap) + "px";
        d.style.height = (b.h * cell + (b.h - 1) * gap) + "px";
        d.onclick = () => unplace(id);
        wagon.appendChild(d);
      }
    }

    function refresh() {
      $("#g-load", pane).textContent = usedW;
      $("#g-n", pane).textContent = Object.keys(placed).length;
      drawPlaced();
      pane.querySelectorAll(".chip").forEach(c => {
        const id = c.dataset.id;
        c.classList.toggle("gone", !!placed[id]);
        c.classList.toggle("sel", id === sel && !placed[id]);
        const meta = c.querySelector(".meta");
        if (meta) {
          const it = C.items.find(t => t.id === id);
          meta.textContent = rotatedSize(it) + "·" + it.wt + "吨" + (it.fragile ? "·易损" : "");
        }
      });
      renderTools();
    }

    function renderTools() {
      if (!sel || placed[sel]) { tools.hidden = true; tools.innerHTML = ""; return; }
      const it = C.items.find(t => t.id === sel);
      tools.hidden = false;
      tools.innerHTML = `<span class="tlab">已选：${SHORT[it.id] || it.name}（${rotatedSize(it)}）</span>
        <button class="tbtn" id="rotBtn">旋转 ⟳</button>
        <button class="tbtn" id="cancelBtn">取消</button>`;
      const rb = $("#rotBtn", tools);
      if (rb) rb.onclick = () => {
        rotMap[it.id] = ((rotMap[it.id] || 0) + 1) % 4;
        refresh();
        toast("已转向 " + rotatedSize(it));
      };
      const cb = $("#cancelBtn", tools);
      if (cb) cb.onclick = () => { sel = null; refresh(); };
    }

    function tray() {
      const t = $("#tray", pane);
      t.innerHTML = "";
      C.items.forEach(it => {
        const c = el("div", "chip", ART.icon(it.icon) +
          `<div class="nm">${SHORT[it.id] || it.name}</div>
           <div class="meta">${rotatedSize(it)}·${it.wt}吨${it.fragile ? "·易损" : ""}</div>`);
        c.dataset.id = it.id;
        attachDrag(c, it);
        t.appendChild(c);
      });
      refresh();
    }

    /* 拖拽：指针事件，兼容触屏；同时支持"点选 → 点格子"
       监听器只绑一次，并带全局兜底：任何一次手势没有正常收尾（指针在窗口外抬起、
       中途失焦、捕获丢失），下一次拖动前都会把残留状态清干净，物品不会被卡住 */
    function attachDrag(chip, it) {
      const S = { ghost: null, moved: false, startX: 0, startY: 0, pid: null, active: false };

      function clearGhosts() {
        if (S.ghost) { S.ghost.remove(); S.ghost = null; }
        document.querySelectorAll(".chip.dragging").forEach(n => n.remove());   // 清掉可能遗留的分身
        clearGhost();
        chip.classList.remove("gone");
      }

      function finish(ev, cancelled) {
        if (!S.active) return;
        const wasMoved = S.moved, pid = S.pid;
        S.active = false; S.moved = false; S.pid = null;
        try { if (pid !== null && chip.hasPointerCapture && chip.hasPointerCapture(pid)) chip.releasePointerCapture(pid); } catch (err) { /* 忽略 */ }
        clearGhosts();
        if (cancelled) { refresh(); return; }
        if (!wasMoved) {                              // 没动 → 视为点选
          sel = (sel === it.id) ? null : it.id;
          if (sel) toast("已选中：" + (SHORT[it.id] || it.name) + "，拖动或点格子放入");
          refresh();
          return;
        }
        const r = grid.getBoundingClientRect();
        const inside = ev.clientX > r.left - 30 && ev.clientX < r.right + 30 &&
                       ev.clientY > r.top - 30 && ev.clientY < r.bottom + 30;
        if (inside) {
          const c = cellAt(ev.clientX, ev.clientY);
          if (!autoPlace(it.id, c.col, c.row)) toast("这里放不下，换个位置或换个方向");
          else sel = null;
        }
        refresh();
      }

      chip.addEventListener("pointerdown", (e) => {
        if (placed[it.id]) return;
        document.querySelectorAll(".chip.dragging").forEach(n => n.remove());   // 上一轮万一没收尾，先清掉
        S.pid = e.pointerId; S.moved = false; S.active = true;
        S.startX = e.clientX; S.startY = e.clientY;
        try { chip.setPointerCapture(e.pointerId); } catch (err) { /* 合成事件或不支持时忽略 */ }
      });

      chip.addEventListener("pointermove", (e) => {
        if (!S.active || e.pointerId !== S.pid) return;
        if (!S.moved && Math.hypot(e.clientX - S.startX, e.clientY - S.startY) > 6) {
          S.moved = true;
          S.ghost = chip.cloneNode(true);
          S.ghost.classList.add("dragging");
          S.ghost.style.width = chip.clientWidth + "px";
          document.body.appendChild(S.ghost);
          chip.classList.add("gone");
        }
        if (S.moved && S.ghost) {
          S.ghost.style.left = (e.clientX - S.ghost.clientWidth / 2) + "px";
          S.ghost.style.top = (e.clientY - 30) + "px";
          const c = cellAt(e.clientX, e.clientY);
          showGhost(c.col, c.row, it);
        }
      });

      chip.addEventListener("pointerup", (e) => { if (e.pointerId === S.pid) finish(e, false); });
      chip.addEventListener("pointercancel", (e) => { if (e.pointerId === S.pid) finish(e, true); });

      // 全局兜底：正常路径由 chip 自己的 pointerup 先处理；若它没跑（元素被重建、捕获丢失），这里收尾
      const bail = () => { setTimeout(() => { if (S.active) finish({ clientX: -9999, clientY: -9999 }, true); }, 0); };
      window.addEventListener("pointerup", bail, true);
      window.addEventListener("pointercancel", bail, true);
      window.addEventListener("blur", bail);
    }

    let ghostEls = [];
    function showGhost(col, row, it) {
      clearGhost();
      const cells = maskOf(it), b = bbox(cells);
      if (col < 0 || row < 0 || col + b.w > COLS || row + b.h > ROWS) return;
      const pad = 6, ok = fits(col, row, cells, it.id);
      cells.forEach(c => {
        const g = el("div", "gcell" + (ok ? "" : " bad"));
        g.style.left = (pad + (col + c[0]) * (cell + gap)) + "px";
        g.style.top = (pad + (row + c[1]) * (cell + gap)) + "px";
        g.style.width = cell + "px";
        g.style.height = cell + "px";
        wagon.appendChild(g);
        ghostEls.push(g);
      });
    }
    function clearGhost() { ghostEls.forEach(g => g.remove()); ghostEls = []; }

    wagon.addEventListener("click", (e) => {
      if (!sel) return;
      if (e.target.closest(".pic") || e.target.closest(".pcell")) return;
      const it = C.items.find(t => t.id === sel);
      const c = (e.clientX || e.clientY) ? cellAt(e.clientX, e.clientY) : { col: 0, row: 0 };
      let done = autoPlace(it.id, c.col, c.row);
      if (!done) {                                  // 点在没有坐标的合成事件上时，扫一遍找空位
        const cells = maskOf(it), b = bbox(cells);
        for (let row = 0; row + b.h <= ROWS && !done; row++)
          for (let col = 0; col + b.w <= COLS && !done; col++)
            done = fits(col, row, cells, it.id) && place(it.id, col, row);
      }
      if (done) sel = null;
      refresh();
    });

    $("#done2", pane).onclick = () => {
      G.packed = Object.keys(placed).map(id => C.items.find(t => t.id === id));
      G.left = C.items.filter(t => !placed[t.id]);
      const foot = $("#foot2", pane); if (foot) foot.style.display = "none";
      const stay = G.left.length
        ? `<div class="staylist"><b>留在上海的一箱：</b>${G.left.map(t => t.name).join("、")}</div>`
        : `<div class="staylist">这一车把家底装齐了。</div>`;
      pane.querySelector(".body").innerHTML =
        `<div class="lead">车皮关上了门。</div>
         <div class="scene">装走 ${G.packed.length} 件，共 ${usedW} 吨${G.left.length ? "，另有 " + G.left.length + " 件留在了上海" : ""}。</div>
         ${stay}
         <div class="hint">这些箱子里的东西，就是西安新校的全部家当。</div>`;
      G.flags.sapling = !!placed["tree"];
      G.flags.bookHoard = !!placed["books"] && !!placed["cards"];
      G.flags.archive = !!placed["archive"];
      cardModal(C.card, chapter3);
    };

    window.addEventListener("resize", layout);
    layout();
    tray();
  }

  /* ===================== 第③章 路上 ===================== */
  function chapter3() {
    const C = DATA.ch3;
    const pane = $("#scr-ch3");
    show("scr-ch3");
    let i = 0;

    function step() {
      if (i >= C.events.length) {
        renderRes($(".topbar .res", pane));
        cardModal(C.card, chapter4);
        return;
      }
      const ev = C.events[i];
      pane.innerHTML = topbar(C.title, C.period) + `<div class="body">
        ${i === 0 ? `<div class="lead">${C.lead}</div>` : ""}
        <div class="steps">${C.events.map((_, k) => `<i class="${k < i ? "on" : ""}"></i>`).join("")}</div>
        <div class="scene">${ev.scene}</div>
        <div class="quote">${ev.quote}</div>
        <div class="loss">体力 <b id="l-st">${G.stamina}</b>　仪器完好率 <b id="l-it">${G.res.intact}%</b>　已误行程 <b id="l-dl">${G.delay}</b> 小时</div>
        <div class="opts" id="opts"></div>
        <div id="fb"></div>
      </div>`;
      renderRes($(".topbar .res", pane));
      const box = $("#opts", pane);
      let answered = false;
      ev.options.forEach((o, k) => {
        const b = el("button", "opt", `<span class="k">${"甲乙丙"[k]}</span>${o.text}`);
        b.onclick = () => {
          if (answered) return;
          answered = true;
          Array.from(box.children).forEach((c, ci) => c.classList.add(ci === k ? "picked" : "locked"));
          Array.from(box.children).forEach(c => c.classList.add("locked"));
          G.stamina = clamp(G.stamina + (o.d.stamina || 0), 40, 100);
          G.res.intact = clamp(G.res.intact + (o.d.intact || 0), DATA.res.intact.min, DATA.res.intact.max);
          G.delay += o.d.delay || 0;
          G.notes.push({ scene: ev.scene, note: o.note });
          if (i === 4 && k === 1) G.flags.students = true;
          if (i === 4 && k === 0) G.flags.intactLove = true;
          renderRes($(".topbar .res", pane));
          $("#fb", pane).innerHTML = `<div class="feedback">${o.note}</div>`;
          const nx = el("button", "btn", i === C.events.length - 1 ? "车到西安" : "继续上路");
          nx.onclick = () => { i++; step(); };
          $("#fb", pane).appendChild(nx);
        };
        box.appendChild(b);
      });
    }
    step();
  }

  /* ===================== 第④章 建校 ===================== */
  function chapter4() {
    const C = DATA.ch4;
    const pane = $("#scr-ch4");
    show("scr-ch4");
    let left = 90, raf = null, last = 0, paused = false, fired = {};
    const workers = clamp(G.res.teachers + C.workers.base, 2, 11);
    let free = workers;
    const speed = 0.55 + 0.45 * (G.stamina / 100);

    pane.innerHTML = topbar(C.title, C.period) + `<div class="body">
      <div class="lead">${C.lead}</div>
      <div class="timer">距入冬 <b id="t-s">90</b> 天<div class="bar"><i id="t-b"></i></div></div>
      <div class="sites" id="sites"></div>
      <div class="note">点人手选中，再点工地把人派过去；直接点工地也行。点工地里的人可以撤回。</div>
      <div class="pool" id="pool"></div>
      <div id="fb4"></div>
    </div>`;
    renderRes($(".topbar .res", pane));

    const siteBox = $("#sites", pane), pool = $("#pool", pane);
    let selWk = false, lastSig = "";               // 人员/选择未变时不动 DOM，避免重建吃掉点击

    C.sites.forEach(s => {
      const d = el("div", "site", `<div class="ic">${ART.icon(s.icon)}</div>
        <div class="mid"><div class="nm">${s.name}</div>
          <div class="sub">${s.note}</div>
          <div class="pb"><i id="pb-${s.id}"></i></div>
          <div class="ct" id="ct-${s.id}">0%　0 人</div></div>
        <div class="wks" id="wks-${s.id}"></div>`);
      d.dataset.id = s.id;
      d.addEventListener("pointerdown", (e) => {
        const st = G.sites[s.id];
        if (e.target.closest(".wk")) {           // 点已派到工地的人 → 撤回人力池
          if (st.wk > 0) { st.wk--; free++; selWk = false; sync(); toast("撤回 1 人"); }
          return;
        }
        if (st.done >= s.need) { toast("这摊子已经干完了"); return; }
        if (free <= 0) { toast("人手都用上了，先从别处撤回一个"); return; }
        st.wk++; free--; selWk = false; sync();  // 选了人再点、或直接点工地，都派一个过去
      });
      siteBox.appendChild(d);
    });

    function sync() { lastSig = ""; render(); }
    function renderProgress() {
      C.sites.forEach(s => {
        const st = G.sites[s.id];
        $("#pb-" + s.id, pane).style.width = Math.round(st.done / s.need * 100) + "%";
        $("#ct-" + s.id, pane).textContent =
          Math.round(st.done) + " / " + s.need + " " + s.unit + "　" + st.wk + " 人";
      });
    }
    function render() {
      const sig = C.sites.map(s => G.sites[s.id].wk).join(",") + "|" + free + "|" + (selWk ? 1 : 0);
      if (sig !== lastSig) {
        lastSig = sig;
        C.sites.forEach(s => {
          const st = G.sites[s.id], box = $("#wks-" + s.id, pane);
          if (!box) return;
          box.innerHTML = "";
          for (let k = 0; k < st.wk; k++) box.appendChild(el("div", "wk mini", ART.icon("bolt")));
        });
        pool.innerHTML = "";
        for (let k = 0; k < free; k++) {
          const w = el("div", "wk" + (selWk ? " free" : ""), ART.icon("bolt"));
          w.addEventListener("pointerdown", (e) => { e.preventDefault(); selWk = !selWk; sync(); });
          pool.appendChild(w);
        }
        for (let k = 0; k < workers - free; k++) pool.appendChild(el("div", "wk slot", ART.icon("bolt")));
      }
      renderProgress();
    }
    render();

    function fire(idx) {
      if (fired[idx]) return;
      fired[idx] = true;
      const ev = C.events[idx];
      paused = true;
      const m = $("#modal-card");
      m.querySelector(".sheet").innerHTML = `<h4>插播</h4>
        <div class="scene">${ev.scene}</div>
        <div class="opts" id="evopts"></div>`;
      m.classList.add("on");
      const box = $("#evopts", m);
      let answered = false;
      ev.options.forEach((o, k) => {
        const b = el("button", "opt", `<span class="k">${"甲乙"[k]}</span>${o.text}`);
        b.onclick = () => {
          if (answered) return;
          answered = true;
          G.stamina = clamp(G.stamina + (o.d.stamina || 0), 40, 100);
          if (o.d.intact) G.res.intact = clamp(G.res.intact + o.d.intact, DATA.res.intact.min, DATA.res.intact.max);
          if (o.d.progress) {  // 进度加减：按各工地工程量折算
            C.sites.forEach(s => {
              const st = G.sites[s.id];
              st.done = clamp(st.done + o.d.progress * 0.6 / 100 * s.need, 0, s.need);
            });
          }
          m.classList.remove("on");
          paused = false; last = performance.now();
          renderRes($(".topbar .res", pane));
        };
        box.appendChild(b);
      });
    }

    function tick() {
      const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
      if (!last) last = now;
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      if (!paused) {
        left -= dt;
        C.sites.forEach(s => {
          const st = G.sites[s.id];
          if (st.wk > 0 && st.done < s.need) {
            st.done = Math.min(s.need, st.done + st.wk * (s.need / (s.work || 90)) * speed * dt);
          }
        });
        $("#t-s", pane).textContent = Math.max(0, Math.ceil(left));
        $("#t-b", pane).style.width = clamp(left / C.seconds * 100, 0, 100) + "%";
        C.events.forEach((e, idx) => { if (left <= C.seconds * (1 - e.at)) fire(idx); });
        render();
        if (left <= 0) { finish(); return; }
      }
    }
    /* 用定时器而非 requestAnimationFrame：部分内嵌浏览器与低功耗模式下 rAF 会被节流甚至不触发 */
    raf = setInterval(tick, 100);

    function finish() {
      clearInterval(raf);
      const doneCnt = C.sites.filter(s => G.sites[s.id].done >= s.need * 0.99).length;
      G.flags.noMiss = doneCnt >= 3;
      const teach = G.sites.teach.done / C.sites.find(z => z.id === "teach").need;
      const dorm = G.sites.dorm.done;
      G.courseCount = Math.round(4 + teach * 6 + (G.res.teachers - 5) * 0.5);
      G.bedCount = Math.round(dorm);
      pane.querySelector(".body").innerHTML =
        `<div class="lead">入冬了。</div>
         <div class="scene">宿舍能住下 ${Math.round(G.sites.dorm.done)} 人；教学楼 ${Math.round(G.sites.teach.done)} / 24 间教室；锅炉房 ${Math.round(G.sites.boiler.done)} / 36 处暖气；食堂 ${Math.round(G.sites.canteen.done)} / 8 口大灶。</div>
         <div class="scene">能住下约 ${G.bedCount} 人，开出 ${G.courseCount} 门课。</div>
         <div class="hint">雪落下来的时候，教室里的小炉子已经点上了。</div>`;
      const nx = el("button", "btn", "继续");
      nx.onclick = () => cardModal(C.card, chapter5);
      pane.querySelector(".body").appendChild(nx);
    }
  }

  /* ===================== 第⑤章 实验室 ===================== */
  function chapter5() {
    const C = DATA.ch5;
    const pane = $("#scr-ch5");
    show("scr-ch5");
    const n = clamp(Math.round(G.res.intact / 12.5), 3, 8);
    G.maxLit = n;
    const list = C.instruments.slice(0, n);
    let lit = 0;

    pane.innerHTML = topbar(C.title, C.period) + `<div class="body compact">
      <div class="lead">${C.lead}</div>
      <div class="hint">点「开始调试」，指针来回摆；进红区时点「完成调试」。</div>
      <div class="insts" id="insts"></div>
      <div id="fb5"></div>
      </div>
      <div class="foot"><button class="btn" id="done5" disabled>再检查一遍</button></div>`;
    renderRes($(".topbar .res", pane));

    const TOL = 7;                        // 允许误差（刻度单位）
    const box = $("#insts", pane);
    const stoppers = {};
    let activeIdx = null;

    function pt(deg, r) {                 // 角度（0=正上，顺时针为正）→ 坐标
      const t = deg * Math.PI / 180;
      return [50 + r * Math.sin(t), 52 - r * Math.cos(t)];
    }
    function bandPath(a1, a2) {
      const s = pt(a1, 34), e = pt(a2, 34);
      return `M${s[0].toFixed(2)} ${s[1].toFixed(2)} A34 34 0 0 1 ${e[0].toFixed(2)} ${e[1].toFixed(2)}`;
    }
    function dialSVG(target) {
      let ticks = "";
      for (let i = 0; i <= 10; i++) {
        const a = -90 + i * 18;
        ticks += `<line class="tk" x1="50" y1="14" x2="50" y2="${i % 5 === 0 ? 21 : 18}"
                  transform="rotate(${a} 50 52)"/>`;
      }
      const a1 = -90 + (target - TOL) * 1.8, a2 = -90 + (target + TOL) * 1.8;
      return `<div class="dial">
        <svg viewBox="0 0 100 62">
          <path class="arc" d="M10 52 A40 40 0 0 1 90 52"/>
          ${ticks}
          <path class="band" d="${bandPath(a1, a2)}"/>
          <line class="tgt" x1="50" y1="12" x2="50" y2="21" transform="rotate(${-90 + target * 1.8} 50 52)"/>
          <line class="needle" x1="50" y1="52" x2="50" y2="17"/>
          <circle class="hub" cx="50" cy="52" r="3.2"/>
        </svg></div>`;
    }

    function refresh() {
      lit = Array.from(box.children).filter(c => c.classList.contains("on")).length;
      const btn = $("#done5", pane);
      btn.disabled = lit === 0;
      btn.textContent = lit >= n ? "全部接通，开学" : `已接通 ${lit} / ${n} 台，收工`;
    }

    list.forEach((ins, idx) => {
      const speed = 34 + idx * 5;                 // 摆动速度（刻度/秒），越往后越紧，但都在可跟得上的范围
      const d = el("div", "inst", `${dialSVG(ins.dial)}
        <div class="mid"><div class="nm">${ins.name}</div>
          <div class="knob"><button class="tbtn go" data-i="${idx}">开始调试</button>
            <span class="lit"></span></div></div>`);
      const needle = $(".needle", d), lamp = $(".lit", d), btn = $(".go", d);
      let value = rnd(100), dir = 1, timer = null, done = false;
      d.dataset.v = Math.round(value);

      function draw() {
        needle.setAttribute("transform", `rotate(${-90 + value * 1.8} 50 52)`);
        d.dataset.v = Math.round(value);
        if (timer) {                                   // 摆动中：进红区给个明显提示
          const hot = Math.abs(value - ins.dial) <= TOL;
          d.classList.toggle("hot", hot && !done);
          lamp.textContent = hot && !done ? "就是现在！" : "";
        }
      }
      function stopSweep() {
        if (timer) { clearInterval(timer); timer = null; }
        if (activeIdx === idx) activeIdx = null;
        btn.classList.remove("run");
        d.classList.remove("hot");
      }
      stoppers[idx] = stopSweep;

      btn.onclick = () => {
        if (done) return;
        if (!timer) {                              // 开始调试
          if (activeIdx !== null && stoppers[activeIdx]) stoppers[activeIdx]();
          activeIdx = idx;
          btn.textContent = "完成调试";
          btn.classList.add("run");
          lamp.textContent = "";
          timer = setInterval(() => {
            value += dir * speed * 0.06;
            if (value >= 100) { value = 100; dir = -1; }
            if (value <= 0) { value = 0; dir = 1; }
            draw();
          }, 60);
        } else {                                   // 完成调试
          stopSweep();
          if (Math.abs(value - ins.dial) <= TOL) {
            done = true;
            d.classList.add("on");
            d.classList.remove("hot");
            lamp.textContent = "● 接通";
            btn.textContent = "已接通";
            btn.disabled = true;
            refresh();
          } else {
            lamp.textContent = "差一点，再来";
            btn.textContent = "开始调试";
            value = rnd(100); draw();
          }
        }
      };
      draw();
      box.appendChild(d);
    });

    $("#done5", pane).onclick = () => {
      Object.keys(stoppers).forEach(k => stoppers[k]());
      G.lit = lit;
      G.flags.allLit = lit >= n;
      cardModal(C.card, endGame);
    };
  }

  /* ===================== 结算 ===================== */
  function endGame() {
    const C = DATA.ch4;
    const avg = C.sites.reduce((a, s) => a + G.sites[s.id].done / s.need, 0) / C.sites.length;
    G.flags.noCrack = G.res.intact >= 50;
    G.flags.family = true;               // 全流程默认带家人同行（第③章第4件事）
    const score = 0.45 * avg + 0.35 * (G.lit / G.maxLit) + 0.20 * (G.res.intact / 100);
    G.score = score;
    const grade = DATA.grades.find(g => score >= g.min) || DATA.grades[DATA.grades.length - 1];

    const got = [];
    const A = {
      no_miss: G.flags.noMiss, all_lit: G.flags.allLit, book_hoard: G.flags.bookHoard,
      no_crack: G.flags.noCrack, family: G.flags.family, sapling: G.flags.sapling,
      archive: G.flags.archive, students: G.flags.students
    };
    DATA.achievements.forEach(a => { if (A[a.id]) got.push(a); });

    const pane = $("#scr-end");
    pane.innerHTML = `<div class="body">
      <div class="center"><div style="font-size:12px;color:var(--faint);letter-spacing:2px">${DATA.meta.endingAlways}</div>
        <div class="grade">${grade.title}</div></div>
      <div class="scene">${grade.text}</div>
      <div class="score">
        <div><b>${G.courseCount}</b><span style="color:var(--faint)">门课开出</span></div>
        <div><b>${G.lit}/${G.maxLit}</b><span style="color:var(--faint)">台仪器调通</span></div>
        <div><b>${G.bedCount}</b><span style="color:var(--faint)">人能住下</span></div>
      </div>
      <div class="hint">成就</div>
      <div class="ach">${DATA.achievements.map(a =>
        `<div class="${A[a.id] ? "got" : ""}"><div class="h">${ART.icon(A[a.id] ? "star" : "card")}<b>${a.name}</b></div><div class="d">${a.desc}</div></div>`).join("")}</div>
      <div class="hint">长按图片保存，转发给同学</div>
      <img id="shareImg" alt="我的 1956 校园">
      <div class="strip">${DATA.epilogue.imgs.map(f =>
        `<img src="${imgURL(f)}" alt="史料照片">`).join("")}</div>
      <div class="epi">「${DATA.epilogue.poem}」<br><span style="font-size:13px;color:var(--faint)">—— ${DATA.epilogue.poet}</span></div>
      <div class="credit">${DATA.epilogue.thanks}<br>${DATA.epilogue.credit}<br>${DATA.epilogue.sponsor}<br>${DATA.epilogue.dev}</div>
      <button class="btn ghost" id="again">再走一遍</button>
    </div>`;
    drawShare(grade, got);
    pane.querySelectorAll(".strip img").forEach(im => {
      const reveal = () => im.classList.add("ld");
      if (im.complete && im.naturalWidth) reveal();
      else { im.onload = reveal; im.onerror = reveal; }
    });
    $("#again", pane).onclick = () => { resetGame(); show("scr-start"); };
    show("scr-end");
  }

  /* 分享图：canvas 画好后转 dataURL 放进 <img>，便于长按保存 */
  function drawShare(grade, got) {
    const W = 750, H = 1000;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d");
    x.fillStyle = "#efe6d4"; x.fillRect(0, 0, W, H);
    x.strokeStyle = "#c9b99e"; x.lineWidth = 3; x.strokeRect(26, 26, W - 52, H - 52);

    x.fillStyle = "#3a2f24"; x.textAlign = "center";
    x.font = "600 54px 'Songti SC',serif"; x.fillText("西迁·1956", W / 2, 130);
    x.font = "24px 'Songti SC',serif"; x.fillStyle = "#8b7a63";
    x.fillText("1955—1958", W / 2, 176);

    x.fillStyle = "#3a2f24"; x.font = "600 40px 'Songti SC',serif";
    x.fillText(grade.title, W / 2, 268);
    x.font = "26px 'Songti SC',serif"; x.fillStyle = "#5b4c3b";
    wrapText(x, grade.text, W / 2, 320, W - 160, 38);

    x.strokeStyle = "#c9b99e"; x.beginPath(); x.moveTo(140, 430); x.lineTo(W - 140, 430); x.stroke();

    const items = [
      ["开出课程", G.courseCount + " 门"],
      ["调通仪器", G.lit + " / " + G.maxLit + " 台"],
      ["能住下", G.bedCount + " 人"],
      ["仪器完好率", G.res.intact + "%"],
      ["带走物品", G.packed.length + " 件"],
      ["留在上海", G.left.length + " 件"]
    ];
    x.font = "26px 'Songti SC',serif";
    items.forEach((it, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const px = 150 + col * 250, py = 490 + row * 74;
      x.textAlign = "left"; x.fillStyle = "#8b7a63"; x.fillText(it[0], px, py);
      x.fillStyle = "#3a2f24"; x.font = "600 30px 'Songti SC',serif"; x.fillText(it[1], px + 150, py);
      x.font = "26px 'Songti SC',serif";
    });

    x.textAlign = "left"; x.fillStyle = "#8b7a63"; x.font = "24px 'Songti SC',serif";
    x.fillText("成就", 120, 730);
    x.fillStyle = "#3a2f24"; x.font = "26px 'Songti SC',serif";
    x.fillText(got.length ? got.map(a => a.name).join("・") : "——", 120, 770);

    x.font = "24px 'Songti SC',serif"; x.fillStyle = "#5b4c3b"; x.textAlign = "center";
    wrapText(x, "「" + DATA.epilogue.poem + "」", W / 2, 856, W - 180, 36);

    x.font = "22px 'Songti SC',serif"; x.fillStyle = "#8b7a63";
    x.fillText(DATA.meta.byline, W / 2, H - 60);

    $("#shareImg").src = c.toDataURL("image/jpeg", 0.92);
  }
  function wrapText(x, text, cx, y, maxW, lh) {
    let line = "", lines = [];
    for (const ch of text) {
      if (x.measureText(line + ch).width > maxW) { lines.push(line); line = ch; }
      else line += ch;
    }
    lines.push(line);
    lines.forEach((l, i) => x.fillText(l, cx, y + i * lh));
  }

  /* ===================== 轻提示 ===================== */
  let toastT = null;
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = el("div", "", ""); t.id = "toast";
      t.style.cssText = "position:fixed;left:50%;bottom:14%;transform:translateX(-50%);z-index:60;" +
        "background:rgba(58,47,36,.92);color:#f7f1e3;padding:9px 14px;border-radius:20px;font-size:13.5px;" +
        "max-width:86vw;text-align:center;transition:opacity .25s";
      document.body.appendChild(t); }
    t.textContent = msg; t.style.opacity = "1";
    clearTimeout(toastT);
    toastT = setTimeout(() => { t.style.opacity = "0"; }, 1900);
  }

  /* ===================== 启动 ===================== */
  /* 自测入口：?dbg=ch1|ch2|ch3|ch4|ch5|end 直接跳到对应屏幕；?measure=1 输出布局测量 */
  const params = new URLSearchParams(location.search);
  const dbg = params.get("dbg");
  if (params.get("measure")) {
    setTimeout(() => {
      const sels = ["body", "#app", ".screen.on", ".topbar", ".topbar .res", ".topbar .res .r",
        ".topbar .res .r .lab", ".body", ".wagon", "#grid", ".tray", ".opts", ".opt", ".score", ".ach"];
      const rows = sels.map(s => {
        const n = document.querySelector(s);
        if (!n) return s + ": (none)";
        const r = n.getBoundingClientRect();
        return `${s}: client=${n.clientWidth} scroll=${n.scrollWidth} rect=${Math.round(r.left)}..${Math.round(r.right)}`;
      });
      rows.push("win=" + window.innerWidth + "x" + window.innerHeight + " dpr=" + window.devicePixelRatio);
      document.body.innerHTML = "<pre id='m'>" + rows.join("\n") + "</pre>";
    }, 1200);
  }
  function fakeEnd() {
    G.packed = DATA.ch2.items.slice(0, 12); G.left = DATA.ch2.items.slice(12);
    G.notes = [{ scene: "x", note: "y" }];
    G.sites = { dorm: { done: 1104, wk: 0 }, teach: { done: 21, wk: 0 }, boiler: { done: 25, wk: 0 }, canteen: { done: 5, wk: 0 } };
    G.lit = 7; G.maxLit = 8;
    G.flags.noMiss = true; G.flags.bookHoard = true; G.flags.sapling = true; G.flags.students = true;
    G.flags.allLit = true; G.flags.noCrack = true; G.flags.archive = true;
    G.res.intact = 92; G.res.teachers = 8; G.courseCount = 11; G.bedCount = 1104;
    endGame();
  }
  window.DBG = { ch1: chapter1, ch2: chapter2, ch3: chapter3, ch4: chapter4, ch5: chapter5, end: fakeEnd };

  function boot() {
    const s = $("#scr-start");
    s.innerHTML = `<div class="t">西迁·1956</div>
      <div class="y">1955—1958</div>
      <div class="rule"></div>
      <div style="font-size:14.5px;color:var(--ink-2);max-width:21em">一位电机系教授，一列车皮，一所要在麦田上重新办起来的大学。<br>全程十分钟。</div>
      <button class="btn" id="go">${DATA.meta.startBtn}</button>
      <div class="wm">${DATA.meta.byline}</div>`;
    $("#go").onclick = () => { resetGame(); chapter1(); show("scr-ch1"); };

    // 预载照片，避免卡片弹出时闪白
    preloadImages();

    resetGame();
    if (dbg && window.DBG[dbg]) {
      show("scr-" + (dbg === "end" ? "end" : dbg));
      setTimeout(() => window.DBG[dbg](), 60);
      return;
    }
    show("scr-start");
  }
  document.addEventListener("DOMContentLoaded", boot);
})();
