/* ============================================
   APEXCARE ADMINISTRATIVE CALENDAR - MAIN JS
   ============================================ */

'use strict';

// ══════════════════════════════════════════════════════════════════
// CONFIG — replace with your deployed Apps Script URL
// ══════════════════════════════════════════════════════════════════
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';

// ══════════════════════════════════════════════════════════════════
// USERS & ROLES
// ══════════════════════════════════════════════════════════════════
const USERS = {
  ceo:       { name: 'المدير التنفيذي',   role: 'ceo',       pin: '0000', initials: 'م ت', color: '#1a1a1a' },
  marketing: { name: 'مدير التسويق',      role: 'marketing', pin: '1111', initials: 'ت',   color: '#4f7af0' },
  operations:{ name: 'مدير العمليات',     role: 'operations',pin: '2222', initials: 'ع',   color: '#2ec4b6' },
  quality:   { name: 'مدير الجودة',       role: 'quality',   pin: '3333', initials: 'ج',   color: '#7c5fe6' },
};

const ROLE_LABELS = {
  ceo:        'المدير التنفيذي',
  marketing:  'التسويق',
  operations: 'العمليات',
  quality:    'الجودة',
  all:        'الجميع',
};

// ══════════════════════════════════════════════════════════════════
// 2026 HEALTH DAYS (MOH Saudi Arabia)
// Hardcoded — replace with live fetch once API available
// ══════════════════════════════════════════════════════════════════
const HEALTH_DAYS_2026 = [
  { date: '2026-01-28', name: 'اليوم العالمي للجذام', type: 'health' },
  { date: '2026-02-04', name: 'اليوم العالمي لمكافحة السرطان', type: 'health' },
  { date: '2026-02-28', name: 'اليوم العالمي للأمراض النادرة', type: 'health' },
  { date: '2026-03-08', name: 'اليوم العالمي للمرأة', type: 'health' },
  { date: '2026-03-20', name: 'اليوم العالمي للسعادة', type: 'health' },
  { date: '2026-03-22', name: 'اليوم العالمي للماء', type: 'health' },
  { date: '2026-03-24', name: 'اليوم العالمي للسل', type: 'health' },
  { date: '2026-04-02', name: 'اليوم العالمي للتوعية بالتوحد', type: 'health' },
  { date: '2026-04-07', name: 'اليوم العالمي للصحة', type: 'health' },
  { date: '2026-04-25', name: 'اليوم العالمي للملاريا', type: 'health' },
  { date: '2026-05-03', name: 'اليوم العالمي لحرية الصحافة', type: 'health' },
  { date: '2026-05-08', name: 'اليوم العالمي للصليب الأحمر', type: 'health' },
  { date: '2026-05-15', name: 'اليوم الدولي للأسرة', type: 'health' },
  { date: '2026-05-25', name: 'اليوم العالمي للتوعية بالجلطة الدماغية', type: 'health' },
  { date: '2026-05-31', name: 'اليوم العالمي لمكافحة التبغ', type: 'health' },
  { date: '2026-06-01', name: 'اليوم العالمي للطفل', type: 'health' },
  { date: '2026-06-05', name: 'اليوم العالمي للبيئة', type: 'health' },
  { date: '2026-06-14', name: 'اليوم العالمي للمتبرعين بالدم', type: 'health' },
  { date: '2026-06-26', name: 'اليوم الدولي لمكافحة المخدرات', type: 'health' },
  { date: '2026-07-11', name: 'اليوم العالمي للسكان', type: 'health' },
  { date: '2026-07-28', name: 'اليوم العالمي لالتهاب الكبد', type: 'health' },
  { date: '2026-08-09', name: 'اليوم الدولي للشعوب الأصلية', type: 'health' },
  { date: '2026-09-08', name: 'اليوم الدولي لمحو الأمية', type: 'health' },
  { date: '2026-09-10', name: 'اليوم العالمي لمنع الانتحار', type: 'health' },
  { date: '2026-09-21', name: 'اليوم العالمي للزهايمر', type: 'health' },
  { date: '2026-09-29', name: 'اليوم العالمي للقلب', type: 'health' },
  { date: '2026-10-01', name: 'اليوم الدولي لكبار السن', type: 'health' },
  { date: '2026-10-10', name: 'اليوم العالمي للصحة النفسية', type: 'health' },
  { date: '2026-10-12', name: 'اليوم العالمي للتهاب المفاصل', type: 'health' },
  { date: '2026-10-15', name: 'اليوم العالمي لغسل اليدين', type: 'health' },
  { date: '2026-10-16', name: 'اليوم العالمي للغذاء', type: 'health' },
  { date: '2026-10-20', name: 'اليوم العالمي لهشاشة العظام', type: 'health' },
  { date: '2026-11-01', name: 'اليوم العالمي للنباتيين', type: 'health' },
  { date: '2026-11-14', name: 'اليوم العالمي للسكري', type: 'health' },
  { date: '2026-11-17', name: 'اليوم العالمي للخداج', type: 'health' },
  { date: '2026-12-01', name: 'اليوم العالمي للإيدز', type: 'health' },
  { date: '2026-12-03', name: 'اليوم الدولي لذوي الإعاقة', type: 'health' },
  { date: '2026-12-10', name: 'اليوم العالمي لحقوق الإنسان', type: 'health' },
];

