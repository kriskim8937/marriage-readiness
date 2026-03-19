function buildProfile(scA,scB,isCouple,lang){
  const flags=[],strengths=[],growth=[];
  const totalA=scA.reduce((a,b)=>a+(b??0),0);
  const totalB=isCouple?scB.reduce((a,b)=>a+(b??0),0):null;
  const safetyIdx=[9],foundationIdx=[0,1,4];
  const addFlag=(idx,partner,reason)=>{
    const qEn=Q[idx].en.title,qKo=Q[idx].ko.title;
    flags.push({item:`Item ${Q[idx].id}: ${lang==='ko'?qKo:qEn}`,partner,reason});
  };
  safetyIdx.forEach(i=>{
    if(scA[i]===0)addFlag(i,'A','safety_zero');
    if(isCouple&&scB[i]===0)addFlag(i,'B','safety_zero');
  });
  foundationIdx.forEach(i=>{
    if(scA[i]===0)addFlag(i,'A','foundation_zero');
    if(isCouple&&scB[i]===0&&!flags.find(f=>f.item.startsWith(`Item ${Q[i].id}`)&&f.partner==='B'))addFlag(i,'B','foundation_zero');
  });
  Q.forEach((q,i)=>{
    if(safetyIdx.includes(i)||foundationIdx.includes(i))return;
    if(scA[i]===0&&!flags.find(f=>f.item.startsWith(`Item ${q.id}`)&&f.partner==='A'))addFlag(i,'A','zero');
    if(isCouple&&scB[i]===0&&!flags.find(f=>f.item.startsWith(`Item ${q.id}`)&&f.partner==='B'))addFlag(i,'B','zero');
  });
  if(isCouple)Q.forEach((q,i)=>{
    if(scA[i]!==null&&scB[i]!==null&&Math.abs(scA[i]-scB[i])>=5)
      flags.push({item:`Item ${q.id}: ${lang==='ko'?q.ko.title:q.en.title}`,partner:'both',reason:'discrepancy',gap:scA[i]-scB[i]});
  });
  foundationIdx.forEach(i=>{
    if(scA[i]>=4&&scA[i]<=7&&(!isCouple||scB[i]>=4&&scB[i]<=7))
      flags.push({item:`Item ${Q[i].id}: ${lang==='ko'?Q[i].ko.title:Q[i].en.title}`,partner:'both',reason:'paired_one'});
  });
  Q.forEach((q,i)=>{
    if(scA[i]>=8&&(!isCouple||scB[i]>=8))
      strengths.push({item:`Item ${q.id}`,title:lang==='ko'?q.ko.title:q.en.title});
  });
  Q.forEach((q,i)=>{
    const aScore=scA[i],bScore=isCouple?scB[i]:null;
    if((aScore>=4&&aScore<=7)||(isCouple&&bScore>=4&&bScore<=7)){
      if(!flags.find(f=>f.item.startsWith(`Item ${q.id}`)))
        growth.push({item:`Item ${q.id}`,title:lang==='ko'?q.ko.title:q.en.title,priority:q.hw?1:0});
    }
  });
  growth.sort((a,b)=>b.priority-a.priority);
  return{flags,strengths:strengths.slice(0,4),growth:growth.slice(0,4),totalA,totalB};
}

