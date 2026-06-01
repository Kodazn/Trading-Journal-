import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// ── Persistent storage helpers (Firestore) ───────────────────
async function load(key) {
  try {
    const snap = await getDoc(doc(db, "journal", key));
    return snap.exists() ? snap.data().value : null;
  } catch { return null; }
}
async function save(key, val) {
  try {
    await setDoc(doc(db, "journal", key), { value: val });
  } catch {}
}

// ── Pre-seeded trade history ─────────────────────────────────
const SEED_TRADES = [
  { id:1, date:"2025-12-10", pair:"EURUSD", session:"New York", bias:"BEAR", entry:"1.16128", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-99.59,  mistake:"None", notes:"", step_failed:"" },
  { id:2, date:"2025-12-10", pair:"GBPUSD", session:"New York", bias:"BEAR", entry:"1.33026", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-44.13,  mistake:"None", notes:"", step_failed:"" },
  { id:3, date:"2025-12-23", pair:"GBPUSD", session:"London",   bias:"BULL", entry:"1.34779", sl:"", tp:"", rr:"", result:"WIN",       pnl:109.76,  mistake:"None", notes:"", step_failed:"" },
  { id:4, date:"2025-12-26", pair:"GBPUSD", session:"London",   bias:"BEAR", entry:"1.35037", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-78.19,  mistake:"None", notes:"", step_failed:"" },
  { id:5, date:"2025-12-29", pair:"EURUSD", session:"New York", bias:"BULL", entry:"1.17643", sl:"", tp:"", rr:"", result:"WIN",       pnl:18.79,   mistake:"None", notes:"", step_failed:"" },
  { id:6, date:"2025-12-30", pair:"EURUSD", session:"New York", bias:"BULL", entry:"1.17699", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-51.61,  mistake:"None", notes:"", step_failed:"" },
  { id:7, date:"2026-01-27", pair:"EURUSD", session:"London",   bias:"BEAR", entry:"1.18957", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-160.79, mistake:"None", notes:"", step_failed:"" },
  { id:8, date:"2026-03-02", pair:"GBPUSD", session:"London",   bias:"BULL", entry:"1.35693", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-233.56, mistake:"None", notes:"", step_failed:"" },
  { id:9, date:"2026-03-17", pair:"EURUSD", session:"New York", bias:"BEAR", entry:"1.15036", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-61.18,  mistake:"None", notes:"", step_failed:"" },
  { id:10,date:"2026-04-17", pair:"EURUSD", session:"London",   bias:"BULL", entry:"1.17826", sl:"", tp:"", rr:"", result:"WIN",       pnl:84.17,   mistake:"None", notes:"Trade 1 FTMO challenge", step_failed:"" },
  { id:11,date:"2026-04-20", pair:"EURUSD", session:"New York", bias:"BEAR", entry:"1.17674", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-50.53,  mistake:"None", notes:"Trade 2 FTMO challenge", step_failed:"" },
  { id:12,date:"2026-04-23", pair:"EURUSD", session:"New York", bias:"BEAR", entry:"1.17054", sl:"", tp:"", rr:"", result:"WIN",       pnl:73.16,   mistake:"None", notes:"Trade 3 FTMO challenge", step_failed:"" },
  { id:13,date:"2026-04-27", pair:"EURUSD", session:"London",   bias:"BEAR", entry:"1.17138", sl:"", tp:"", rr:"", result:"WIN",       pnl:24.97,   mistake:"None", notes:"Trade 4 FTMO challenge", step_failed:"" },
  { id:14,date:"2026-04-28", pair:"EURUSD", session:"London",   bias:"BEAR", entry:"1.17319", sl:"", tp:"", rr:"", result:"WIN",       pnl:95.21,   mistake:"None", notes:"Trade 5 FTMO challenge", step_failed:"" },
  { id:15,date:"2026-04-29", pair:"EURUSD", session:"London",   bias:"BEAR", entry:"1.17104", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-48.51,  mistake:"SL too close to liquidity", notes:"Trade 6 FTMO — SL stopped then price ran to TP", step_failed:"SL placement" },
  { id:16,date:"2026-05-05", pair:"EURUSD", session:"New York", bias:"BEAR", entry:"1.16888", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-46.94,  mistake:"None", notes:"Trade 7 FTMO challenge", step_failed:"" },
  { id:17,date:"2026-05-08", pair:"XAUUSD", session:"London",   bias:"BULL", entry:"4704.91", sl:"", tp:"", rr:"", result:"BREAKEVEN", pnl:0.07,    mistake:"None", notes:"Trade 8 FTMO — Gold test", step_failed:"" },
  { id:18,date:"2026-05-11", pair:"EURUSD", session:"London",   bias:"BEAR", entry:"1.17749", sl:"", tp:"", rr:"", result:"WIN",       pnl:94.33,   mistake:"None", notes:"Trade 9 FTMO challenge", step_failed:"" },
  { id:19,date:"2026-05-12", pair:"EURUSD", session:"London",   bias:"BEAR", entry:"1.17851", sl:"", tp:"", rr:"", result:"WIN",       pnl:123.46,  mistake:"None", notes:"Trade 10 FTMO challenge", step_failed:"" },
  { id:20,date:"2026-05-15", pair:"EURUSD", session:"New York", bias:"BEAR", entry:"1.17116", sl:"", tp:"", rr:"", result:"WIN",       pnl:71.99,   mistake:"None", notes:"Trade 11 FTMO — partial close", step_failed:"" },
  { id:21,date:"2026-05-18", pair:"EURUSD", session:"London",   bias:"BEAR", entry:"1.16448", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-53.58,  mistake:"None", notes:"", step_failed:"" },
  { id:22,date:"2026-05-19", pair:"EURUSD", session:"London",   bias:"BULL", entry:"1.16333", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-55.66,  mistake:"None", notes:"", step_failed:"" },
  { id:23,date:"2026-05-20", pair:"XAUUSD", session:"New York", bias:"BULL", entry:"4531.59", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-4.17,   mistake:"None", notes:"", step_failed:"" },
  { id:24,date:"2026-05-20", pair:"XAUUSD", session:"New York", bias:"BULL", entry:"4536.03", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-14.13,  mistake:"None", notes:"", step_failed:"" },
  { id:25,date:"2026-05-21", pair:"XAUUSD", session:"London",   bias:"BULL", entry:"4532.68", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-54.18,  mistake:"None", notes:"", step_failed:"" },
  { id:26,date:"2026-05-22", pair:"XAUUSD", session:"London",   bias:"BEAR", entry:"4534.59", sl:"", tp:"", rr:"", result:"WIN",       pnl:11.74,   mistake:"None", notes:"", step_failed:"" },
  { id:27,date:"2026-05-22", pair:"EURUSD", session:"New York", bias:"BULL", entry:"1.15965", sl:"", tp:"", rr:"", result:"WIN",       pnl:92.93,   mistake:"None", notes:"", step_failed:"" },
  { id:28,date:"2026-05-25", pair:"XAUUSD", session:"New York", bias:"BEAR", entry:"4573.31", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-70.05,  mistake:"None", notes:"", step_failed:"" },
  { id:29,date:"2026-05-25", pair:"XAUUSD", session:"New York", bias:"BEAR", entry:"4571.12", sl:"", tp:"", rr:"", result:"WIN",       pnl:90.93,   mistake:"None", notes:"", step_failed:"" },
  { id:30,date:"2026-05-26", pair:"XAUUSD", session:"London",   bias:"BULL", entry:"4519.39", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-49.52,  mistake:"None", notes:"", step_failed:"" },
  { id:31,date:"2026-05-28", pair:"EURUSD", session:"London",   bias:"BULL", entry:"1.16333", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-57.18,  mistake:"None", notes:"", step_failed:"" },
  { id:32,date:"2026-05-28", pair:"XAUUSD", session:"London",   bias:"BEAR", entry:"4395.37", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-61.62,  mistake:"None", notes:"", step_failed:"" },
  { id:33,date:"2026-05-28", pair:"XAUUSD", session:"New York", bias:"BEAR", entry:"4468.14", sl:"", tp:"", rr:"", result:"LOSS",      pnl:-69.52,  mistake:"None", notes:"", step_failed:"" },
].reverse();

