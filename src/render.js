function badge(v){
  if(v===null)return`<div class="score-badge" style="background:#f0ebe4;border:1.5px solid #dfd6cc;color:#bbb">—</div>`;
  const cls=v>=8?'b2':v>=4?'b1':'b0';
  return`<div class="score-badge ${cls}">${v}</div>`;
}

function acc(id,labelKey,content){
  const tr=t();
  return`<div>
    <button class="acc-btn" id="acc-${id}-btn" onclick="toggleAcc('${id}')">
      <span style="font-size:14px;font-weight:500;color:#1B1714">${tr[labelKey]}</span>
      <span id="acc-${id}-chev" style="color:#6B645C;font-size:18px;transition:transform .22s;display:inline-block">›</span>
    </button>
    <div class="acc-body" id="acc-${id}-body">${content}</div>
  </div>`;
}

function render(){
  const {screen,scores,partner,qIdx,result,error,mode,names,lang}=S;
  const tr=t();
  const isCouple=mode==='couple';
  const steps=isCouple?20:10;
  const step=isCouple?(partner==='A'?qIdx:10+qIdx):qIdx;
  const prog=((step+1)/steps)*100;
  let html='';

  if(screen==='intro'){
    const ok=mode&&names.A.trim()&&(mode==='single'||(mode==='couple'&&names.B.trim()));
    const whoContent=tr.whoItems.map((u,i)=>`<div style="${i<3?'margin-bottom:14px;':''}display:flex;gap:12px;align-items:flex-start">
      <div style="font-size:20px;flex-shrink:0;margin-top:1px">${u.icon}</div>
      <div><div style="font-size:14px;font-weight:500;color:#1B1714;margin-bottom:3px">${u.title}</div><div style="font-size:13px;color:#6B645C;line-height:1.58">${u.desc}</div></div>
    </div>`).join('');
    const howContent=`
      ${tr.howSteps.map(([title,desc],i)=>`<div class="step-row"><div class="step-num">${i+1}</div><div><div style="font-size:14px;font-weight:500;color:#1B1714;margin-bottom:3px">${title}</div><div style="font-size:13px;color:#6B645C;line-height:1.58">${desc}</div></div></div>`).join('')}
      <div class="divider"></div>
      <div style="background:#EEE9E3;border-radius:8px;padding:12px 14px">
        <div style="font-size:11px;font-weight:500;color:#6B645C;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">${lang==='ko'?'점수 해석':'Score interpretation'}</div>
        ${tr.scoreBands.map(b=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px"><div style="min-width:40px;font-size:12px;font-weight:500;color:#1B1714;font-family:'Cormorant Garamond',serif">${b.range}</div><div style="font-size:12px;color:${b.color};background:${b.bg};padding:3px 8px;border-radius:4px">${b.label}</div></div>`).join('')}
        <p style="font-size:11px;color:#aaa;margin-top:8px;line-height:1.5">${tr.bandNote}</p>
      </div>`;
    const safeContent=`
      <div style="background:#FAE8E5;border-radius:8px;padding:14px 16px;margin-bottom:14px">
        <div style="font-size:12px;font-weight:500;color:#A85240;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">${tr.safeWarningTitle}</div>
        <p style="font-size:13px;color:#7A3428;line-height:1.65;margin-bottom:8px">${tr.safeWarning1}</p>
        <p style="font-size:13px;color:#7A3428;line-height:1.65;margin:0">${tr.safeWarning2}</p>
      </div>
      <p style="font-size:13px;color:#6B645C;line-height:1.65;margin:0">${tr.privacyNote}</p>`;
    const refsContent=`
      <p style="font-size:13px;color:#6B645C;line-height:1.65;margin-bottom:14px">${tr.refsNote}</p>
      <div style="display:flex;flex-direction:column;gap:5px">${Object.entries(REFS).map(([k,r])=>`<a class="ref-pill" href="${r.url}" target="_blank" rel="noopener" style="display:flex">↗ ${r.label}</a>`).join('')}</div>`;
    html=`<div class="screen ${tr.langClass}" style="padding-top:52px">
      <div style="text-align:center;margin-bottom:44px">
        <div style="display:flex;justify-content:center;margin-bottom:20px">
          <div class="lang-toggle">
            <button class="lang-btn${lang==='en'?' active':''}" onclick="setLang('en')">EN</button>
            <button class="lang-btn${lang==='ko'?' active':''}" onclick="setLang('ko')">한국어</button>
          </div>
        </div>
        <div style="font-size:11px;letter-spacing:.16em;color:#A85240;text-transform:uppercase;margin-bottom:14px;font-weight:500">${tr.tag}</div>
        <h1 class="serif" style="font-size:42px;font-weight:400;line-height:1.12;color:#1B1714;font-style:italic;margin-bottom:16px">${tr.title}</h1>
        <p style="font-size:15px;color:#6B645C;line-height:1.75;max-width:380px;margin:0 auto;font-weight:300">${tr.subtitle}</p>
      </div>
      <div style="background:#fff;border:1px solid #DFD6CC;border-radius:12px;padding:20px 22px;margin-bottom:16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="background:#EAF3EC;border-radius:8px;padding:12px 14px">
            <div style="font-size:11px;font-weight:500;color:#3D6E50;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">${tr.itIs}</div>
            ${tr.isItems.map(t=>`<div style="font-size:13px;color:#2D5A3D;line-height:1.55;display:flex;gap:6px;align-items:flex-start;margin-bottom:4px"><span style="color:#3D6E50;flex-shrink:0;margin-top:1px">✓</span>${t}</div>`).join('')}
          </div>
          <div style="background:#FAE8E5;border-radius:8px;padding:12px 14px">
            <div style="font-size:11px;font-weight:500;color:#A85240;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">${tr.itIsnt}</div>
            ${tr.isntItems.map(t=>`<div style="font-size:13px;color:#7A3428;line-height:1.55;display:flex;gap:6px;align-items:flex-start;margin-bottom:4px"><span style="color:#A85240;flex-shrink:0;margin-top:1px">✕</span>${t}</div>`).join('')}
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        ${acc('who','accWho',whoContent)}
        ${acc('how','accHow',howContent)}
        ${acc('safe','accSafe',safeContent)}
        ${acc('refs','accRefs',refsContent)}
      </div>
      <div style="height:1px;background:#DFD6CC;margin:28px 0 26px"></div>
      <div style="font-size:11px;font-weight:500;color:#6B645C;letter-spacing:.09em;text-transform:uppercase;margin-bottom:12px">${tr.modeTitle}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:${names.A.trim()&&!mode?'8px':'22px'}">
        <button class="mode-card${mode==='couple'?' selected':''}" onclick="set({mode:'couple'})">
          <div style="font-size:26px;margin-bottom:9px">👫</div>
          <div style="font-size:15px;font-weight:500;color:#1B1714;margin-bottom:4px">${tr.modeCoupleTitle}</div>
          <div style="font-size:13px;color:#6B645C;line-height:1.5">${tr.modeCoupleDesc}</div>
        </button>
        <button class="mode-card${mode==='single'?' selected':''}" onclick="set({mode:'single'})">
          <div style="font-size:26px;margin-bottom:9px">🪞</div>
          <div style="font-size:15px;font-weight:500;color:#1B1714;margin-bottom:4px">${tr.modeSingleTitle}</div>
          <div style="font-size:13px;color:#6B645C;line-height:1.5">${tr.modeSingleDesc}</div>
        </button>
      </div>
      ${names.A.trim()&&!mode?`<p id="mode-hint" style="font-size:13px;color:#A85240;margin-bottom:22px;text-align:center">← ${lang==='ko'?'위에서 참여 방식을 선택해 주세요':'Please choose how you\'re taking this above'}</p>`:`<p id="mode-hint" style="font-size:13px;color:#A85240;margin-bottom:22px;text-align:center;display:none">← ${lang==='ko'?'위에서 참여 방식을 선택해 주세요':'Please choose how you\'re taking this above'}</p>`}

      <div style="margin-bottom:28px">
        <div style="font-size:11px;font-weight:500;color:#6B645C;letter-spacing:.09em;text-transform:uppercase;margin-bottom:12px">${mode==='single'?tr.nameLabelSingle:tr.nameLabelCouple}</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div style="position:relative">
            ${isCouple?`<div style="position:absolute;left:13px;top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:${PC.A};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;pointer-events:none">1</div>`:''}
            <input class="name-input" style="${isCouple?'padding-left:45px':''}" type="text" maxlength="24" placeholder="${mode==='single'?tr.namePlaceholderA1:tr.namePlaceholderA2}" value="${esc(names.A)}" oninput="updateName('A',this.value)">
          </div>
          ${isCouple?`<div style="position:relative">
            <div style="position:absolute;left:13px;top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:${PC.B};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;pointer-events:none">2</div>
            <input class="name-input" style="padding-left:45px" type="text" maxlength="24" placeholder="${tr.namePlaceholderB}" value="${esc(names.B)}" oninput="updateName('B',this.value)">
          </div>`:''}
        </div>
        ${mode&&!names.A.trim()?`<p id="name-hint" style="font-size:13px;color:#A85240;margin-top:10px">↑ ${lang==='ko'?'이름 또는 닉네임을 입력해 주세요':'Please enter your name or nickname above'}</p>`:`<p id="name-hint" style="font-size:13px;color:#A85240;margin-top:10px;display:none">↑ ${lang==='ko'?'이름 또는 닉네임을 입력해 주세요':'Please enter your name or nickname above'}</p>`}
        ${isCouple&&names.A.trim()&&!names.B.trim()?`<p id="name-hint-2" style="font-size:13px;color:#A85240;margin-top:10px">↑ ${lang==='ko'?'두 번째 분의 이름도 입력해 주세요':'Please enter the second partner\'s name above'}</p>`:`<p id="name-hint-2" style="font-size:13px;color:#A85240;margin-top:10px;display:none">↑ ${lang==='ko'?'두 번째 분의 이름도 입력해 주세요':'Please enter the second partner\'s name above'}</p>`}
      </div>
      <div style="text-align:center">
        <button id="begin-btn" class="btn-primary" style="font-size:16px;padding:15px 46px" onclick="set({screen:'questions',partner:'A',qIdx:0})" ${!ok?'disabled':''}>${tr.beginBtn}</button>
        <p style="font-size:12px;color:#B4ADA6;margin-top:14px;line-height:1.6">${tr.beginNote}</p>
        <p style="font-size:13px;color:#6B645C;margin-top:16px">${lang==='ko'?'이 도구에 대한 의견이 있으신가요?':'Thoughts on this tool?'} <a href="mailto:kriskim8937@gmail.com?subject=${encodeURIComponent(lang==='ko'?'Foundations 피드백':'Foundations feedback')}" style="color:#A85240;text-decoration:underline">${lang==='ko'?'의견 보내기':'Send us a note'}</a></p>
      </div>
    </div>`;
  }

  else if(screen==='questions'){
    const pName=nOf(partner);
    const ql=Q[qIdx][lang];
    const cur=scores[partner][qIdx];
    const isDetailMode=!!(Q[qIdx].detailed&&getDetailMode(partner,qIdx));
    const isLast=qIdx===9&&(partner==='B'||!isCouple);
    const nextLabel=qIdx===9&&partner==='A'&&isCouple?abbr(nOf('B'))+tr.partnerBTurn:isLast?tr.reviewBtn:tr.nextBtn;
    html=`<div class="screen ${tr.langClass}" style="padding-top:44px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="partner-dot" style="background:${PC[partner]}">${esc(abbr(pName)).slice(0,2).toUpperCase()}</div>
          <span style="font-size:14px;color:#6B645C">${isCouple?esc(abbr(pName))+tr.yourTurn:tr.yourReflection}</span>
        </div>
        <span style="font-size:13px;color:#6B645C">${qIdx+1} / 10</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${prog}%"></div></div>
      <div style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#A85240;margin-bottom:6px">${ql.subtitle}</div>
      <h2 class="serif" style="font-size:30px;font-weight:500;color:#1B1714;margin-bottom:10px;line-height:1.25">${ql.title}</h2>
      <p style="font-size:14px;color:#6B645C;line-height:1.7;margin-bottom:18px">${ql.thesis}</p>
      <div style="margin-bottom:20px">
        <div style="font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#B4ADA6;margin-bottom:6px">${tr.sourcesLabel}</div>
        ${refPills(Q[qIdx].refs)}
      </div>
      ${Q[qIdx].detailed?`<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:12px 14px;background:#EEE9E3;border-radius:10px">
        <div style="font-size:13px;color:#6B645C;flex:1">${tr.detailToggle}</div>
        <div class="lang-toggle">
          <button class="lang-btn${!isDetailMode?' active':''}" onclick="toggleDetailMode('${partner}',${qIdx})">${tr.simpleLabel}</button>
          <button class="lang-btn${isDetailMode?' active':''}" onclick="toggleDetailMode('${partner}',${qIdx})">${tr.detailedLabel}</button>
        </div>
      </div>`:''}
      ${isDetailMode?Q[qIdx].detailed.map((sq,si)=>{
        const ans=getDetailAnswers(partner,qIdx)[si];
        return`<div style="border:1.5px solid ${ans===1?'#3D6E50':ans===0?'#A85240':'#DFD6CC'};border-radius:10px;padding:14px 16px;margin-bottom:10px;background:${ans===1?'#EAF3EC':ans===0?'#FAE8E5':'#fff'}">
          <div style="font-size:13px;font-weight:500;color:#6B645C;margin-bottom:4px">${si+1} / 10</div>
          <div style="font-size:14px;color:#1B1714;line-height:1.65;margin-bottom:10px">${esc(sq[lang])}</div>
          <div style="margin-bottom:10px">${refPills(sq.refs)}</div>
          <div style="display:flex;gap:8px">
            <button class="btn-ghost" style="${ans===1?'background:#3D6E50;color:#fff;border-color:#3D6E50':''}" onclick="setDetailAnswer('${partner}',${qIdx},${si},1)">${tr.yes}</button>
            <button class="btn-ghost" style="${ans===0?'background:#A85240;color:#fff;border-color:#A85240':''}" onclick="setDetailAnswer('${partner}',${qIdx},${si},0)">${tr.no}</button>
          </div>
        </div>`;
      }).join(''):[2,1,0].map(v=>`<div class="score-opt${cur===v?' '+SC[v].selCls:''}" onclick="setScore(${v})">
        <div class="score-num">${v}</div>
        <div><div class="score-label">${tr.scoreLabels[v]}</div><div class="score-text">${ql.opts[v]}</div></div>
      </div>`).join('')}
      <div class="nav-row" style="margin-top:20px">
        <button class="btn-ghost" onclick="goPrev()">${tr.backBtn}</button>
        <button class="btn-primary" onclick="goNext()" ${!isDomainAnswered(partner,qIdx)?'disabled':''}>${nextLabel}</button>
      </div>
    </div>`;
  }

  else if(screen==='review'){
    const nA=nOf('A'),nB=nOf('B');
    const csA=computedScores('A'),csB=computedScores('B');
    const tA=csA.reduce((a,b)=>a+(b??0),0);
    const tB=csB.reduce((a,b)=>a+(b??0),0);
    const bandA=scoreBand(csA);
    const bandB=isCouple?scoreBand(csB):null;
    const cols=isCouple?'1fr 68px 68px':'1fr 80px';
    html=`<div class="screen ${tr.langClass}" style="padding-top:44px">
      <div style="font-size:11px;letter-spacing:.12em;color:#6B645C;text-transform:uppercase;margin-bottom:10px">${tr.reviewTitle}</div>
      <h2 class="serif" style="font-size:36px;font-weight:400;color:#1B1714;margin-bottom:8px;font-style:italic">${tr.reviewHeading}</h2>
      <p style="font-size:14px;color:#6B645C;line-height:1.65;margin-bottom:26px">${tr.reviewNote}</p>
      ${error?`<div style="background:#FAE8E5;border:1px solid #A85240;border-radius:8px;padding:12px 16px;margin-bottom:18px;font-size:14px;color:#A85240">${esc(error)}</div>`:''}
      <div class="card" style="overflow:hidden;margin-bottom:22px">
        <div style="display:grid;grid-template-columns:${cols}" class="review-head">
          <div>${tr.itemCol}</div>
          <div style="text-align:center;color:${PC.A}">${esc(abbr(nA))}</div>
          ${isCouple?`<div style="text-align:center;color:${PC.B}">${esc(abbr(nB))}</div>`:''}
        </div>
        ${Q.map((q,i)=>{
          const sA=csA[i],sB=csB[i];
          const disc=isCouple&&sA!==null&&sB!==null&&Math.abs(sA-sB)>=5;
          const ql=q[lang];
          return`<div style="display:grid;grid-template-columns:${cols}" class="review-row">
            <div class="review-cell"><span style="color:#6B645C;font-size:12px;margin-right:6px">${q.id}.</span>${esc(ql.title)}${disc?`<span style="font-size:10px;background:#FAE8E5;color:#A85240;padding:1px 5px;border-radius:3px;margin-left:5px">${tr.gap}</span>`:''}</div>
            <div class="review-cell center">${badge(sA)}</div>
            ${isCouple?`<div class="review-cell center">${badge(sB)}</div>`:''}
          </div>`;
        }).join('')}
      </div>
      <div style="display:grid;grid-template-columns:${isCouple?'1fr 1fr':'180px'};gap:12px;margin-bottom:10px">
        <div class="total-card">
          <div style="font-size:12px;color:#6B645C;margin-bottom:4px">${esc(nA)}</div>
          <div class="serif" style="font-size:42px;font-weight:500;color:${PC.A};line-height:1">${tA}</div>
          <div style="font-size:12px;color:#6B645C;margin-top:2px">${tr.outOf}</div>
        </div>
        ${isCouple?`<div class="total-card">
          <div style="font-size:12px;color:#6B645C;margin-bottom:4px">${esc(nB)}</div>
          <div class="serif" style="font-size:42px;font-weight:500;color:${PC.B};line-height:1">${tB}</div>
          <div style="font-size:12px;color:#6B645C;margin-top:2px">${tr.outOf}</div>
        </div>`:''}
      </div>
      <div style="margin-bottom:26px">
        <div style="font-size:11px;font-weight:500;color:#6B645C;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">${tr.readingLabel}</div>
        <div style="font-size:13px;color:${bandA.color};background:${bandA.bg};padding:8px 12px;border-radius:6px;margin-bottom:${bandB?'6px':'0'}">${esc(nA)}: ${esc(bandA.label)}</div>
        ${bandB?`<div style="font-size:13px;color:${bandB.color};background:${bandB.bg};padding:8px 12px;border-radius:6px">${esc(nB)}: ${esc(bandB.label)}</div>`:''}
        <p style="font-size:11px;color:#aaa;margin-top:7px">${tr.bandNote}</p>
      </div>
      <div style="display:flex;gap:12px;justify-content:flex-end">
        <button class="btn-ghost" onclick="set({screen:'questions',partner:'A',qIdx:0})">${tr.editBtn}</button>
        <button class="btn-primary" onclick="analyze()">${tr.analyzeBtn}</button>
      </div>
    </div>`;
  }

  else if(screen==='loading'){
    html=`<div class="screen ${tr.langClass}" style="padding-top:110px;text-align:center">
      <div class="spin"></div>
      <p class="serif" style="font-size:24px;color:#6B645C;font-style:italic">${tr.loadingText}</p>
      <p style="font-size:13px;color:#aaa;margin-top:10px">${tr.loadingNote}</p>
    </div>`;
  }

  else if(screen==='results'&&result){
    const {overview,flags,strengths,growthAreas}=result;
    const csA=computedScores('A'),csB=computedScores('B');
    const tA=csA.reduce((a,b)=>a+(b??0),0);
    const tB=csB.reduce((a,b)=>a+(b??0),0);
    const bandA=scoreBand(csA);
    const bandB=isCouple?scoreBand(csB):null;
    html=`<div class="screen ${tr.langClass}" style="padding-top:44px">
      <div style="font-size:11px;letter-spacing:.12em;color:#6B645C;text-transform:uppercase;margin-bottom:10px">${tr.analysisTag}</div>
      <h2 class="serif" style="font-size:36px;font-weight:400;color:#1B1714;margin-bottom:22px;font-style:italic">${tr.analysisTitle}</h2>

      <!-- Score cards -->
      <div style="display:grid;grid-template-columns:${isCouple?'1fr 1fr':'1fr'};gap:10px;margin-bottom:22px">
        <div style="background:${bandA.bg};border-radius:10px;padding:14px 16px;text-align:center">
          <div style="font-size:12px;color:#6B645C;margin-bottom:4px">${esc(nOf('A'))}</div>
          <div class="serif" style="font-size:38px;font-weight:500;color:${bandA.color};line-height:1;margin-bottom:5px">${tA}<span style="font-size:18px;color:#aaa"> / 100</span></div>
          <div style="font-size:12px;color:${bandA.color}">${esc(bandA.label)}</div>
        </div>
        ${isCouple&&bandB?`<div style="background:${bandB.bg};border-radius:10px;padding:14px 16px;text-align:center">
          <div style="font-size:12px;color:#6B645C;margin-bottom:4px">${esc(nOf('B'))}</div>
          <div class="serif" style="font-size:38px;font-weight:500;color:${bandB.color};line-height:1;margin-bottom:5px">${tB}<span style="font-size:18px;color:#aaa"> / 100</span></div>
          <div style="font-size:12px;color:${bandB.color}">${esc(bandB.label)}</div>
        </div>`:''}
      </div>

      <!-- Safety resources -->
      ${S.hasSafety?`<div style="background:#FAE8E5;border:1.5px solid #A85240;border-radius:12px;padding:20px 22px;margin-bottom:18px">
        <div style="font-size:12px;font-weight:600;color:#A85240;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">${tr.supportTitle}</div>
        <p style="font-size:14px;color:#7A3428;line-height:1.68;margin-bottom:14px">${tr.supportBody}</p>
        <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:7px">
          <li><a href="https://www.thehotline.org" target="_blank" style="color:#A85240;font-size:14px">${tr.hotline}</a></li>
          <li><a href="https://www.rainn.org" target="_blank" style="color:#A85240;font-size:14px">${tr.rainn}</a></li>
          <li style="font-size:14px;color:#6B645C">${tr.therapist}</li>
        </ul>
      </div>`:''}

      <!-- Overview -->
      <div style="background:#fff;border:1px solid #DFD6CC;border-radius:12px;padding:20px 22px;margin-bottom:18px">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#6B645C;margin-bottom:10px">${tr.overviewLabel}</div>
        <p style="font-size:15px;line-height:1.78;color:#1B1714;margin:0">${esc(overview)}</p>
      </div>

      <!-- Flags -->
      ${flags&&flags.length?`<div class="section" style="background:#FAE8E5;border:1px solid #c87060">
        <div class="section-title" style="color:#A85240"><span>⚠</span>${tr.flagsTitle}</div>
        ${flags.map(f=>`<div class="result-item">
          <div class="result-bullet" style="background:#FAD4CD;color:#A85240">!</div>
          <div style="flex:1">
            <div class="result-item-title" style="color:#A85240">${esc(f.item)}</div>
            ${f.concern?`<div class="result-item-body" style="margin-bottom:${f.actions&&f.actions.length?'10px':'0'}">${esc(f.concern)}</div>`:''}
            ${f.actions&&f.actions.length?`<ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px">
              ${f.actions.map(a=>`<li style="display:flex;gap:8px;align-items:flex-start"><span style="color:#A85240;font-weight:600;flex-shrink:0;margin-top:1px">→</span><span style="font-size:13px;color:#7A3428;line-height:1.6">${esc(a)}</span></li>`).join('')}
            </ul>`:''}
          </div>
        </div>`).join('')}
      </div>`:''}

      <!-- Strengths -->
      ${strengths&&strengths.length?`<div class="section" style="background:#EAF3EC;border:1px solid #7ab98a">
        <div class="section-title" style="color:#3D6E50"><span>✓</span>${tr.strengthsTitle}</div>
        ${strengths.map(s=>`<div class="result-item">
          <div class="result-bullet" style="background:#C4E2CB;color:#3D6E50">✓</div>
          <div>
            ${s.title?`<div class="result-item-title" style="color:#3D6E50">${esc(s.title)}</div>`:''}
            <div class="result-item-body" style="padding-top:${s.title?'2px':'0'}">${esc(s.detail)}</div>
          </div>
        </div>`).join('')}
      </div>`:''}

      <!-- Growth areas -->
      ${growthAreas&&growthAreas.length?`<div class="section" style="background:#FBF5E6;border:1px solid #c9a85c">
        <div class="section-title" style="color:#7C5E1A"><span>→</span>${tr.growthTitle}</div>
        ${growthAreas.map(g=>`<div class="result-item">
          <div class="result-bullet" style="background:#F0DCA8;color:#7C5E1A">→</div>
          <div style="flex:1">
            <div class="result-item-title" style="color:#7C5E1A">${esc(g.area)}</div>
            ${g.context?`<div class="result-item-body" style="margin-bottom:${g.actions&&g.actions.length?'10px':'0'}">${esc(g.context)}</div>`:''}
            ${g.actions&&g.actions.length?`<ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px">
              ${g.actions.map(a=>`<li style="display:flex;gap:8px;align-items:flex-start"><span style="color:#8B6A1A;font-weight:600;flex-shrink:0;margin-top:1px">→</span><span style="font-size:13px;color:#5C4010;line-height:1.6">${esc(a)}</span></li>`).join('')}
            </ul>`:''}
          </div>
        </div>`).join('')}
      </div>`:''}

      <p style="font-size:11px;color:#aaa;line-height:1.55;margin-bottom:16px;padding:0 2px">${tr.disclaimerNote}</p>
      <p style="font-size:13px;color:#6B645C;text-align:center;margin-bottom:24px">${lang==='ko'?'이 도구에 대한 의견이 있으신가요?':'Thoughts on this tool?'} <a href="mailto:kriskim8937@gmail.com?subject=${encodeURIComponent(lang==='ko'?'Foundations 피드백':'Foundations feedback')}" style="color:#A85240;text-decoration:underline">${lang==='ko'?'의견 보내기':'Send us a note'}</a></p>
      <div style="display:flex;gap:12px;justify-content:space-between">
        <button class="btn-ghost" onclick="set({screen:'review'})">${lang==='ko'?'← 답변 다시 보기':'← Back to answers'}</button>
        <button class="btn-ghost" onclick="restart()">${tr.restartBtn}</button>
      </div>
    </div>`;
  }

  document.getElementById('root').innerHTML=html;
}

function restart(){
  set({screen:'intro',mode:null,names:{A:'',B:''},scores:{A:Array(10).fill(null),B:Array(10).fill(null)},detailMode:{A:{},B:{}},detailAnswers:{A:{},B:{}},partner:'A',qIdx:0,result:null,loading:false,error:null,hasSafety:false});
}
