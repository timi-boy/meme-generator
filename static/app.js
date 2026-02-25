(function () {
  'use strict';

  const MEMEGEN_BASE = 'https://api.memegen.link/images';
  const PREVIEW_LARGE = 380;
  const EXPORT_SIZE = 600;
  const FONT = 'Impact, sans-serif';
  const STROKE = 3;
  const PADDING_RATIO = 0.03;

  const PLACEMENTS = [
    { id: 'top', name: 'Top', positions: ['top'], align: 'center' },
    { id: 'middle', name: 'Middle', positions: ['center'], align: 'center' },
    { id: 'bottom', name: 'Bottom', positions: ['bottom'], align: 'center' },
  ];

  var COMMON_PHOTOS = [
    { id: 'drake', name: 'Drake', imageUrl: MEMEGEN_BASE + '/drake.jpg' },
    { id: 'db', name: 'Distracted Boyfriend', imageUrl: MEMEGEN_BASE + '/db.jpg' },
    { id: 'success', name: 'Success Kid', imageUrl: MEMEGEN_BASE + '/success.jpg' },
    { id: 'cmm', name: 'Change My Mind', imageUrl: MEMEGEN_BASE + '/cmm.jpg' },
    { id: 'doge', name: 'Doge', imageUrl: MEMEGEN_BASE + '/doge.jpg' },
    { id: 'fry', name: 'Futurama Fry', imageUrl: MEMEGEN_BASE + '/fry.jpg' },
    { id: 'grumpycat', name: 'Grumpy Cat', imageUrl: MEMEGEN_BASE + '/grumpycat.jpg' },
    { id: 'bihw', name: 'Honest Work', imageUrl: MEMEGEN_BASE + '/bihw.jpg' },
    { id: 'noidea', name: 'No Idea', imageUrl: MEMEGEN_BASE + '/noidea.jpg' },
    { id: 'spongebob', name: 'Mocking SpongeBob', imageUrl: MEMEGEN_BASE + '/spongebob.jpg' },
    { id: 'stonks', name: 'Stonks', imageUrl: MEMEGEN_BASE + '/stonks.jpg' },
    { id: 'fine', name: 'This is Fine', imageUrl: MEMEGEN_BASE + '/fine.jpg' },
  ];

  var TOPIC_TEXTS = {
    shuffle: [
      { top: 'When you finally', bottom: 'get it working' },
      { top: 'Me ignoring responsibilities', bottom: 'Me making memes' },
      { top: 'Something bad', bottom: 'Something good' },
      { top: 'Expectation', bottom: 'Reality' },
      { top: 'Nobody:', bottom: 'Me at 3 AM:' },
      { top: 'Monday', bottom: 'Friday' },
    ],
    trump: [
      { top: 'Nobody:', bottom: 'Trump reading the Constitution' },
      { top: 'Fake news', bottom: 'Actual news' },
      { top: 'Biggest inauguration ever', bottom: 'The photo' },
      { top: 'I could stand in the middle of 5th Ave', bottom: 'and shoot somebody' },
      { top: 'Covfefe', bottom: 'The entire internet' },
      { top: 'The wall', bottom: 'Mexico paying for it' },
    ],
    manUnited: [
      { top: 'Man United fans', bottom: 'Next year is our year' },
      { top: 'Spending £200M', bottom: 'Still losing to Brighton' },
      { top: 'We\'re not a sacking club', bottom: '*sacks manager*' },
      { top: 'Trust the process', bottom: 'The process' },
      { top: 'Top 4 is lava', bottom: 'Man United' },
      { top: 'Glazers out', bottom: 'Glazers: *still there*' },
    ],
    dadJoke: [
      { top: 'I\'m reading a book about anti-gravity', bottom: 'It\'s impossible to put down' },
      { top: 'Why don\'t scientists trust atoms?', bottom: 'Because they make up everything' },
      { top: 'I used to hate facial hair', bottom: 'But then it grew on me' },
      { top: 'Why did the scarecrow win an award?', bottom: 'He was outstanding in his field' },
      { top: 'I told my wife she was drawing her eyebrows too high', bottom: 'She looked surprised' },
      { top: 'What do you call a fake noodle?', bottom: 'An impasta' },
    ],
    programmer: [
      { top: 'It works on my machine', bottom: 'Ship it' },
      { top: '99 little bugs in the code', bottom: 'Fix one bug, 100 little bugs' },
      { top: 'No comments', bottom: 'What does this do?' },
      { top: 'I\'ll fix it later', bottom: '*3 years later*' },
      { top: 'Just one more meeting', bottom: 'The entire day' },
      { top: 'Pushing to main', bottom: 'Hope nobody notices' },
    ],
    coffee: [
      { top: 'Before coffee', bottom: 'After coffee' },
      { top: 'I don\'t have a problem', bottom: '*twitches*' },
      { top: 'Decaf', bottom: 'Why bother' },
      { top: 'Me without coffee', bottom: 'Error 404: Human not found' },
      { top: 'Coffee: 0 calories', bottom: 'Coffee with stuff: 500 calories' },
      { top: 'Another coffee?', bottom: 'Yes' },
    ],
  };

  const state = {
    imageUrl: null,
    imageEl: null,
    textLine: '',
    textColor: '#ffffff',
    selectedPlacementId: 'top',
  };

  function wrapText(ctx, text, maxWidth) {
    if (!text || !maxWidth) return [''];
    var words = text.split(/\s+/);
    var lines = [];
    var current = '';
    for (var i = 0; i < words.length; i++) {
      var test = current ? current + ' ' + words[i] : words[i];
      var m = ctx.measureText(test);
      if (m.width > maxWidth && current) {
        lines.push(current);
        current = words[i];
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [''];
  }

  function drawMeme(ctx, width, height, preset) {
    var padding = Math.min(width, height) * PADDING_RATIO;
    var fontSize = Math.min(width, height) * 0.08;
    var lineHeight = fontSize * 1.2;
    var maxTextWidth = width - padding * 2;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    if (state.imageEl && state.imageEl.complete && state.imageEl.naturalWidth) {
      var img = state.imageEl;
      var scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
      var sw = img.naturalWidth * scale;
      var sh = img.naturalHeight * scale;
      ctx.drawImage(img, (width - sw) / 2, (height - sh) / 2, sw, sh);
    }

    ctx.font = 'bold ' + fontSize + 'px ' + FONT;
    var lines = wrapText(ctx, state.textLine || '', maxTextWidth);
    var blockHeight = lineHeight * lines.length;
    ctx.textAlign = preset.align;
    ctx.textBaseline = 'top';

    var pos = preset.positions[0] || 'center';
    var startY = pos === 'top' ? padding : pos === 'bottom' ? height - padding - blockHeight : (height - blockHeight) / 2;
    function posX() {
      if (preset.align === 'center') return width / 2;
      if (preset.align === 'right') return width - padding;
      return padding;
    }
    var x = posX();
    for (var i = 0; i < lines.length; i++) {
      var y = startY + i * lineHeight;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = STROKE;
      ctx.strokeText(lines[i] || '', x, y, maxTextWidth);
      ctx.fillStyle = state.textColor || '#ffffff';
      ctx.fillText(lines[i] || '', x, y, maxTextWidth);
    }
  }

  function setImageFromUrl(url) {
    if (state.imageUrl && state.imageUrl.indexOf('blob:') === 0) {
      URL.revokeObjectURL(state.imageUrl);
    }
    state.imageUrl = url;
    state.imageEl = null;
    if (!url) {
      renderPreviews();
      return;
    }
    var img = new Image();
    img.crossOrigin = url.indexOf('blob:') === 0 ? null : 'anonymous';
    img.onload = function () {
      state.imageEl = img;
      renderPreviews();
      updatePhotoSelection();
    };
    img.onerror = function () {
      state.imageEl = null;
      renderPreviews();
      updatePhotoSelection();
    };
    img.src = url;
  }

  function setImageFromFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFromUrl(URL.createObjectURL(file));
  }

  function updatePhotoSelection() {
    var items = document.querySelectorAll('.common-photo:not(.upload-photo-box)');
    items.forEach(function (el) {
      var url = el.dataset.imageUrl;
      el.classList.toggle('selected', url === state.imageUrl);
    });
    var uploadBox = document.getElementById('upload-photo-box');
    if (uploadBox) {
      uploadBox.classList.toggle('selected', state.imageUrl && state.imageUrl.indexOf('blob:') === 0);
    }
  }

  function getSelectedPreset() {
    for (var i = 0; i < PLACEMENTS.length; i++) {
      if (PLACEMENTS[i].id === state.selectedPlacementId) return PLACEMENTS[i];
    }
    return PLACEMENTS[0];
  }

  function renderCommonPhotos() {
    var container = document.getElementById('common-photos');
    var fileInput = document.getElementById('photo-upload-input');
    container.innerHTML = '';
    COMMON_PHOTOS.forEach(function (photo) {
      var wrap = document.createElement('button');
      wrap.type = 'button';
      wrap.className = 'common-photo';
      wrap.dataset.imageUrl = photo.imageUrl;
      wrap.title = photo.name;
      var img = document.createElement('img');
      img.src = photo.imageUrl;
      img.alt = photo.name;
      img.loading = 'lazy';
      var label = document.createElement('span');
      label.className = 'common-photo-name';
      label.textContent = photo.name;
      wrap.appendChild(img);
      wrap.appendChild(label);
      wrap.addEventListener('click', function () {
        setImageFromUrl(photo.imageUrl);
      });
      container.appendChild(wrap);
    });
    var uploadBox = document.createElement('button');
    uploadBox.type = 'button';
    uploadBox.id = 'upload-photo-box';
    uploadBox.className = 'common-photo upload-photo-box';
    uploadBox.title = 'Upload your own image';
    uploadBox.innerHTML = '<span class="upload-photo-icon">📤</span><span class="common-photo-name">Upload</span>';
    uploadBox.addEventListener('click', function () {
      if (fileInput) fileInput.click();
    });
    container.appendChild(uploadBox);
    if (fileInput) {
      fileInput.onchange = function () {
        var file = fileInput.files && fileInput.files[0];
        setImageFromFile(file);
        fileInput.value = '';
      };
    }
  }

  var PLACEMENT_ICONS = { top: '⬆️', middle: '🔶', bottom: '⬇️' };

  function renderPreviews() {
    var optionsEl = document.getElementById('placement-options');
    var largeCanvas = document.getElementById('placement-preview-large');
    if (!optionsEl) return;

    optionsEl.innerHTML = '';
    PLACEMENTS.forEach(function (preset) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-topic btn-placement' + (state.selectedPlacementId === preset.id ? ' selected' : '');
      btn.dataset.placementId = preset.id;
      var icon = document.createElement('span');
      icon.className = 'btn-topic-icon';
      icon.textContent = PLACEMENT_ICONS[preset.id] || '•';
      btn.appendChild(icon);
      btn.appendChild(document.createTextNode(preset.name));
      btn.addEventListener('click', function () {
        state.selectedPlacementId = preset.id;
        renderPreviews();
      });
      optionsEl.appendChild(btn);
    });

    if (largeCanvas) {
      largeCanvas.width = PREVIEW_LARGE;
      largeCanvas.height = PREVIEW_LARGE;
      var largeCtx = largeCanvas.getContext('2d');
      if (largeCtx) drawMeme(largeCtx, PREVIEW_LARGE, PREVIEW_LARGE, getSelectedPreset());
    }
  }

  function setTextFromInputValue(value) {
    state.textLine = (value || '').trim();
  }

  function getInputValueFromState() {
    return state.textLine || '';
  }

  function pickTopicText(topicKey) {
    var list = TOPIC_TEXTS[topicKey];
    if (!list || list.length === 0) return;
    var i = Math.floor(Math.random() * list.length);
    var pair = list[i];
    state.textLine = (pair.top + ' ' + pair.bottom).trim();
    var el = document.getElementById('text-input');
    if (el) el.value = state.textLine;
    renderPreviews();
  }

  function getMemeBlob(cb) {
    var preset = getSelectedPreset();
    var canvas = document.createElement('canvas');
    canvas.width = EXPORT_SIZE;
    canvas.height = EXPORT_SIZE;
    var ctx = canvas.getContext('2d');
    if (!ctx) { cb(null); return; }
    drawMeme(ctx, EXPORT_SIZE, EXPORT_SIZE, preset);
    canvas.toBlob(cb, 'image/png');
  }

  function copyImageToClipboard(cb) {
    getMemeBlob(function (blob) {
      if (!blob) { if (cb) cb(false); return; }
      if (navigator.clipboard && navigator.clipboard.write) {
        var item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(function () { if (cb) cb(true); }, function () { if (cb) cb(false); });
      } else {
        if (cb) cb(false);
      }
    });
  }

  function copyLinkToClipboard() {
    var url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {}, function () {});
    }
  }

  function closeShareDropdown() {
    var dd = document.getElementById('share-dropdown');
    if (dd) dd.hidden = true;
    var btn = document.getElementById('btn-share');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function openShareDropdown() {
    var dd = document.getElementById('share-dropdown');
    if (dd) dd.hidden = false;
    document.getElementById('btn-share').setAttribute('aria-expanded', 'true');
  }

  function toggleShareDropdown() {
    var dd = document.getElementById('share-dropdown');
    if (dd.hidden) openShareDropdown(); else closeShareDropdown();
  }

  function download() {
    var preset = getSelectedPreset();
    var canvas = document.createElement('canvas');
    canvas.width = EXPORT_SIZE;
    canvas.height = EXPORT_SIZE;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawMeme(ctx, EXPORT_SIZE, EXPORT_SIZE, preset);
    var a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'meme.png';
    a.click();
  }


  function bindUi() {
    var textInput = document.getElementById('text-input');
    if (textInput) {
      textInput.addEventListener('input', function () {
        setTextFromInputValue(this.value);
        renderPreviews();
      });
    }

    document.querySelectorAll('.btn-topic').forEach(function (btn) {
      btn.addEventListener('click', function () {
        pickTopicText(this.dataset.topic);
      });
    });

    document.getElementById('btn-download').addEventListener('click', download);

    var shareBtn = document.getElementById('btn-share');
    var shareDropdown = document.getElementById('share-dropdown');
    if (shareBtn && shareDropdown) {
      shareBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleShareDropdown();
      });
      shareDropdown.querySelectorAll('.share-dropdown-item').forEach(function (item) {
        item.addEventListener('click', function () {
          var action = this.dataset.action;
          if (action === 'copy-image') {
            copyImageToClipboard(function () { closeShareDropdown(); });
          } else if (action === 'copy-link') {
            copyLinkToClipboard();
            closeShareDropdown();
          } else if (action === 'download') {
            download();
            closeShareDropdown();
          }
        });
      });
    }
    document.addEventListener('click', function (e) {
      if (shareDropdown && !shareDropdown.contains(e.target) && e.target !== shareBtn) closeShareDropdown();
    });
    if (shareDropdown) shareDropdown.addEventListener('click', function (e) { e.stopPropagation(); });

    var colorInput = document.getElementById('text-color');
    if (colorInput) {
      colorInput.addEventListener('input', function () {
        state.textColor = this.value;
        renderPreviews();
      });
    }
    document.querySelectorAll('.color-swatch').forEach(function (btn) {
      var c = btn.dataset.color;
      if (c) btn.style.background = c;
      btn.addEventListener('click', function () {
        var color = this.dataset.color;
        state.textColor = color;
        var input = document.getElementById('text-color');
        if (input) input.value = color;
        renderPreviews();
      });
    });
  }

  renderCommonPhotos();
  bindUi();
  renderPreviews();
  if (COMMON_PHOTOS.length > 0) {
    setImageFromUrl(COMMON_PHOTOS[0].imageUrl);
  }
})();
