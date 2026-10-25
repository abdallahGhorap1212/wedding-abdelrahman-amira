/* ═══════════ دعوة زفاف عبدالرحمن وأميرة ═══════════ */
(function () {
  'use strict';

  // «بعد صلاة العشاء» ≈ ٦:٢٠ م بالتوقيت الشتوي — الصيفي بيخلص ليلة الخميس ٢٩/١٠،
  // فالموعدين نفس اللحظة بالـ UTC (٤:٣٠ م).
  var EVENTS = [
    { key: 'henna',   label: 'حنة العريس',  title: 'حنة العريس عبدالرحمن',
      start: new Date('2026-10-29T19:30:00+03:00'), place: 'قاعة الريان - أويش الحجر' },
    { key: 'wedding', label: 'حفل الزفاف', title: 'حفل زفاف عبدالرحمن وأميرة',
      start: new Date('2026-10-31T18:30:00+02:00'), place: 'قاعة بالميرا - صينية ميت خميس، أمام لادولشي فيتا' }
  ];
  var HOURS   = 4;  // مدة كل مناسبة في التقويم
  var MAP_URL = 'https://maps.app.goo.gl/vYgPshMJ1V8ywu9b7';

  var AR = '٠١٢٣٤٥٦٧٨٩';
  function ar(n) { return String(n).replace(/\d/g, function (d) { return AR[d]; }); }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── رسالة سريعة ── */
  var toast = document.getElementById('toast'), toastTimer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2800);
  }

  /* ── دعوة باسم الضيف: ?to=الاسم ── */
  var guest = (new URLSearchParams(location.search).get('to') || '').trim().slice(0, 60);
  if (guest) {
    document.querySelectorAll('.js-to').forEach(function (el) {
      var b = document.createElement('b');
      b.textContent = guest;
      el.textContent = el.id === 'guestLine' ? 'دعوة خاصة إلى ' : 'إلى: ';
      el.appendChild(b);
      el.hidden = false;
    });
  }

  /* ── البوابة: الضلفة الشمال نسخة من وش الباب، وكل ضلفة بتعرض نصّه ── */
  var face = document.getElementById('face');
  var copy = face.cloneNode(true);
  copy.removeAttribute('id');
  document.querySelector('.leaf-l').appendChild(copy);

  var gate = document.getElementById('gate');
  var opened = false;
  document.body.classList.add('locked');
  function openGate() {
    if (opened) return;
    opened = true;
    if (window.__weddingPlay) window.__weddingPlay();   // الضغطة دي هي التفاعل اللي المتصفح مستنيه للصوت
    gate.classList.add('opening');
    document.body.classList.add('ready');               // الغلاف بيظهر ورا الضلف وهي بتتفتح
    setTimeout(function () {
      gate.classList.add('gone');
      document.body.classList.remove('locked');
    }, reduce ? 200 : 2000);
    setTimeout(function () { gate.remove(); }, reduce ? 600 : 2800);
  }
  gate.addEventListener('click', openGate);

  /* ── لمعات الدهب ── */
  function sprinkle(box, n) {
    for (var i = 0; i < n; i++) {
      var d = document.createElement('i');
      d.style.left = (Math.random() * 100) + '%';
      d.style.setProperty('--s', (1.5 + Math.random() * 2.5).toFixed(1) + 'px');
      d.style.setProperty('--d', (9 + Math.random() * 10).toFixed(1) + 's');
      d.style.setProperty('--dl', (-Math.random() * 18).toFixed(1) + 's');
      d.style.setProperty('--dx', Math.round(Math.random() * 80 - 40) + 'px');
      box.appendChild(d);
    }
  }
  if (!reduce) {
    document.querySelectorAll('.dust').forEach(function (box) { sprinkle(box, window.innerWidth < 600 ? 14 : 24); });
  }

  /* ── الظهور عند التمرير ── */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── العد التنازلي بالأرقام المقلوبة ── */
  function Flap(el) {
    this.el = el;
    this.v = null;
    this.parts = ['t', 'b', 'ft', 'fb'].map(function (c) {
      var s = document.createElement('span');
      s.className = c;
      el.appendChild(s);
      return s;
    });
    var self = this;
    this.parts[3].addEventListener('animationend', function () { self.settle(); });
  }
  Flap.prototype.settle = function () {
    this.parts[1].textContent = this.parts[2].textContent = this.v;
    this.el.classList.remove('go');
  };
  Flap.prototype.set = function (txt) {
    if (txt === this.v) return;
    var old = this.v === null ? txt : this.v;
    this.v = txt;
    var p = this.parts;
    p[0].textContent = p[3].textContent = txt;   // الجديد: النص اللي فوق + الضلفة اللي نازلة
    p[1].textContent = p[2].textContent = old;   // القديم: النص اللي تحت + الضلفة اللي بتقع
    if (reduce || old === txt) { this.settle(); return; }
    this.el.classList.remove('go');
    void this.el.offsetWidth;
    this.el.classList.add('go');
  };

  var flaps = Array.prototype.map.call(document.querySelectorAll('.flap'), function (el) { return new Flap(el); });
  var cdLabel = document.getElementById('cdLabel');
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tick() {
    var now = Date.now();
    var next = EVENTS.filter(function (e) { return e.start.getTime() > now; })[0];
    if (!next) {
      document.getElementById('timer').hidden = true;
      cdLabel.hidden = true;
      var done = document.getElementById('timerDone');
      done.textContent = 'تمّ الفرح بحمد الله — شكراً لمشاركتكم فرحتنا';
      done.hidden = false;
      clearInterval(timer);
      return;
    }
    cdLabel.textContent = 'باقي على ' + next.label;
    var s = Math.floor((next.start.getTime() - now) / 1000);
    var vals = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    flaps.forEach(function (f, i) { f.set(ar(pad(vals[i]))); });
  }
  var timer = setInterval(tick, 1000);
  tick();

  /* ── التقويم: آبل تاخد ملف .ics، الباقي جوجل كاليندر ── */
  function gcal(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  var isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  document.querySelectorAll('.cal').forEach(function (btn) {
    var ev = EVENTS.filter(function (e) { return e.key === btn.getAttribute('data-ev'); })[0];
    if (!isApple) {
      var end = new Date(ev.start.getTime() + HOURS * 3600000);
      btn.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text='     + encodeURIComponent(ev.title) +
        '&dates='    + gcal(ev.start) + '/' + gcal(end) +
        '&details='  + encodeURIComponent('بعد صلاة العشاء — يسعدنا حضوركم' + (ev.key === 'wedding' ? '\n' + MAP_URL : '')) +
        '&location=' + encodeURIComponent(ev.place);
      btn.removeAttribute('download');
      btn.target = '_blank';
      btn.rel = 'noopener';
    }
    btn.addEventListener('click', function () {
      say(isApple ? 'هيفتحلك التقويم — اضغط «إضافة»' : 'هيفتح جوجل كاليندر في تبويب جديد');
    });
  });

  /* ── مشاركة الدعوة ── */
  var btnShare = document.getElementById('btnShare');
  var link = location.origin + location.pathname;
  var text = 'دعوة زفاف عبدالرحمن وأميرة 🤍\n' +
    'حنة العريس: الخميس ٢٩ أكتوبر — قاعة الريان، أويش الحجر\n' +
    'حفل الزفاف: السبت ٣١ أكتوبر — قاعة بالميرا، صينية ميت خميس\n' +
    'بعد صلاة العشاء\n' + link;
  btnShare.href = 'https://wa.me/?text=' + encodeURIComponent(text);
  btnShare.addEventListener('click', function (e) {
    if (navigator.share) {
      e.preventDefault();
      navigator.share({ title: 'دعوة زفاف عبدالرحمن وأميرة', text: text }).catch(function () {});
    }
  });
})();