// ══════════════════════════════════════════════════════════════════
// 2026 ACADEMIC CALENDAR (Saudi MOE)
// ══════════════════════════════════════════════════════════════════
const EDUCATION_DAYS_2026 = [
  { date: '2026-01-01', name: 'رأس السنة الميلادية', type: 'holiday', duration: 1 },
  { date: '2026-02-22', name: 'اليوم الوطني السعودي (التأسيس)', type: 'holiday', duration: 1 },
  { date: '2026-03-01', name: 'بداية الفصل الدراسي الثاني', type: 'education' },
  { date: '2026-03-15', name: 'أسبوع التطوع السعودي', type: 'education' },
  { date: '2026-03-20', name: 'اليوم العالمي للسعادة (تعليمي)', type: 'education' },
  { date: '2026-04-05', name: 'إجازة منتصف الفصل الثاني', type: 'holiday', duration: 5 },
  { date: '2026-05-01', name: 'يوم العمال العالمي', type: 'holiday', duration: 1 },
  { date: '2026-06-01', name: 'إجازة عيد الأضحى (متوقع)', type: 'holiday', duration: 10 },
  { date: '2026-06-20', name: 'نهاية العام الدراسي 1447هـ', type: 'education' },
  { date: '2026-07-01', name: 'الإجازة الصيفية', type: 'holiday', duration: 60 },
  { date: '2026-09-01', name: 'بداية العام الدراسي 1448هـ', type: 'education' },
  { date: '2026-09-23', name: 'اليوم الوطني السعودي 96', type: 'holiday', duration: 1 },
  { date: '2026-10-15', name: 'إجازة منتصف الفصل الأول', type: 'holiday', duration: 5 },
  { date: '2026-12-01', name: 'أسبوع مهارات المستقبل', type: 'education' },
  { date: '2026-12-20', name: 'إجازة نهاية الفصل الأول', type: 'holiday', duration: 14 },
];

// ══════════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════════
let state = {
  currentUser: null,
  currentYear:  2026,
  currentMonth: (new Date()).getMonth(), // 0-indexed
  events: [],       // merged array of all events
  userNotes: [],    // notes created by users
  selectedDay: null,
  editingEvent: null,
  isLoading: false,
};

// ══════════════════════════════════════════════════════════════════
// HIJRI DATE CONVERSION (simplified algorithm)
// ══════════════════════════════════════════════════════════════════
function toHijri(year, month, day) {
  const date = new Date(year, month, day);
  const jd = Math.floor((date - new Date(1970, 0, 1)) / 86400000) + 2440587.5;
  let l = Math.floor(jd) - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719)
          + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
        - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hYear  = 30 * n + j - 30;
  const hMonth = Math.floor((24 * l) / 709);
  const hDay   = l - Math.floor((709 * hMonth) / 24);
  const hMonthNames = ['محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى',
    'جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
  return `${hDay} ${hMonthNames[hMonth - 1]} ${hYear}هـ`;
}

