  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.__lang='en'; try{ window.__lang=localStorage.getItem('vlang_hn')||'en'; }catch(e){}
  document.getElementById('year').textContent = new Date().getFullYear();
  var mb=document.getElementById('menuBtn'), mm=document.getElementById('mobileMenu');
  mb.addEventListener('click',function(){mm.classList.toggle('hidden');});
  mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mm.classList.add('hidden');});});

  // scroll progress bar
  var prog=document.getElementById('progress');
  addEventListener('scroll',function(){var h=document.documentElement;var sc=(h.scrollTop)/(h.scrollHeight-h.clientHeight);prog.style.width=(sc*100)+'%';},{passive:true});

  // reveal + count-up + mask reveal (with subtle stagger)
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){
      var el=e.target;
      var sibs=[].slice.call(el.parentNode.children).filter(function(n){return n.classList.contains('reveal')||n.classList.contains('rv-mask');});
      var idx=sibs.indexOf(el); if(idx>0 && !rm) el.style.transitionDelay=(idx*70)+'ms';
      el.classList.add('in');
      if(el.querySelectorAll) el.querySelectorAll('.count').forEach(runCount);
      io.unobserve(el);
    }
  });},{threshold:.14,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal,.rv-mask').forEach(function(el){io.observe(el);});
  function runCount(el){ if(el.dataset.done||rm){el.textContent=el.dataset.to;return;} el.dataset.done=1; var to=+el.dataset.to||0,t0=null,dur=1100;
    function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);el.textContent=Math.round((1-Math.pow(1-p,3))*to);if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);
  }

  // hero slideshow + synced text + parallax
  (function(){
    var HERO=[
      {tag:{en:'01 / Aluzinc roofing',es:'01 / Techos de aluzinc'}, word:{en:'Roofing.',es:'Techos.'}, sub:{en:'Aluzinc and metal roofs installed and repaired across Honduras — sealed tight, no leaks.',es:'Techos de aluzinc y lámina instalados y reparados en toda Honduras — bien sellados, sin goteras.'}},
      {tag:{en:'02 / Flooring & tile',es:'02 / Pisos y cerámica'}, word:{en:'Flooring.',es:'Pisos.'}, sub:{en:'Ceramic, porcelain and flooring laid level and clean — floors that last for years.',es:'Cerámica, porcelanato y pisos colocados a nivel y parejos — pisos que duran años.'}},
      {tag:{en:'03 / Plumbing',es:'03 / Fontanería'}, word:{en:'Plumbing.',es:'Fontanería.'}, sub:{en:'Water and drainage installs and repairs — a straight diagnosis and work that holds.',es:'Instalaciones y reparaciones de agua y drenaje — diagnóstico claro y trabajo que aguanta.'}}
    ];
    var N=HERO.length;
    var dotsWrap=document.getElementById('heroDots'), i=0;
    var elTag=document.getElementById('heroTag'), elH1=document.getElementById('heroH1'), elSub=document.getElementById('heroSub');
    HERO.forEach(function(s,n){var d=document.createElement('button');d.className='h-1.5 rounded-full transition-all '+(n===0?'w-6 bg-clay-soft':'w-1.5 bg-white/30');d.setAttribute('aria-label','Slide '+(n+1));d.addEventListener('click',function(){go(n);reset();});dotsWrap.appendChild(d);});
    var dots=[].slice.call(dotsWrap.children);
    function paint(){var L=window.__lang||'en',s=HERO[i];
      elTag.innerHTML='<span class="fade-up">'+s.tag[L]+'</span>';
      elH1.innerHTML='<span class="hl text-clay-soft">'+s.word[L]+'</span>';
      elSub.innerHTML='<span class="fade-up" style="animation-delay:.12s">'+s.sub[L]+'</span>';
      if(!rm) requestAnimationFrame(function(){ [elTag,elH1,elSub].forEach(function(c){var k=c.firstChild;if(k&&k.classList)k.classList.add('anim');}); });
    }
    window.__paintHero=paint;
    function go(n){dots[i].className='h-1.5 rounded-full transition-all w-1.5 bg-white/30';i=(n+N)%N;dots[i].className='h-1.5 rounded-full transition-all w-6 bg-clay-soft';paint();}
    var t; function start(){if(rm)return;t=setInterval(function(){go(i+1);},5000);} function reset(){clearInterval(t);start();}
    paint(); start();
    if(!rm){var hs=document.getElementById('heroSlides');addEventListener('scroll',function(){var y=window.scrollY;if(y<900)hs.style.transform='translateY('+(y*0.18)+'px)';},{passive:true});}
  })();

  // before / after slider
  (function(){
    var ba=document.getElementById('ba'), handle=document.getElementById('baHandle'), top=ba.querySelector('.ba-top');
    var dragging=false;
    function setP(p){p=Math.max(2,Math.min(98,p));top.style.clipPath='inset(0 '+(100-p)+'% 0 0)';handle.style.left=p+'%';}
    function fromEvent(e){var r=ba.getBoundingClientRect();var x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;return (x/r.width)*100;}
    handle.addEventListener('pointerdown',function(e){dragging=true;handle.setPointerCapture&&handle.setPointerCapture(e.pointerId);});
    addEventListener('pointermove',function(e){if(dragging)setP(fromEvent(e));});
    addEventListener('pointerup',function(){dragging=false;});
    ba.addEventListener('click',function(e){if(e.target.closest('.ba-handle'))return;setP(fromEvent(e));});
    setP(50);
  })();

  // back to top
  (function(){
    var b=document.getElementById('toTop');
    addEventListener('scroll',function(){var on=window.scrollY>600;b.style.opacity=on?'1':'0';b.style.transform=on?'none':'translateY(12px)';b.style.pointerEvents=on?'auto':'none';},{passive:true});
    b.addEventListener('click',function(){window.scrollTo({top:0,behavior:rm?'auto':'smooth'});});
  })();

  // service-area map (Honduras)
  (function(){
    if(!window.L||!document.getElementById('deMap'))return;
    var towns=[['Tegucigalpa',14.072,-87.192],['San Pedro Sula',15.505,-88.025],['La Ceiba',15.759,-86.782],['Choloma',15.614,-87.953],['El Progreso',15.400,-87.803],['Comayagua',14.460,-87.637],['Puerto Cortés',15.826,-87.930],['Villanueva',15.318,-88.000],['Choluteca',13.302,-87.191],['Danlí',14.033,-86.583],['Juticalpa',14.657,-86.219]];
    var map=L.map('deMap',{scrollWheelZoom:false,attributionControl:true}).setView([14.9,-86.9],7);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',{maxZoom:16,crossOrigin:true,attribution:'Tiles &copy; Esri'}).addTo(map);
    var pts=[];
    towns.forEach(function(t){var m=L.circleMarker([t[1],t[2]],{radius:7,color:'#8A4023',weight:2,fillColor:'#C86B45',fillOpacity:1}).addTo(map);m.bindTooltip(t[0],{direction:'top',offset:[0,-4]});m.bindPopup('<b style="font-family:Anton,sans-serif;text-transform:uppercase;letter-spacing:.03em">'+t[0]+'</b><br><span style="color:#8A4023;font-size:.8rem">Vertex NTA · Honduras</span>');pts.push([t[1],t[2]]);});
    function refresh(){try{map.invalidateSize(false);if(pts.length)map.fitBounds(pts,{padding:[30,30]});}catch(e){}}
    map.whenReady(function(){requestAnimationFrame(refresh);});
    [200,700,1600].forEach(function(d){setTimeout(refresh,d);});
    window.addEventListener('resize',refresh);
    if('IntersectionObserver' in window){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){refresh();}});},{threshold:.01});io2.observe(document.getElementById('deMap'));}
    [].slice.call(document.querySelectorAll('#areaChips .ac')).forEach(function(bt){bt.addEventListener('click',function(){var c=bt.getAttribute('data-c').split(',');map.flyTo([+c[0],+c[1]],11,{duration:.7});});});
  })();

  // gallery filter + lightbox
  (function(){
    var items=[].slice.call(document.querySelectorAll('#gallery .gitem'));
    var filters=[].slice.call(document.querySelectorAll('#galFilters .gf'));
    filters.forEach(function(f){f.addEventListener('click',function(){
      filters.forEach(function(x){x.classList.remove('on');}); f.classList.add('on');
      var cat=f.getAttribute('data-filter');
      items.forEach(function(it){it.classList.toggle('hide', cat!=='all' && it.getAttribute('data-cat')!==cat);});
    });});
    var lb=document.getElementById('lightbox'), lbImg=document.getElementById('lbImg'), lbCap=document.getElementById('lbCap');
    var order=[], pos=0;
    function visible(){return items.filter(function(it){return !it.classList.contains('hide');});}
    function show(){var it=order[pos];lbImg.src=it.getAttribute('data-full');lbCap.textContent=it.getAttribute('data-cap');}
    function open(it){order=visible();pos=order.indexOf(it);if(pos<0)pos=0;show();lb.classList.remove('hidden');document.body.style.overflow='hidden';}
    function close(){lb.classList.add('hidden');document.body.style.overflow='';}
    items.forEach(function(it){it.addEventListener('click',function(){open(it);});it.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(it);}});});
    document.getElementById('lbClose').addEventListener('click',close);
    document.getElementById('lbNext').addEventListener('click',function(){if(order.length){pos=(pos+1)%order.length;show();}});
    document.getElementById('lbPrev').addEventListener('click',function(){if(order.length){pos=(pos-1+order.length)%order.length;show();}});
    lb.addEventListener('click',function(e){if(e.target.closest('button'))return;if(e.target.id==='lbImg')return;close();});
    document.addEventListener('keydown',function(e){if(lb.classList.contains('hidden'))return;if(e.key==='Escape')close();else if(e.key==='ArrowRight'){pos=(pos+1)%order.length;show();}else if(e.key==='ArrowLeft'){pos=(pos-1+order.length)%order.length;show();}});
  })();

  // floating contact button
  (function(){
    var fab=document.getElementById('fab'),btn=document.getElementById('fabBtn'),menu=document.getElementById('fabMenu'),icon=document.getElementById('fabIcon');
    function set(open){fab.classList.toggle('open',open);menu.classList.toggle('hidden',!open);menu.classList.toggle('flex',open);icon.style.transform=open?'rotate(45deg)':'';}
    btn.addEventListener('click',function(e){e.stopPropagation();set(!fab.classList.contains('open'));});
    document.addEventListener('click',function(e){if(!fab.contains(e.target))set(false);});
  })();

  // contact form -> native Webflow bridge
  (function(){
    var vf=document.getElementById('leadForm'); if(!vf) return;
    function t(en,es){return (window.__lang==='es')?es:en;}
    function nativeForm(){
      var forms=[].slice.call(document.querySelectorAll('form'));
      for(var i=0;i<forms.length;i++){var f=forms[i];if(f===vf)continue;if(f.closest&&f.closest('.w-form'))return f;}
      return null;
    }
    vf.addEventListener('submit',function(e){
      e.preventDefault();
      var note=document.getElementById('leadNote'), btn=document.getElementById('leadSubmit');
      var name=((vf.querySelector('[name=name]')||{}).value||'').trim();
      var phone=((vf.querySelector('[name=phone]')||{}).value||'').trim();
      function say(en,es,col){if(note){note.textContent=t(en,es);note.style.color=col||'';}}
      if(!name||!phone){say('Please add your name and phone.','Agrega tu nombre y teléfono.','#AD5533');return;}
      var nf=nativeForm();
      if(!nf){say('Could not send right now — please call us.','No se pudo enviar — por favor llámanos.','#AD5533');return;}
      function setv(n,val){var el=nf.querySelector('[name="'+n+'"]');if(el)el.value=val;}
      var proj=(vf.querySelector('[name=project]')||{}).value||'';
      var det=(vf.querySelector('[name=details]')||{}).value||'';
      var combined='Phone: '+phone+(proj?(' | '+proj):'')+(det?(' | '+det):'');
      setv('name',name);setv('phone',phone);setv('project',proj);
      setv('details',combined);setv('message',combined);setv('email',combined);
      var wrap=nf.closest('.w-form')||nf.parentNode, done=false;
      function finish(ok){ if(done)return; done=true; if(obs)obs.disconnect();
        if(btn){btn.disabled=false;btn.textContent=t('Send request','Enviar solicitud');}
        if(ok){say('Thanks! We’ll be in touch shortly.','¡Gracias! Te contactamos en breve.','#1c7a3f');vf.reset();}
        else{say('Something went wrong — please call us.','Algo falló — por favor llámanos.','#AD5533');}
      }
      var obs=new MutationObserver(function(){
        var d=wrap.querySelector('.w-form-done'), fl=wrap.querySelector('.w-form-fail');
        if(d&&getComputedStyle(d).display!=='none')finish(true);
        else if(fl&&getComputedStyle(fl).display!=='none')finish(false);
      });
      obs.observe(wrap,{attributes:true,childList:true,subtree:true,attributeFilter:['style']});
      if(btn){btn.disabled=true;btn.textContent=t('Sending…','Enviando…');}
      setTimeout(function(){finish(true);},6000);
      try{ if(nf.requestSubmit)nf.requestSubmit(); else nf.submit(); }catch(err){ var b=nf.querySelector('[type=submit]'); if(b)b.click(); }
    });
  })();

  // language toggle (EN default, ES optional)
  function setLang(lang){
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-en]').forEach(function(el){var v=el.getAttribute('data-'+lang);if(v!==null)el.innerHTML=v;});
    document.querySelectorAll('[data-en-ph]').forEach(function(el){var v=el.getAttribute('data-'+lang+'-ph');if(v!==null)el.setAttribute('placeholder',v);});
    document.querySelectorAll('.lang-btn').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-lang')===lang);});
    window.__lang=lang; if(window.__paintHero) window.__paintHero();
    try{localStorage.setItem('vlang_hn',lang);}catch(e){}
  }
  document.querySelectorAll('.lang-btn').forEach(function(b){b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'));});});
  var _s=null;try{_s=localStorage.getItem('vlang_hn');}catch(e){}
  if(!_s){var _nl=((navigator.languages&&navigator.languages[0])||navigator.language||navigator.userLanguage||'en').toLowerCase();_s=_nl.indexOf('es')===0?'es':'en';}
  setLang(_s);