/* ═══════════ موسيقى الخلفية ═══════════ */
(function () {
  'use strict';
  var btn = document.getElementById('musicBtn');
  if (!btn) return;

  var probe = document.createElement('audio');
  var ext = probe.canPlayType && probe.canPlayType('audio/webm; codecs="opus"') !== '' ? 'webm' : 'm4a';
  var N = 3;                     // عدد الأغاني
  var GAP_MS = 4000;             // الفاصل بينها
  var TARGET_VOL = 0.55;
  var KEY = 'wedding-ar-music';

  function list(x) {
    var out = [];
    for (var i = 1; i <= N; i++) out.push('audio/track-' + i + '.' + x);
    return out;
  }
  var TRACKS = list(ext);

  var audio = new Audio();
  audio.preload = 'auto';
  audio.volume = 0;
  audio.src = TRACKS[0];

  var idx = 0, userToggled = false, fadeTimer = null, gapTimer = null;
  var altTried = false, shouldPlay = false;

  audio.addEventListener('ended', function () {
    idx = (idx + 1) % TRACKS.length;
    audio.src = TRACKS[idx];
    clearTimeout(gapTimer);
    gapTimer = setTimeout(function () {
      if (!shouldPlay) return;
      audio.volume = 0;
      audio.play().then(function () { fadeTo(TARGET_VOL); }).catch(function () {});
    }, GAP_MS);
  });

  audio.addEventListener('error', function () {
    if (altTried) return;
    altTried = true;
    ext = (ext === 'webm' ? 'm4a' : 'webm');
    TRACKS = list(ext);
    audio.src = TRACKS[idx];
    audio.load();
    if (shouldPlay) audio.play().catch(function () {});
  });

  audio.addEventListener('play',  function () { setUI(true); });
  audio.addEventListener('pause', function () { setUI(false); });

  function setUI(on) {
    btn.classList.toggle('playing', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'إيقاف موسيقى الخلفية' : 'تشغيل موسيقى الخلفية');
  }

  function fadeTo(target, done) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(function () {
      var d = target - audio.volume;
      if (Math.abs(d) < 0.03) {
        audio.volume = target;
        clearInterval(fadeTimer);
        if (done) done();
        return;
      }
      audio.volume = Math.min(1, Math.max(0, audio.volume + d * 0.18));
    }, 60);
  }

  function play() {
    shouldPlay = true;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setUI(false); });
    fadeTo(TARGET_VOL);
  }
  function stop() {
    shouldPlay = false;
    clearTimeout(gapTimer);
    fadeTo(0, function () { audio.pause(); });
  }

  btn.addEventListener('click', function () {
    userToggled = true;
    if (audio.paused) { play();  try { localStorage.setItem(KEY, 'on');  } catch (e) {} }
    else              { stop();  try { localStorage.setItem(KEY, 'off'); } catch (e) {} }
  });

  function wanted() {
    try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; }
  }

  // المتصفحات بتمنع الصوت قبل أول تفاعل — بنفضل مستنيين ونشغّل مع أول لمسة
  var EVS = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'keydown', 'click', 'wheel', 'scroll'];
  function disarm() {
    EVS.forEach(function (e) { window.removeEventListener(e, tryStart); });
    document.removeEventListener('visibilitychange', onVisible);
  }
  function tryStart() {
    if (userToggled || !wanted()) { disarm(); return; }
    if (!audio.paused) { disarm(); return; }
    shouldPlay = true;
    var p = audio.play();
    if (p && p.then) p.then(function () { fadeTo(TARGET_VOL); disarm(); }).catch(function () {});
    else { fadeTo(TARGET_VOL); disarm(); }
  }
  function onVisible() { if (!document.hidden) tryStart(); }
  EVS.forEach(function (e) { window.addEventListener(e, tryStart, { passive: true }); });
  document.addEventListener('visibilitychange', onVisible);

  // فتح الباب بيشغّل الأغاني دايمًا — زي دعوة عبدالله وخلود
  window.__weddingPlay = function () { userToggled = true; play(); };

  setUI(false);
  tryStart();
  window.addEventListener('load', tryStart);
})();