// ══════════════════════════════════════════════════════════════════
// DATE HELPERS
// ══════════════════════════════════════════════════════════════════
function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function parseDate(str) {
  // "YYYY-MM-DD"
  const [y, m, d] = str.split('-').map(Number);
  return { y, m: m - 1, d };
}

function expandEvents(events) {
  // Expand multi-day events into individual day entries
  const expanded = [];
  events.forEach(ev => {
    const dur = ev.duration || 1;
    const base = parseDate(ev.date);
    for (let i = 0; i < dur; i++) {
      const d = new Date(base.y, base.m, base.d + i);
      expanded.push({
        ...ev,
        _key: dateKey(d.getFullYear(), d.getMonth(), d.getDate()),
        _dayOffset: i,
      });
    }
  });
  return expanded;
}

// ══════════════════════════════════════════════════════════════════
// BUILD EVENT MAP
// ══════════════════════════════════════════════════════════════════
function buildEventMap() {
  const map = {};
  const allEvents = [...state.events, ...state.userNotes];
  const expanded = expandEvents(allEvents);
  expanded.forEach(ev => {
    if (!map[ev._key]) map[ev._key] = [];
    map[ev._key].push(ev);
  });
  return map;
}

// ══════════════════════════════════════════════════════════════════
// APPS SCRIPT API
// ══════════════════════════════════════════════════════════════════
async function apiCall(action, payload = {}) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    // Demo mode — work with local state only
    return { ok: true, demo: true };
  }
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    });
    return await res.json();
  } catch (e) {
    console.warn('API error:', e);
    return { ok: false, error: e.message };
  }
}

async function loadNotesFromServer() {
  const res = await apiCall('getNotes');
  if (res.ok && res.notes) {
    state.userNotes = res.notes;
  }
}

async function saveNoteToServer(note) {
  return apiCall('saveNote', { note });
}

async function deleteNoteFromServer(id) {
  return apiCall('deleteNote', { id });
}

// ══════════════════════════════════════════════════════════════════
// PERMISSIONS
// ══════════════════════════════════════════════════════════════════
function canSeeEvent(ev) {
  if (!state.currentUser) return false;
  const role = state.currentUser.role;
  if (role === 'ceo') return true;                         // sees everything
  if (!ev.visibility) return true;                         // public event
  if (ev.visibility === 'all') return true;
  if (Array.isArray(ev.visibility)) return ev.visibility.includes(role);
  return ev.visibility === role;
}

// ══════════════════════════════════════════════════════════════════
// CALENDAR RENDER
// ══════════════════════════════════════════════════════════════════
const MONTH_NAMES_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو',
  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const WEEKDAYS_AR = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

function renderCalendar() {
  const { currentYear: y, currentMonth: m } = state;

  // Update header label
  document.getElementById('monthLabel').innerHTML =
    `<div class="month-name">${MONTH_NAMES_AR[m]} ${y}</div>
     <div class="hijri-label">${toHijri(y, m, 15).split(' ').slice(1).join(' ')}</div>`;

  const firstDay = new Date(y, m, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrev  = new Date(y, m, 0).getDate();
  const today = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const eventMap = buildEventMap();

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  let dayCount = 1;
  let nextCount = 1;

  // 6 rows × 7 cols
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cellIndex = row * 7 + col;
      let dayNum, dayYear, dayMonth, isOther = false;

      if (cellIndex < firstDay) {
        // Previous month
        dayNum   = daysInPrev - firstDay + cellIndex + 1;
        dayMonth = m - 1;
        dayYear  = m === 0 ? y - 1 : y;
        if (dayMonth < 0) dayMonth = 11;
        isOther = true;
      } else if (dayCount > daysInMonth) {
        // Next month
        dayNum   = nextCount++;
        dayMonth = m + 1;
        dayYear  = m === 11 ? y + 1 : y;
        if (dayMonth > 11) dayMonth = 0;
        isOther = true;
      } else {
        dayNum   = dayCount++;
        dayMonth = m;
        dayYear  = y;
      }

      const key = dateKey(dayYear, dayMonth, dayNum);
      const isToday   = key === todayKey;
      const isWeekend = col === 5 || col === 6;
      const dayEvents = (eventMap[key] || []).filter(canSeeEvent);

      const cell = document.createElement('div');
      cell.className = [
        'day-cell',
        isOther   ? 'other-month' : '',
        isToday   ? 'today'       : '',
        isWeekend ? 'weekend'     : '',
        dayEvents.length ? 'has-events' : '',
      ].filter(Boolean).join(' ');

      cell.dataset.key   = key;
      cell.dataset.year  = dayYear;
      cell.dataset.month = dayMonth;
      cell.dataset.day   = dayNum;

      const hijriStr = toHijri(dayYear, dayMonth, dayNum);
      const hijriDay = hijriStr.split(' ')[0];

      const visibleEvents = dayEvents.slice(0, 3);
      const moreCount     = dayEvents.length - visibleEvents.length;

      const pillsHTML = visibleEvents.map(ev =>
        `<div class="event-pill ${ev.type || 'admin'}" data-id="${ev.id || ''}" title="${ev.name}">
          ${ev.name}
        </div>`
      ).join('');

      cell.innerHTML = `
        <div class="day-number">${dayNum}</div>
        <div class="day-hijri">${hijriDay}</div>
        <div class="day-events">
          ${pillsHTML}
          ${moreCount > 0 ? `<div class="day-more">+${moreCount} أكثر</div>` : ''}
        </div>`;

      cell.addEventListener('click', () => openDayModal(key, dayYear, dayMonth, dayNum, dayEvents));
      grid.appendChild(cell);
    }
  }

  updateStats(eventMap);
}