async function analyze(){
  set({screen:'loading',loading:true,error:null});
  const nA=nOf('A'),nB=nOf('B');
  const isCouple=S.mode==='couple';
  const safetyA=hasSafetyZero(computedScores('A'));
  const safetyB=isCouple&&hasSafetyZero(computedScores('B'));
  const hasSafety=safetyA||safetyB;
  const tr=t();
  const langInst=tr.promptInstruction;
  const csA=computedScores('A'),csB=computedScores('B');
  const profile=buildProfile(csA,csB,isCouple,S.lang);

  // Build rich per-domain detail for each partner
  const buildDomainDetail=(partner,cs)=>Q.map((q,i)=>{
    const score=cs[i];
    const ql=q[S.lang];
    const isDetailedDomain=getDetailMode(partner,i)&&q.detailed;
    const entry={domain:`Item ${q.id}: ${ql.title}`,score:`${score??'—'}/10`};
    if(isDetailedDomain){
      const ans=getDetailAnswers(partner,i);
      const nos=q.detailed.map((sq,si)=>ans[si]===0?sq[S.lang]:null).filter(Boolean);
      const yeses=q.detailed.map((sq,si)=>ans[si]===1?sq[S.lang]:null).filter(Boolean);
      if(nos.length)entry.unresolved=nos;
      if(yeses.length)entry.confirmed=yeses;
    } else if(score!==null){
      const rawScore=S.scores[partner][i];
      if(rawScore!==null&&ql.opts)entry.selectedAnswer=ql.opts[rawScore];
    }
    return entry;
  });

  const profileJson=JSON.stringify({
    partnerA:nA,partnerB:isCouple?nB:null,mode:S.mode,
    totalA:profile.totalA,totalB:profile.totalB,
    hasSafetyConcern:hasSafety,
    domainsA:buildDomainDetail('A',csA),
    ...(isCouple?{domainsB:buildDomainDetail('B',csB)}:{}),
  });
  const prompt=`${tr.promptRole}${langInst?' '+langInst:''}

A ${isCouple?'couple':'person'} completed a science-based relationship readiness assessment.

RESPONSE DATA (scores out of 10, plus exact answers selected):
${profileJson}

YOUR TASK: Write an objective third-person analytical report about this couple. Use their names when referring to them. Do NOT address them directly ("you", "your"). Write as if presenting findings to a professional advisor.

Each flag and growth area MUST include a "recommendations" array — SHORT, SPECIFIC, DOABLE steps written in third person. Do NOT write long paragraphs in "concern" or "context". Keep those to 1 sentence max.

GOOD example of a recommendations array:
"actions": [
  "They should schedule a dedicated conversation to resolve their disagreement on whether to have children",
  "${nA} and ${isCouple?nB:'their partner'} would benefit from each independently listing their top 3 financial priorities, then comparing",
  "A structured 20-minute cool-down agreement — either partner can call a pause mid-argument — would reduce escalation"
]

BAD example (do NOT do this):
"actions": []  ← never leave empty
"context": "They need to work on communication and trust." ← too vague, no specifics

RULES:
- actions: 2–4 bullets per flag/growth area, each ≤ 25 words, third-person phrasing
- For Big Rocks "unresolved" items: write one bullet per unresolved topic naming it explicitly
- For couple gaps: reference both names and their specific scores (e.g. "${nA} scores this at 3 while ${isCouple?nB:'their partner'} scores it at 8 — this gap suggests differing perceptions of the current reality")
- Never write vague recommendations like "they should communicate more" — always specify the mechanism or format
- ${hasSafety?'Safety concern present: flag this clearly and objectively, without minimising.':'Do not invent safety concerns.'}

Return ONLY valid JSON, no markdown fences:
{"overview":"2-3 sentences in third person, use names, reference actual scores and patterns observed","flags":[{"item":"domain name","concern":"1 objective sentence describing the issue","actions":["third-person specific recommendation","third-person specific recommendation"]}],"strengths":[{"title":"domain name","detail":"1-2 objective sentences using names describing what the data shows"}],"growthAreas":[{"area":"domain name","context":"1 objective sentence on what the data indicates","actions":["third-person specific recommendation","third-person specific recommendation","third-person specific recommendation"]}]}

${langInst}`;

  try{
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:3200,messages:[{role:'user',content:prompt}]})});
    const data=await res.json();
    if(data.error)throw new Error(typeof data.error==='object'?data.error.message:data.error);
    const txt=data.content?.map(b=>b.text||'').join('')||'';
    let parsed;
    try{parsed=JSON.parse(txt.replace(/```json|```/g,'').trim());}
    catch{parsed={overview:txt.slice(0,300),flags:[],strengths:[],growthAreas:[]};}
    const safe={
      overview:typeof parsed.overview==='string'?parsed.overview:'',
      flags:Array.isArray(parsed.flags)?parsed.flags.filter(f=>f&&typeof f.item==='string')
        .map(f=>({item:f.item,concern:f.concern||'',actions:Array.isArray(f.actions)?f.actions.filter(a=>typeof a==='string'):[]})):[],
      strengths:Array.isArray(parsed.strengths)?parsed.strengths.filter(s=>s&&(typeof s==='string'||typeof s.title==='string'))
        .map(s=>typeof s==='string'?{title:'',detail:s}:{title:s.title||'',detail:s.detail||''}):[],
      growthAreas:Array.isArray(parsed.growthAreas)?parsed.growthAreas.filter(g=>g&&typeof g.area==='string')
        .map(g=>({area:g.area,context:g.context||g.advice||'',actions:Array.isArray(g.actions)?g.actions.filter(a=>typeof a==='string'):[]})):[],
    };
    set({result:safe,screen:'results',loading:false,hasSafety});
  }catch(e){set({error:(S.lang==='ko'?'분석 실패: ':'Analysis failed: ')+(e.message||'Please try again.'),screen:'review',loading:false});}
}
