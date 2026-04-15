import { useState, useRef, useCallback, useEffect } from "react";

const RED = "#C41E2A";
const RED_DIM = "#9A1620";
const BLACK = "#0D0D0D";
const WHITE = "#F5F4F2";
const BG = "#E8E6E2";
const CARD = "#F5F4F2";
const CARD2 = "#DDDBD7";
const BORDER = "#C8C5BF";
const TEXT = "#111111";
const MUTED = "#888480";
const TENJIKU_IMG = "data:image/png;base64,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jEgg8APNR/tH6YoL47ROgrpuZt05pe1S4ENT7yHFuymlL4QnmOHHQk+PlmscdjfaTW+19z1M1qZbKIknu0RksuhaXVDOVjy5HHOtkgAOlKD5WQlJUrmACTUHYFBbbjiRhClkp+VSV1lIjRV+8C4RhKc8yapLOwWIiUHrigrKUpQKUpQUN7OLe7/dNV1oObXGP/dioy98TgajJB/erCeXzqbaQlptKEjCUgAcqC2df7f6O13BEXVdijXJtHNClgpcRj8K0kKH51q92udN7R7X7Z/0Z0/peCxfrw4FsOc3HWW0EFS+NRJA6ADIzk+VbX621RZtH6amahv0tMWBERxuLIySfBIHiSeQFa6bObaTN0ta3Hd7dG399ElEiy2ySkFIj8+FS0nwAxgeOSaC0v2b0e3IkasuDzjSZiEMtoCljIb94k4645DnUtddOao7QO+kfVEB2XatFafd7iJcEnhU+UKystefEofF0AFWFthsU3uJp3XN705c12u8wL0/Ht0dDhSyUJOeBRHMA5AB8MVmfs870zn9WwdpdWaURpu5QoJbQoe4l51HglGOQKQTnJyaDYt55mHCXIkOhtllsrcccVgJSBzJPhyGa0FjamuG7XbQtd3sgW5EjTkJjqTyCYzPVR9DzP1FZP7bG8063uO7V6VSpc6c0EXB9o8Sghf+5SBz4lA8/Q1e/ZA2Yb240p9vXZri1HdmUl4KRgxW+oaHr0J9aDPdec+/so7g9rddsZS8toXGPbUhHNXCggKI+vEa303M1VA0VoS76muTqW2YMVa0gn414whA9SrA+taH9jyyv687RX2/cFun2FTt0eWkci4Ve6CfDmr9KD0RjthmO20kYShISPoKitSAqVEQFci7kjz5VM1BXQ99fWW+Hk0jOfmaCQbGEAV9UxgClApSlApSlApSlApSlAronOBuMtfkK76orzn2BzH4TQd+nmS3bkrUDxuHjVmquZJjw4rsqU82ywyguOuLUAlCQMkknoAK+LV/s2P/AMMVjrfvRuqNwLXA0jaZzdtsc14m9ywr973KcENoT4lR/lQac7iXK5doPfkhqS7H0vEfENub3ZLMRjixxqI5ArPMZPlW+2htMWbR+loOnrDDbiwYrQShKB8asc1HzJPMn1qAs+itObc7WXGy6ft7TcRiE645xgFT6w2cqWfEmsIdjrfBu7afGhtQSwq9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";

// Safe localStorage helpers — work in deployed PWA, fail silently in sandboxed preview
const lsGet = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const RANKS = [
  { min:0,  kanji:"新", title:"Newcomer",   sub:"Shiniri",      color:MUTED  },
  { min:5,  kanji:"戦", title:"Warrior",    sub:"Senshi",       color:BLACK  },
  { min:15, kanji:"幹", title:"Executive",  sub:"Kanbu",        color:"#8B4513" },
  { min:30, kanji:"副", title:"Commander",  sub:"Fuku Souchou", color:RED    },
  { min:50, kanji:"天", title:"King of Kings", sub:"Tenjiku Supreme", color:RED },
];
const getRank = (s) => [...RANKS].reverse().find(r => s >= r.min) || RANKS[0];

const ANIM = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=Noto+Serif+JP:wght@700&display=swap');
  @keyframes spinIn{0%{transform:rotate(0deg) scale(0);opacity:0}60%{transform:rotate(540deg) scale(1.15);opacity:1}100%{transform:rotate(720deg) scale(1);opacity:1}}
  @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes lineGrow{from{width:0}to{width:100%}}
  @keyframes kanjiDrop{0%{opacity:0;transform:translateY(-30px) scale(1.4)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes scanLine{0%{top:10%}50%{top:85%}100%{top:10%}}
  .spin-in{animation:spinIn 1.6s cubic-bezier(.22,1,.36,1) forwards}
  .spin-slow{animation:spinSlow 12s linear infinite}
  .fade-up{animation:fadeUp 0.7s ease forwards}
  .slide-up{animation:slideUp 0.35s cubic-bezier(.22,1,.36,1) forwards}
`;

function YinYang({ size=32, style={}, className="" }) {
  return <img src={TENJIKU_IMG} width={size} height={size} alt="Tenjiku" className={className} style={{ objectFit:"contain", display:"block", ...style }}/>;
}

function Ring({ value, max, size=80, stroke=8, color=RED, label }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, dash=Math.min(value/max,1)*circ;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={CARD2} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition:"stroke-dasharray 0.5s ease" }}/>
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily:"'Bebas Neue'", fontSize:18, fill:TEXT }}>{Math.round(value)}</text>
        <text x={size/2} y={size/2+14} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily:"'DM Sans'", fontSize:9, fill:MUTED }}>/{max}</text>
      </svg>
      {label && <span style={{ fontFamily:"'DM Sans'", fontSize:11, color:MUTED, textTransform:"uppercase", letterSpacing:1 }}>{label}</span>}
    </div>
  );
}

function MacroBar({ label, val, max, color }) {
  const pct=Math.min(val/max,1)*100;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontFamily:"'DM Sans'", fontSize:12, color:MUTED }}>{label}</span>
        <span style={{ fontFamily:"'DM Sans'", fontSize:12, color:TEXT }}>{Math.round(val)}g / {max}g</span>
      </div>
      <div style={{ height:5, background:CARD2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, transition:"width 0.5s ease" }}/>
      </div>
    </div>
  );
}

function WeightChart({ data }) {
  if (!data||data.length<2) return <div style={{ textAlign:"center", padding:"20px 0", color:MUTED, fontSize:13 }}>Log at least 2 entries to see your trend</div>;
  const weights=data.map(d=>parseFloat(d.weight));
  const minW=Math.min(...weights)-2, maxW=Math.max(...weights)+2;
  const W=320, H=100, pad=20;
  const toX=(i)=>pad+(i/(data.length-1))*(W-pad*2);
  const toY=(w)=>H-pad-((w-minW)/(maxW-minW))*(H-pad*2);
  const pts=data.map((d,i)=>`${toX(i)},${toY(parseFloat(d.weight))}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      <polyline points={pts} fill="none" stroke={RED} strokeWidth="2.5" strokeLinejoin="round"/>
      {data.map((d,i)=>(
        <g key={i}>
          <circle cx={toX(i)} cy={toY(parseFloat(d.weight))} r="4" fill={RED}/>
          <text x={toX(i)} y={toY(parseFloat(d.weight))-8} textAnchor="middle" style={{ fontSize:9, fontFamily:"'DM Sans'", fill:TEXT }}>{d.weight}</text>
        </g>
      ))}
    </svg>
  );
}

