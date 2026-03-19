let S={
  screen:'intro', lang:'en', mode:null,
  names:{A:'',B:''},
  scores:{A:Array(10).fill(null),B:Array(10).fill(null)},
  detailMode:{A:{},B:{}},
  detailAnswers:{A:{},B:{}},
  partner:'A', qIdx:0, result:null, loading:false, error:null, hasSafety:false
};

const set=p=>{S={...S,...p};render();};
const t=()=>T[S.lang];
const nOf=p=>S.names[p]||(p==='A'?(S.lang==='ko'?'파트너 A':'Partner A'):(S.lang==='ko'?'파트너 B':'Partner B'));
const abbr=str=>str.length>8?str.slice(0,7)+'…':str;

function esc(v=''){
  return String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function setLang(l){S.lang=l;render();}

function toggleAcc(id){
  const body=document.getElementById('acc-'+id+'-body');
  const chev=document.getElementById('acc-'+id+'-chev');
  const btn=document.getElementById('acc-'+id+'-btn');
  if(!body)return;
  const open=body.classList.contains('open');
  body.classList.toggle('open',!open);
  if(btn)btn.classList.toggle('open',!open);
  if(chev)chev.style.transform=open?'':'rotate(90deg)';
}

function updateName(partner,value){
  S.names[partner]=value;
  const ok=S.mode&&S.names.A.trim()&&(S.mode==='single'||(S.mode==='couple'&&S.names.B.trim()));
  const btn=document.getElementById('begin-btn');
  if(btn) btn.disabled=!ok;
  const modeHint=document.getElementById('mode-hint');
  if(modeHint) modeHint.style.display=S.names.A.trim()&&!S.mode?'block':'none';
  const nameHint=document.getElementById('name-hint');
  if(nameHint) nameHint.style.display=S.mode&&!S.names.A.trim()?'block':'none';
  const nameHint2=document.getElementById('name-hint-2');
  if(nameHint2) nameHint2.style.display=S.mode==='couple'&&S.names.A.trim()&&!S.names.B.trim()?'block':'none';
}

function setScore(v){const s=JSON.parse(JSON.stringify(S.scores));s[S.partner][S.qIdx]=v;set({scores:s});}

function toggleDetailMode(partner,qIdx){
  const newMode=!getDetailMode(partner,qIdx);
  const dm=JSON.parse(JSON.stringify(S.detailMode));
  if(!dm[partner])dm[partner]={};
  dm[partner][qIdx]=newMode;
  const sc=JSON.parse(JSON.stringify(S.scores));
  sc[partner][qIdx]=null;
  const da=JSON.parse(JSON.stringify(S.detailAnswers));
  if(!da[partner])da[partner]={};
  da[partner][qIdx]=Array(10).fill(null);
  set({detailMode:dm,scores:sc,detailAnswers:da});
}
function setDetailAnswer(partner,qIdx,subIdx,val){
  const da=JSON.parse(JSON.stringify(S.detailAnswers));
  if(!da[partner])da[partner]={};
  if(!da[partner][qIdx])da[partner][qIdx]=Array(10).fill(null);
  da[partner][qIdx][subIdx]=val;
  set({detailAnswers:da});
}

function goNext(){
  if(S.qIdx<9)set({qIdx:S.qIdx+1});
  else if(S.mode==='couple'&&S.partner==='A')set({partner:'B',qIdx:0});
  else set({screen:'review'});
}
function goPrev(){
  if(S.qIdx>0)set({qIdx:S.qIdx-1});
  else if(S.mode==='couple'&&S.partner==='B')set({partner:'A',qIdx:9});
  else set({screen:'intro'});
}

function hasSafetyZero(sc){return sc[9]===0;}
function hasFoundationZero(sc){return sc[0]===0||sc[1]===0||sc[4]===0;}

function scoreBand(sc){
  const tr=t();
  if(hasSafetyZero(sc)) return{label:tr.bandSafety,color:'#A85240',bg:'#FAE8E5'};
  if(hasFoundationZero(sc)) return{label:tr.bandFoundation,color:'#A85240',bg:'#FAE8E5'};
  const total=sc.reduce((a,b)=>a+(b??0),0);
  const bands=tr.scoreBands;
  if(total>=85)return bands[0];
  if(total>=65)return bands[1];
  if(total>=45)return bands[2];
  return bands[3];
}

function getDetailMode(partner,qIdx){return !!(S.detailMode[partner]&&S.detailMode[partner][qIdx]);}
function getDetailAnswers(partner,qIdx){return (S.detailAnswers[partner]&&S.detailAnswers[partner][qIdx])||Array(10).fill(null);}
function computedScores(partner){
  return Q.map((q,i)=>{
    if(getDetailMode(partner,i)&&q.detailed){
      const ans=getDetailAnswers(partner,i);
      if(ans.some(a=>a===null))return null;
      return ans.reduce((a,b)=>a+b,0);
    }
    const raw=S.scores[partner][i];
    return raw===null?null:raw*5;
  });
}
function isDomainAnswered(partner,qIdx){
  if(getDetailMode(partner,qIdx)&&Q[qIdx].detailed){
    const ans=getDetailAnswers(partner,qIdx);
    return ans.every(a=>a!==null);
  }
  return S.scores[partner][qIdx]!==null;
}

function refPills(keys){
  return keys.map(k=>{
    const r=REFS[k];
    return `<a class="ref-pill" href="${r.url}" target="_blank" rel="noopener">↗ ${r.label}</a>`;
  }).join('');
}
