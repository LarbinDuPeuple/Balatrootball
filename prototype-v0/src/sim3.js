const L=require('./logic.js');
function subsets(a){const r=[];const n=a.length;for(let mask=1;mask<(1<<n);mask++){const s=[];for(let i=0;i<n;i++)if(mask&(1<<i))s.push(a[i]);if(s.length<=5)r.push(s);}return r;}
function playMatch(G){const m=L.newMatch(G);while(!m.over){const hand=m.hand.filter(id=>L.playable(m,G,id));if(!hand.length){m.over='loss';break;}let best=null;for(const s of subsets(hand)){const e=L.evaluate(s,m,G);const score=e.goals*100000+e.danger;if(!best||score>best.score)best={s,score};}L.playAction(best.s,m,G);}return m;}
function rate(squad,stage,setup,N=200){let w=0;for(let i=0;i<N;i++){const G=L.newGame();G.squad=squad;setup(G);G.stage=stage;const m=playMatch(G);if(m.over==='win')w++;}return Math.round(w/N*100);}
const P=Object.values(L.PLAYERS);const youth=P.filter(p=>p.youth).sort((a,b)=>b.r-a.r);
function squad(nStars,lo,hi){const need={GAR:2,DEF:4,MIL:4,ATT:4};const st=P.filter(p=>!p.youth&&p.r>=lo&&p.r<=hi);const out=[];const per={GAR:Math.round(nStars*0.1),DEF:Math.round(nStars*0.3),MIL:Math.round(nStars*0.3)};per.ATT=nStars-per.GAR-per.DEF-per.MIL;for(const pos in need){const s=st.filter(p=>p.pos===pos).slice(0,per[pos]);const y=youth.filter(p=>p.pos===pos).slice(0,need[pos]-s.length);out.push(...s.map(p=>p.id),...y.map(p=>p.id));}return out;}
const early=G=>{const b=L.booster();L.addMove(G,b[0]);L.addMove(G,b[1]);};
const mid=G=>{early(G);L.addMove(G,'contre');L.addMove(G,'tiki');G.levels[G.moves[3]]=1;G.staff=['coachatt'];};
const late=G=>{G.moves=['passe','unedeux','montee','totale','tiki','contre'];G.levels.montee=2;G.levels.contre=2;G.levels.tiki=1;G.staff=['coachatt','video','gk','adjoint'];};
const rows=[['starter',squad(0,0,0),early],['s3 mid',squad(3,84,88),mid],['s6 mid',squad(6,85,90),mid],['s9 late',squad(9,86,92),late],['s12 late',squad(12,88,96),late]];
for(const [k,sq,f] of rows)console.log(k.padEnd(9),[0,1,2,3,4,5,6,7,8].map(s=>String(rate(sq,s,f)).padStart(4)).join(''));
