(function () {
  const statuses = [
    { value: "open", label: "Open" },
    { value: "qualified", label: "Qualified" },
    { value: "assigned", label: "Assigned" },
    { value: "inProgress", label: "In Progress" },
    { value: "forReview", label: "For Review" },
    { value: "closed", label: "Closed" },
    { value: "reopened", label: "Reopened" },
    { value: "deferred", label: "Deferred" },
    { value: "archived", label: "Archived" },
  ];

  const modeOptions = [
    { value: "all", label: "Show All" },
    { value: "excludeSx", label: "Exclude SX" },
    { value: "onlyRcs", label: "Only RCS" },
  ];

  const typeOrder = ["spark", "network", "override"];

  const types = {
    spark: {
      label: "Spark",
      subjectLabel: "Equipment",
      note: "Mirrors the current board: equipment, rules, and the RCS/SX mode controls are Spark-specific.",
    },
    network: {
      label: "Network",
      subjectLabel: "Device",
      note: "Network filters replace equipment/rules with device, protocol, segment, and health context.",
    },
    override: {
      label: "Override",
      subjectLabel: "Point",
      note: "Override filters focus on point, override type, parent asset, and duration context.",
    },
  };

  const commonFacets = [
    { label: "Project", key: "project", stateKey: "projects" },
    { label: "Status", key: "status", stateKey: "statuses" },
    { label: "Assigned To", key: "assignee", stateKey: "assignees" },
    { label: "Priority", key: "priority", stateKey: "priorities" },
  ];

  const typeFacets = {
    spark: [
      { label: "Equipment", key: "equipment", stateKey: "equipment", type: "spark" },
      { label: "Rules", key: "rule", stateKey: "rules", type: "spark" },
      { label: "Issue Type", key: "issueType", stateKey: "issueTypes", type: "spark" },
    ],
    network: [
      { label: "Device", key: "device", stateKey: "devices", type: "network" },
      { label: "Protocol", key: "protocol", stateKey: "protocols", type: "network" },
      { label: "Segment", key: "segment", stateKey: "segments", type: "network" },
      { label: "Health", key: "healthBand", stateKey: "healthBands", type: "network" },
    ],
    override: [
      { label: "Point", key: "point", stateKey: "points", type: "override" },
      { label: "Override Type", key: "overrideType", stateKey: "overrideTypes", type: "override" },
      { label: "Parent", key: "parent", stateKey: "parents", type: "override" },
      { label: "Duration", key: "durationBand", stateKey: "durationBands", type: "override" },
    ],
  };

  const allFacets = [...commonFacets, ...typeOrder.flatMap((type) => typeFacets[type])];
  const facetsByStateKey = Object.fromEntries(allFacets.map((facet) => [facet.stateKey, facet]));

  const assignees = ["NV5", "Maya", "Iris", "Leo", "Sam", "Priya", "Alex", "Network Team", "Controls Team"];
  const priorities = ["Critical", "High", "Medium", "Low"];
  const projects = [
    "Civic Center",
    "Riverside Campus",
    "North Hospital",
    "Harbor Lab",
    "Midtown Tower",
    "West Data Center",
    "Airport Terminal",
    "University Hall",
  ];

  const sparkTemplates = [
    ["AHU-1", "Low SAT", "Comfort", "low discharge air performance", 420],
    ["AHU-2", "High DAT", "Comfort", "high discharge air temperature trend", 360],
    ["AHU-3", "Static Pressure", "Airside", "static pressure reset not responding", 510],
    ["CH-1", "Short Cycle", "Efficiency", "short cycling trend detected", 720],
    ["CH-2", "Low Delta T", "Efficiency", "low delta T across evaporator", 890],
    ["BLR-1", "Schedule Runtime", "Schedule", "excess runtime outside schedule", 980],
    ["RTU-4", "Economizer", "Verification", "economizer not using available free cooling", 310],
    ["RTU-5", "Mixed Air", "Airside", "mixed air temperature outside expected range", 280],
    ["VAV-2-14", "Damper Flow", "Airside", "damper command not matching airflow", 190],
    ["VAV-3-12", "Zone Temp", "Comfort", "zone temperature drifting from setpoint", 150],
    ["EF-1", "Schedule Runtime", "Schedule", "exhaust fan enabled after hours", 120],
    ["P-2", "Pump Runtime", "Hydronic", "pump runtime exceeds load profile", 440],
    ["HX-1", "Valve Leak", "Hydronic", "heating valve leaking through", 260],
    ["DOAS-1", "Humidity", "Comfort", "humidity above comfort band", 330],
    ["FCU-7", "Fan Runtime", "Terminal", "fan running without occupancy", 95],
  ];

  const networkTemplates = [
    ["BAS-RTR-A", "BACnet/IP", "MSTP trunk A", "Offline", "BACnet router offline", 0],
    ["BAS-RTR-B", "BACnet/IP", "MSTP trunk B", "Degraded", "router packet loss above threshold", 61],
    ["VAV-C-221", "BACnet MSTP", "Floor 2", "Intermittent", "controller intermittent comm loss", 42],
    ["AHU-C-04", "BACnet/IP", "Mechanical penthouse", "Duplicate ID", "duplicate device instance found", 75],
    ["TR-RTR-2", "IP", "Server room", "Latency", "trend router latency above threshold", 67],
    ["GW-EDGE-1", "HTTPS", "Cloud gateway", "Certificate", "gateway certificate expiring", 88],
    ["MTR-GW-3", "Modbus TCP", "Electrical room", "Timeout", "meter gateway timeout rate increased", 53],
    ["LON-BRIDGE-1", "LonWorks", "Legacy wing", "Offline", "legacy bridge offline", 0],
    ["SEC-SW-1", "IP", "Network closet", "Port Errors", "switch port errors increasing", 79],
    ["BBMD-1", "BACnet/IP", "Campus core", "Broadcast", "BBMD broadcast table mismatch", 70],
    ["VFD-GW-2", "Modbus RTU", "Plant loop", "Intermittent", "VFD gateway intermittent polling", 58],
    ["UPS-MON-1", "SNMP", "Data closet", "Degraded", "UPS monitor stale values", 64],
  ];

  const overrideTemplates = [
    ["AHU-1 SAT Setpoint", "Manual", "AHU-1", "Long", "SAT setpoint held in manual override"],
    ["RF-2 Start Command", "Operator", "RF-2", "Week", "fan command override after maintenance"],
    ["VAV-4-09 Cooling Valve", "Manual", "VAV-4-09", "Long", "cooling valve forced open"],
    ["Zone Schedule Override", "Schedule", "Floor 3", "Long", "schedule override preventing night setback"],
    ["P-1 Enable", "Manual", "P-1", "Short", "pump command released from override"],
    ["CHW Reset Enable", "Program", "CHW System", "Week", "reset sequence disabled by override"],
    ["BLR-1 Firing Rate", "Operator", "BLR-1", "Short", "boiler firing rate held by operator"],
    ["RTU-5 Occupancy", "Schedule", "RTU-5", "Long", "occupancy point forced occupied"],
    ["AHU-3 Static Pressure", "Manual", "AHU-3", "Week", "static pressure setpoint fixed"],
    ["HW Supply Temp", "Program", "HW System", "Long", "hot water supply target overridden"],
    ["EF-1 Command", "Operator", "EF-1", "Short", "exhaust fan command manually enabled"],
    ["Tower Fan Speed", "Manual", "CT-1", "Week", "tower fan speed fixed"],
  ];

  function nextStatus(index, offset) {
    return statuses[(index + offset) % statuses.length].value;
  }

  function nextAssignee(index, offset) {
    return assignees[(index + offset) % assignees.length];
  }

  function nextPriority(index, offset) {
    return priorities[(index + offset) % priorities.length];
  }

  function nextProject(index, offset) {
    return projects[(index + offset) % projects.length];
  }

  function addMeta(base, extra) {
    return [...base, ...extra].filter(Boolean);
  }

  function buildWorkOrders() {
    const rows = [];
    let nextNumber = 1001;

    for (let i = 0; i < 48; i += 1) {
      const [equipment, rule, issueType, description, savings] = sparkTemplates[i % sparkTemplates.length];
      const repeat = Math.floor(i / sparkTemplates.length) + 1;
      const hasSx = i % 5 === 0 || i % 11 === 0;
      const hasRcs = i % 4 === 0 || i % 13 === 0;
      const recentHours = 3 + ((i * 7) % 46);
      rows.push({
        id: `wo-${nextNumber}`,
        number: nextNumber,
        type: "spark",
        status: nextStatus(i, 0),
        title: repeat === 1 ? `${equipment} ${description}` : `${equipment} ${description} follow-up ${repeat}`,
        subjectKind: "Equipment",
        subject: equipment,
        project: nextProject(i, 0),
        assignee: nextAssignee(i, 0),
        priority: nextPriority(i, 1),
        age: `${1 + ((i * 3) % 29)}d`,
        equipment,
        rule,
        issueType,
        hasSx,
        hasRcs,
        meta: addMeta([`Rule: ${rule}`, `Savings: $${savings + repeat * 35}/mo`], [hasRcs ? "RCS" : "", hasSx ? "SX" : `Recent: ${recentHours}h`]),
      });
      nextNumber += 1;
    }

    for (let i = 0; i < 36; i += 1) {
      const [device, protocol, segment, issueType, description, health] = networkTemplates[i % networkTemplates.length];
      const repeat = Math.floor(i / networkTemplates.length) + 1;
      const healthBand = health === 0 ? "Offline" : health < 60 ? "Poor" : health < 80 ? "Degraded" : "Healthy";
      rows.push({
        id: `wo-${nextNumber}`,
        number: nextNumber,
        type: "network",
        status: nextStatus(i, 2),
        title: repeat === 1 ? `${device} ${description}` : `${device} ${description} follow-up ${repeat}`,
        subjectKind: "Device",
        subject: device,
        project: nextProject(i, 3),
        assignee: nextAssignee(i, 5),
        priority: nextPriority(i, 0),
        age: `${1 + ((i * 2) % 21)}d`,
        device,
        protocol,
        segment,
        issueType,
        health,
        healthBand,
        meta: [`Protocol: ${protocol}`, `Health: ${health}%`, issueType],
      });
      nextNumber += 1;
    }

    for (let i = 0; i < 33; i += 1) {
      const [point, overrideType, parent, durationBand, description] = overrideTemplates[i % overrideTemplates.length];
      const repeat = Math.floor(i / overrideTemplates.length) + 1;
      const days = durationBand === "Short" ? 1 + (i % 3) : durationBand === "Week" ? 5 + (i % 5) : 10 + (i % 18);
      rows.push({
        id: `wo-${nextNumber}`,
        number: nextNumber,
        type: "override",
        status: nextStatus(i, 4),
        title: repeat === 1 ? `${point} ${description}` : `${point} ${description} follow-up ${repeat}`,
        subjectKind: "Point",
        subject: point,
        project: nextProject(i, 5),
        assignee: nextAssignee(i, 2),
        priority: nextPriority(i, 2),
        age: `${days}d`,
        point,
        overrideType,
        parent,
        durationBand,
        meta: [`${overrideType} override`, `Duration: ${days}d`, `Parent: ${parent}`],
      });
      nextNumber += 1;
    }

    return rows;
  }

  const workOrders = buildWorkOrders();

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function statusLabel(value) {
    return statuses.find((status) => status.value === value)?.label ?? value;
  }

  function typeLabel(value) {
    return types[value]?.label ?? value;
  }

  function searchText(order) {
    return [
      order.number,
      order.type,
      typeLabel(order.type),
      order.status,
      statusLabel(order.status),
      order.title,
      order.subject,
      order.subjectKind,
      order.project,
      order.assignee,
      order.priority,
      order.equipment,
      order.rule,
      order.issueType,
      order.device,
      order.protocol,
      order.segment,
      order.healthBand,
      order.point,
      order.overrideType,
      order.parent,
      order.durationBand,
      ...(order.meta ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function createFilterState(initialType = "all") {
    return {
      type: initialType,
      search: "",
      mode: "all",
      projects: [],
      statuses: [],
      assignees: [],
      priorities: [],
      equipment: [],
      rules: [],
      issueTypes: [],
      devices: [],
      protocols: [],
      segments: [],
      healthBands: [],
      points: [],
      overrideTypes: [],
      parents: [],
      durationBands: [],
    };
  }

  function cloneFilterState(state) {
    const next = createFilterState(state.type);
    Object.keys(next).forEach((key) => {
      next[key] = Array.isArray(state[key]) ? [...state[key]] : state[key];
    });
    return next;
  }

  function hasSelected(values) {
    return Array.isArray(values) && values.length > 0;
  }

  function matchesSelected(order, key, values, scopedType) {
    if (!hasSelected(values)) return true;
    if (scopedType && order.type !== scopedType) return true;
    return values.includes(order[key]);
  }

  function filterOrders(orders, options) {
    const state = { ...createFilterState(), ...(options ?? {}) };
    const selectedType = state.type ?? "all";
    const search = (state.search ?? "").trim().toLowerCase();

    return orders.filter((order) => {
      if (selectedType !== "all" && order.type !== selectedType) return false;
      if (search && !searchText(order).includes(search)) return false;
      if (hasSelected(state.projects) && !state.projects.includes(order.project)) return false;
      if (hasSelected(state.statuses) && !state.statuses.includes(order.status)) return false;
      if (hasSelected(state.assignees) && !state.assignees.includes(order.assignee)) return false;
      if (hasSelected(state.priorities) && !state.priorities.includes(order.priority)) return false;

      if (order.type === "spark") {
        if (state.mode === "excludeSx" && order.hasSx) return false;
        if (state.mode === "onlyRcs" && !order.hasRcs) return false;
      }

      if (!matchesSelected(order, "equipment", state.equipment, "spark")) return false;
      if (!matchesSelected(order, "rule", state.rules, "spark")) return false;
      if (!matchesSelected(order, "issueType", state.issueTypes, "spark")) return false;
      if (!matchesSelected(order, "device", state.devices, "network")) return false;
      if (!matchesSelected(order, "protocol", state.protocols, "network")) return false;
      if (!matchesSelected(order, "segment", state.segments, "network")) return false;
      if (!matchesSelected(order, "healthBand", state.healthBands, "network")) return false;
      if (!matchesSelected(order, "point", state.points, "override")) return false;
      if (!matchesSelected(order, "overrideType", state.overrideTypes, "override")) return false;
      if (!matchesSelected(order, "parent", state.parents, "override")) return false;
      if (!matchesSelected(order, "durationBand", state.durationBands, "override")) return false;

      return true;
    });
  }

  function uniqueValues(orders, key) {
    return Array.from(
      new Set(
        orders
          .map((order) => order[key])
          .filter((value) => value !== undefined && value !== null && value !== "")
      )
    ).sort((a, b) => String(a).localeCompare(String(b)));
  }

  function facetValues(orders, state, facet) {
    if (facet.key === "status") return statuses.map((status) => status.value);
    const baseState = cloneFilterState(state);
    baseState[facet.stateKey] = [];
    const base = filterOrders(orders, baseState).filter((order) => !facet.type || order.type === facet.type);
    return uniqueValues(base, facet.key);
  }

  function facetCounts(orders, state, facet) {
    const values = facetValues(orders, state, facet);
    const baseState = cloneFilterState(state);
    baseState[facet.stateKey] = [];
    const base = filterOrders(orders, baseState).filter((order) => !facet.type || order.type === facet.type);
    const selected = state[facet.stateKey] ?? [];

    return values.map((value) => ({
      value,
      label: facet.key === "status" ? statusLabel(value) : String(value),
      count: base.filter((order) => order[facet.key] === value).length,
      active: selected.length === 0 || selected.includes(value),
    }));
  }

  function resetTypeScopedFilters(state) {
    typeOrder.flatMap((type) => typeFacets[type]).forEach((facet) => {
      state[facet.stateKey] = [];
    });
    state.mode = "all";
  }

  function activeFilterSummary(state) {
    const chips = [];
    if (state.type && state.type !== "all") chips.push(`Type: ${typeLabel(state.type)}`);
    if (state.mode && state.mode !== "all") chips.push(`Mode: ${modeOptions.find((mode) => mode.value === state.mode)?.label ?? state.mode}`);

    allFacets.forEach((facet) => {
      const values = state[facet.stateKey] ?? [];
      if (!values.length) return;
      const preview = values.slice(0, 2).join(", ");
      const suffix = values.length > 2 ? ` +${values.length - 2}` : "";
      chips.push(`${facet.label}: ${preview}${suffix}`);
    });

    return chips.length ? chips : ["No active filters"];
  }

  function renderModeButtons(state) {
    return `
      <section class="filter-group">
        <div class="filter-group-header">
          <div>
            <h3>Mode</h3>
            <p>Same intent as Show All, Exclude SX, Only RCS.</p>
          </div>
        </div>
        <div class="filter-mode-row">
          ${modeOptions
            .map(
              (mode) => `
                <button class="filter-mode${state.mode === mode.value ? " active" : ""}" data-filter-mode="${escapeHtml(mode.value)}">
                  ${escapeHtml(mode.label)}
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderFacetGroup(orders, state, facet) {
    const options = facetCounts(orders, state, facet);
    const shownOptions = options.slice(0, 36);
    return `
      <section class="filter-group">
        <div class="filter-group-header">
          <div>
            <h3>${escapeHtml(facet.label)}</h3>
            <p>${facet.type ? `${typeLabel(facet.type)} scoped` : "Universal"}</p>
          </div>
          <div class="filter-actions">
            <button data-filter-action="clear" data-state-key="${escapeHtml(facet.stateKey)}">Clear</button>
            <button data-filter-action="selectAll" data-state-key="${escapeHtml(facet.stateKey)}">Select All</button>
          </div>
        </div>
        <div class="filter-options">
          ${shownOptions
            .map(
              (option) => `
                <button class="filter-option${option.active ? " active" : ""}" data-state-key="${escapeHtml(facet.stateKey)}" data-filter-value="${escapeHtml(option.value)}">
                  <span class="filter-check">${option.active ? "✓" : ""}</span>
                  <span class="filter-label">${escapeHtml(option.label)}</span>
                  <span class="filter-count">${option.count}</span>
                </button>
              `
            )
            .join("")}
          ${options.length > shownOptions.length ? `<div class="filter-overflow-note">${options.length - shownOptions.length} more values hidden in prototype</div>` : ""}
          ${options.length === 0 ? '<div class="empty-state">No values</div>' : ""}
        </div>
      </section>
    `;
  }

  function renderFilterPanel(container, state, options = {}) {
    const includeAllTypeGroups = Boolean(options.includeAllTypeGroups);
    const activeType = state.type ?? "all";
    const groups = activeType === "all" && includeAllTypeGroups ? typeOrder : activeType === "all" ? [] : [activeType];
    const summary = activeFilterSummary(state)
      .map((chip) => `<span class="chip${chip === "No active filters" ? " muted-chip" : ""}">${escapeHtml(chip)}</span>`)
      .join("");

    container.innerHTML = `
      <aside class="filter-panel-inner">
        <div class="filter-topline">
          <div>
            <p class="eyebrow">Filter sheet</p>
            <h2>Work order filters</h2>
          </div>
          <button class="plain-button" type="button">Share</button>
        </div>
        <p class="filter-note">Status stays universal. Equipment and Rules stay Spark-specific; Device filters are Network-specific; Point filters are Override-specific.</p>
        <div class="active-filter-summary">${summary}</div>
        ${commonFacets.map((facet) => renderFacetGroup(workOrders, state, facet)).join("")}
        ${groups
          .map(
            (type) => `
              <section class="filter-type-section ${escapeHtml(type)}">
                <div class="filter-type-heading">
                  <span class="type-badge ${escapeHtml(type)}">${escapeHtml(typeLabel(type))}</span>
                  <p>${escapeHtml(types[type].note)}</p>
                </div>
                ${type === "spark" ? renderModeButtons(state) : ""}
                ${typeFacets[type].map((facet) => renderFacetGroup(workOrders, state, facet)).join("")}
              </section>
            `
          )
          .join("")}
        ${activeType === "all" && !includeAllTypeGroups ? '<div class="filter-note strong-note">Select a work order type to show type-specific filters.</div>' : ""}
      </aside>
    `;
  }

  function handleFilterPanelClick(event, state, options = {}) {
    const modeButton = event.target.closest("[data-filter-mode]");
    if (modeButton) {
      state.mode = modeButton.dataset.filterMode;
      options.afterChange?.();
      return;
    }

    const actionButton = event.target.closest("[data-filter-action]");
    if (actionButton) {
      const stateKey = actionButton.dataset.stateKey;
      const action = actionButton.dataset.filterAction;
      const facet = facetsByStateKey[stateKey];
      if (!facet) return;
      if (action === "clear") state[stateKey] = [];
      if (action === "selectAll") state[stateKey] = facetValues(workOrders, state, facet);
      options.afterChange?.();
      return;
    }

    const optionButton = event.target.closest("[data-filter-value]");
    if (optionButton) {
      const stateKey = optionButton.dataset.stateKey;
      const value = optionButton.dataset.filterValue;
      const facet = facetsByStateKey[stateKey];
      if (!facet) return;
      const allValues = facetValues(workOrders, state, facet).map(String);
      const current = (state[stateKey] ?? []).map(String);
      let next;

      if (current.length === 0) {
        next = allValues.filter((item) => item !== value);
      } else if (current.includes(value)) {
        next = current.filter((item) => item !== value);
      } else {
        next = [...current, value];
      }

      state[stateKey] = next.length === allValues.length ? [] : next;
      options.afterChange?.();
    }
  }

  function cardHtml(order, options) {
    const compact = Boolean(options?.compact);
    const selected = options?.selectedId === order.id;
    const meta = compact ? order.meta.slice(0, 1) : order.meta.slice(0, 2);
    const selectedAttr = selected ? ' aria-pressed="true"' : "";
    const selectedClass = selected ? " selected" : "";
    const chips = meta.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("");

    return `
      <button class="wo-card type-${escapeHtml(order.type)}${selectedClass}" data-id="${escapeHtml(order.id)}"${selectedAttr}>
        <div class="card-top">
          <span class="wo-num">#${escapeHtml(order.number)}</span>
          <span class="assignee-badge">${escapeHtml(order.assignee)}</span>
        </div>
        <div class="wo-title">${escapeHtml(order.title)}</div>
        <div class="wo-subject">
          <span>${escapeHtml(order.subjectKind)}:</span>
          <strong>${escapeHtml(order.subject)}</strong>
        </div>
        <div class="chip-row">
          <span class="chip">${escapeHtml(order.project)}</span>
          <span class="chip">${escapeHtml(order.priority)}</span>
          ${chips}
        </div>
      </button>
    `;
  }

  function renderStatusColumns(container, orders, options = {}) {
    const visibleStatuses = Array.isArray(options.visibleStatuses) && options.visibleStatuses.length
      ? options.visibleStatuses
      : statuses.map((status) => status.value);
    const statusList = statuses.filter((status) => visibleStatuses.includes(status.value));
    const columnCount = Math.max(statusList.length, 1);
    container.style.gridTemplateColumns = `repeat(${columnCount}, minmax(220px, 1fr))`;
    container.style.minWidth = `${Math.max(columnCount * 232, 720)}px`;

    container.innerHTML = statusList
      .map((status) => {
        const statusOrders = orders.filter((order) => order.status === status.value);
        const cards = statusOrders.length
          ? statusOrders.map((order) => cardHtml(order, options)).join("")
          : '<div class="empty-state">No work orders</div>';

        return `
          <section class="status-column">
            <div class="status-header">
              <div class="status-title">
                <span class="status-dot ${escapeHtml(status.value)}"></span>
                <span>${escapeHtml(status.label)}</span>
              </div>
              <span class="count-pill">${statusOrders.length}</span>
            </div>
            <div class="column-body">${cards}</div>
          </section>
        `;
      })
      .join("");
  }
  window.WorkOrderKanbanMock = {
    statuses,
    modeOptions,
    projects,
    types,
    typeOrder,
    commonFacets,
    typeFacets,
    allFacets,
    workOrders,
    escapeHtml,
    statusLabel,
    typeLabel,
    createFilterState,
    cloneFilterState,
    filterOrders,
    uniqueValues,
    facetValues,
    facetCounts,
    resetTypeScopedFilters,
    activeFilterSummary,
    renderFilterPanel,
    handleFilterPanelClick,
    cardHtml,
    renderStatusColumns,
  };
})();