// ══════════════════════════════════════════════════════════════════
// STATS SIDEBAR
// ══════════════════════════════════════════════════════════════════
function updateStats(eventMap) {
  const { currentYear: y, currentMonth: m } = state;
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  let health = 0, edu = 0, holiday = 0, notes = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(y, m, d);
    (eventMap[key] || []).forEach(ev => {
      if (ev.type === 'health')    health++;
      if (ev.type === 'education') edu++;
      if (ev.type === 'holiday')   holiday++;
      if (ev.type === 'note')      notes++;
    });
  }

  document.getElementById('statHealth').textContent   = health;
  document.getElementById('statEdu').textContent      = edu;
  document.getElementById('statHoliday').textContent  = holiday;
  document.getElementById('statNotes').textContent    = notes;
}

// ══════════════════════════════════════════════════════════════════
// DAY DETAIL MODAL
// ══════════════════════════════════════════════════════════════════
function openDayModal(key, year, month, day, dayEvents) {
  state.selectedDay = { key, year, month, day };

  const overlay = document.getElementById('dayModal');
  overlay.querySelector('.day-detail-date-big').textContent = day;
  overlay.querySelector('.day-detail-month').textContent =
    `${MONTH_NAMES_AR[month]} ${year}`;
  overlay.querySelector('.day-detail-hijri').textContent = toHijri(year, month, day);

  renderDayEventList(dayEvents);
  openModal('dayModal');
}

