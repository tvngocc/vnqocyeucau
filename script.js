/* A little love letter — hoàn toàn chạy bằng HTML/CSS/JS, không cần server. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clone = (obj) => JSON.parse(JSON.stringify(obj));
  const defaultConfig = clone(window.LOVE_CONFIG || {});
  const symbols = ['♡','✿','☼','♫','✦','❀','☁','☕','☾','✧','❥','∞'];
  const galleryAngles = ['-3deg', '2deg', '-2deg', '3deg', '-1deg', '2deg'];
  let cfg = clone(defaultConfig);
  let toastTimer;
  let activeAnswer = '';
  let lastFocused = null;
  let musicCtx = null;
  let musicInterval = null;
  let musicStep = 0;
  let scratchRevealed = false;
  let scratchDrawing = false;
  let scratchStrokes = 0;

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3300);
  }
  function getConfig() {
    // Chỉ đọc từ config.js: không có giao diện chỉnh sửa hoặc ghi đè nội dung.
    cfg.memories = Array.isArray(cfg.memories) ? cfg.memories : [];
    cfg.reasons = Array.isArray(cfg.reasons) ? cfg.reasons : [];
    cfg.galleryCaptions = Array.isArray(cfg.galleryCaptions) ? cfg.galleryCaptions : [];
    cfg.galleryImages = Array.isArray(cfg.galleryImages) ? cfg.galleryImages : [];
    applyConfig();
  }
  function applyConfig() {
    document.documentElement.setAttribute('data-theme', ['rose','lavender','midnight'].includes(cfg.theme) ? cfg.theme : 'rose');
    $$('[data-bind]').forEach((el) => {
      const value = cfg[el.dataset.bind];
      if (typeof value === 'string') el.textContent = value;
    });
    document.title = `Gửi ${cfg.crushName || 'cậu'}, một điều thật lòng ♡`;
    $('meta[name="description"]').setAttribute('content', `Có một lời thương gửi ${cfg.crushName || 'cậu'} từ ${cfg.yourName || 'một người đặc biệt'}.`);
    $('#countdownSection').hidden = cfg.showCountdown === false;
    renderTimeline();
    renderReasons();
    renderGallery();
    updateCounters();
    $('#letterModalTitle').textContent = cfg.letterTitle || 'Gửi cậu, người đặc biệt';
    $('#letterSigner').textContent = cfg.yourName || 'Một người thương cậu';
    $('#letterContent').replaceChildren(...(Array.isArray(cfg.letter) ? cfg.letter : []).map((line) => {
      const p = document.createElement('p');
      p.textContent = line;
      return p;
    }));
    if (cfg.specialDate) $('#dateWhen').value = cfg.specialDate;
    $('#sendReplyBtn').disabled = !cfg.email?.trim();
    $('#emailWarning').hidden = !!cfg.email?.trim();
    initializeScratch();
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }
  function renderTimeline() {
    const list = $('#timeline'); list.replaceChildren();
    cfg.memories.slice(0, 8).forEach((entry) => {
      const item = element('article', 'timeline-item');
      const icon = element('div', 'timeline-symbol', entry.icon || '♡');
      const box = element('div', 'timeline-info');
      box.append(element('div', 'timeline-date', entry.date || ''), element('h3', '', entry.title || ''), element('p', '', entry.text || ''));
      item.append(icon, box); list.append(item);
    });
  }
  function renderReasons() {
    const grid = $('#reasonGrid'); grid.replaceChildren();
    cfg.reasons.slice(0, 24).forEach((reason, index) => {
      const card = element('button', 'reason-card'); card.type = 'button';
      card.setAttribute('aria-label', `Điều thứ ${index + 1}: chạm để lật thẻ`);
      card.setAttribute('aria-pressed', 'false');
      const inside = element('span', 'reason-inner');
      const front = element('span', 'reason-front');
      front.append(element('span', 'reason-number', String(index + 1).padStart(2,'0')), element('span','reason-symbol', symbols[index % symbols.length]), element('span','reason-prompt','Chạm để xem ↗'));
      const back = element('span', 'reason-back');
      back.append(element('span','', '♡'), element('p','',reason));
      inside.append(front, back); card.append(inside);
      card.addEventListener('click', () => { card.classList.toggle('flipped'); card.setAttribute('aria-pressed', String(card.classList.contains('flipped'))); });
      grid.append(card);
    });
  }
  function photoSrc(index) { return cfg.galleryImages?.[index] || `assets/photo-${index+1}.svg`; }
  function renderGallery() {
    const grid = $('#photoGrid'); grid.replaceChildren();
    for (let index=0; index<6; index++) {
      const tile = element('button','photo-tile'); tile.type='button';
      tile.style.setProperty('--rotate', galleryAngles[index]);
      tile.setAttribute('aria-label',`Xem ảnh ${index+1}, ${(cfg.galleryCaptions[index] || 'Ảnh kỷ niệm')}`);
      const image = element('img'); image.src=photoSrc(index); image.alt=cfg.galleryCaptions[index] || 'Ảnh kỷ niệm'; image.loading='eager';
      const edit = element('span','photo-edit','Xem ảnh ↗');
      const caption = element('span','photo-caption', cfg.galleryCaptions[index] || `Kỷ niệm số ${index + 1}`);
      tile.append(image,edit,caption); tile.addEventListener('click', () => openPhoto(index)); grid.append(tile);
    }
  }
  function openPhoto(index) {
    $('#photoModalTitle').textContent = cfg.galleryCaptions[index] || `Khoảnh khắc ${index+1}`;
    $('#photoModalImage').src=photoSrc(index);
    $('#photoCaption').textContent = cfg.galleryCaptions[index] || 'Một kỷ niệm thật đẹp';
    openModal('photoModal');
  }
  function openModal(id) {
    lastFocused=document.activeElement;
    const modal=$(`#${id}`); modal.hidden=false;
    document.body.classList.add('modal-open');
    const target=$('[data-close]',modal) || $('button',modal); if(target) target.focus();
  }
  function closeModal(id) {
    const modal=$(`#${id}`); modal.hidden=true;
    if (!$$('.modal-overlay:not([hidden])').length) document.body.classList.remove('modal-open');
    if (lastFocused?.isConnected) lastFocused.focus();
  }
  function closeAllModals() {
    $$('.modal-overlay:not([hidden])').forEach(m=>{m.hidden=true;});
    document.body.classList.remove('modal-open');
    if(lastFocused?.isConnected) lastFocused.focus();
  }
  function downloadText(filename, contents, type='text/plain;charset=utf-8') {
    const blob=new Blob([contents],{type});
    const url=URL.createObjectURL(blob);const a=element('a');a.href=url;a.download=filename;
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch { // Fallback for locally opened index.html or browsers without clipboard permission.
      const input=element('textarea');input.value=text;input.style.cssText='position:fixed;left:-9999px;top:0;';document.body.append(input);input.select();
      let result=false;try{result=document.execCommand('copy');}catch{}input.remove();return result;
    }
  }
  function parseLocalDate(s) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s||'')))return null;
    const [y,m,d]=s.split('-').map(Number);const date=new Date(y,m-1,d);
    if(date.getFullYear()!==y||date.getMonth()!==m-1||date.getDate()!==d)return null;
    return date;
  }
  function updateCounters() {
    const today=new Date();
    const first=parseLocalDate(cfg.firstMet);
    const dayEl=$('#daysTogether');
    if(first) {
      const nowDay=Date.UTC(today.getFullYear(),today.getMonth(),today.getDate());
      const startDay=Date.UTC(first.getFullYear(),first.getMonth(),first.getDate());
      dayEl.textContent=Math.max(0,Math.floor((nowDay-startDay)/86400000)).toLocaleString('vi-VN');
    } else dayEl.textContent='—';
    const event=parseLocalDate(cfg.specialDate);
    if(!event){['countDays','countHours','countMinutes','countSeconds'].forEach(id=>$('#'+id).textContent='—');return;}
    // Ngày đặc biệt lặp lại hằng năm. Trước mốc đầu tiên giữ nguyên năm đã đặt.
    let next=new Date(event.getFullYear(),event.getMonth(),event.getDate());
    if(next<today && today.getFullYear()>event.getFullYear()) next=new Date(today.getFullYear(),event.getMonth(),event.getDate());
    if(next<today) next=new Date(Math.max(today.getFullYear()+1,event.getFullYear()+1),event.getMonth(),event.getDate());
    const remaining=Math.max(0,next-today);
    $('#countDays').textContent=String(Math.floor(remaining/86400000)).padStart(2,'0');
    $('#countHours').textContent=String(Math.floor(remaining/3600000)%24).padStart(2,'0');
    $('#countMinutes').textContent=String(Math.floor(remaining/60000)%60).padStart(2,'0');
    $('#countSeconds').textContent=String(Math.floor(remaining/1000)%60).padStart(2,'0');
  }
  function initializeScratch() {
    const canvas=$('#scratchCanvas'),wrap=$('#scratchContainer');
    const width=wrap.clientWidth,height=wrap.clientHeight;
    if(!width||!height)return;
    const dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent-pale').trim()||'#f2dce1';
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent-dark').trim()||'#883d54';
    ctx.font='italic 21px Georgia';ctx.textAlign='center';ctx.fillText('✦ Cào để mở bí mật ✦',width/2,height/2+7);
    canvas.hidden=false;scratchRevealed=false;scratchStrokes=0;
  }
  function scratchMove(event,initial=false) {
    if(!scratchDrawing||scratchRevealed)return;
    event.preventDefault();
    const canvas=$('#scratchCanvas'),ctx=canvas.getContext('2d');
    const bounds=canvas.getBoundingClientRect(); const ratioX=canvas.width/bounds.width,ratioY=canvas.height/bounds.height;
    const x=(event.clientX-bounds.left)*ratioX,y=(event.clientY-bounds.top)*ratioY;
    ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=Math.max(28,Math.min(canvas.width,canvas.height)*.21);
    if(initial){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+.2,y+.2);ctx.stroke();}
    else {ctx.lineTo(x,y);ctx.stroke();}
    scratchStrokes++;
    if(scratchStrokes>80){revealScratch();toast('Bí mật đã được mở ♡');}
  }
  function revealScratch() {scratchRevealed=true;$('#scratchCanvas').hidden=true;}

  const notes = [
    ['C5',1],['E5',1],['G5',2],['E5',1],['D5',1],['C5',2],
    ['A4',1],['C5',1],['E5',2],['D5',1],['C5',1],['G4',2],
    ['A4',1],['C5',1],['F5',2],['E5',1],['D5',1],['C5',2],
    ['G4',1],['A4',1],['C5',2],['D5',1],['E5',1],['C5',2]
  ];
  const pitch={G4:392,A4:440,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99};
  let score=[];notes.forEach(([note,duration])=>{score.push(note);for(let i=1;i<duration;i++)score.push(null);});
  function playMusicNote(frequency) {
    if(!musicCtx||!frequency)return;
    const now=musicCtx.currentTime;
    const osc=musicCtx.createOscillator();const gain=musicCtx.createGain();
    osc.type='sine';osc.frequency.value=frequency;
    gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.085,now+.018);gain.gain.exponentialRampToValueAtTime(.0001,now+.36);
    osc.connect(gain).connect(musicCtx.destination);osc.start(now);osc.stop(now+.38);
  }
  async function toggleMusic() {
    if(musicCtx){clearInterval(musicInterval);const old=musicCtx;musicCtx=null;musicInterval=null;old.close().catch(()=>{});$('#musicBtn').classList.remove('active');$('#musicBtn').setAttribute('aria-pressed','false');$('#musicBtn').setAttribute('aria-label','Bật nhạc');$('#musicIcon').textContent='♫';toast('Đã tắt giai điệu.');return;}
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx){toast('Trình duyệt chưa hỗ trợ phát giai điệu.');return;}
    try{
      musicCtx=new Ctx();await musicCtx.resume();musicStep=0;
      const tick=()=>{const note=score[musicStep%score.length];if(note)playMusicNote(pitch[note]);musicStep++;};
      tick();musicInterval=setInterval(tick,240);
      $('#musicBtn').classList.add('active');$('#musicBtn').setAttribute('aria-pressed','true');$('#musicBtn').setAttribute('aria-label','Tắt nhạc');$('#musicIcon').textContent='♪';toast('Đang phát giai điệu tự sáng tác ♫');
    }catch {musicCtx=null;toast('Trình duyệt không thể phát nhạc.');}
  }
  function burstConfetti() {
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const wrap=$('#confetti');wrap.replaceChildren();
    const palette=['#d77e95','#ffd7ad','#c88daf','#fff0eb','#eabbca'];
    for(let i=0;i<85;i++){
      const piece=element('span','confetti-piece');piece.textContent=i%5===0?'♡':'◆';
      piece.style.left=`${Math.random()*100}%`;piece.style.fontSize=`${9+Math.random()*17}px`;piece.style.color=palette[i%palette.length];
      piece.style.animationDelay=`${Math.random()*.9}s`;piece.style.animationDuration=`${2.4+Math.random()*2.3}s`;
      piece.style.setProperty('--x',`${(Math.random()-.5)*330}px`);piece.style.setProperty('--rot',`${Math.random()*1600-800}deg`);
      wrap.append(piece);
    }
    setTimeout(()=>wrap.replaceChildren(),5500);
  }
  function startPetals() {
    if(!cfg.floatingHearts||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const root=$('#petals');
    setInterval(()=>{
      if(document.hidden || root.childElementCount>15)return;
      const petal=element('span','petal',Math.random()<.5?'♡':'✿');
      petal.style.left=`${Math.random()*100}%`;petal.style.fontSize=`${9+Math.random()*15}px`;
      const duration=8+Math.random()*9;petal.style.animationDuration=`${duration}s`;
      root.append(petal);setTimeout(()=>petal.remove(),duration*1000+150);
    },1100);
  }
  function answerText() {
    const names={yes:'Mình cũng muốn thử cùng cậu ♡',think:'Mình muốn thêm thời gian để suy nghĩ',friend:'Mình rất trân trọng cậu, nhưng mình muốn làm bạn'};
    return `Gửi ${cfg.yourName || 'cậu'},\n\nMình đã đọc món quà tỏ tình cậu gửi.\nCâu trả lời của mình là: ${names[activeAnswer] || ''}.\n${$('#replyMessage').value.trim() ? '\nLời nhắn thêm: '+$('#replyMessage').value.trim()+'\n' : ''}\nTừ ${cfg.crushName || 'mình'} ♡`;
  }
  function chooseAnswer(type) {
    activeAnswer=type;$('#replyMessage').value='';
    const content={
      yes:{icon:'♥',title:'Một khởi đầu thật đáng yêu! ♡',body:'Cảm ơn cậu đã mở lòng. Nếu cả hai đều muốn, hãy bắt đầu bằng những cuộc trò chuyện và những buổi gặp gỡ thật tự nhiên.'},
      think:{icon:'✿',title:'Cứ từ từ, không sao cả.',body:'Cảm ơn cậu đã đọc những lời này. Không cần vội đâu, cảm xúc luôn xứng đáng được lắng nghe theo nhịp riêng.'},
      friend:{icon:'♡',title:'Cảm ơn cậu vì đã chân thành.',body:'Câu trả lời này vẫn rất đáng trân trọng. Mong chúng mình sẽ luôn giữ sự tử tế và những kỷ niệm đẹp dành cho nhau.'}
    }[type];
    $('#answerIcon').textContent=content.icon;$('#answerTitle').textContent=content.title;$('#answerBody').textContent=content.body;
    $('#answerPreview').hidden=false;$('#answerPreview').textContent=content.title+' Nếu muốn, bạn có thể gửi phản hồi bằng email hoặc sao chép tin nhắn.';
    openModal('answerModal');if(type==='yes')burstConfetti();
  }
  function setupEvents() {
    $$('.answer-btn').forEach(button=>button.addEventListener('click',()=>chooseAnswer(button.dataset.answer)));
    $('#sendReplyBtn').addEventListener('click',()=>{
      if(!cfg.email?.trim()){toast('Chủ nhân chưa thêm email nhận phản hồi. Hãy sao chép lời nhắn nhé.');return;}
      const subject=`Lời hồi đáp từ ${cfg.crushName || 'người đặc biệt'} ♡`;
      const uri=`mailto:${encodeURIComponent(cfg.email.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(answerText())}`;
      window.location.href=uri;
      toast('Đã yêu cầu mở ứng dụng email. Bạn cần bấm Gửi trong ứng dụng để hoàn tất.');
    });
    $('#copyReplyBtn').addEventListener('click',async()=>toast(await copyText(answerText())?'Đã sao chép lời hồi đáp.':'Không tự sao chép được; hãy chọn và sao chép lời nhắn.'));
    $('#musicBtn').addEventListener('click',toggleMusic);
    $('#mobileMenuBtn').addEventListener('click',()=>{
      const menu=$('#mobileNav'),isOpen=!menu.hidden;menu.hidden=isOpen;$('#mobileMenuBtn').setAttribute('aria-expanded',String(!isOpen));$('#mobileMenuBtn').textContent=isOpen?'☰':'✕';
    });
    $$('#mobileNav a').forEach(link=>link.addEventListener('click',()=>{$('#mobileNav').hidden=true;$('#mobileMenuBtn').setAttribute('aria-expanded','false');$('#mobileMenuBtn').textContent='☰';}));
    $('#openLetterBtn').addEventListener('click',()=>{
      $('#openLetterBtn').classList.add('is-open');$('#letterPrompt').textContent='Một lá thư thật lòng, chỉ dành cho cậu ♡';
      setTimeout(()=>openModal('letterModal'),420);
    });
    $('#copyLetterBtn').addEventListener('click',async()=>{
      const body=[cfg.letterTitle,...(cfg.letter||[]),`Thương mến, ${cfg.yourName}`].join('\n\n');
      toast(await copyText(body)?'Đã sao chép lá thư ♡':'Không thể sao chép tự động.');
    });
    $$('[data-close]').forEach(button=>button.addEventListener('click',()=>closeModal(button.dataset.close)));
    $$('.modal-overlay').forEach(overlay=>overlay.addEventListener('mousedown',(e)=>{if(e.target===overlay)closeModal(overlay.id);}));
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape')closeAllModals();
      if(e.key==='Tab'){
        const opened=$('.modal-overlay:not([hidden])');if(!opened)return;
        const focusables=$$('button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),select:not(:disabled)',opened).filter(el=>el.offsetParent!==null);
        if(!focusables.length)return;
        const first=focusables[0],last=focusables[focusables.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    $('#revealSecret').addEventListener('click',()=>{revealScratch();toast('Bí mật đã được mở ♡');});
    const scratch=$('#scratchCanvas');
    scratch.addEventListener('pointerdown',e=>{scratchDrawing=true;scratch.setPointerCapture(e.pointerId);scratchMove(e,true);});
    scratch.addEventListener('pointermove',e=>scratchMove(e));
    for(const event of ['pointerup','pointercancel'])scratch.addEventListener(event,()=>scratchDrawing=false);
    $('#loveRange').addEventListener('input',e=>{
      const value=Number(e.target.value);$('#lovePercent').textContent=`${value}%`;
      $('#meterText').textContent=value<25?'Có một chút rung rinh ♡':value<60?'Trái tim đang vui lên!':value<99?'Nhiều hơn một chút mỗi ngày ♡':'Không đếm nổi nữa rồi ♥';
      $('.meter-heart').style.transform=`scale(${.8+value/300})`;
    });
    $('#calendarBtn').addEventListener('click',()=>{
      const value=$('#dateWhen').value,when=parseLocalDate(value);
      if(!when){toast('Hãy chọn một ngày hợp lệ trước nhé.');$('#dateWhen').focus();return;}
      const start=new Date(when.getFullYear(),when.getMonth(),when.getDate(),16,0,0);
      const end=new Date(start.getTime()+2*3600000);
      const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
      const escapeIcs=text=>String(text).replace(/\\/g,'\\\\').replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n');
      const title=`Một buổi hẹn nhỏ của ${cfg.yourName} và ${cfg.crushName}`;
      const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Thu Gui Cau//Love Letter//VI','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${Date.now()}-lovestory@local`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${escapeIcs(title)}`,`DESCRIPTION:${escapeIcs($('#dateIdea').value)}\n${escapeIcs('Lời hẹn nhỏ xinh ♡')}`,`LOCATION:${escapeIcs(cfg.location||'Chưa chốt địa điểm')}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
      downloadText('loi-hen-nho.ics',ics,'text/calendar;charset=utf-8');toast('Đã tải lịch hẹn (.ics) — hãy mở file để thêm vào lịch điện thoại / máy tính.');
    });
    $('#shareBtn').addEventListener('click',async()=>{
      if(location.protocol==='file:'){toast('Hãy đăng web lên hosting trước khi chia sẻ link cho người ấy nhé.');return;}
      const url=location.href.split('#')[0];
      if(navigator.share){try{await navigator.share({title:document.title,text:`Có một lời nhắn nho nhỏ gửi ${cfg.crushName} ♡`,url});return;}catch{}}
      toast(await copyText(url)?'Đã sao chép đường link ♡':'Bạn có thể sao chép URL trên thanh địa chỉ.');
    });
    $('#backToTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll',()=>$('#backToTop').classList.toggle('visible',scrollY>600),{passive:true});
    let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(initializeScratch,240);});
    document.addEventListener('visibilitychange',()=>{if(musicCtx && document.hidden)musicCtx.suspend();else if(musicCtx)musicCtx.resume();});
  }
  function initReveal(){
    if(!('IntersectionObserver' in window)){$$('.reveal').forEach(el=>el.classList.add('visible'));return;}
    const observer=new IntersectionObserver((entries)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
    $$('.reveal').forEach(el=>observer.observe(el));
  }
  setupEvents();getConfig();initReveal();startPetals();setInterval(updateCounters,1000);
})();
