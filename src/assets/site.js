/* New Life Tabernacle — site behaviour */
(()=>{
  const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav
  const mb=$('#menuBtn'),nav=$('#mainNav');
  mb.addEventListener('click',()=>{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu')});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.setAttribute('aria-label','Open menu')}));

  // Forms
  const say=(el,t)=>{el.hidden=false;el.textContent=t};
  // Copy
  $$('[data-copy]').forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.copy,orig=b.textContent;
    const ok=()=>{b.textContent='Copied';setTimeout(()=>b.textContent=orig,1600)};
    try{navigator.clipboard.writeText(t).then(ok,()=>{b.textContent=t})}catch(e){b.textContent=t}}));

  // Forms → Netlify Forms (submissions appear in the Netlify dashboard and can be emailed to the church)
  const post=form=>fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()}).then(r=>{if(!r.ok)throw new Error(r.status)});
  const FALLBACK='Something went wrong sending that. Call (718) 636-4938 or email newlife1476@aol.com and someone will help you.';
  const cf=$('#connectForm');
  cf.addEventListener('submit',async e=>{e.preventDefault();const d=$('#cDone'),b=$('#cSend');
    const name=cf.cName.value.trim(),contact=cf.cContact.value.trim();
    if(!name||!contact){say(d,'Add your name and an email or phone so we can reach you.');return}
    b.disabled=true;b.textContent='Sending…';
    try{await post(cf);say(d,`Thank you, ${name.split(' ')[0]}. Your message reached New Life Tabernacle, and someone will be in touch.`);cf.reset()}
    catch(err){say(d,FALLBACK)}
    b.disabled=false;b.textContent='Send'});
  const nf=$('#newsForm');
  nf.addEventListener('submit',async e=>{e.preventDefault();const v=nf.nEmail.value.trim(),d=$('#newsDone');
    if(!/\S+@\S+\.\S+/.test(v)){say(d,'Enter a valid email address to subscribe.');return}
    try{await post(nf);nf.reset();say(d,'You’re subscribed. Watch your inbox for news from New Life.')}
    catch(err){say(d,'That didn’t go through. Email newlife1476@aol.com to join the list.')}});

  // A word for today: mood → King James verse
  const WORDS={};(window.NLT&&NLT.moods||[]).forEach(m=>{WORDS[m.mood]=(m.verses||[]).map(v=>[v.ref,v.text])});
  const KEYS={anxious:'anxious worried worry stress stressed nervous anxiety panic restless tense uneasy',weary:'tired weary exhausted drained burnt burned worn sleepy fatigue rest',afraid:'afraid scared fear fearful terrified frightened',overwhelmed:'overwhelmed much pressure heavy burden drowning crushed busy',lonely:'lonely alone isolated forgotten abandoned left nobody',grieving:'grief grieving sad sorrow loss lost mourning died death crying hurt heartbroken broken',unsure:'unsure confused lost direction decision guidance unclear doubt doubting stuck',
    'ready to start over':'guilty shame ashamed sorry mistake failed sin forgive forgiveness start again over fresh',hopeful:'hopeful hope expecting waiting new optimistic',grateful:'grateful thankful thanks blessed appreciative',joyful:'joyful happy joy glad excited celebrate rejoice good great'};
  let mood=(window.NLT&&NLT.defaultMood)||Object.keys(WORDS)[0],idx=0;const wv=$('#wVerse'),wr=$('#wRef');
  const showWord=(m,i,anim=true)=>{mood=m;idx=i%WORDS[m].length;const [ref,txt]=WORDS[m][idx];
    const apply=()=>{wv.textContent=txt;wr.textContent=ref;$('#wFor').innerHTML='a word for when you feel <b></b>';$('#wFor b').textContent=m;
      $('#wRead').href='https://www.biblegateway.com/passage/?search='+encodeURIComponent(ref.replace(/:.*$/,''))+'&version=KJV';
      wv.classList.remove('swap');wr.classList.remove('swap')};
    if(anim&&!reduce){wv.classList.add('swap');wr.classList.add('swap');setTimeout(apply,240)}else apply();
    $$('.moods button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m))};
  $$('.moods button').forEach(b=>b.addEventListener('click',()=>showWord(b.dataset.m,b.dataset.m===mood?idx+1:Math.floor(Math.random()*WORDS[b.dataset.m].length))));
  $('#wNext').addEventListener('click',()=>showWord(mood,idx+1));
  $('#wCopy').addEventListener('click',e=>{const b=e.currentTarget,t=`“${wv.textContent}” ${wr.textContent} (KJV)`;
    try{navigator.clipboard.writeText(t).then(()=>{b.textContent='( copied )';setTimeout(()=>b.textContent='( copy )',1600)},()=>getSelection().selectAllChildren(wv))}catch(err){getSelection().selectAllChildren(wv)}});
  const matchLocal=t=>{t=t.toLowerCase();let best=null,score=0;for(const m of Object.keys(WORDS)){if(t.includes(m)){return m}}for(const [m,k] of Object.entries(KEYS)){if(!WORDS[m])continue;const sc=k.split(' ').filter(w=>t.includes(w)).length;if(sc>score){score=sc;best=m}}return best||mood};
  $('#ownForm').addEventListener('submit',async e=>{e.preventDefault();const t=$('#ownIn').value.trim();if(!t)return;const go=$('#ownGo');go.textContent='( finding… )';
    let pick=null;
    if(!pick){const m=matchLocal(t);pick=[m,Math.floor(Math.random()*WORDS[m].length)]}
    showWord(pick[0],pick[1]);go.textContent='( find a word )';
    if(innerWidth<=900)$('.w-card').scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})});

  // Videos: real YouTube thumbnails, and each poster turns into the player in place
  const canEmbed=location.protocol.startsWith('http');
  if(canEmbed)$$('.vid').forEach(v=>{const im=new Image();im.src='https://i.ytimg.com/vi/'+v.dataset.yt+'/hqdefault.jpg';im.alt='';im.className='thumb';v.prepend(im)});
  $$('.vid').forEach(v=>{const id=v.dataset.yt;v.addEventListener('click',e=>{
    if(!canEmbed)return;e.preventDefault();
    const f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.title=v.getAttribute('aria-label');
    v.classList.add('on');v.append(f)})});

  // ---------- Signature motion ----------
  const fine=matchMedia('(pointer:fine)').matches;
  // intro plays once per visit
  let introOn=false;
  try{introOn=!reduce&&!sessionStorage.getItem('nlt-intro');sessionStorage.setItem('nlt-intro','1')}catch(e){introOn=!reduce}
  if(introOn)document.documentElement.classList.add('has-intro');else $('.intro')?.remove();
  setTimeout(()=>$('.intro')?.remove(),3000);

  // smooth scroll
  let lenis=null;
  if(!reduce&&window.Lenis){try{lenis=new Lenis({lerp:.085,wheelMultiplier:.95});const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}catch(e){lenis=null}}
  const goTo=(y)=>lenis?lenis.scrollTo(y,{duration:1.4}):scrollTo({top:y,behavior:reduce?'auto':'smooth'});
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2)return;const t=$(id);if(!t)return;e.preventDefault();
    goTo(t.getBoundingClientRect().top+scrollY-80)}));

  // kinetic hero type: letters thin out under the cursor, and breathe on their own when it's away
  const h1=$('#h1'),cs=[];
  h1.querySelectorAll('.l>span').forEach(sp=>{const t=sp.textContent;sp.textContent='';[...t].forEach(ch=>{const c=document.createElement('span');c.className='c';c.textContent=ch;sp.append(c);if(ch.trim())cs.push(c)})});
  h1.setAttribute('aria-label','we believe God.');
  let pts=[],hx=-1e4,hy=-1e4,inside=false;
  const measure=()=>{pts=cs.map(c=>{const r=c.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2+scrollY]})};
  h1.closest('.hero').addEventListener('pointermove',e=>{hx=e.clientX;hy=e.clientY+scrollY;inside=true});
  h1.closest('.hero').addEventListener('pointerleave',()=>{inside=false});
  const ws=cs.map(()=>680);
  const kin=now=>{const t=now/1000;
    cs.forEach((c,i)=>{let target;
      if(inside&&fine){const d=Math.hypot(pts[i][0]-hx,pts[i][1]-hy);target=380+380*Math.min(1,d/260)}
      else target=reduce?680:660+70*Math.sin(t*1.1-i*.45);
      ws[i]+=(target-ws[i])*.12;c.style.setProperty('--w',ws[i].toFixed(0))});
    requestAnimationFrame(kin)};
  setTimeout(()=>{measure();requestAnimationFrame(kin)},introOn?2600:900);
  addEventListener('resize',measure);setInterval(measure,1200);

  // headlines rise word by word
  const heads=$$('.w-ask h2,.sh h2,.nlcf h2,.sp h2,.attend h2,.give-h,.hello-h,.f-top h2');
  heads.forEach(h=>{if(h.children.length)return;const words=h.textContent.trim().split(/\s+/);h.textContent='';
    words.forEach((w,i)=>{const o=document.createElement('span');o.className='wd';const n=document.createElement('span');n.textContent=w;n.style.transitionDelay=i*60+'ms';o.append(n);h.append(o);if(i<words.length-1)h.append(' ')})});
  if(!reduce){const hio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');hio.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px'});
    heads.forEach(h=>{if(h.getBoundingClientRect().top>innerHeight){h.classList.add('pre');hio.observe(h)}})}

  // pastors: pinned scroll story
  const track=$('#ptrack'),items=$$('.pitem'),pnav=$$('.pnav button');let cur=0;
  let pLock=0;const setP=(i,force)=>{if(!force&&Date.now()<pLock)return;if(i===cur)return;items.forEach((it,k)=>{it.classList.toggle('on',k===i);it.classList.toggle('was',k<i)});pnav.forEach((b,k)=>b.setAttribute('aria-current',k===i));cur=i};
  const pScroll=()=>{if(innerWidth<=860)return;const r=track.getBoundingClientRect(),span=r.height-innerHeight;
    const p=Math.min(1,Math.max(0,-r.top/span));setP(Math.min(2,Math.floor(p*3)));
    pnav.forEach((b,k)=>b.querySelector('i').style.setProperty('--f',Math.min(1,Math.max(0,p*3-k)).toFixed(3)))};
  addEventListener('scroll',pScroll,{passive:true});pScroll();
  pnav.forEach((b,k)=>b.addEventListener('click',()=>{setP(k,true);pLock=Date.now()+1700;pnav.forEach((x,j)=>x.querySelector('i').style.setProperty('--f',j<k?1:j===k?.5:0));const span=track.offsetHeight-innerHeight;goTo(track.getBoundingClientRect().top+scrollY+span*(k+.5)/3)}));

  // cursor
  const cr=$('#cur');
  if(fine&&!reduce){let x=-100,y=-100,cx2=-100,cy2=-100;
    addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;const t=e.target.closest('.vid,.sp,a,button,summary,input,select,textarea');
      cr.classList.remove('big','link');cr.firstChild.textContent='';
      if(!t)return;if(t.closest('.vid')){cr.classList.add('big');cr.firstChild.textContent='play'}
      else if(t.matches('.mcard,.sp')){cr.classList.add('big');cr.firstChild.textContent='view'}
      else if(t.matches('a,button,summary'))cr.classList.add('link')});
    const mv=()=>{cx2+=(x-cx2)*.22;cy2+=(y-cy2)*.22;cr.style.transform=`translate3d(${cx2}px,${cy2}px,0)`;requestAnimationFrame(mv)};mv();
    document.addEventListener('pointerleave',()=>{x=y=-100})}

  // Hero: the logo's open book and rising rays, drawn as light. Book edge draws in, rays rise, dust drifts in the beams.
  const cv=$('#rays'),ctx=cv.getContext('2d'),hero=cv.parentElement;
  let W=0,H=0,mx=.75,my=.3,ex=.75,ey=.3,sp=0,run=true;const t0=performance.now();
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const RAYS=Array.from({length:21},(_,i)=>({a:3+i*(76/20)+(rnd()-.5)*2.2,w:.55+rnd()*.9+(i%4===0?.7:0),l:.62+rnd()*.5,warm:i%5===2,ph:rnd()*6.28}));
  const MOTES=Array.from({length:70},()=>({x:rnd(),y:rnd(),r:.5+rnd()*1.5,v:.004+rnd()*.012,ph:rnd()*6.28}));
  const ease=x=>1-Math.pow(1-Math.min(1,Math.max(0,x)),3);
  const resize=()=>{const r=hero.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)};
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height});
  const frame=now=>{
    const t=reduce?9:(now-t0)/1000-(document.documentElement.classList.contains('has-intro')?1.6:0);ex+=(mx-ex)*.05;ey+=(my-ey)*.05;
    ctx.clearRect(0,0,W,H);
    const ox=W*(W<700?.02:.05),oy=H*.965,R=Math.hypot(W,H)*1.25;
    const rise=ease((t-.5)/1.8),line=ease(t/1.1),spread=1+sp*.35;
    const aim=Math.atan2(oy-ey*H,ex*W-ox)*180/Math.PI;
    ctx.globalCompositeOperation='lighter';
    for(const r of RAYS){
      const a=(r.a*(.12+.88*rise)*spread+(reduce?0:Math.sin(t*.25+r.ph)*.8)+(aim-45)*.03)*Math.PI/180;
      const w=r.w*Math.PI/180,len=R*r.l*(.4+.6*rise);
      const near=Math.max(0,1-Math.abs(aim-a*180/Math.PI)/14);
      const al=(.035+.035*(reduce?.5:.5+.5*Math.sin(t*.7+r.ph))+.16*near)*rise*(1-sp*.6);
      const gx=ox+Math.cos(a)*len,gy=oy-Math.sin(a)*len;
      const gr=ctx.createLinearGradient(ox,oy,gx,gy);
      gr.addColorStop(0,r.warm?`rgba(176,58,52,${al*2.2})`:`rgba(238,204,118,${al*2.2})`);
      gr.addColorStop(.45,`rgba(221,185,94,${al})`);gr.addColorStop(1,'rgba(221,185,94,0)');
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+Math.cos(a-w)*len,oy-Math.sin(a-w)*len);ctx.lineTo(ox+Math.cos(a+w)*len,oy-Math.sin(a+w)*len);ctx.closePath();
      ctx.fillStyle=gr;ctx.fill();
    }
    // dust in the light
    for(const m of MOTES){
      const y=((m.y-(reduce?0:t*m.v))%1+1)%1,x=(m.x+(reduce?0:Math.sin(t*.3+m.ph)*.01));
      const px=x*W,py=y*H,ang=Math.atan2(oy-py,px-ox)*180/Math.PI;
      if(ang<2||ang>82)continue;
      const d=Math.hypot(px-ex*W,py-ey*H)/Math.max(W,H),tw=.4+.6*Math.sin(t*1.6+m.ph*3);
      const al=Math.max(0,(.12+.5*Math.max(0,1-d*2.4))*tw)*rise;
      ctx.fillStyle=`rgba(245,222,160,${al})`;ctx.beginPath();ctx.arc(px,py,m.r,0,6.283);ctx.fill();
    }
    const glow=ctx.createRadialGradient(ox,oy,0,ox,oy,H*.8);glow.addColorStop(0,`rgba(238,204,118,${.14*rise})`);glow.addColorStop(1,'rgba(238,204,118,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation='source-over';
    // the open book's page edge
    ctx.fillStyle='rgba(221,185,94,.85)';ctx.fillRect(ox,oy,(W-ox-W*.04)*line,2);
    if(!reduce&&run)requestAnimationFrame(frame);
  };
  resize();new ResizeObserver(()=>{resize();if(reduce)frame(0)}).observe(hero);
  new IntersectionObserver(([e])=>{const was=run;run=e.isIntersecting;if(run&&!was&&!reduce)requestAnimationFrame(frame)}).observe(hero);
  requestAnimationFrame(frame);

  // Scroll motion
  const foot=$('.wordmark');
  const onScroll=()=>{const r=hero.getBoundingClientRect();sp=Math.min(1,Math.max(0,-r.top/r.height));
    if(foot&&!reduce){const fr=foot.getBoundingClientRect(),p=(innerHeight-fr.top)/(innerHeight+fr.height);foot.style.transform=`translateX(${(.5-p)*8}%)`}};
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  if(!reduce&&'IntersectionObserver' in window){
    const sel='.sh .lead,.f-list li,.connect>*,.at-top .lead,.atc,.first>div,.feat,.lv,.vrow .vp,.poster,.gw,.nlcf>*,.conv,.mottos blockquote,.give>*';
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
    $$(sel).forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight)return;
      const sib=[...el.parentElement.children].filter(c=>c.matches(sel)).indexOf(el);
      el.style.transitionDelay=Math.min(sib,5)*70+'ms';el.classList.add('rv');io.observe(el)});
  }
})();