function renderDayEventList(events) {
  const list = document.getElementById('dayEventList');

  if (!events || events.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="icon">📅</div><p>لا توجد أحداث لهذا اليوم</p></div>`;
    return;
  }

  const TYPE_LABELS = { health:'صحي', education:'تعليمي', holiday:'إجازة', admin:'إداري', note:'ملاحظة' };
  const canEdit = (ev) => state.currentUser?.role === 'ceo' || ev.createdBy === state.currentUser?.role;

  list.innerHTML = events.map(ev => `
    <div class="event-list-item" data-id="${ev.id || ''}">
      <div class="event-list-dot" style="background:${getTypeColor(ev.type)}"></div>
      <div style="flex:1">
        <div class="event-list-name">${ev.name}</div>
        <div class="event-list-type">${TYPE_LABELS[ev.type] || ev.type} ${ev.visibility ? '· ' + formatVisibility(ev.visibility) : ''}</div>
      </div>
      ${canEdit(ev) ? `
      <div class="event-list-actions">
        <button class="btn-icon" onclick="openEditEventModal('${JSON.stringify(ev).replace(/"/g,'&quot;')}')">✏️</button>
        <button class="btn-icon delete" onclick="deleteEvent('${ev.id}')">🗑️</button>
      </div>` : ''}
    </div>`).join('');
}

function formatVisibility(v) {
  if (!v || v === 'all') return 'الجميع';
  if (Array.isArray(v)) return v.map(r => ROLE_LABELS[r] || r).join(', ');
  return ROLE_LABELS[v] || v;
}

function getTypeColor(type) {
  const map = {
    health:    '#2ec4b6',
    education: '#4f7af0',
    holiday:   '#f4a835',
    admin:     '#7c5fe6',
    note:      '#e85f7c',
  };
  return map[type] || '#6b6b6b';
}

// ══════════════════════════════════════════════════════════════════
// ADD / EDIT EVENT MODAL
// ══════════════════════════════════════════════════════════════════
function openAddEventModal() {
  state.editingEvent = null;
  document.getElementById('eventModalTitle').textContent = 'إضافة حدث جديد';
  document.getElementById('deleteEventBtn').style.display = 'none';
  resetEventForm();

  // Pre-fill date if a day is selected
  if (state.selectedDay) {
    const { year, month, day } = state.selectedDay;
    document.getElementById('eventDate').value = dateKey(year, month, day);
  }

  closeModal('dayModal');
  openModal('eventModal');
}

function openEditEventModal(evJson) {
  const ev = typeof evJson === 'string' ? JSON.parse(evJson.replace(/&quot;/g,'"')) : evJson;
  state.editingEvent = ev;

  document.getElementById('eventModalTitle').textContent = 'تعديل الحدث';
  const canDelete = state.currentUser?.role === 'ceo' || ev.createdBy === state.currentUser?.role;
  document.getElementById('deleteEventBtn').style.display = canDelete ? 'inline-flex' : 'none';

  document.getElementById('eventName').value     = ev.name || '';
  document.getElementById('eventDate').value     = ev.date || '';
  document.getElementById('eventType').value     = ev.type || 'admin';
  document.getElementById('eventDuration').value = ev.duration || 1;
  document.getElementById('eventNotes').value    = ev.notes || '';

  // Visibility checkboxes
  const vis = ev.visibility || 'all';
  document.querySelectorAll('#visibilityGroup input[type=checkbox]').forEach(cb => {
    cb.checked = vis === 'all' || (Array.isArray(vis) ? vis.includes(cb.value) : vis === cb.value);
  });

  closeModal('dayModal');
  openModal('eventModal');
}

function resetEventForm() {
  document.getElementById('eventName').value     = '';
  document.getElementById('eventDate').value     = '';
  document.getElementById('eventType').value     = 'admin';
  document.getElementById('eventDuration').value = 1;
  document.getElementById('eventNotes').value    = '';
  document.querySelectorAll('#visibilityGroup input[type=checkbox]').forEach(cb => cb.checked = true);
}

async function saveEvent() {
  const name     = document.getElementById('eventName').value.trim();
  const date     = document.getElementById('eventDate').value;
  const type     = document.getElementById('eventType').value;
  const duration = parseInt(document.getElementById('eventDuration').value) || 1;
  const notes    = document.getElementById('eventNotes').value.trim();

  if (!name || !date) {
    showToast('الرجاء إدخال الاسم والتاريخ', 'error');
    return;
  }

  const visBoxes = document.querySelectorAll('#visibilityGroup input[type=checkbox]:checked');
  const visArr   = Array.from(visBoxes).map(cb => cb.value);
  const visibility = visArr.length === 4 ? 'all' : (visArr.length === 0 ? 'all' : visArr);

  const ev = {
    id:         state.editingEvent?.id || `note_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    name, date, type, duration, notes, visibility,
    createdBy:  state.currentUser.role,
    createdAt:  state.editingEvent?.createdAt || new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
  };

  if (state.editingEvent) {
    const idx = state.userNotes.findIndex(n => n.id === ev.id);
    if (idx > -1) state.userNotes[idx] = ev;
    else state.userNotes.push(ev);
  } else {
    state.userNotes.push(ev);
  }

  await saveNoteToServer(ev);
  closeModal('eventModal');
  renderCalendar();
  showToast(state.editingEvent ? 'تم تحديث الحدث ✓' : 'تم إضافة الحدث ✓', 'success');
}

