(function(){
'use strict';
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var scenes=$$('.scene'),visited={},timers=[],hint=$('#hint');
var audio=new Audio('assets/station-ambience.mp3');audio.loop=true;audio.volume=.55;
var soundOn=false,audioOk=true,soundBtn=$('#sound');
audio.addEventListener('error',function(){audioOk=false});

function later(fn,ms){timers.push(setTimeout(fn,reduce?Math.min(ms,300):ms))}
function say(t){hint.textContent=t;clearTimeout(say.t);say.t=setTimeout(function(){hint.textContent=''},4500)}

function show(id){
  scenes.forEach(function(s){var on=s.id===id;s.classList.toggle('active',on);if(on){s.removeAttribute('inert');s.removeAttribute('aria-hidden')}else{s.setAttribute('inert','');s.setAttribute('aria-hidden','true')}});
  document.body.setAttribute('data-scene',id);
  var t=$('#'+id+' h2');if(t){t.setAttribute('tabindex','-1');setTimeout(function(){t.focus({preventScroll:true})},700)}
  $('#'+id).scrollTop=0;
}
$$('[data-go]').forEach(function(b){b.addEventListener('click',function(){show(b.getAttribute('data-go'))})});

/* sound */
function setSound(on){
  soundOn=on;soundBtn.textContent=on?'Sound on':'Sound off';soundBtn.setAttribute('aria-pressed',String(on));
  if(on){var p=audio.play();if(p&&p.catch)p.catch(function(){audioOk=false})
    setTimeout(function(){if(!audioOk)say('No audio yet. Add assets/station-ambience.mp3 to hear the station.')},400)}
  else audio.pause();
}
soundBtn.addEventListener('click',function(){setSound(!soundOn)});

/* progress */
function mark(p){
  if(visited[p])return;visited[p]=1;
  $('#lights [data-p='+p+']').classList.add('on');
  var st=$('[data-st='+p+']');st.textContent='Visited';st.parentNode.classList.add('done');
  if(visited.p1&&visited.p2&&visited.p3){
    $('#rows').hidden=true;$('#finalRow').hidden=false;
    $('#boardNote').textContent='The board has changed.';
  }
}

/* intro */
$$('#s-intro .line').forEach(function(el){later(function(){el.classList.add('in')},+el.getAttribute('data-delay'))});
$('#enter').addEventListener('click',function(){
  document.body.classList.add('entered');$('#hud').hidden=false;
  setSound(true);show('s-board');
  if(!reduce)setTimeout(function(){$('#s-intro').style.display='none'},4000);
});

/* p1 tickets */
(function(){
  var cap=$('#cap1'),tk=$$('#s-p1 .ticket'),n=0;
  tk.forEach(function(t){t.addEventListener('click',function(){
    cap.classList.add('swap');
    setTimeout(function(){cap.textContent=t.getAttribute('data-msg');cap.classList.remove('swap')},reduce?0:450);
    if(!t.classList.contains('read')){t.classList.add('read');n++}
    if(n===tk.length)mark('p1');
  })});
})();

/* p2 panels */
(function(){
  var ps=$$('#s-p2 .panel'),n=0;
  ps.forEach(function(p){var b=$('button',p);b.addEventListener('click',function(){
    if(!p.classList.contains('open')){p.classList.add('open');b.setAttribute('aria-expanded','true');n++}
    if(n===ps.length)mark('p2');
  })});
})();

/* p3 signs */
(function(){
  var ss=$$('#s-p3 .sign'),pl=$('#plaque'),seen=0;
  ss.forEach(function(s){s.addEventListener('click',function(){
    ss.forEach(function(x){x.classList.remove('sel')});s.classList.add('sel');
    pl.textContent=s.getAttribute('data-d');
    if(!s.classList.contains('read')){s.classList.add('read');seen++}
    if(seen===ss.length)mark('p3');
  })});
})();

/* letter */
$('#envelope').addEventListener('click',function(){
  this.hidden=true;$('#letter').hidden=false;
  later(function(){$('#toTrain').hidden=false},reduce?300:16000);
});

/* last train */
$('#toTrain').addEventListener('click',function(){
  show('s-train');
  var fade=setInterval(function(){audio.volume=Math.max(0,audio.volume-.02);if(audio.volume<=0){clearInterval(fade);audio.pause()}},300);
  later(function(){$('#farLight').classList.add('on')},1500);
  later(function(){$('#train').classList.add('in')},4000);
  later(function(){$('#train').classList.add('open')},13500);
  later(function(){$('#e1').classList.add('in')},16000);
  later(function(){$('#e2').classList.add('in')},21000);
  later(function(){$('#blackout').classList.add('on')},30000);
});
})();
