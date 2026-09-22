(function () {
  const ICONS = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-up': '<path d="m18 15-6-6-6 6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevrons-down': '<path d="m7 6 5 5 5-5M7 13l5 5 5-5"/>',
    'chevrons-up': '<path d="m17 18-5-5-5 5M17 11l-5-5-5 5"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    'arrow-down-right': '<path d="m7 7 10 10M17 8v9H8"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M4 19h16"/>',
    upload: '<path d="M12 15V4M7 9l5-5 5 5M4 19h16"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.3-4.3"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
    columns: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M10 4v16M16 4v16"/>',
    pencil: '<path d="m4 20 4-1L19 8l-3-3L5 16zM14 7l3 3"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
    'more-horizontal': '<circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    home: '<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    wallet: '<path d="M3 7a2 2 0 0 1 2-2h13v4"/><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M16 13h2"/>',
    'piggy': '<path d="M5 11a7 7 0 0 1 7-6h3a5 5 0 0 1 5 5v1h1v3h-1.3a5 5 0 0 1-2.2 3l.5 2h-3l-.4-1.5h-3.2L11 19H8l.5-2A7 7 0 0 1 5 11z"/><circle cx="15" cy="10" r=".8"/>',
    'chart-line': '<path d="M3 20h18M4 16l5-6 4 3 7-8"/>',
    'chart-bar': '<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>',
    'chart-pie': '<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M21 12a9 9 0 0 0-9-9v9z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    smile: '<circle cx="12" cy="12" r="8.5"/><path d="M9 10h.01M15 10h.01M8.5 14.5a4.5 4.5 0 0 0 7 0"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M10 10v11"/>',
    banknote: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 12h.01M17.5 12h.01"/>',
    landmark: '<path d="M3 21h18M5 18v-7M9 18v-7M15 18v-7M19 18v-7M3 10l9-6 9 6z"/>',
    'credit-card': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    'alert-triangle': '<path d="M12 4 2.5 20h19zM12 10v4M12 17h.01"/>',
    'alert-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v5M12 16h.01"/>',
    'check-circle': '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.5 2.5 2.5 5-5"/>',
    'external-link': '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
    undo: '<path d="M4 9h10a5 5 0 0 1 0 10h-3M4 9l4-4M4 9l4 4"/>',
    percent: '<path d="m19 5-14 14"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
    maximize: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    'panel-left': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    receipt: '<path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21zM8 8h8M8 12h8M8 16h5"/>',
    tag: '<path d="M3 12V4h8l9 9-8 8zM7.5 7.5h.01"/>',
    'file-text': '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',
    'clipboard-paste': '<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2M9 12h6M9 16h4"/>',
    'folder-tree': '<path d="M4 4v14a2 2 0 0 0 2 2h4M4 10h6M14 4h6v4h-6zM14 14h6v4h-6z"/>',
    'grip': '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
    'dollar': '<path d="M12 3v18M16.5 7.5A3.5 3.5 0 0 0 13 5h-2a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-2a3.5 3.5 0 0 1-3.5-2.5"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
    logout: '<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M14 9l2 2"/>',
    'sort': '<path d="M8 4v16M8 20l-3-3M8 20l3-3M16 20V4M16 4l3 3M16 4l-3 3"/>',
    'sort-asc': '<path d="M12 5v14M6 11l6-6 6 6"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  };

  const NAV = [
    { id: 'tomi', label: 'Tomi', icon: 'smile', href: 'tomi.html' },
    {
      id: 'finanzas', label: 'Finanzas', icon: 'wallet', href: 'finanzas-dashboard.html',
      children: [
        { id: 'finanzas-dashboard', label: 'Resumen', icon: 'layout', href: 'finanzas-dashboard.html' },
        { id: 'finanzas-movimientos', label: 'Movimientos', icon: 'receipt', href: 'finanzas-movimientos.html' },
        { id: 'finanzas-presupuesto', label: 'Presupuesto', icon: 'chart-bar', href: 'finanzas-presupuesto.html' },
        { id: 'finanzas-vencimientos', label: 'Vencimientos', icon: 'clock', href: 'finanzas-vencimientos.html' },
        { id: 'finanzas-buscar', label: 'Buscar', icon: 'search', href: 'finanzas-buscar.html' },
      ],
    },
    { id: 'inversiones', label: 'Inversiones', icon: 'chart-line', href: 'inversiones.html' },
    { id: 'importar', label: 'Importar', icon: 'upload', href: 'importar.html' },
  ];
  const NAV_FOOTER = [
    {
      id: 'settings', label: 'Configuración', icon: 'settings', href: 'settings.html',
      children: [
        { id: 'settings-admin', label: 'Categorías', icon: 'folder-tree', href: 'settings.html' },
        { id: 'settings-api', label: 'API', icon: 'plug', href: 'settings.html#api' },
      ],
    },
  ];

  function iconSvg(name, cls) {
    const body = ICONS[name] || ICONS['alert-circle'];
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll('i[data-icon]').forEach((el) => {
      const name = el.getAttribute('data-icon');
      const cls = el.getAttribute('class') || '';
      const tpl = document.createElement('template');
      tpl.innerHTML = iconSvg(name, cls);
      el.replaceWith(tpl.content.firstChild);
    });
  }

  function navItem(item, active, depth) {
    const isActive = active === item.id;
    const hasActiveChild = item.children && item.children.some((c) => c.id === active);
    const open = isActive || hasActiveChild;
    let html = '<a class="nav-item' + (isActive ? ' is-active' : '') + (hasActiveChild ? ' is-parent-active' : '') + '" href="' + item.href + '" data-nav="' + item.id + '">' +
      iconSvg(item.icon) + '<span class="nav-label">' + item.label + '</span>' +
      (item.children ? iconSvg('chevron-down', 'nav-caret') : '') +
      '</a>';
    if (item.children) {
      html += '<div class="nav-sub' + (open ? ' is-open' : '') + '">' +
        item.children.map((c) => navItem(c, active, 1)).join('') + '</div>';
    }
    return html;
  }

  function renderSidebar() {
    const body = document.body;
    const active = body.getAttribute('data-page') || '';
    const aside = document.createElement('aside');
    aside.className = 'sidebar';
    aside.innerHTML =
      '<div class="sidebar-brand">' +
        '<a class="brand" href="index.html"><span class="brand-mark">M</span><span class="brand-name">Mis gestiones</span></a>' +
        '<button class="icon-btn sidebar-toggle" type="button" title="Contraer barra lateral">' + iconSvg('panel-left') + '</button>' +
      '</div>' +
      '<nav class="nav">' + NAV.map((i) => navItem(i, active, 0)).join('') + '</nav>' +
      '<nav class="nav nav-footer">' + NAV_FOOTER.map((i) => navItem(i, active, 0)).join('') + '</nav>' +
      '<div class="sidebar-user"><span class="avatar">A</span><span class="nav-label"><span class="user-name">Andrés</span><span class="user-meta">v2 · mockup</span></span></div>';
    body.insertBefore(aside, body.firstChild);

    aside.querySelector('.sidebar-toggle').addEventListener('click', () => {
      body.classList.toggle('sidebar-collapsed');
      try { localStorage.setItem('mg.sidebar', body.classList.contains('sidebar-collapsed') ? '1' : '0'); } catch (e) {}
    });
    try { if (localStorage.getItem('mg.sidebar') === '1') body.classList.add('sidebar-collapsed'); } catch (e) {}

    aside.querySelectorAll('.nav-item').forEach((a) => {
      const sub = a.nextElementSibling;
      if (sub && sub.classList.contains('nav-sub')) {
        a.addEventListener('click', (e) => {
          if (e.target.closest('.nav-caret')) { e.preventDefault(); sub.classList.toggle('is-open'); }
        });
      }
    });
  }

  function wireBehaviors() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-toggle]');
      if (toggle) {
        const target = document.querySelector(toggle.getAttribute('data-toggle'));
        if (target) {
          target.classList.toggle('is-open');
          toggle.classList.toggle('is-on', target.classList.contains('is-open'));
        }
      }
      const opener = e.target.closest('[data-modal-open]');
      if (opener) {
        const m = document.querySelector(opener.getAttribute('data-modal-open'));
        if (m) { m.classList.add('is-open'); document.body.classList.add('has-modal'); }
      }
      const closer = e.target.closest('[data-modal-close]');
      if (closer) {
        const m = closer.closest('.modal-backdrop');
        if (m) { m.classList.remove('is-open'); document.body.classList.remove('has-modal'); }
      }
      if (e.target.classList && e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('is-open'); document.body.classList.remove('has-modal');
      }
      const tab = e.target.closest('[data-tab]');
      if (tab) {
        const group = tab.closest('[data-tabs]');
        if (group) {
          group.querySelectorAll('[data-tab]').forEach((t) => t.classList.toggle('is-active', t === tab));
          const name = group.getAttribute('data-tabs');
          document.querySelectorAll('[data-tab-panel][data-tab-group="' + name + '"]').forEach((p) => {
            p.classList.toggle('is-active', p.getAttribute('data-tab-panel') === tab.getAttribute('data-tab'));
          });
        }
      }
      const monthTab = e.target.closest('.month-tab');
      if (monthTab && !monthTab.closest('.months--multi')) {
        monthTab.parentElement.querySelectorAll('.month-tab').forEach((t) => t.classList.toggle('is-active', t === monthTab));
      } else if (monthTab) {
        monthTab.classList.toggle('is-active');
      }
      const seg = e.target.closest('.segmented > button');
      if (seg) {
        seg.parentElement.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === seg));
      }
      const groupRow = e.target.closest('tr.row-group');
      if (groupRow && !groupRow.classList.contains('no-collapse') && !e.target.closest('input, button, a, label')) {
        groupRow.classList.toggle('is-collapsed');
        let next = groupRow.nextElementSibling;
        while (next && !next.classList.contains('row-group')) {
          next.classList.toggle('is-hidden', groupRow.classList.contains('is-collapsed'));
          next = next.nextElementSibling;
        }
      }
    });

    document.addEventListener('change', (e) => {
      const cb = e.target;
      if (cb.matches('tr input[type="checkbox"]')) {
        const row = cb.closest('tr');
        if (row.classList.contains('row-group')) {
          let next = row.nextElementSibling;
          while (next && !next.classList.contains('row-group')) {
            const c = next.querySelector('input[type="checkbox"]');
            if (c) { c.checked = cb.checked; next.classList.toggle('is-selected', cb.checked); }
            next = next.nextElementSibling;
          }
        } else if (row.closest('thead')) {
          row.closest('table').querySelectorAll('tbody input[type="checkbox"]').forEach((c) => {
            c.checked = cb.checked;
            c.closest('tr').classList.toggle('is-selected', cb.checked);
          });
        } else {
          row.classList.toggle('is-selected', cb.checked);
        }
        updateSelectionSum(row.closest('table'));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.is-open').forEach((m) => m.classList.remove('is-open'));
        document.body.classList.remove('has-modal');
      }
    });
  }

  function updateSelectionSum(table) {
    if (!table) return;
    const out = document.querySelector('[data-selection-sum]');
    const count = document.querySelector('[data-selection-count]');
    if (!out && !count) return;
    let sum = 0, n = 0;
    table.querySelectorAll('tbody tr.is-selected:not(.row-group)').forEach((tr) => {
      const v = tr.getAttribute('data-amount');
      if (v) { sum += Number(v); n += 1; }
    });
    if (out) out.textContent = n ? '$ ' + sum.toLocaleString('es-AR', { maximumFractionDigits: 0 }) : '$ 0';
    if (count) count.textContent = String(n);
    const bulk = document.querySelector('[data-bulk-actions]');
    if (bulk) bulk.classList.toggle('is-visible', n > 0);
  }

  window.MG = { icon: iconSvg, hydrateIcons };

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.hasAttribute('data-no-shell')) renderSidebar();
    hydrateIcons(document);
    wireBehaviors();
    const preselected = document.querySelector('tbody tr.is-selected');
    if (preselected) updateSelectionSum(preselected.closest('table'));
  });
})();