async function deleteEvent(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الحدث؟')) return;

  // Check in userNotes
  const idx = state.userNotes.findIndex(n => n.id === id);
  if (idx > -1) {
    state.userNotes.splice(idx, 1);
    await deleteNoteFromServer(id);
  } else {
    // Remove from builtin events (admin override)
    const idx2 = state.events.findIndex(e => e.id === id);
    if (idx2 > -1) state.events.splice(idx2, 1);
  }

  closeModal('eventModal');
  closeModal('dayModal');
  renderCalendar();
  showToast('تم حذف الحدث', 'error');
}

// ══════════════════════════════════════════════════════════════════
// MODAL HELPERS
// ══════════════════════════════════════════════════════════════════
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ══════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════
function showToast(msg, type = 'default') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ══════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════
function tryLogin() {
  const roleKey = document.getElementById('loginRole').value;
  const pin     = document.getElementById('loginPin').value;
  const user    = USERS[roleKey];

  if (!user || user.pin !== pin) {
    document.getElementById('loginError').textContent = 'كلمة المرور غير صحيحة';
    document.getElementById('loginPin').classList.add('shake');
    setTimeout(() => document.getElementById('loginPin').classList.remove('shake'), 500);
    return;
  }

  state.currentUser = { ...user };
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  document.getElementById('userNameDisplay').textContent   = user.name;
  document.getElementById('userRoleDisplay').textContent   = ROLE_LABELS[user.role] || user.role;
  document.getElementById('userAvatarDisplay').textContent = user.initials;
  document.getElementById('userAvatarDisplay').style.background = user.color;

  initApp();
}

function logout() {
  state.currentUser = null;
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginPin').value = '';
  document.getElementById('loginError').textContent = '';
}

// ══════════════════════════════════════════════════════════════════
// MONTH NAVIGATION
// ══════════════════════════════════════════════════════════════════
function prevMonth() {
  if (state.currentMonth === 0) { state.currentMonth = 11; state.currentYear--; }
  else state.currentMonth--;
  renderCalendar();
}

function nextMonth() {
  if (state.currentMonth === 11) { state.currentMonth = 0; state.currentYear++; }
  else state.currentMonth++;
  renderCalendar();
}

function goToday() {
  const now = new Date();
  state.currentMonth = now.getMonth();
  state.currentYear  = now.getFullYear();
  renderCalendar();
}

// ══════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════
async function initApp() {
  // Assign IDs to hardcoded events
  state.events = [
    ...HEALTH_DAYS_2026.map((e, i) => ({ ...e, id: `health_${i}`, createdBy: 'system' })),
    ...EDUCATION_DAYS_2026.map((e, i) => ({ ...e, id: `edu_${i}`, createdBy: 'system' })),
  ];

  // Load user notes from server (if connected)
  try { await loadNotesFromServer(); } catch(e) {}

  renderCalendar();
}

// ══════════════════════════════════════════════════════════════════
// DOM READY
// ══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Hide app until login
  document.getElementById('app').style.display = 'none';

  // Login form
  document.getElementById('loginBtn').addEventListener('click', tryLogin);
  document.getElementById('loginPin').addEventListener('keydown', e => {
    if (e.key === 'Enter') tryLogin();
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Month nav
  document.getElementById('prevMonthBtn').addEventListener('click', prevMonth);
  document.getElementById('nextMonthBtn').addEventListener('click', nextMonth);
  document.getElementById('todayBtn').addEventListener('click', goToday);

  // Quick add
  document.getElementById('quickAddBtn').addEventListener('click', () => {
    state.selectedDay = null;
    state.editingEvent = null;
    resetEventForm();
    document.getElementById('deleteEventBtn').style.display = 'none';
    document.getElementById('eventModalTitle').textContent = 'إضافة حدث جديد';
    openModal('eventModal');
  });

  // Day modal add button
  document.getElementById('addEventFromDayBtn').addEventListener('click', openAddEventModal);

  // Event modal save
  document.getElementById('saveEventBtn').addEventListener('click', saveEvent);

  // Event modal delete
  document.getElementById('deleteEventBtn').addEventListener('click', () => {
    if (state.editingEvent) deleteEvent(state.editingEvent.id);
  });

  // Close modals
  document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    });
  });

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});