function StarRating({ value, onChange, color=RED }) {
  return (
    <div style={{ display:"flex", gap:6 }}>
      {[1,2,3,4,5].map(s=>(
        <div key={s} onClick={()=>onChange(s)} style={{ width:28, height:28, cursor:"pointer",
          background:s<=value?color:CARD2, border:`1px solid ${s<=value?color:BORDER}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Bebas Neue'", fontSize:14, color:s<=value?WHITE:MUTED }}>{s}</div>
      ))}
    </div>
  );
}

/* ── BARCODE SCANNER ─────────────────────────────── */
function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("init");
  const [msg, setMsg] = useState("Starting camera...");

  useEffect(() => {
    let stream = null, rafId = null, active = true;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal:"environment" } } });
        if (!active || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        if (!("BarcodeDetector" in window)) {
          setStatus("error"); setMsg("Barcode scanning requires Chrome or Edge. Try the Photo scan instead."); return;
        }
        const detector = new window.BarcodeDetector({ formats:["ean_13","ean_8","upc_a","upc_e","code_128","code_39","qr_code"] });
        setStatus("scanning"); setMsg("Point at barcode or QR code");
        const tick = async () => {
          if (!active || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0) { active=false; onDetected(codes[0].rawValue); return; }
          } catch {}
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      } catch { setStatus("error"); setMsg("Camera access denied. Please allow camera permissions."); }
    })();
    return () => { active=false; cancelAnimationFrame(rafId); stream?.getTracks().forEach(t=>t.stop()); };
  }, []);

  return (
    <div>
      <div style={{ position:"relative", background:BLACK, marginBottom:10 }}>
        <video ref={videoRef} playsInline muted style={{ width:"100%", height:230, objectFit:"cover", display:"block" }}/>
        {status==="scanning" && <>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <div style={{ width:220, height:120, border:`2px solid ${RED}`, boxShadow:"0 0 0 1000px rgba(0,0,0,0.55)", position:"relative" }}>
              <div style={{ position:"absolute", left:0, right:0, height:2, background:RED+"88", animation:"scanLine 2s ease-in-out infinite" }}/>
            </div>
          </div>
        </>}
      </div>
      <div style={{ textAlign:"center", fontSize:12, color:status==="error"?RED:MUTED, padding:"0 0 10px" }}>{msg}</div>
    </div>
  );
}

/* ── RESULT CARD WITH QUANTITY ───────────────────── */
function ResultCard({ result, quantity, onQuantityChange, onAdd, onBack, backLabel, extraBtn }) {
  const q = quantity;
  const scaled = {
    calories: Math.round(result.calories * q),
    protein:  Math.round(result.protein  * q * 10) / 10,
    carbs:    Math.round(result.carbs    * q * 10) / 10,
    fat:      Math.round(result.fat      * q * 10) / 10,
  };
  const qLabel = q % 1 === 0 ? String(q) : q.toFixed(1);
  const dec = () => onQuantityChange(Math.max(0.5, parseFloat((q - 0.5).toFixed(1))));
  const inc = () => onQuantityChange(parseFloat((q + 0.5).toFixed(1)));

  const addEntry = {
    ...result,
    ...scaled,
    serving: q !== 1 ? `${qLabel} × ${result.serving}` : result.serving,
  };

  return (
    <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${RED}`, padding:"14px", marginBottom:14 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ flex:1, paddingRight:8 }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:1, lineHeight:1.1 }}>{result.name}</div>
          <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>{result.serving} · per serving</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
          <span style={{ background:( result.confidence==="high"?BLACK:RED)+"18", color:result.confidence==="high"?BLACK:RED, border:`1px solid ${result.confidence==="high"?BLACK:RED}44`, borderRadius:2, padding:"2px 7px", fontSize:10, fontWeight:600 }}>{result.confidence}</span>
          {onBack && <button onClick={onBack} style={{ fontSize:10, color:RED, background:"transparent", border:"none", cursor:"pointer", padding:0, letterSpacing:0.3 }}>{backLabel||"← Back"}</button>}
        </div>
      </div>

      {/* Quantity selector */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:CARD2, padding:"10px 14px", marginBottom:12, borderLeft:`2px solid ${RED}` }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2 }}>QUANTITY</div>
          {q !== 1 && <div style={{ fontSize:10, color:MUTED, marginTop:1 }}>{result.calories} kcal × {qLabel}</div>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={dec} style={{ width:34, height:34, background:q<=0.5?CARD2:RED, color:q<=0.5?MUTED:WHITE, border:`1px solid ${q<=0.5?BORDER:RED}`, fontSize:20, fontWeight:700, cursor:q<=0.5?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>−</button>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:TEXT, minWidth:36, textAlign:"center", lineHeight:1 }}>{qLabel}</div>
          <button onClick={inc} style={{ width:34, height:34, background:RED, color:WHITE, border:`1px solid ${RED}`, fontSize:20, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>+</button>
        </div>
      </div>

      {/* Live macros */}
      <div style={{ display:"flex", gap:6, marginBottom:10 }}>
        <div style={{ background:RED+"12", color:RED, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${RED}` }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20 }}>{scaled.calories}</div><div style={{ fontSize:9, color:MUTED }}>KCAL</div>
        </div>
        <div style={{ background:BLACK+"12", color:BLACK, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${BLACK}` }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:BLACK }}>{scaled.protein}g</div><div style={{ fontSize:9, color:MUTED }}>PROT</div>
        </div>
        <div style={{ background:MUTED+"12", color:MUTED, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${MUTED}` }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20 }}>{scaled.carbs}g</div><div style={{ fontSize:9, color:MUTED }}>CARB</div>
        </div>
        <div style={{ background:RED_DIM+"12", color:RED_DIM, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${RED_DIM}` }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20 }}>{scaled.fat}g</div><div style={{ fontSize:9, color:MUTED }}>FAT</div>
        </div>
      </div>

      {result.notes && <div style={{ fontSize:11, color:MUTED, marginBottom:10, fontStyle:"italic" }}>ℹ️ {result.notes}</div>}

      <div style={{ display:"flex", gap:8 }}>
        <button style={{ flex:1, background:RED, color:WHITE, border:"none", borderRadius:0, padding:"13px 16px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", letterSpacing:1, textTransform:"uppercase" }}
          onClick={()=>onAdd(addEntry)}>
          + Add {q !== 1 ? `${qLabel} × ` : ""}to Log
        </button>
        {extraBtn}
      </div>
    </div>
  );
}

/* ── ADD FOOD PANEL ──────────────────────────────── */
function AddFoodPanel({ onAdd, onClose, favorites, recentFoods }) {
  const [mode, setMode] = useState("search");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [imgBase64, setImgBase64] = useState(null);
  const [barcodeVal, setBarcodeVal] = useState(null);
  const fileRef = useRef();
  const cameraRef = useRef();

  const filteredFavs = favorites.filter(f => !query || f.name.toLowerCase().includes(query.toLowerCase()));
  const filteredRecent = recentFoods.filter(f =>
    query && f.name.toLowerCase().includes(query.toLowerCase()) &&
    !favorites.find(fav => fav.name === f.name)
  );

  const lookupByName = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(""); setResult(null); setOptions([]);
    try {
      const res = await fetch("/api/claude", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200,
          messages:[{ role:"user", content:`Give 4 to 6 distinct variations of: "${query}". Vary by size, preparation method, fat content, cut of meat, cooking style, or restaurant vs homemade — whatever makes the most sense for this food. Each option should be meaningfully different so the user can pick the right one. Respond ONLY with valid JSON (no markdown): {"options":[{"name":"specific descriptive name","calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"serving":"serving size description","confidence":"high/medium/low","notes":"1 sentence on what makes this variation distinct"}]}` }]
        })
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      const parsed = JSON.parse(txt.replace(/```json|```/g,"").trim());
      if (parsed.options && parsed.options.length > 0) {
        setOptions(parsed.options);
      } else {
        selectResult(parsed);
      }
    } catch { setError("Couldn't look up that food. Try a different name."); }
    setLoading(false);
  };

  const lookupBarcode = async (code) => {
    setBarcodeVal(code); setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();
      if (data.status===1 && data.product) {
        const p = data.product, n = p.nutriments||{};
        const sg = parseFloat(p.serving_quantity)||100, f = sg/100;
        selectResult({
          name: p.product_name||p.product_name_en||"Unknown Product",
          calories: Math.round((n["energy-kcal_100g"]||0)*f),
          protein: Math.round((n.proteins_100g||0)*f*10)/10,
          carbs: Math.round((n.carbohydrates_100g||0)*f*10)/10,
          fat: Math.round((n.fat_100g||0)*f*10)/10,
          fiber: Math.round((n.fiber_100g||0)*f*10)/10,
          sugar: Math.round((n.sugars_100g||0)*f*10)/10,
          serving: p.serving_size||"1 serving",
          confidence:"high", notes:`Barcode: ${code}`
        });
      } else {
        setError("Product not found in database. Try Photo scan instead.");
      }
    } catch { setError("Lookup failed. Check your connection."); }
    setLoading(false);
  };

  const analyzePhoto = async () => {
    if (!imgBase64) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/claude", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
          messages:[{ role:"user", content:[
            { type:"image", source:{ type:"base64", media_type:"image/jpeg", data:imgBase64 }},
            { type:"text", text:`Analyze this food image. Respond ONLY with valid JSON (no markdown): {"name":"dish name","calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"serving":"description","confidence":"high/medium/low","notes":"brief note"}` }
          ]}]
        })
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      selectResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch { setError("Couldn't analyze image. Try again."); }
    setLoading(false);
  };

  const handleFile = (file) => {
    if (!file) return;
    setResult(null); setError("");
    const r = new FileReader();
    r.onload = e => { setImgPreview(e.target.result); setImgBase64(e.target.result.split(",")[1]); };
    r.readAsDataURL(file);
  };

  const quickAdd = (food) => {
    onAdd({ ...food, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), id:Date.now() });
  };

  const selectResult = (r) => { setResult(r); setQuantity(1); };

  const S = {
    overlay: { position:"fixed", inset:0, zIndex:500, display:"flex", flexDirection:"column" },
    backdrop: { flex:1, background:"rgba(0,0,0,0.55)" },
    panel: { background:BG, maxHeight:"88vh", display:"flex", flexDirection:"column", animation:"slideUp 0.35s cubic-bezier(.22,1,.36,1)" },
    panelHead: { background:BLACK, padding:"12px 16px 0", flexShrink:0 },
    body: { overflowY:"auto", padding:"14px 14px 30px", flex:1 },
    modeTab: (a) => ({ flex:1, padding:"10px 4px 8px", fontFamily:"'Bebas Neue'", fontSize:12, letterSpacing:1.5,
      color:a?RED:"#555", background:"transparent", border:"none", borderBottom:`2px solid ${a?RED:"transparent"}`, cursor:"pointer" }),
    card: { background:CARD, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${RED}`, padding:"12px", marginBottom:8 },
    input: { background:WHITE, color:TEXT, border:`1px solid ${BORDER}`, borderBottom:`2px solid ${RED}`, borderRadius:0, padding:"9px 10px", fontSize:13, fontFamily:"'DM Sans'", width:"100%", boxSizing:"border-box", outline:"none" },
    btn: { background:RED, color:WHITE, border:"none", borderRadius:0, padding:"12px 16px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", letterSpacing:1, textTransform:"uppercase" },
    btnSm: { background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, borderRadius:0, padding:"6px 12px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" },
    btnSmRed: { background:"transparent", color:RED, border:`1px solid ${RED}`, borderRadius:0, padding:"6px 12px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" },
    pill: (c) => ({ background:c+"18", color:c, border:`1px solid ${c}44`, borderRadius:2, padding:"2px 7px", fontSize:10, fontWeight:600, display:"inline-block" }),
    macroChip: (c) => ({ background:c+"12", color:c, borderRadius:0, padding:"7px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${c}` }),
    favItem: { background:CARD, border:`1px solid ${BORDER}`, borderRadius:0, padding:"10px 12px", cursor:"pointer", textAlign:"left", width:"100%", marginBottom:6, display:"flex", justifyContent:"space-between", alignItems:"center" },
  };

  return (
    <div style={S.overlay}>
      <div style={S.backdrop} onClick={onClose}/>
      <div style={S.panel}>
        {/* Header */}
        <div style={S.panelHead}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:WHITE, letterSpacing:2 }}>LOG FOOD</div>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#555", fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>
          </div>
          <div style={{ display:"flex" }}>
            {[{ id:"search", icon:"🔍", label:"Search" },{ id:"photo", icon:"📷", label:"Photo" },{ id:"barcode", icon:"📊", label:"Barcode" }].map(t=>(
              <button key={t.id} style={S.modeTab(mode===t.id)} onClick={()=>{ setMode(t.id); setResult(null); setOptions([]); setError(""); setBarcodeVal(null); setImgPreview(null); }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={S.body}>
          {/* ── SEARCH MODE ── */}
          {mode==="search" && (<>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <input style={{ ...S.input, flex:1 }} placeholder="Search foods or enter a food name..." value={query}
                onChange={e=>{ setQuery(e.target.value); setResult(null); setOptions([]); setError(""); }}
                onKeyDown={e=>e.key==="Enter"&&lookupByName()}/>
              {query && <button style={S.btnSmRed} onClick={lookupByName}>Look Up</button>}
            </div>

            {loading && (
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <div style={{ fontSize:13, color:MUTED, marginBottom:6 }}>🤖 Finding options for "{query}"...</div>
                <div style={{ height:2, background:CARD2, overflow:"hidden", borderRadius:2 }}>
                  <div style={{ height:"100%", width:"70%", background:RED, animation:"lineGrow 1s ease forwards" }}/>
                </div>
              </div>
            )}
            {error && <div style={{ fontSize:12, color:RED, marginBottom:12 }}>{error}</div>}

            {/* OPTIONS LIST — shown when Claude returns multiple variations */}
            {options.length > 0 && !result && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:RED, letterSpacing:2, marginBottom:10, borderBottom:`1px solid ${RED}44`, paddingBottom:5 }}>
                  SELECT A VARIATION — {query.toUpperCase()}
                </div>
                {options.map((opt, i) => (
                  <button key={i} onClick={()=>selectResult(opt)} style={{
                    width:"100%", textAlign:"left", background:CARD, border:`1px solid ${BORDER}`,
                    borderLeft:`3px solid ${RED}`, borderRadius:0, padding:"11px 12px",
                    marginBottom:6, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                  }}>
                    <div style={{ flex:1, paddingRight:10 }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:0.5, color:TEXT, marginBottom:2 }}>{opt.name}</div>
                      <div style={{ fontSize:10, color:MUTED, marginBottom:4 }}>{opt.serving}</div>
                      {opt.notes && <div style={{ fontSize:10, color:MUTED, fontStyle:"italic" }}>{opt.notes}</div>}
                      <div style={{ display:"flex", gap:6, marginTop:5 }}>
                        <span style={{ fontSize:10, color:BLACK, fontWeight:600 }}>P {Math.round(opt.protein)}g</span>
                        <span style={{ fontSize:10, color:MUTED }}>·</span>
                        <span style={{ fontSize:10, color:MUTED }}>C {Math.round(opt.carbs)}g</span>
                        <span style={{ fontSize:10, color:MUTED }}>·</span>
                        <span style={{ fontSize:10, color:MUTED }}>F {Math.round(opt.fat)}g</span>
                      </div>
                    </div>
                    <div style={{ flexShrink:0, textAlign:"right" }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:RED, lineHeight:1 }}>{Math.round(opt.calories)}</div>
                      <div style={{ fontSize:9, color:MUTED }}>KCAL</div>
                    </div>
                  </button>
                ))}
                <button onClick={()=>{ setOptions([]); setQuery(""); }} style={{ fontSize:11, color:MUTED, background:"transparent", border:"none", cursor:"pointer", padding:"4px 0", letterSpacing:0.5 }}>
                  ← Search something else
                </button>
              </div>
            )}

            {/* SELECTED RESULT — shown after picking a variation */}
            {result && (
              <ResultCard
                result={result}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAdd={(entry)=>{ quickAdd(entry); onClose(); }}
                onBack={options.length>0?()=>setResult(null):null}
                backLabel="← Other options"
              />
            )}

            {/* Favorites */}
            {favorites.length > 0 && (<>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:RED, letterSpacing:2, marginBottom:8, borderBottom:`1px solid ${RED}44`, paddingBottom:5 }}>
                ★ FAVORITES
              </div>
              {filteredFavs.map((f,i)=>(
                <button key={i} style={S.favItem} onClick={()=>{ quickAdd(f); onClose(); }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, textAlign:"left" }}>{f.name}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{f.serving}</div>
                  </div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:RED, flexShrink:0, marginLeft:10 }}>{Math.round(f.calories)} kcal</div>
                </button>
              ))}
              {query && filteredFavs.length===0 && favorites.length>0 && <div style={{ fontSize:12, color:MUTED, marginBottom:10 }}>No favorites match "{query}"</div>}
            </>)}

            {/* Recent matches */}
            {filteredRecent.length > 0 && (<>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:MUTED, letterSpacing:2, marginBottom:8, marginTop:4, borderBottom:`1px solid ${BORDER}`, paddingBottom:5 }}>RECENT MATCHES</div>
              {filteredRecent.slice(0,5).map((f,i)=>(
                <button key={i} style={S.favItem} onClick={()=>{ quickAdd(f); onClose(); }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, textAlign:"left" }}>{f.name}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{f.serving}</div>
                  </div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:MUTED, flexShrink:0, marginLeft:10 }}>{Math.round(f.calories)} kcal</div>
                </button>
              ))}
            </>)}

            {!query && favorites.length===0 && (
              <div style={{ textAlign:"center", padding:"30px 20px", color:MUTED }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🔍</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:1, marginBottom:6 }}>Search Any Food</div>
                <div style={{ fontSize:12, lineHeight:1.6 }}>Type a food name above and tap Look Up. Claude will estimate the nutrition. Star items you eat often for quick access.</div>
              </div>
            )}
          </>)}

          {/* ── PHOTO MODE ── */}
          {mode==="photo" && (<>
            {/* Image preview area */}
            {imgPreview
              ? <div style={{ position:"relative", marginBottom:12 }}>
                  <img src={imgPreview} alt="Food" style={{ width:"100%", maxHeight:220, objectFit:"contain", background:BLACK, display:"block" }}/>
                  <button onClick={()=>{ setImgPreview(null); setImgBase64(null); setResult(null); }}
                    style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.7)", border:`1px solid ${BORDER}`, color:WHITE, width:28, height:28, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>
              : <div style={{ marginBottom:14 }}>
                  {/* Two option buttons */}
                  <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                    <button onClick={()=>!loading&&cameraRef.current?.click()}
                      style={{ flex:1, background:BLACK, border:`1.5px solid ${RED}`, color:WHITE, padding:"20px 12px", cursor:"pointer", textAlign:"center" }}>
                      <div style={{ fontSize:28, marginBottom:6 }}>📷</div>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:1, color:WHITE }}>Take Photo</div>
                      <div style={{ fontSize:11, color:"#666", marginTop:3 }}>Use your camera</div>
                    </button>
                    <button onClick={()=>!loading&&fileRef.current?.click()}
                      style={{ flex:1, background:BLACK, border:`1.5px solid ${BORDER}`, color:WHITE, padding:"20px 12px", cursor:"pointer", textAlign:"center" }}>
                      <div style={{ fontSize:28, marginBottom:6 }}>🖼️</div>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:1, color:WHITE }}>Upload Photo</div>
                      <div style={{ fontSize:11, color:"#666", marginTop:3 }}>From your library</div>
                    </button>
                  </div>
                  <div style={{ fontSize:11, color:MUTED, textAlign:"center" }}>Claude AI will analyze the nutrition facts</div>
                </div>
            }
            {/* Camera input — opens camera directly */}
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
            {/* File input — opens photo library */}
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>

            {imgPreview && !result && (
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                <button style={S.btn} onClick={analyzePhoto} disabled={loading}>{loading?"⚡ Analyzing...":"⚡ Analyze with AI"}</button>
              </div>
            )}
            {loading && <div style={{ textAlign:"center", padding:"12px 0", color:MUTED, fontSize:13 }}>🤖 Claude is analyzing your photo...</div>}
            {error && <div style={{ fontSize:12, color:RED, marginBottom:12 }}>{error}</div>}
            {result && (
              <ResultCard
                result={result}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAdd={(entry)=>{ quickAdd(entry); onClose(); }}
              />
            )}
          </>)}

          {/* ── BARCODE MODE ── */}
          {mode==="barcode" && (<>
            {!barcodeVal && <BarcodeScanner onDetected={lookupBarcode}/>}
            {barcodeVal && loading && <div style={{ textAlign:"center", padding:"20px 0", color:MUTED, fontSize:13 }}>🔍 Looking up barcode {barcodeVal}...</div>}
            {error && <div style={{ fontSize:12, color:RED, marginBottom:12, textAlign:"center" }}>{error}</div>}
            {barcodeVal && !loading && !result && !error && <div style={{ textAlign:"center", padding:"12px 0", color:MUTED, fontSize:13 }}>Barcode: {barcodeVal}</div>}
            {result && (
              <ResultCard
                result={result}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAdd={(entry)=>{ quickAdd(entry); onClose(); }}
                extraBtn={<button style={{ background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, borderRadius:0, padding:"0 14px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" }} onClick={()=>{ setBarcodeVal(null); setResult(null); setError(""); setQuantity(1); }}>Rescan</button>}
              />
            )}
            {mode==="barcode" && !barcodeVal && (
              <div style={{ fontSize:12, color:MUTED, textAlign:"center", marginTop:8 }}>Supports EAN-13, UPC-A, QR Code and more</div>
            )}
          </>)}
        </div>
      </div>
    </div>
  );
}