const PAIRS    = ["EURUSD","XAUUSD","GBPUSD","Other"];
const SESSIONS = ["London","New York","London/NY Overlap","Asian"];
const RESULTS  = ["WIN","LOSS","BREAKEVEN"];
const MISTAKES = ["None","Entered before confirmation","Emotional bias","SL too close to liquidity","Overconfidence in setup","Traded outside session","Ignored news event","Both pairs simultaneously"];
const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const EMPTY = { id:null, date:"", pair:"EURUSD", session:"London", bias:"BULL", entry:"", sl:"", tp:"", rr:"", result:"WIN", pnl:"", mistake:"None", notes:"", step_failed:"" };

const C = { bg:"#0a0a0f", card:"#0f0f1a", border:"#1a1a2e", accent:"#00c896", red:"#ff4466", orange:"#ffaa00", muted:"#444466", text:"#e0e0f0", dim:"#1c1c2e" };

const css = `
* { box-sizing:border-box; margin:0; padding:0; }
body { background:${C.bg}; color:${C.text}; font-family:'Inter',system-ui,sans-serif; font-size:14px; }
::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:${C.bg}} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
input,select,textarea { background:${C.dim}; color:${C.text}; border:1px solid ${C.border}; border-radius:6px; padding:8px 10px; font-size:13px; width:100%; outline:none; font-family:inherit; }
input:focus,select:focus,textarea:focus { border-color:${C.accent}; }
select option { background:${C.card}; }
button { cursor:pointer; border:none; border-radius:6px; font-size:12px; font-weight:600; padding:7px 14px; transition:opacity 0.15s; font-family:inherit; }
button:hover { opacity:0.82; }
label { font-size:11px; color:${C.muted}; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:4px; }
`;