/* ── SETTINGS PANEL ──────────────────────────────── */
function SettingsPanel({ user, goals, onSaveGoals, onClose }) {
  const [g, setG] = useState({ ...goals });
  const [tdeeMode, setTdeeMode] = useState(false);
  const [tdee, setTdee] = useState({ weight:"", height:"", age:"", sex:"male", activity:"moderate" });
  const [tdeeResult, setTdeeResult] = useState(null);

  const activityMultipliers = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, veryactive:1.9 };
  const activityLabels = { sedentary:"Sedentary (desk job)", light:"Light (1-3x/week)", moderate:"Moderate (3-5x/week)", active:"Active (6-7x/week)", veryactive:"Very Active (athlete)" };

  const calcTDEE = () => {
    const wKg = parseFloat(tdee.weight) / 2.205;
    const hCm = parseFloat(tdee.height) * 2.54;
    const age  = parseFloat(tdee.age);
    if (isNaN(wKg)||isNaN(hCm)||isNaN(age)) return;
    const bmr = tdee.sex==="male"
      ? 10*wKg + 6.25*hCm - 5*age + 5
      : 10*wKg + 6.25*hCm - 5*age - 161;
    const maintenance = Math.round(bmr * activityMultipliers[tdee.activity]);
    const goal = user.goal;
    const target = goal==="cut" ? maintenance-500 : goal==="bulk" ? maintenance+300 : maintenance;
    const protein = Math.round(parseFloat(tdee.weight) * 0.82);
    const fat     = Math.round(target * 0.25 / 9);
    const carbs   = Math.round((target - protein*4 - fat*9) / 4);
    setTdeeResult({ calories:target, maintenance, protein, fat, carbs });
    setG({ calories:target, protein, fat, carbs });
  };

  const S = {
    overlay: { position:"fixed", inset:0, zIndex:600, display:"flex", flexDirection:"column" },
    backdrop: { flex:1, background:"rgba(0,0,0,0.6)" },
    panel: { background:BG, maxHeight:"92vh", display:"flex", flexDirection:"column", animation:"slideUp 0.35s cubic-bezier(.22,1,.36,1)" },
    head: { background:BLACK, padding:"14px 16px 0", flexShrink:0 },
    body: { overflowY:"auto", padding:"16px 16px 40px", flex:1 },
    label: { fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:6 },
    labelRed: { fontFamily:"'Bebas Neue'", fontSize:12, color:RED, letterSpacing:2, marginBottom:10, borderBottom:`1px solid ${RED}44`, paddingBottom:5 },
    input: { background:WHITE, color:TEXT, border:`1px solid ${BORDER}`, borderBottom:`2px solid ${RED}`, borderRadius:0, padding:"9px 10px", fontSize:13, fontFamily:"'DM Sans'", width:"100%", boxSizing:"border-box", outline:"none" },
    row: { display:"flex", gap:10, marginBottom:14 },
    card: { background:CARD, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${RED}`, padding:"14px", marginBottom:10 },
    btn: { background:RED, color:WHITE, border:"none", borderRadius:0, padding:"13px 16px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", letterSpacing:1, textTransform:"uppercase" },
    btnSm: { background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, borderRadius:0, padding:"8px 14px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer", letterSpacing:0.5 },
    btnSmRed: { background:"transparent", color:RED, border:`1px solid ${RED}`, borderRadius:0, padding:"8px 14px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer", letterSpacing:0.5 },
    macroInput: { flex:1, display:"flex", flexDirection:"column", gap:5 },
  };

  return (
    <div style={S.overlay}>
      <div style={S.backdrop} onClick={onClose}/>
      <div style={S.panel}>
        <div style={S.head}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:WHITE, letterSpacing:2 }}>SETTINGS</div>
              <div style={{ fontSize:10, color:"#444", letterSpacing:1 }}>IZANA MODE · {user.name}</div>
            </div>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#555", fontSize:20, cursor:"pointer" }}>✕</button>
          </div>
        </div>

        <div style={S.body}>

          {/* TDEE Calculator */}
          <div style={{ marginBottom:6, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={S.labelRed}>🧮 TDEE CALCULATOR</div>
            <button style={S.btnSm} onClick={()=>setTdeeMode(m=>!m)}>
              {tdeeMode ? "▲ Hide" : "▼ Calculate"}
            </button>
          </div>

          {tdeeMode && (
            <div style={S.card}>
              <div style={S.row}>
                <div style={S.macroInput}>
                  <div style={S.label}>WEIGHT (lbs)</div>
                  <input style={S.input} placeholder="185" type="number" value={tdee.weight} onChange={e=>setTdee(t=>({...t,weight:e.target.value}))}/>
                </div>
                <div style={S.macroInput}>
                  <div style={S.label}>HEIGHT (in)</div>
                  <input style={S.input} placeholder="70" type="number" value={tdee.height} onChange={e=>setTdee(t=>({...t,height:e.target.value}))}/>
                </div>
                <div style={S.macroInput}>
                  <div style={S.label}>AGE</div>
                  <input style={S.input} placeholder="25" type="number" value={tdee.age} onChange={e=>setTdee(t=>({...t,age:e.target.value}))}/>
                </div>
              </div>

              <div style={{ marginBottom:12 }}>
                <div style={S.label}>BIOLOGICAL SEX</div>
                <div style={{ display:"flex", gap:8 }}>
                  {["male","female"].map(s=>(
                    <button key={s} onClick={()=>setTdee(t=>({...t,sex:s}))} style={{ flex:1, padding:"9px", fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:1, background:tdee.sex===s?RED:"transparent", color:tdee.sex===s?WHITE:MUTED, border:`1px solid ${tdee.sex===s?RED:BORDER}`, cursor:"pointer", textTransform:"uppercase" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:14 }}>
                <div style={S.label}>ACTIVITY LEVEL</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {Object.entries(activityLabels).map(([k,v])=>(
                    <button key={k} onClick={()=>setTdee(t=>({...t,activity:k}))} style={{ textAlign:"left", padding:"8px 12px", fontFamily:"'DM Sans'", fontSize:12, background:tdee.activity===k?RED+"18":"transparent", color:tdee.activity===k?RED:MUTED, border:`1px solid ${tdee.activity===k?RED:BORDER}`, cursor:"pointer", borderLeft:tdee.activity===k?`3px solid ${RED}`:`3px solid transparent` }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <button style={S.btn} onClick={calcTDEE}>⚡ Calculate My Targets</button>

              {tdeeResult && (
                <div style={{ marginTop:14, background:BLACK, padding:"12px 14px" }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:"#555", letterSpacing:2, marginBottom:8 }}>YOUR TARGETS — {user.goal?.toUpperCase()||"GOAL"}</div>
                  <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                    <div style={{ flex:1, textAlign:"center" }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:RED }}>{tdeeResult.calories}</div>
                      <div style={{ fontSize:9, color:"#555", letterSpacing:1 }}>KCAL</div>
                    </div>
                    <div style={{ flex:1, textAlign:"center" }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:WHITE }}>{tdeeResult.protein}g</div>
                      <div style={{ fontSize:9, color:"#555", letterSpacing:1 }}>PROTEIN</div>
                    </div>
                    <div style={{ flex:1, textAlign:"center" }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:MUTED }}>{tdeeResult.carbs}g</div>
                      <div style={{ fontSize:9, color:"#555", letterSpacing:1 }}>CARBS</div>
                    </div>
                    <div style={{ flex:1, textAlign:"center" }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:RED_DIM }}>{tdeeResult.fat}g</div>
                      <div style={{ fontSize:9, color:"#555", letterSpacing:1 }}>FAT</div>
                    </div>
                  </div>
                  <div style={{ fontSize:10, color:"#555", textAlign:"center" }}>Maintenance: {tdeeResult.maintenance} kcal · targets applied below ↓</div>
                </div>
              )}
            </div>
          )}

          {/* Manual Goals */}
          <div style={S.labelRed}>🎯 DAILY MACRO TARGETS</div>
          <div style={S.card}>
            <div style={{ marginBottom:14 }}>
              <div style={S.label}>CALORIES (kcal)</div>
              <input style={S.input} type="number" value={g.calories} onChange={e=>setG(x=>({...x,calories:parseInt(e.target.value)||0}))}/>
            </div>
            <div style={S.row}>
              <div style={S.macroInput}>
                <div style={S.label}>PROTEIN (g)</div>
                <input style={S.input} type="number" value={g.protein} onChange={e=>setG(x=>({...x,protein:parseInt(e.target.value)||0}))}/>
              </div>
              <div style={S.macroInput}>
                <div style={S.label}>CARBS (g)</div>
                <input style={S.input} type="number" value={g.carbs} onChange={e=>setG(x=>({...x,carbs:parseInt(e.target.value)||0}))}/>
              </div>
              <div style={S.macroInput}>
                <div style={S.label}>FAT (g)</div>
                <input style={S.input} type="number" value={g.fat} onChange={e=>setG(x=>({...x,fat:parseInt(e.target.value)||0}))}/>
              </div>
            </div>
            <div style={{ fontSize:11, color:MUTED, marginBottom:14, padding:"8px 10px", background:CARD2, borderLeft:`2px solid ${BORDER}` }}>
              Calories from macros: <strong style={{ color:TEXT }}>{g.protein*4 + g.carbs*4 + g.fat*9} kcal</strong>
            </div>
            <button style={S.btn} onClick={()=>onSaveGoals(g)}>✓ Save Targets</button>
          </div>

          {/* App info */}
          <div style={{ textAlign:"center", padding:"20px 0 0", borderTop:`1px solid ${BORDER}`, marginTop:6 }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:4, color:MUTED }}>IZANA <span style={{ color:RED }}>MODE</span></div>
            <div style={{ fontSize:10, color:MUTED, marginTop:4, letterSpacing:1 }}>王者之道 · WAY OF THE SOVEREIGN</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ONBOARDING ──────────────────────────────────── */
function Onboarding({ onComplete }) {
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [goal,setGoal]=useState(null);
  const [phase,setPhase]=useState("in");
  const advance=(n)=>{ setPhase("out"); setTimeout(()=>{ setStep(n); setPhase("in"); },400); };
  const base={ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", opacity:phase==="out"?0:1, transform:phase==="out"?"translateX(-40px)":"translateX(0)",
    transition:"opacity 0.35s ease, transform 0.35s ease", padding:"40px 28px" };

  if(step===0) return (
    <div style={{ position:"fixed", inset:0, background:BLACK, zIndex:1000, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:RED, animation:"lineGrow 2s ease 0.5s forwards", width:0 }}/>
      <div className="spin-in" style={{ marginBottom:36 }}><YinYang size={120}/></div>
      <div style={{ textAlign:"center", animation:"fadeUp 0.8s ease 1.2s both" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:52, color:WHITE, letterSpacing:6, lineHeight:1 }}>IZANA <span style={{ color:RED }}>MODE</span></div>
        <div style={{ fontFamily:"'Noto Serif JP'", fontSize:16, color:"#555", letterSpacing:8, marginTop:8 }}>初代横浜</div>
      </div>
      {["天","代","横","浜"].map((k,i)=>(
        <div key={k} style={{ position:"absolute", fontFamily:"'Bebas Neue'", fontSize:28, color:RED, opacity:0.25,
          animation:`kanjiDrop 0.6s ease ${1.8+i*0.2}s both`,
          top:i<2?20:"auto", bottom:i>=2?100:"auto", left:i%2===0?20:"auto", right:i%2===1?20:"auto" }}>{k}</div>
      ))}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:RED, animation:"lineGrow 2s ease 0.5s forwards", width:0 }}/>
      <button onClick={()=>advance(1)} style={{ position:"absolute", bottom:50, background:"transparent", border:`1px solid #333`, color:"#555", fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:3, padding:"10px 28px", cursor:"pointer", animation:"fadeIn 0.6s ease 2.6s both" }}>ENTER ›</button>
    </div>
  );

  if(step===1) return (
    <div style={{ position:"fixed", inset:0, background:RED, zIndex:1000, overflow:"hidden" }}>
      <div style={{ ...base }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.06 }}>
          <YinYang size={340} className="spin-slow"/>
        </div>
        <div style={{ position:"relative", textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:"rgba(255,255,255,0.6)", letterSpacing:4, marginBottom:20 }}>THE KING OF KINGS COMMANDS</div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:44, color:WHITE, letterSpacing:2, lineHeight:1.1, marginBottom:24 }}>Your body is your<br/><span style={{ color:BLACK }}>battlefield.</span></div>
          <div style={{ width:48, height:2, background:WHITE, margin:"0 auto 24px", opacity:0.5 }}/>
          <p style={{ fontFamily:"'DM Sans'", fontSize:15, color:"rgba(255,255,255,0.75)", lineHeight:1.7, maxWidth:300, margin:"0 auto 36px" }}>
            Track nutrition, training, body metrics, sleep and recovery — planned by AI.
          </p>
          <button onClick={()=>advance(2)} style={{ background:BLACK, color:WHITE, border:"none", fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:3, padding:"16px 40px", cursor:"pointer", width:"100%", maxWidth:300 }}>I'M READY ›</button>
        </div>
      </div>
    </div>
  );

  if(step===2) return (
    <div style={{ position:"fixed", inset:0, background:BLACK, zIndex:1000, overflow:"hidden" }}>
      <div style={{ ...base, justifyContent:"flex-start", paddingTop:60 }}>
        <div style={{ position:"absolute", bottom:-40, right:-40, opacity:0.06 }}><YinYang size={260} className="spin-slow"/></div>
        <div style={{ textAlign:"center", marginBottom:28, width:"100%" }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:RED, letterSpacing:4, marginBottom:8 }}>TENJIKU ARSENAL</div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:WHITE, letterSpacing:2, lineHeight:1 }}>YOUR WEAPONS</div>
          <div style={{ height:2, background:RED, marginTop:10 }}/>
        </div>
        {[
          { kanji:"食", en:"Log Food",         desc:"Search, photo scan, or barcode scan any meal. Save favourites for instant re-logging." },
          { kanji:"鍛", en:"Workout Tracker",  desc:"Log sets, reps and weight. Kanji-coded regimens included." },
          { kanji:"体", en:"Body Metrics",     desc:"Track weight and chart your progress over time." },
          { kanji:"眠", en:"Sleep & Recovery", desc:"Log sleep quality and get a daily recovery score." },
          { kanji:"謀", en:"AI Meal Planner",  desc:"Claude builds a personalised 7-day meal plan for your goal." },
        ].map((f,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:16, width:"100%", animation:`fadeUp 0.6s ease ${0.1+i*0.1}s both` }}>
            <div style={{ width:46, height:46, flexShrink:0, background:RED, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue'", fontSize:25, color:WHITE }}>{f.kanji}</div>
            <div><div style={{ fontFamily:"'Bebas Neue'", fontSize:16, color:WHITE, letterSpacing:1, marginBottom:2 }}>{f.en}</div><div style={{ fontFamily:"'DM Sans'", fontSize:12, color:"#666", lineHeight:1.5 }}>{f.desc}</div></div>
          </div>
        ))}
        <button onClick={()=>advance(3)} style={{ background:RED, color:WHITE, border:"none", fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:3, padding:"16px 40px", cursor:"pointer", width:"100%", marginTop:6 }}>NEXT ›</button>
      </div>
    </div>
  );

  if(step===3) return (
    <div style={{ position:"fixed", inset:0, background:WHITE, zIndex:1000, overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${RED},${BLACK})` }}/>
      <div style={{ ...base, justifyContent:"flex-start", paddingTop:60, overflowY:"auto" }}>
        <div style={{ textAlign:"center", marginBottom:28, width:"100%" }}>
          <YinYang size={44} style={{ margin:"0 auto 16px", mixBlendMode:"multiply" }}/>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:MUTED, letterSpacing:4, marginBottom:6 }}>IDENTIFY YOURSELF</div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:34, color:TEXT, letterSpacing:2 }}>WHO TRAINS TODAY?</div>
          <div style={{ height:2, background:RED, marginTop:10 }}/>
        </div>
        <div style={{ width:"100%", marginBottom:24 }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:MUTED, letterSpacing:3, marginBottom:8 }}>YOUR NAME</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name..."
            style={{ width:"100%", boxSizing:"border-box", background:"transparent", color:TEXT, border:"none", borderBottom:`2px solid ${name?RED:BORDER}`, fontFamily:"'Bebas Neue'", fontSize:24, letterSpacing:2, padding:"8px 0", outline:"none", transition:"border-color 0.3s" }}/>
        </div>
        <div style={{ width:"100%", marginBottom:28 }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:MUTED, letterSpacing:3, marginBottom:12 }}>YOUR MISSION</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[{ id:"cut", kanji:"削", label:"Cut", sub:"Lose fat" },{ id:"bulk", kanji:"増", label:"Bulk", sub:"Build mass" },{ id:"recomp", kanji:"変", label:"Recomp", sub:"Transform" },{ id:"endure", kanji:"耐", label:"Endure", sub:"Build stamina" }].map(g=>(
              <button key={g.id} onClick={()=>setGoal(g.id)} style={{ background:goal===g.id?RED:"transparent", border:`1.5px solid ${goal===g.id?RED:BORDER}`, borderRadius:0, padding:"14px 12px", cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:30, color:goal===g.id?WHITE:RED, lineHeight:1, marginBottom:4 }}>{g.kanji}</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, color:goal===g.id?WHITE:TEXT, letterSpacing:1 }}>{g.label}</div>
                <div style={{ fontFamily:"'DM Sans'", fontSize:11, color:goal===g.id?"rgba(255,255,255,0.7)":MUTED, marginTop:2 }}>{g.sub}</div>
              </button>
            ))}
          </div>
        </div>
        <button onClick={()=>name&&goal&&advance(4)} style={{ background:name&&goal?RED:CARD2, color:name&&goal?WHITE:MUTED, border:"none", borderRadius:0, fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:2, padding:"16px", cursor:name&&goal?"pointer":"not-allowed", width:"100%", transition:"all 0.3s" }}>
          {name&&goal?`ENTER THE DOJO, ${name.toUpperCase()} ›`:"FILL IN BOTH FIELDS"}
        </button>
      </div>
    </div>
  );

  if(step===4) return <FinalTransition name={name} goal={goal} onComplete={onComplete}/>;
  return null;
}

function FinalTransition({ name, goal, onComplete }) {
  const [sub,setSub]=useState(0);
  useEffect(()=>{ const t1=setTimeout(()=>setSub(1),600), t2=setTimeout(()=>setSub(2),1800), t3=setTimeout(()=>onComplete({name,goal}),3200); return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); }; },[]);
  return (
    <div style={{ position:"fixed", inset:0, background:BLACK, zIndex:1000, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <YinYang size={100} className="spin-in" style={{ marginBottom:32 }}/>
      {sub>=1&&<div style={{ textAlign:"center", animation:"fadeUp 0.6s ease both" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, color:RED, letterSpacing:4, marginBottom:6 }}>TENJIKU WELCOMES</div>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:48, color:WHITE, letterSpacing:3, lineHeight:1 }}>{name.toUpperCase()}</div>
      </div>}
      {sub>=2&&<div style={{ textAlign:"center", marginTop:24, animation:"fadeUp 0.5s ease both" }}>
        <div style={{ fontFamily:"'DM Sans'", fontSize:14, color:"#555", marginBottom:16 }}>Initializing your regimen...</div>
        <div style={{ width:200, height:2, background:"#222", overflow:"hidden" }}><div style={{ height:"100%", background:RED, animation:"lineGrow 1.2s ease forwards" }}/></div>
      </div>}
      {["天","代","横","浜"].map((k,i)=>(<div key={k} style={{ position:"absolute", fontFamily:"'Bebas Neue'", fontSize:22, color:RED, opacity:0.2, top:i<2?24:"auto", bottom:i>=2?24:"auto", left:i%2===0?24:"auto", right:i%2===1?24:"auto" }}>{k}</div>))}
    </div>
  );
}

/* ── MAIN APP ────────────────────────────────────── */
const DEFAULT_GOALS = { calories:2000, protein:150, carbs:200, fat:65 };
const SAMPLE_WORKOUTS = [
  { id:"push", name:"天 — Push Day",  exercises:["Bench Press","Overhead Press","Tricep Dips","Lateral Raises"] },
  { id:"pull", name:"地 — Pull Day",  exercises:["Pull-Ups","Barbell Row","Face Pulls","Bicep Curls"] },
  { id:"legs", name:"力 — Leg Day",   exercises:["Squat","Romanian Deadlift","Leg Press","Calf Raises"] },
  { id:"full", name:"全 — Full Body", exercises:["Deadlift","Bench Press","Squat","Pull-Ups"] },
];

function MainApp({ user }) {
  const [tab,setTab]=useState("home");
  const [foodLog,setFoodLog]=useState(()=>lsGet('im_foodLog',[]));
  const [favorites,setFavorites]=useState(()=>lsGet('im_favorites',[]));
  const [sessions,setSessions]=useState(()=>lsGet('im_sessions',[]));
  const [bodyMetrics,setBodyMetrics]=useState(()=>lsGet('im_bodyMetrics',[]));
  const [sleepLog,setSleepLog]=useState(()=>lsGet('im_sleepLog',[]));
  const [mealPlan,setMealPlan]=useState(null);
  const [generatingPlan,setGeneratingPlan]=useState(false);
  const [healthSub,setHealthSub]=useState("metrics");
  const [goals,setGoals]=useState(()=>lsGet('oja_goals', DEFAULT_GOALS));
  const [showSettings,setShowSettings]=useState(false);
  const [activeSession,setActiveSession]=useState(null);
  const [newExName,setNewExName]=useState("");
  const [newWeight,setNewWeight]=useState("");
  const [newSleep,setNewSleep]=useState({ hours:"", quality:3, soreness:3 });
  const [planPrefs,setPlanPrefs]=useState({ restrictions:"" });
  const [showAddFood,setShowAddFood]=useState(false);

  const today=new Date().toLocaleDateString("en-US",{ weekday:"short", month:"short", day:"numeric" });
  const totals=foodLog.reduce((a,f)=>({ calories:a.calories+(f.calories||0), protein:a.protein+(f.protein||0), carbs:a.carbs+(f.carbs||0), fat:a.fat+(f.fat||0) }),{ calories:0, protein:0, carbs:0, fat:0 });
  const activityScore=foodLog.length+sessions.length+bodyMetrics.length+sleepLog.length;
  const rank=getRank(activityScore);
  const nextRank=RANKS[RANKS.indexOf(RANKS.find(r=>r.min===rank.min))+1];
  const rankProgress=nextRank?Math.min((activityScore-rank.min)/(nextRank.min-rank.min)*100,100):100;
  const latestSleep=sleepLog[sleepLog.length-1];
  const recoveryScore=latestSleep?Math.round(Math.min(parseFloat(latestSleep.hours)/8,1)*50+((6-latestSleep.soreness)/5)*30+(latestSleep.quality/5)*20):null;

  // all unique foods ever logged (for recent searches)
  const recentFoods = [...new Map(
    [...foodLog].reverse().map(f => [f.name, f])
  ).values()];

  // Persist goals
  useEffect(()=>lsSet('oja_goals', goals),[goals]);
  // Persist all logs
  useEffect(()=>lsSet('im_foodLog', foodLog),[foodLog]);

  // Streak calculation — consecutive days with at least 1 food logged
  const streak = (() => {
    if (!foodLog.length) return 0;
    const logged = new Set(foodLog.map(f => {
      const d = new Date(f.id); // id is Date.now()
      return `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;
    }));
    let count = 0, d = new Date();
    while (true) {
      const key = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;
      if (logged.has(key)) { count++; d.setDate(d.getDate()-1); }
      else break;
    }
    return count;
  })();
  useEffect(()=>lsSet('im_favorites', favorites),[favorites]);
  useEffect(()=>lsSet('im_sessions', sessions),[sessions]);
  useEffect(()=>lsSet('im_bodyMetrics', bodyMetrics),[bodyMetrics]);
  useEffect(()=>lsSet('im_sleepLog', sleepLog),[sleepLog]);

  const addFoodItem = (item) => {
    setFoodLog(p=>[...p, item]);
  };

  const deleteFoodItem = (id) => {
    setFoodLog(p=>p.filter(f=>f.id!==id));
  };

  const toggleFavorite = (food) => {
    const isFav = favorites.find(f=>f.name===food.name);
    if (isFav) setFavorites(f=>f.filter(x=>x.name!==food.name));
    else setFavorites(f=>[...f, { name:food.name, calories:food.calories, protein:food.protein, carbs:food.carbs, fat:food.fat, fiber:food.fiber||0, sugar:food.sugar||0, serving:food.serving, confidence:food.confidence, notes:food.notes }]);
  };

  const generateMealPlan=async()=>{
    setGeneratingPlan(true); setMealPlan(null);
    try {
      const res=await fetch("/api/claude",{ method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1500,
          messages:[{ role:"user", content:`Create a 7-day meal plan. Goal: ${user.goal}. Daily calories: ${goals.calories}. Restrictions: ${planPrefs.restrictions||"none"}.
Respond ONLY with valid JSON (no markdown): {"days":[{"day":"Monday","meals":[{"name":"meal name","calories":number,"protein":number,"carbs":number,"fat":number,"time":"Breakfast"}]}]}
Include Breakfast, Lunch, Dinner, Snack for each day.` }]
        })
      });
      const data=await res.json();
      const txt=data.content?.find(b=>b.type==="text")?.text||"";
      setMealPlan(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch { alert("Couldn't generate plan. Try again."); }
    setGeneratingPlan(false);
  };

  const addMetric=()=>{
    if(!newWeight||isNaN(parseFloat(newWeight))) return;
    setBodyMetrics(p=>[...p,{ weight:newWeight, date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}), id:Date.now() }]);
    setNewWeight("");
  };
  const addSleep=()=>{
    if(!newSleep.hours||isNaN(parseFloat(newSleep.hours))) return;
    setSleepLog(p=>[...p,{ ...newSleep, date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}), id:Date.now() }]);
    setNewSleep({ hours:"", quality:3, soreness:3 });
  };

  const startWorkout=(t)=>setActiveSession({ id:Date.now(), name:t.name, start:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), exercises:t.exercises.map(n=>({ name:n, sets:[{reps:"",weight:""}] })) });
  const addSet=(ei)=>setActiveSession(s=>({ ...s, exercises:s.exercises.map((ex,i)=>i===ei?{ ...ex, sets:[...ex.sets,{reps:"",weight:""}] }:ex) }));
  const updateSet=(ei,si,f,v)=>setActiveSession(s=>({ ...s, exercises:s.exercises.map((ex,i)=>i!==ei?ex:{ ...ex, sets:ex.sets.map((st,j)=>j!==si?st:{ ...st,[f]:v }) }) }));
  const addCustomEx=()=>{ if(!newExName.trim()) return; setActiveSession(s=>({ ...s, exercises:[...s.exercises,{ name:newExName.trim(), sets:[{reps:"",weight:""}] }] })); setNewExName(""); };
  const finishWorkout=()=>{ setSessions(p=>[...p,{ ...activeSession, end:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), date:today }]); setActiveSession(null); };

  const goalLabel={ cut:"削 Cut", bulk:"増 Bulk", recomp:"変 Recomp", endure:"耐 Endure" };

  const S={
    app:       { fontFamily:"'DM Sans', sans-serif", background:BG, minHeight:"100vh", maxWidth:420, margin:"0 auto", display:"flex", flexDirection:"column", color:TEXT },
    header:    { background:BLACK, borderBottom:`3px solid ${RED}` },
    headerTop: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px 12px" },
    logo:      { fontFamily:"'Bebas Neue'", fontSize:28, color:WHITE, letterSpacing:3, lineHeight:1 },
    subhead:   { fontSize:9, color:"#555", letterSpacing:2, textTransform:"uppercase", marginTop:2 },
    content:   { flex:1, overflowY:"auto", padding:"14px 14px 80px" },
    card:      { background:CARD, border:`1px solid ${BORDER}`, borderRadius:0, padding:"14px", marginBottom:10, borderLeft:`3px solid ${RED}` },
    cardBlack: { background:BLACK, border:`1px solid #333`, borderRadius:0, padding:"14px", marginBottom:10, borderLeft:`3px solid ${RED}` },
    card2:     { background:CARD2, border:`1px solid ${BORDER}`, borderRadius:0, padding:"10px", marginBottom:8 },
    label:     { fontFamily:"'Bebas Neue'", fontSize:12, color:MUTED, letterSpacing:2, marginBottom:10, borderBottom:`1px solid ${BORDER}`, paddingBottom:5 },
    labelRed:  { fontFamily:"'Bebas Neue'", fontSize:12, color:RED, letterSpacing:2, marginBottom:10, borderBottom:`1px solid ${RED}55`, paddingBottom:5 },
    bigNum:    { fontFamily:"'Bebas Neue'", fontSize:40, color:TEXT, lineHeight:1 },
    btn:       { background:RED, color:WHITE, border:"none", borderRadius:0, padding:"13px 20px", fontSize:14, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", letterSpacing:1, textTransform:"uppercase" },
    btnBlack:  { background:BLACK, color:WHITE, border:`1.5px solid ${BLACK}`, borderRadius:0, padding:"11px 20px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", letterSpacing:1, textTransform:"uppercase" },
    btnSm:     { background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, borderRadius:0, padding:"6px 10px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" },
    btnSmRed:  { background:"transparent", color:RED, border:`1px solid ${RED}`, borderRadius:0, padding:"6px 12px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer", letterSpacing:1 },
    input:     { background:WHITE, color:TEXT, border:`1px solid ${BORDER}`, borderRadius:0, padding:"9px 10px", fontSize:13, fontFamily:"'DM Sans'", width:"100%", boxSizing:"border-box", outline:"none", borderBottom:`2px solid ${RED}` },
    tab:    (a)=>({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"9px 0 5px", cursor:"pointer", gap:2, background:a?BLACK:"transparent", border:"none", borderTopWidth:2, borderTopColor:a?RED:"transparent", borderTopStyle:"solid" }),
    tabLabel:  (a)=>({ fontSize:9, fontFamily:"'Bebas Neue'", color:a?RED:MUTED, letterSpacing:1.2 }),
    nav:       { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:CARD, borderTop:`2px solid ${BLACK}`, display:"flex", zIndex:100, paddingBottom:4 },
    pill:   (c)=>({ background:c+"18", color:c, border:`1px solid ${c}55`, borderRadius:2, padding:"2px 7px", fontSize:10, fontWeight:600, display:"inline-block", letterSpacing:0.5 }),
    macroChip: (c)=>({ background:c+"12", color:c, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${c}` }),
    setRow:    { display:"flex", gap:8, alignItems:"center", marginBottom:6 },
    subTab: (a)=>({ flex:1, padding:"9px 6px", textAlign:"center", fontFamily:"'Bebas Neue'", fontSize:12, letterSpacing:1.5, color:a?RED:MUTED, background:a?CARD:CARD2, border:"none", borderBottom:`2px solid ${a?RED:"transparent"}`, cursor:"pointer" }),
  };

  const TabIcon=({ name, active })=>{
    const c=active?RED:MUTED;
    const icons={
      home:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={c} strokeWidth="1.8" fill={active?c+"22":"none"}/><path d="M9 21V12h6v9" stroke={c} strokeWidth="1.8"/></svg>,
      log:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke={c} strokeWidth="1.8"/><path d="M9 12h6M9 16h4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
      workout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4v16M18 4v16M6 12h12M2 6h4M18 6h4M2 18h4M18 18h4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
      health:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={c} strokeWidth="1.8" fill={active?c+"22":"none"}/></svg>,
    };
    return icons[name];
  };

  const openLogFood = () => { setTab("log"); setShowAddFood(true); };

  return (
    <div style={S.app}>
      {showAddFood && <AddFoodPanel onAdd={addFoodItem} onClose={()=>setShowAddFood(false)} favorites={favorites} recentFoods={recentFoods}/>}
      {showSettings && <SettingsPanel user={user} goals={goals} onSaveGoals={(g)=>{ setGoals(g); setShowSettings(false); }} onClose={()=>setShowSettings(false)}/>}

      <div style={S.header}>
        <div style={S.headerTop}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <YinYang size={36} style={{ mixBlendMode:"multiply" }}/>
            <div>
              <div style={S.logo}>IZANA <span style={{ color:RED }}>MODE</span></div>
              <div style={S.subhead}>{user.name.toUpperCase()} · {goalLabel[user.goal]} · {today}</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:rank.color, letterSpacing:2 }}>{rank.title}</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:RED, lineHeight:1 }}>{Math.round(totals.calories)}</div>
              <div style={{ fontSize:9, color:"#555", letterSpacing:1, textTransform:"uppercase" }}>kcal today</div>
            </div>
            <button onClick={()=>setShowSettings(true)} style={{ background:"transparent", border:`1px solid #333`, color:"#555", width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#888" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#888" strokeWidth="1.8"/></svg>
            </button>
          </div>
        </div>
        <div style={{ height:3, background:`linear-gradient(90deg,${RED},${BLACK})` }}/>
      </div>

      <div style={S.content}>

        {/* ── HOME ── */}
        {tab==="home"&&(<>
          <div style={{ ...S.cardBlack, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:56, height:56, background:rank.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:WHITE }}>{rank.kanji}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:"#555", letterSpacing:3, marginBottom:2 }}>TENJIKU RANK</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:WHITE, letterSpacing:1, lineHeight:1 }}>{rank.title} <span style={{ fontSize:12, color:"#555" }}>· {rank.sub}</span></div>
              <div style={{ marginTop:8, height:3, background:"#222", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${rankProgress}%`, background:rank.color, transition:"width 0.5s" }}/>
              </div>
              <div style={{ fontFamily:"'DM Sans'", fontSize:10, color:"#555", marginTop:3 }}>
                {nextRank?`${activityScore-rank.min} / ${nextRank.min-rank.min} to ${nextRank.title}`:"Maximum rank achieved"}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            {/* Streak card */}
            <div style={{ ...S.card, flex:1, marginBottom:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"12px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:streak>0?RED:MUTED, lineHeight:1 }}>{streak}</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:10, color:MUTED, letterSpacing:2, marginTop:2 }}>DAY{streak!==1?"S":""} STREAK</div>
              <div style={{ fontSize:10, color:streak>=7?RED:MUTED, marginTop:4 }}>{streak===0?"Log today to start":streak>=7?"🔥 On fire!":streak>=3?"Keep going!":"Keep it up!"}</div>
            </div>
            {/* Activity score card */}
            <div style={{ ...S.card, flex:1, marginBottom:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"12px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:TEXT, lineHeight:1 }}>{activityScore}</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:10, color:MUTED, letterSpacing:2, marginTop:2 }}>TOTAL LOGS</div>
              <div style={{ fontSize:10, color:MUTED, marginTop:4 }}>{foodLog.length}f · {sessions.length}w · {sleepLog.length}s</div>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.labelRed}>Daily Calories</div>
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              <Ring value={totals.calories} max={goals.calories} size={86} stroke={9} color={RED}/>
              <div style={{ flex:1 }}>
                <div style={S.bigNum}>{Math.round(Math.max(0, goals.calories-totals.calories))}</div>
                <div style={{ fontSize:12, color:MUTED }}>kcal remaining</div>
                {recoveryScore!==null&&<div style={{ marginTop:6, display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:8, height:8, background:recoveryScore>70?RED:MUTED }}/>
                  <span style={{ fontSize:11, color:MUTED }}>Recovery: <span style={{ color:TEXT, fontWeight:600 }}>{recoveryScore}/100</span></span>
                </div>}
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.label}>Macros</div>
            <MacroBar label="Protein" val={totals.protein} max={goals.protein} color={RED}/>
            <MacroBar label="Carbs"   val={totals.carbs}   max={goals.carbs}   color={BLACK}/>
            <MacroBar label="Fat"     val={totals.fat}      max={goals.fat}     color={MUTED}/>
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            <button style={{ ...S.btn, flex:1 }} onClick={openLogFood}>🍱 Log Food</button>
            <button style={{ ...S.btnBlack, flex:1 }} onClick={()=>setTab("workout")}>🏋️ Workout</button>
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            <button style={{ ...S.btnSm, flex:1, padding:"9px 4px", textAlign:"center", fontSize:11, letterSpacing:0.5 }} onClick={()=>{ setTab("health"); setHealthSub("sleep"); }}>😴 Log Sleep</button>
            <button style={{ ...S.btnSm, flex:1, padding:"9px 4px", textAlign:"center", fontSize:11, letterSpacing:0.5 }} onClick={()=>{ setTab("health"); setHealthSub("metrics"); }}>⚖️ Log Weight</button>
            <button style={{ ...S.btnSm, flex:1, padding:"9px 4px", textAlign:"center", fontSize:11, letterSpacing:0.5 }} onClick={()=>{ setTab("health"); setHealthSub("ai"); }}>🤖 Meal Plan</button>
          </div>

          {foodLog.length>0&&<div style={S.card}>
            <div style={S.label}>Today's Food</div>
            {foodLog.slice(-3).reverse().map(f=>(
              <div key={f.id} style={{ ...S.card2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><div style={{ fontWeight:600, fontSize:13 }}>{f.name}</div><div style={{ fontSize:11, color:MUTED }}>{f.time}</div></div>
                <span style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:RED }}>{f.calories} kcal</span>
              </div>
            ))}
          </div>}

          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 0 10px", gap:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:6, color:BLACK, opacity:0.22 }}>初代</span>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:6, color:BLACK, opacity:0.22 }}>横浜</span>
            </div>
            <YinYang size={190} style={{ opacity:0.82, mixBlendMode:"darken" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:6, color:BLACK, opacity:0.22 }}>天</span>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:6, color:BLACK, opacity:0.22 }}>竺</span>
            </div>
          </div>
        </>)}

        {/* ── LOG ── */}
        {tab==="log"&&(<>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:24, letterSpacing:2 }}>Food Log</div>
            <button style={S.btnSmRed} onClick={()=>setShowAddFood(true)}>+ Log Food</button>
          </div>

          <div style={S.card}>
            <div style={S.labelRed}>Today's Totals</div>
            <div style={{ display:"flex", gap:8, justifyContent:"space-around" }}>
              <Ring value={totals.calories} max={goals.calories} size={66} stroke={6} color={RED}     label="Kcal"/>
              <Ring value={totals.protein}  max={goals.protein}  size={66} stroke={6} color={BLACK}   label="Protein"/>
              <Ring value={totals.carbs}    max={goals.carbs}    size={66} stroke={6} color={MUTED}   label="Carbs"/>
              <Ring value={totals.fat}      max={goals.fat}      size={66} stroke={6} color={RED_DIM} label="Fat"/>
            </div>
          </div>

          {/* Favorites quick-access */}
          {favorites.length>0&&<div style={S.card}>
            <div style={S.labelRed}>★ Favorites</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {favorites.map((f,i)=>(
                <button key={i} onClick={()=>addFoodItem({ ...f, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), id:Date.now() })}
                  style={{ background:CARD2, border:`1px solid ${BORDER}`, borderBottom:`2px solid ${RED}`, borderRadius:0, padding:"8px 12px", cursor:"pointer", textAlign:"left" }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:0.5 }}>{f.name}</div>
                  <div style={{ fontSize:10, color:RED, fontWeight:600 }}>{Math.round(f.calories)} kcal</div>
                </button>
              ))}
            </div>
          </div>}

          {foodLog.length===0
            ?<div style={{ ...S.card, textAlign:"center", padding:"36px 20px" }}>
                <div style={{ fontSize:34, marginBottom:10 }}>🍽️</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:1, marginBottom:6 }}>No food logged yet</div>
                <div style={{ fontSize:12, color:MUTED, marginBottom:16 }}>Search, scan a photo, or scan a barcode to add meals</div>
                <button style={S.btn} onClick={()=>setShowAddFood(true)}>Log Food</button>
              </div>
            :[...foodLog].reverse().map(f=>(
                <div key={f.id} style={S.card}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14 }}>{f.name}</div>
                      <div style={{ fontSize:11, color:MUTED }}>{f.serving} · {f.time}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                      <button onClick={()=>toggleFavorite(f)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:16, color:favorites.find(x=>x.name===f.name)?RED:BORDER, lineHeight:1, padding:"2px 4px" }}>
                        {favorites.find(x=>x.name===f.name)?"★":"☆"}
                      </button>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:RED }}>{Math.round(f.calories)}</div>
                      <button onClick={()=>deleteFoodItem(f.id)} style={{ background:"transparent", border:`1px solid ${BORDER}`, cursor:"pointer", color:MUTED, fontSize:12, lineHeight:1, padding:"3px 7px", letterSpacing:0.3 }} title="Remove">✕</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <span style={S.pill(BLACK)}>P: {Math.round(f.protein)}g</span>
                    <span style={S.pill(MUTED)}>C: {Math.round(f.carbs)}g</span>
                    <span style={S.pill(RED)}>F: {Math.round(f.fat)}g</span>
                  </div>
                </div>
              ))
          }
        </>)}

        {/* ── WORKOUT ── */}
        {tab==="workout"&&!activeSession&&(<>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:24, letterSpacing:2, marginBottom:4 }}>Workouts</div>
          <div style={{ fontSize:12, color:MUTED, marginBottom:14 }}>Select a regimen and begin</div>
          {sessions.length>0&&<div style={S.card}>
            <div style={S.label}>Recent Sessions</div>
            {sessions.slice(-3).reverse().map(s=>(
              <div key={s.id} style={{ ...S.card2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><div style={{ fontWeight:600 }}>{s.name}</div><div style={{ fontSize:11, color:MUTED }}>{s.exercises?.length} exercises · {s.start}–{s.end}</div></div>
                <span style={S.pill(RED)}>✓</span>
              </div>
            ))}
          </div>}
          <div style={S.labelRed}>Select Regimen</div>
          {SAMPLE_WORKOUTS.map(w=>(
            <div key={w.id} style={{ ...S.card, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }} onClick={()=>startWorkout(w)}>
              <div><div style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:1 }}>{w.name}</div><div style={{ fontSize:11, color:MUTED, marginTop:3 }}>{w.exercises.join(" · ")}</div></div>
              <div style={{ color:RED, fontSize:22, fontWeight:700 }}>›</div>
            </div>
          ))}
          <button style={{ ...S.btnBlack, marginTop:4 }} onClick={()=>startWorkout({ name:"Custom Workout", exercises:[] })}>+ Custom Workout</button>
        </>)}

        {tab==="workout"&&activeSession&&(<>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div><div style={{ fontFamily:"'Bebas Neue'", fontSize:20, letterSpacing:1 }}>{activeSession.name}</div><div style={{ fontSize:11, color:MUTED }}>Started {activeSession.start}</div></div>
            <button style={{ ...S.btnSm, color:RED }} onClick={()=>setActiveSession(null)}>Quit</button>
          </div>
          {activeSession.exercises.map((ex,ei)=>(
            <div key={ei} style={S.card}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:1, marginBottom:8, color:RED }}>{ex.name}</div>
              <div style={{ display:"flex", gap:8, marginBottom:5 }}>
                <span style={{ flex:0.4, fontSize:9, color:MUTED, textAlign:"center", letterSpacing:1 }}>SET</span>
                <span style={{ flex:1, fontSize:9, color:MUTED, textAlign:"center", letterSpacing:1 }}>REPS</span>
                <span style={{ flex:1, fontSize:9, color:MUTED, textAlign:"center", letterSpacing:1 }}>LBS</span>
              </div>
              {ex.sets.map((st,si)=>(
                <div key={si} style={S.setRow}>
                  <span style={{ flex:0.4, fontFamily:"'Bebas Neue'", fontSize:17, color:MUTED, textAlign:"center" }}>{si+1}</span>
                  <input style={{ ...S.input, flex:1, textAlign:"center", padding:"7px 4px" }} placeholder="—" value={st.reps} onChange={e=>updateSet(ei,si,"reps",e.target.value)}/>
                  <input style={{ ...S.input, flex:1, textAlign:"center", padding:"7px 4px" }} placeholder="—" value={st.weight} onChange={e=>updateSet(ei,si,"weight",e.target.value)}/>
                </div>
              ))}
              <button style={{ ...S.btnSm, width:"100%", marginTop:4, borderStyle:"dashed" }} onClick={()=>addSet(ei)}>+ Set</button>
            </div>
          ))}
          <div style={{ ...S.card, display:"flex", gap:8 }}>
            <input style={{ ...S.input, flex:1 }} placeholder="Add exercise..." value={newExName} onChange={e=>setNewExName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomEx()}/>
            <button style={S.btnSmRed} onClick={addCustomEx}>Add</button>
          </div>
          <button style={S.btn} onClick={finishWorkout}>✓ Finish Workout</button>
        </>)}

        {/* ── HEALTH ── */}
        {tab==="health"&&(<>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:24, letterSpacing:2, marginBottom:12 }}>Health Center</div>
          <div style={{ display:"flex", marginBottom:14, borderBottom:`2px solid ${BORDER}` }}>
            {[{ id:"metrics", label:"⚖️ Body" },{ id:"sleep", label:"😴 Sleep" },{ id:"ai", label:"🤖 AI Plan" }].map(t=>(
              <button key={t.id} style={S.subTab(healthSub===t.id)} onClick={()=>setHealthSub(t.id)}>{t.label}</button>
            ))}
          </div>

          {healthSub==="metrics"&&(<>
            <div style={S.card}>
              <div style={S.labelRed}>Log Weight (lbs)</div>
              <div style={{ display:"flex", gap:8 }}>
                <input style={{ ...S.input, flex:1 }} placeholder="e.g. 185.5" value={newWeight} onChange={e=>setNewWeight(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addMetric()} type="number"/>
                <button style={S.btnSmRed} onClick={addMetric}>Log</button>
              </div>
            </div>
            {bodyMetrics.length>0&&<div style={S.card}>
              <div style={S.label}>Weight Trend</div>
              <WeightChart data={bodyMetrics}/>
              <div style={{ marginTop:10 }}>
                {[...bodyMetrics].reverse().slice(0,5).map(m=>(
                  <div key={m.id} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${BORDER}` }}>
                    <span style={{ fontSize:12, color:MUTED }}>{m.date}</span>
                    <span style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:RED }}>{m.weight} lbs</span>
                  </div>
                ))}
              </div>
            </div>}
            {bodyMetrics.length===0&&<div style={{ ...S.card, textAlign:"center", padding:"36px 20px" }}>
              <div style={{ fontSize:34, marginBottom:10 }}>⚖️</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:1, marginBottom:6 }}>No weight logged yet</div>
              <div style={{ fontSize:12, color:MUTED }}>Enter your weight above to start tracking</div>
            </div>}
          </>)}

          {healthSub==="sleep"&&(<>
            <div style={S.card}>
              <div style={S.labelRed}>Log Last Night's Sleep</div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:6 }}>HOURS SLEPT</div>
                <input style={S.input} placeholder="e.g. 7.5" value={newSleep.hours} onChange={e=>setNewSleep(s=>({ ...s, hours:e.target.value }))} type="number" step="0.5"/>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:8 }}>SLEEP QUALITY</div>
                <StarRating value={newSleep.quality} onChange={v=>setNewSleep(s=>({ ...s, quality:v }))} color={RED}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:8 }}>MUSCLE SORENESS (1=none · 5=destroyed)</div>
                <StarRating value={newSleep.soreness} onChange={v=>setNewSleep(s=>({ ...s, soreness:v }))} color={BLACK}/>
              </div>
              <button style={S.btn} onClick={addSleep}>Log Recovery</button>
            </div>
            {recoveryScore!==null&&<div style={S.card}>
              <div style={S.labelRed}>Recovery Score</div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:76, height:76, background:recoveryScore>70?RED:recoveryScore>40?BLACK:MUTED, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"'Bebas Neue'", fontSize:32, color:WHITE }}>{recoveryScore}</span>
                </div>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:1 }}>{recoveryScore>70?"Ready to Train":recoveryScore>40?"Train Light":"Rest Day"}</div>
                  <div style={{ fontSize:12, color:MUTED, marginTop:4, lineHeight:1.5 }}>
                    {recoveryScore>70?"You're fully recovered. Hit it hard.":recoveryScore>40?"Consider lighter session or active recovery.":"Your body needs rest. Prioritize sleep tonight."}
                  </div>
                </div>
              </div>
            </div>}
            {sleepLog.length>0&&<div style={S.card}>
              <div style={S.label}>Sleep History</div>
              {[...sleepLog].reverse().slice(0,5).map(s=>(
                <div key={s.id} style={{ ...S.card2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><div style={{ fontSize:11, color:MUTED }}>{s.date}</div><div style={{ fontSize:12, marginTop:2 }}>Quality {s.quality}/5 · Soreness {s.soreness}/5</div></div>
                  <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:RED }}>{s.hours}h</span>
                </div>
              ))}
            </div>}
          </>)}

          {healthSub==="ai"&&(<>
            <div style={S.card}>
              <div style={S.labelRed}>AI Meal Planner</div>
              <div style={{ fontSize:12, color:MUTED, marginBottom:14, lineHeight:1.6 }}>Claude builds a personalised 7-day meal plan based on your goal and calorie target.</div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:6 }}>DIETARY RESTRICTIONS / PREFERENCES</div>
                <input style={S.input} placeholder="e.g. no dairy, vegetarian, gluten-free..." value={planPrefs.restrictions} onChange={e=>setPlanPrefs(p=>({ ...p, restrictions:e.target.value }))}/>
              </div>
              <div style={{ ...S.card2, marginBottom:10, display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, color:MUTED }}>Goal</span><span style={{ fontSize:12, fontWeight:600 }}>{goalLabel[user.goal]}</span>
              </div>
              <div style={{ ...S.card2, marginBottom:14, display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, color:MUTED }}>Daily Calories</span><span style={{ fontSize:12, fontWeight:600 }}>{goals.calories} kcal</span>
              </div>
              <button style={S.btn} onClick={generateMealPlan} disabled={generatingPlan}>{generatingPlan?"🤖 Claude is Planning...":"🤖 Generate 7-Day Plan"}</button>
            </div>
            {generatingPlan&&<div style={{ ...S.card, textAlign:"center" }}>
              <YinYang size={40} style={{ margin:"0 auto 12px", mixBlendMode:"multiply" }} className="spin-slow"/>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:1, marginBottom:4 }}>Building Your Plan...</div>
              <div style={{ fontSize:12, color:MUTED }}>Claude is crafting your personalised meal schedule</div>
            </div>}
            {mealPlan&&mealPlan.days&&mealPlan.days.map((day,di)=>(
              <div key={di} style={S.card}>
                <div style={S.labelRed}>{day.day}</div>
                {day.meals&&day.meals.map((meal,mi)=>(
                  <div key={mi} style={{ ...S.card2, marginBottom:6 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                      <div>
                        <div style={{ fontSize:11, color:RED, fontWeight:600, letterSpacing:0.5 }}>{meal.time}</div>
                        <div style={{ fontSize:13, fontWeight:600, marginTop:1 }}>{meal.name}</div>
                      </div>
                      <span style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:RED }}>{meal.calories}</span>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      {meal.protein&&<span style={S.pill(BLACK)}>P: {meal.protein}g</span>}
                      {meal.carbs&&<span style={S.pill(MUTED)}>C: {meal.carbs}g</span>}
                      {meal.fat&&<span style={S.pill(RED)}>F: {meal.fat}g</span>}
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}>
                  <span style={{ fontSize:11, color:MUTED }}>Day total: <strong style={{ color:TEXT }}>{day.meals?.reduce((a,m)=>a+(m.calories||0),0)} kcal</strong></span>
                </div>
              </div>
            ))}
          </>)}
        </>)}
      </div>

      <nav style={S.nav}>
        {[{ id:"home", label:"Home" },{ id:"log", label:"Log" },{ id:"workout", label:"Train" },{ id:"health", label:"Health" }].map(t=>(
          <button key={t.id} style={S.tab(tab===t.id)} onClick={()=>setTab(t.id)}>
            <TabIcon name={t.id} active={tab===t.id}/>
            <span style={S.tabLabel(tab===t.id)}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ── WELCOME BACK ────────────────────────────────── */
function WelcomeBack({ user, onContinue }) {
  const rank = getRank(0);
  const goalLabel = { cut:"削 Cut", bulk:"増 Bulk", recomp:"変 Recomp", endure:"耐 Endure" };
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };
  return (
    <div style={{ position:"fixed", inset:0, background:BLACK, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:1000, overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${RED},${BLACK})` }}/>

      <YinYang size={90} className="spin-in" style={{ marginBottom:28 }}/>

      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:14, color:RED, letterSpacing:5, marginBottom:6 }}>
          {greeting().toUpperCase()}
        </div>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:52, color:WHITE, letterSpacing:4, lineHeight:1, animation:"fadeUp 0.6s ease 0.4s both" }}>
          {user.name.toUpperCase()}
        </div>
        <div style={{ fontFamily:"'DM Sans'", fontSize:13, color:"#555", marginTop:10, letterSpacing:1, animation:"fadeUp 0.6s ease 0.6s both" }}>
          {goalLabel[user.goal]} · Tenjiku awaits
        </div>
      </div>

      <button onClick={onContinue} style={{
        marginTop:44, background:RED, color:WHITE, border:"none",
        fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:4,
        padding:"16px 56px", cursor:"pointer",
        animation:"fadeUp 0.6s ease 0.8s both"
      }}>
        ENTER ›
      </button>

      {["天","代","横","浜"].map((k,i)=>(
        <div key={k} style={{ position:"absolute", fontFamily:"'Bebas Neue'", fontSize:22, color:RED, opacity:0.15,
          top:i<2?20:"auto", bottom:i>=2?20:"auto", left:i%2===0?20:"auto", right:i%2===1?20:"auto" }}>{k}</div>
      ))}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${BLACK},${RED})` }}/>
    </div>
  );
}

/* ── APP ROOT ────────────────────────────────────── */
export default function App() {
  const [user,setUser]=useState(()=>lsGet('im_user', null));
  const [welcomed,setWelcomed]=useState(false);

  const handleComplete=(d)=>{
    lsSet('im_user', d);
    setUser(d);
    setWelcomed(true);
  };

  return (
    <>
      <style>{ANIM}</style>
      {!user
        ? <Onboarding onComplete={handleComplete}/>
        : !welcomed
          ? <WelcomeBack user={user} onContinue={()=>setWelcomed(true)}/>
          : <MainApp user={user}/>
      }
    </>
  );
}