function Badge({ c, label }) {
  return <span style={{ background:c+"22", color:c, border:`1px solid ${c}44`, borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{label}</span>;
}
function Card({ children, style }) {
  return <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16, ...style }}>{children}</div>;
}
function Stat({ label, value, color }) {
  return <div style={{ textAlign:"center" }}><div style={{ fontSize:22, fontWeight:800, color:color||C.text }}>{value}</div><div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{label}</div></div>;
}
function SectionTitle({ children }) {
  return <div style={{ fontSize:11, color:C.muted, fontWeight:700, letterSpacing:"0.1em", marginBottom:12 }}>{children}</div>;
}

function calcRR(f) {
  const e=parseFloat(f.entry), s=parseFloat(f.sl), t=parseFloat(f.tp);
  if (!e||!s||!t) return "";
  const risk=Math.abs(e-s), reward=Math.abs(t-e);
  return risk>0 ? (reward/risk).toFixed(2) : "";
}
function fmt(n) { return n>=0 ? `+£${Math.abs(n).toFixed(2)}` : `-£${Math.abs(n).toFixed(2)}`; }
function resultColor(r) { return r==="WIN" ? C.accent : r==="LOSS" ? C.red : C.orange; }

export default function Journal() {
  const [tab,     setTab]     = useState("dashboard");
  const [trades,  setTrades]  = useState([]);
  const [notes,   setNotes]   = useState({});
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(false);
  const [loaded,  setLoaded]  = useState(false);
  const [calDate, setCalDate] = useState(new Date());
  const [selDay,  setSelDay]  = useState(null);
  const [filter,  setFilter]  = useState("ALL");

  useEffect(() => {
    (async () => {
      const t = await load("tj_trades2");
      const n = await load("tj_notes2");
      if (t && t.length > 0) setTrades(t);
      else { setTrades(SEED_TRADES); await save("tj_trades2", SEED_TRADES); }
      if (n) setNotes(n);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) save("tj_trades2", trades); }, [trades, loaded]);
  useEffect(() => { if (loaded) save("tj_notes2",  notes);  }, [notes,  loaded]);

  function submitTrade() {
    if (!form.date) return;
    const t = { ...form, id: editing ? form.id : Date.now(), rr: form.rr || calcRR(form), pnl: parseFloat(form.pnl)||0 };
    if (editing) { setTrades(p => p.map(x => x.id===t.id ? t : x)); setEditing(false); }
    else setTrades(p => [t, ...p]);
    setForm(EMPTY);
    setTab("history");
  }
  function deleteTrade(id) { if (confirm("Delete this trade?")) setTrades(p => p.filter(t => t.id!==id)); }
  function editTrade(t) { setForm({...t, pnl: t.pnl?.toString()||""}); setEditing(true); setTab("log"); window.scrollTo(0,0); }
  function uf(k,v) { setForm(p => { const n={...p,[k]:v}; if(["entry","sl","tp"].includes(k)) n.rr=calcRR(n); return n; }); }

  // Stats
  const ftmoTrades = trades.filter(t => new Date(t.date) >= new Date("2026-04-16"));
  const allT   = trades;
  const wins   = allT.filter(t=>t.result==="WIN").length;
  const losses = allT.filter(t=>t.result==="LOSS").length;
  const bes    = allT.filter(t=>t.result==="BREAKEVEN").length;
  const netPnL = allT.reduce((s,t) => s+(parseFloat(t.pnl)||0), 0);
  const ftmoPnL= ftmoTrades.reduce((s,t)=>s+(parseFloat(t.pnl)||0),0);
  const winRate= allT.length ? ((wins/allT.length)*100).toFixed(1) : "0.0";
  const avgRR  = allT.length ? (allT.reduce((s,t)=>s+(parseFloat(t.rr)||0),0)/allT.length).toFixed(2) : "0.00";
  const streak = (() => { let s=0; for(const t of trades){ if(t.result==="WIN") s++; else break; } return s; })();
  const mistakeCounts = trades.reduce((a,t) => { if(t.mistake&&t.mistake!=="None") a[t.mistake]=(a[t.mistake]||0)+1; return a; }, {});
  const topMistake = Object.entries(mistakeCounts).sort((a,b)=>b[1]-a[1])[0];
  const BASE_BALANCE = 10000;
  const ftmoBalance = BASE_BALANCE + ftmoPnL;

  // Calendar
  const yr  = calDate.getFullYear(), mo = calDate.getMonth();
  const dim = new Date(yr,mo+1,0).getDate();
  const fd  = new Date(yr,mo,1).getDay();
  function dayStr(d) { return `${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
  function dayTrades(d) { return trades.filter(t=>t.date===dayStr(d)); }
  function dayPnL(d) { return dayTrades(d).reduce((s,t)=>s+(parseFloat(t.pnl)||0),0); }

  // Filtered history
  const filtered = filter==="ALL" ? trades : trades.filter(t=>t.pair===filter||t.result===filter);

  const NAV = ["dashboard","log","history","calendar","mistakes"];

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", background:C.bg, paddingBottom:48 }}>

        {/* Nav */}
        <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <div>
            <div style={{ fontWeight:800, fontSize:14, letterSpacing:"0.08em" }}>TOMIWA</div>
            <div style={{ fontSize:9, color:C.muted, letterSpacing:"0.12em" }}>TRADE JOURNAL</div>
          </div>
          <div style={{ display:"flex", gap:3 }}>
            {NAV.map(n => (
              <button key={n} onClick={()=>setTab(n)} style={{ background:tab===n?C.accent:"transparent", color:tab===n?"#000":C.muted, padding:"5px 10px", textTransform:"capitalize", fontSize:11 }}>{n}</button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:860, margin:"0 auto", padding:"20px 14px" }}>

          {/* DASHBOARD */}
          {tab==="dashboard" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <Card>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
                  <Stat label="Net P&L (All)"  value={fmt(netPnL)}  color={netPnL>=0?C.accent:C.red} />
                  <Stat label="Win Rate"        value={`${winRate}%`} color={parseFloat(winRate)>=55?C.accent:C.orange} />
                  <Stat label="Total Trades"    value={allT.length} />
                  <Stat label="Avg RR"          value={`${avgRR}R`}  color={parseFloat(avgRR)>=2?C.accent:C.orange} />
                  <Stat label="Current Streak"  value={`${streak}W`} color={streak>=3?C.accent:C.text} />
                </div>
              </Card>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {[["WINS",wins,C.accent],["LOSSES",losses,C.red],["BREAKEVEN",bes,C.orange]].map(([l,v,c])=>(
                  <Card key={l} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:30, fontWeight:800, color:c }}>{v}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>{l}</div>
                  </Card>
                ))}
              </div>

              {/* FTMO Tracker */}
              <Card style={{ borderColor:C.accent+"33" }}>
                <SectionTitle>FTMO CHALLENGE — £10,000 SWING</SectionTitle>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:14 }}>
                  <div><div style={{ fontSize:10, color:C.muted }}>BALANCE</div><div style={{ fontSize:18, fontWeight:800 }}>£{ftmoBalance.toFixed(2)}</div></div>
                  <div><div style={{ fontSize:10, color:C.muted }}>TARGET</div><div style={{ fontSize:18, fontWeight:800, color:C.accent }}>£11,000</div></div>
                  <div><div style={{ fontSize:10, color:C.muted }}>FLOOR</div><div style={{ fontSize:18, fontWeight:800, color:C.red }}>£9,000</div></div>
                  <div><div style={{ fontSize:10, color:C.muted }}>BUFFER</div><div style={{ fontSize:18, fontWeight:800, color:ftmoBalance-9000<300?C.red:C.orange }}>£{Math.max(0,ftmoBalance-9000).toFixed(2)}</div></div>
                </div>
                <div style={{ background:C.dim, borderRadius:4, height:8, overflow:"hidden" }}>
                  <div style={{ width:`${Math.min(100,Math.max(0,(ftmoPnL/1000)*100))}%`, background:ftmoPnL>800?C.accent:ftmoPnL>400?C.orange:C.red, height:"100%", borderRadius:4, transition:"width 0.4s" }} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                  <span style={{ fontSize:11, color:C.muted }}>{((ftmoPnL/1000)*100).toFixed(1)}% to profit target</span>
                  <span style={{ fontSize:11, color:C.muted }}>FTMO Trades: {ftmoTrades.length}</span>
                </div>
              </Card>

              {/* Recent 5 */}
              {trades.length>0 && (
                <Card>
                  <SectionTitle>RECENT TRADES</SectionTitle>
                  {trades.slice(0,5).map(t => (
                    <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <Badge c={resultColor(t.result)} label={t.result} />
                        <div>
                          <div style={{ fontWeight:600, fontSize:13 }}>{t.pair} — {t.bias}</div>
                          <div style={{ fontSize:11, color:C.muted }}>{t.date} · {t.session}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontWeight:700, color:resultColor(t.result) }}>{fmt(parseFloat(t.pnl)||0)}</div>
                        {t.rr && <div style={{ fontSize:11, color:C.muted }}>{t.rr}R</div>}
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {topMistake && (
                <Card style={{ borderColor:C.red+"44" }}>
                  <div style={{ fontSize:11, color:C.red, fontWeight:700, letterSpacing:"0.08em", marginBottom:6 }}>⚠ TOP MISTAKE</div>
                  <div style={{ fontWeight:600 }}>{topMistake[0]}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Flagged {topMistake[1]}x across your trades</div>
                </Card>
              )}
            </div>
          )}

          {/* LOG */}
          {tab==="log" && (
            <Card>
              <SectionTitle>{editing?"EDIT TRADE":"LOG NEW TRADE"}</SectionTitle>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[["Date","date","date"],["Pair","pair","select",PAIRS],["Session","session","select",SESSIONS],["Bias","bias","select",["BULL","BEAR"]],["Entry","entry","number"],["Stop Loss","sl","number"],["Take Profit","tp","number"]].map(([lbl,key,type,opts])=>(
                  <div key={key}>
                    <label>{lbl}</label>
                    {type==="select"
                      ? <select value={form[key]} onChange={e=>uf(key,e.target.value)}>{opts.map(o=><option key={o}>{o}</option>)}</select>
                      : <input type={type} step="any" value={form[key]} onChange={e=>uf(key,e.target.value)} />
                    }
                  </div>
                ))}
                <div>
                  <label>RR (auto)</label>
                  <input readOnly value={form.rr?`${form.rr}R`:""} style={{ color:C.accent }} placeholder="Auto-calculated" />
                </div>
                <div>
                  <label>Result</label>
                  <select value={form.result} onChange={e=>uf("result",e.target.value)}>{RESULTS.map(r=><option key={r}>{r}</option>)}</select>
                </div>
                <div>
                  <label>P&L (£)</label>
                  <input type="number" step="any" value={form.pnl} onChange={e=>uf("pnl",e.target.value)} placeholder="-50.00 or 100.00" />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label>Mistake Made</label>
                  <select value={form.mistake} onChange={e=>uf("mistake",e.target.value)}>{MISTAKES.map(m=><option key={m}>{m}</option>)}</select>
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label>Which Step Failed</label>
                  <input value={form.step_failed} onChange={e=>uf("step_failed",e.target.value)} placeholder="e.g. Step 3 — no rejection close" />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label>Notes / Key Lesson</label>
                  <textarea rows={3} value={form.notes} onChange={e=>uf("notes",e.target.value)} placeholder="What happened? What did you learn?" />
                </div>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:16 }}>
                <button onClick={submitTrade} style={{ background:C.accent, color:"#000", flex:1 }}>{editing?"Save Changes":"Log Trade"}</button>
                {editing && <button onClick={()=>{setForm(EMPTY);setEditing(false);}} style={{ background:C.dim, color:C.text }}>Cancel</button>}
              </div>
            </Card>
          )}

          {/* HISTORY */}
          {tab==="history" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["ALL","EURUSD","XAUUSD","GBPUSD","WIN","LOSS"].map(f=>(
                  <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?C.accent:C.dim, color:filter===f?"#000":C.muted, fontSize:11 }}>{f}</button>
                ))}
              </div>
              {filtered.length===0 && <Card><div style={{ color:C.muted, textAlign:"center", padding:24 }}>No trades found.</div></Card>}
              {filtered.map(t=>(
                <Card key={t.id}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <Badge c={resultColor(t.result)} label={t.result} />
                      <div>
                        <div style={{ fontWeight:700 }}>{t.pair} — {t.bias}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{t.date} · {t.session}</div>
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:700, color:resultColor(t.result) }}>{fmt(parseFloat(t.pnl)||0)}</div>
                      {t.rr && <div style={{ fontSize:11, color:C.muted }}>{t.rr}R</div>}
                    </div>
                  </div>
                  {(t.entry||t.sl||t.tp) && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginTop:10 }}>
                      {t.entry && <div><span style={{ color:C.muted, fontSize:10 }}>ENTRY </span><span style={{ fontSize:12 }}>{t.entry}</span></div>}
                      {t.sl    && <div><span style={{ color:C.muted, fontSize:10 }}>SL </span><span style={{ fontSize:12, color:C.red }}>{t.sl}</span></div>}
                      {t.tp    && <div><span style={{ color:C.muted, fontSize:10 }}>TP </span><span style={{ fontSize:12, color:C.accent }}>{t.tp}</span></div>}
                    </div>
                  )}
                  {t.mistake&&t.mistake!=="None" && <div style={{ marginTop:8 }}><Badge c={C.orange} label={`⚠ ${t.mistake}`} /></div>}
                  {t.step_failed && <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>Step failed: {t.step_failed}</div>}
                  {t.notes && <div style={{ fontSize:12, color:C.muted, marginTop:6, fontStyle:"italic" }}>"{t.notes}"</div>}
                  <div style={{ display:"flex", gap:6, marginTop:12 }}>
                    <button onClick={()=>editTrade(t)} style={{ background:C.dim, color:C.text }}>Edit</button>
                    <button onClick={()=>deleteTrade(t.id)} style={{ background:C.red+"22", color:C.red }}>Delete</button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* CALENDAR */}
          {tab==="calendar" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <Card>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <button onClick={()=>setCalDate(new Date(yr,mo-1))} style={{ background:C.dim, color:C.text }}>←</button>
                  <div style={{ fontWeight:700 }}>{MONTHS[mo]} {yr}</div>
                  <button onClick={()=>setCalDate(new Date(yr,mo+1))} style={{ background:C.dim, color:C.text }}>→</button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
                    <div key={d} style={{ textAlign:"center", fontSize:10, color:C.muted, padding:"4px 0" }}>{d}</div>
                  ))}
                  {Array.from({length:fd}).map((_,i)=><div key={"e"+i}/>)}
                  {Array.from({length:dim}).map((_,i)=>{
                    const day=i+1, dt=dayTrades(day), pnl=dayPnL(day), has=dt.length>0;
                    const today=new Date(), isT=today.getDate()===day&&today.getMonth()===mo&&today.getFullYear()===yr;
                    return (
                      <div key={day} onClick={()=>setSelDay(selDay===day?null:day)} style={{
                        background: has?(pnl>=0?C.accent+"22":C.red+"22"):C.dim,
                        border:`1px solid ${isT?C.accent:has?(pnl>=0?C.accent+"55":C.red+"55"):C.border}`,
                        borderRadius:6, padding:"5px 3px", textAlign:"center", cursor:has?"pointer":"default", minHeight:44,
                      }}>
                        <div style={{ fontSize:11, fontWeight:isT?800:400, color:isT?C.accent:C.text }}>{day}</div>
                        {has && <>
                          <div style={{ fontSize:9, color:pnl>=0?C.accent:C.red, fontWeight:700 }}>{pnl>=0?"+":"-"}£{Math.abs(pnl).toFixed(0)}</div>
                          <div style={{ fontSize:9, color:C.muted }}>{dt.length}T</div>
                        </>}
                      </div>
                    );
                  })}
                </div>
              </Card>

              {selDay && dayTrades(selDay).length>0 && (
                <Card>
                  <SectionTitle>{MONTHS[mo]} {selDay} — {dayTrades(selDay).length} trade(s)</SectionTitle>
                  {dayTrades(selDay).map(t=>(
                    <div key={t.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <Badge c={resultColor(t.result)} label={t.result} />
                        <span style={{ fontSize:13 }}>{t.pair}</span>
                      </div>
                      <span style={{ color:resultColor(t.result), fontWeight:700 }}>{fmt(parseFloat(t.pnl)||0)}</span>
                    </div>
                  ))}
                </Card>
              )}

              <Card>
                <SectionTitle>SESSION NOTES — {MONTHS[mo]} {yr}</SectionTitle>
                <textarea rows={4} placeholder="Pre/post session notes, market context, mindset..." value={notes[`${yr}-${mo}`]||""} onChange={e=>setNotes(p=>({...p,[`${yr}-${mo}`]:e.target.value}))} />
              </Card>
            </div>
          )}

          {/* MISTAKES */}
          {tab==="mistakes" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <Card>
                <SectionTitle>MISTAKE TRACKER</SectionTitle>
                {Object.keys(mistakeCounts).length===0
                  ? <div style={{ color:C.muted, textAlign:"center", padding:16 }}>No mistakes logged yet.</div>
                  : Object.entries(mistakeCounts).sort((a,b)=>b[1]-a[1]).map(([m,count])=>(
                    <div key={m} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:600 }}>{m}</span>
                        <span style={{ fontSize:12, color:C.red, fontWeight:700 }}>{count}x</span>
                      </div>
                      <div style={{ background:C.dim, borderRadius:4, height:5 }}>
                        <div style={{ width:`${(count/allT.length)*100}%`, background:C.red, height:"100%", borderRadius:4 }} />
                      </div>
                    </div>
                  ))
                }
              </Card>

              <Card style={{ borderColor:C.orange+"44" }}>
                <SectionTitle style={{ color:C.orange }}>YOUR KNOWN WEAKNESSES</SectionTitle>
                {["Entering before confirmation is complete","Emotional bias once a trade idea forms","SL placed at liquidity — not beyond it with buffer","Overconfidence in visually good-looking setups"].map(w=>(
                  <div key={w} style={{ display:"flex", gap:8, marginBottom:8 }}>
                    <span style={{ color:C.orange }}>▸</span>
                    <span style={{ fontSize:13 }}>{w}</span>
                  </div>
                ))}
              </Card>

              <Card>
                <SectionTitle>TRADES WITH MISTAKES</SectionTitle>
                {trades.filter(t=>t.mistake&&t.mistake!=="None").length===0
                  ? <div style={{ color:C.muted, fontSize:13 }}>None logged.</div>
                  : trades.filter(t=>t.mistake&&t.mistake!=="None").map(t=>(
                    <div key={t.id} style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <span style={{ fontWeight:600 }}>{t.date} — {t.pair}</span>
                        <Badge c={resultColor(t.result)} label={t.result} />
                      </div>
                      <div style={{ fontSize:12, color:C.orange, marginTop:4 }}>⚠ {t.mistake}</div>
                      {t.notes && <div style={{ fontSize:12, color:C.muted, marginTop:4, fontStyle:"italic" }}>"{t.notes}"</div>}
                    </div>
                  ))
                }
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
