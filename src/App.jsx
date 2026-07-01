import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase, configured } from "./supabase.js";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
.tl, .tl * { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.tl .display { font-family: 'Sora', system-ui, sans-serif; letter-spacing: -0.02em; }
.tl {
  --bg:#f6f5f3; --panel:#fff; --panel2:#fbfafa; --ink:#15151a; --ink2:#6b6b76; --ink3:#9b9ba6;
  --line:#ececea; --me1:#6d5efc; --me2:#8b5cf6; --them:#f0eff2; --accent:#6d5efc; --good:#28c084;
  width:100%; height:100%; display:flex; background:var(--bg); border-radius:16px; overflow:hidden; border:1px solid var(--line); color:var(--ink);
}
@media (max-width:760px){ .tl{ border-radius:0; border:none; } }
.auth { flex:1; display:flex; align-items:center; justify-content:center; padding:24px; background: radial-gradient(120% 80% at 50% 0%, #eceaff, var(--bg)); }
.card { background:var(--panel); border:1px solid var(--line); border-radius:20px; padding:30px 26px; width:100%; max-width:360px; box-shadow:0 20px 50px rgba(20,20,40,.08); }
.logo { width:52px;height:52px;border-radius:15px;background:linear-gradient(135deg,var(--me1),var(--me2)); display:grid;place-items:center;color:#fff;font-weight:700;font-size:24px; margin-bottom:16px; box-shadow:0 8px 20px rgba(109,94,252,.4); }
.card h1 { font-size:22px; font-weight:700; margin:0 0 4px; }
.card p.sub { color:var(--ink2); font-size:14px; margin:0 0 20px; }
.field2 { margin-bottom:12px; }
.field2 label { display:block; font-size:12.5px; font-weight:600; color:var(--ink2); margin-bottom:5px; }
.field2 input { width:100%; padding:12px 14px; border-radius:12px; border:1px solid var(--line); background:var(--panel2); color:var(--ink); font-size:15px; outline:none; transition:.15s; }
.field2 input:focus { border-color:var(--accent); background:var(--panel); }
.pbtn { width:100%; padding:13px; border-radius:12px; border:none; cursor:pointer; font-weight:600; font-size:15px; color:#fff; background:linear-gradient(135deg,var(--me1),var(--me2)); box-shadow:0 6px 18px rgba(109,94,252,.35); margin-top:6px; }
.pbtn:disabled { opacity:.55; cursor:default; }
.swap { text-align:center; margin-top:16px; font-size:14px; color:var(--ink2); }
.swap b { color:var(--accent); cursor:pointer; }
.err2 { background:#ffe9ec; color:#c0304a; border:1px solid #f3c3cd; border-radius:10px; padding:9px 12px; font-size:13px; margin-bottom:12px; }
.note { background:#fff7e0; color:#9a7b2e; border:1px solid #f1e2ad; border-radius:10px; padding:10px 12px; font-size:12.5px; line-height:1.45; margin-bottom:14px; }
.side { width:320px; border-right:1px solid var(--line); background:var(--panel); display:flex; flex-direction:column; flex-shrink:0; }
.side .top { padding:16px 16px 10px; display:flex; align-items:center; justify-content:space-between; }
.side .top .me { display:flex; align-items:center; gap:10px; min-width:0; }
.side .top .me b { font-size:15px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.side .top .me small { display:block; font-size:11.5px; color:var(--ink3); }
.icon { width:34px;height:34px;border-radius:10px;border:none;background:var(--panel2);color:var(--ink2);cursor:pointer;display:grid;place-items:center;font-size:16px; }
.icon:hover { background:var(--bg); }
.search { margin:6px 14px 8px; position:relative; }
.search input { width:100%; padding:11px 12px 11px 36px; border-radius:12px; border:1px solid var(--line); background:var(--panel2); color:var(--ink); font-size:14px; outline:none; }
.search input:focus { border-color:var(--accent); background:var(--panel); }
.search svg { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--ink3); }
.seclabel { padding:8px 18px 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--ink3); }
.list { flex:1; overflow-y:auto; padding:0 8px 10px; }
.crow { display:flex; align-items:center; gap:12px; padding:11px 10px; border-radius:13px; cursor:pointer; }
.crow:hover { background:var(--panel2); } .crow.on { background:var(--bg); }
.av { width:44px;height:44px;border-radius:50%; display:grid;place-items:center;color:#fff;font-weight:600;font-size:16px; flex-shrink:0; }
.crow .m { flex:1; min-width:0; } .crow .m b{ font-size:15px; font-weight:600; } .crow .m span{ display:block; font-size:13px; color:var(--ink2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.udot { width:20px;height:20px;border-radius:50%;background:var(--accent);color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;flex-shrink:0; }
.empty2 { text-align:center; color:var(--ink3); font-size:13.5px; padding:26px 18px; line-height:1.5; }
.main { flex:1; display:flex; flex-direction:column; background:var(--bg); min-width:0; position:relative; }
.chead { display:flex; align-items:center; gap:12px; padding:13px 18px; background:var(--panel); border-bottom:1px solid var(--line); }
.chead b { font-size:16px; font-weight:600; flex:1; }
.thread { flex:1; overflow-y:auto; padding:18px 8% 14px; display:flex; flex-direction:column; gap:4px; }
@media (max-width:760px){ .thread{ padding:14px 14px; } .side{ width:100%; } .tl[data-open="true"] .side{ display:none; } .tl[data-open="false"] .main{ display:none; } }
.b { max-width:74%; padding:9px 13px; border-radius:17px; font-size:14.5px; line-height:1.4; box-shadow:0 1px 2px rgba(20,20,30,.06); word-wrap:break-word; }
.b.me { align-self:flex-end; background:linear-gradient(135deg,var(--me1),var(--me2)); color:#fff; border-bottom-right-radius:6px; }
.b.them { align-self:flex-start; background:var(--them); color:#1c1c22; border-bottom-left-radius:6px; }
.b.media { padding:5px; }
.b time { display:block; font-size:10px; opacity:.65; margin-top:3px; text-align:right; }
.media-img, .media-vid { max-width:230px; max-height:280px; border-radius:12px; display:block; }
.media-img { cursor:pointer; }
.composer2 { position:relative; display:flex; align-items:center; gap:8px; padding:12px 16px; background:var(--panel); border-top:1px solid var(--line); }
.cbtn { width:40px;height:40px;border-radius:50%;border:none;background:var(--panel2);color:var(--ink2);cursor:pointer;font-size:19px;flex-shrink:0; display:grid;place-items:center; }
.cbtn:hover { background:var(--bg); } .cbtn:disabled{ opacity:.5; }
.msgfield { flex:1; padding:12px 16px; border-radius:22px; border:1px solid var(--line); background:var(--panel2); color:var(--ink); font-size:14.5px; outline:none; }
.msgfield:focus { border-color:var(--accent); }
.sendbtn { width:44px;height:44px;border-radius:50%;border:none;cursor:pointer;color:#fff;background:linear-gradient(135deg,var(--me1),var(--me2)); flex-shrink:0; font-size:18px; }
.sendbtn:disabled { opacity:.4; }
.emojipop { position:absolute; bottom:74px; left:14px; width:284px; background:var(--panel); border:1px solid var(--line); border-radius:14px; box-shadow:0 14px 34px rgba(0,0,0,.16); padding:8px; display:grid; grid-template-columns:repeat(8,1fr); gap:2px; max-height:190px; overflow-y:auto; z-index:20; }
.emojipop button { border:none;background:transparent;font-size:20px;cursor:pointer;padding:4px;border-radius:8px; }
.emojipop button:hover { background:var(--panel2); }
.uploading { position:absolute; top:0; left:0; right:0; text-align:center; font-size:12px; color:#fff; background:var(--accent); padding:5px; z-index:5; }
.welcome { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:var(--ink3); text-align:center; padding:24px; }
.welcome .ring { width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,var(--me1),var(--me2)); display:grid;place-items:center;color:#fff;font-size:30px; box-shadow:0 10px 26px rgba(109,94,252,.4); }
.back2 { display:none; } @media (max-width:760px){ .back2{ display:grid; } }
.list::-webkit-scrollbar,.thread::-webkit-scrollbar,.emojipop::-webkit-scrollbar{ width:8px; } .list::-webkit-scrollbar-thumb,.thread::-webkit-scrollbar-thumb{ background:#ddd; border-radius:8px; }
`;

const COLORS = ["#6d5efc", "#ff8a5b", "#28c084", "#ff6b9d", "#3ba7ff", "#f9c74f", "#a06cd5"];
const colorFor = (s) => COLORS[[...(s || "?")].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const initial = (s) => (s || "?").trim()[0]?.toUpperCase() || "?";
const fmt = (ts) => { const d = new Date(ts); let h = d.getHours(), m = d.getMinutes(); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${m < 10 ? "0" + m : m} ${ap}`; };
const EMOJIS = "😀 😂 🥹 😊 😍 😘 😎 🤩 🤔 😴 🥳 🤗 🙌 👏 🙏 👍 👎 🔥 ✨ 💯 ❤️ 🧡 💛 💚 💙 💜 🖤 💔 💕 🎉 🎁 🍕 🍔 ☕ 🌮 🚀 ⚽ 🎮 🎧 📸 😭 😅 🙂 😉 😇 🤣 😜 🤝 💪 🌈 ☀️ 🌙 😢 😡 🥲 👀 🙈 💀".split(" ");
const preview = (m) => m?.kind === "image" ? "📷 Photo" : m?.kind === "video" ? "🎥 Video" : (m?.body || "");
function beep() { try { const a = new (window.AudioContext || window.webkitAudioContext)(); const o = a.createOscillator(); const g = a.createGain(); o.connect(g); g.connect(a.destination); o.type = "sine"; o.frequency.value = 680; g.gain.value = 0.06; o.start(); o.stop(a.currentTime + 0.16); } catch (e) {} }

export default function App() {
  const [session, setSession] = useState(null);
  const [booting, setBooting] = useState(true);
  const [me, setMe] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [uname, setUname] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [chats, setChats] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [unread, setUnread] = useState({});
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const threadRef = useRef(null);
  const fileRef = useRef(null);
  const activeRef = useRef(null);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    if (!configured) { setBooting(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setBooting(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setMe(null); return; }
    setProfileLoading(true);
    (async () => {
      const { data } = await supabase.from("profiles").select("id,username").eq("id", session.user.id).maybeSingle();
      setMe(data || null); setProfileLoading(false);
    })();
  }, [session]);

  /* ask for notification permission once signed in */
  useEffect(() => {
    if (me && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, [me]);

  /* show unread total in the browser tab title */
  useEffect(() => {
    const total = Object.values(unread).reduce((a, b) => a + b, 0);
    document.title = total > 0 ? `(${total}) Talks` : "Talks";
  }, [unread]);

  const loadChats = useCallback(async () => {
    if (!me) return;
    const { data: msgs } = await supabase.from("messages").select("sender,recipient,body,kind,media_url,created_at")
      .or(`sender.eq.${me.id},recipient.eq.${me.id}`).order("created_at", { ascending: false });
    const last = {};
    (msgs || []).forEach(m => { const o = m.sender === me.id ? m.recipient : m.sender; if (!last[o]) last[o] = m; });
    const ids = Object.keys(last);
    if (ids.length === 0) { setChats([]); return; }
    const { data: profs } = await supabase.from("profiles").select("id,username").in("id", ids);
    const list = (profs || []).map(p => ({ ...p, last: last[p.id] }));
    list.sort((a, b) => new Date(b.last.created_at) - new Date(a.last.created_at));
    setChats(list);
  }, [me]);

  useEffect(() => { if (me) loadChats(); }, [me, loadChats]);

  useEffect(() => {
    if (!me) return;
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    let cancelled = false;
    const t = setTimeout(async () => {
      const { data } = await supabase.from("profiles").select("id,username").ilike("username", `%${q}%`).neq("id", me.id).limit(20);
      if (!cancelled) setResults(data || []);
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [query, me]);

  /* realtime + notifications */
  useEffect(() => {
    if (!me) return;
    const ch = supabase.channel("rt-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `recipient=eq.${me.id}` },
        async (payload) => {
          const m = payload.new;
          const open = activeRef.current;
          const inOpenChat = open && m.sender === open.id;
          if (inOpenChat) setMessages(cur => [...cur, m]);
          else setUnread(u => ({ ...u, [m.sender]: (u[m.sender] || 0) + 1 }));
          if (!inOpenChat || document.hidden) {
            beep();
            if ("Notification" in window && Notification.permission === "granted") {
              let name = "New message";
              const found = chats.find(c => c.id === m.sender);
              if (found) name = found.username;
              else { const { data } = await supabase.from("profiles").select("username").eq("id", m.sender).maybeSingle(); if (data) name = data.username; }
              try { new Notification(name, { body: preview(m), icon: "/icon-192.png", tag: "talks-" + m.sender }); } catch (e) {}
            }
          }
          loadChats();
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [me, loadChats, chats]);

  useEffect(() => {
    if (!me || !active) { setMessages([]); return; }
    (async () => {
      const { data } = await supabase.from("messages").select("*")
        .or(`and(sender.eq.${me.id},recipient.eq.${active.id}),and(sender.eq.${active.id},recipient.eq.${me.id})`)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    })();
    setUnread(u => { const n = { ...u }; delete n[active.id]; return n; });
  }, [me, active]);

  useEffect(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, [messages.length, active]);

  function openChat(p) { setActive(p); setQuery(""); setResults([]); setShowEmoji(false); }

  async function submitAuth() {
    setErr(""); setBusy(true);
    try {
      if (mode === "signup") {
        const clean = uname.trim().toLowerCase();
        if (!email.trim() || !pw) throw new Error("Please fill in email and password.");
        if (!/^[a-z0-9_]{3,20}$/.test(clean)) throw new Error("Username: 3-20 letters, numbers or _ only.");
        const taken = await supabase.from("profiles").select("id").eq("username", clean).maybeSingle();
        if (taken.data) throw new Error("That username is taken.");
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: pw });
        if (error) throw error;
        if (!data.session) { setErr("Account made! If email confirmation is on, confirm via email then sign in."); setMode("signin"); setBusy(false); return; }
        const { error: pe } = await supabase.from("profiles").insert({ id: data.user.id, username: clean });
        if (pe) throw pe;
      } else {
        if (!email.trim() || !pw) throw new Error("Please enter your email and password.");
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
        if (error) throw error;
      }
    } catch (e) {
      let msg = e.message || "Something went wrong.";
      if (/already registered/i.test(msg)) { msg = "This email already has an account — switch to Sign in below."; setMode("signin"); }
      setErr(msg);
    }
    setBusy(false);
  }

  async function setupUsername() {
    setErr("");
    const clean = uname.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(clean)) { setErr("Username: 3-20 letters, numbers or _ only."); return; }
    setBusy(true);
    try {
      const taken = await supabase.from("profiles").select("id").eq("username", clean).maybeSingle();
      if (taken.data) throw new Error("That username is taken.");
      const { data, error } = await supabase.from("profiles").insert({ id: session.user.id, username: clean }).select().single();
      if (error) throw error;
      setMe(data);
    } catch (e) { setErr(e.message || "Could not set username."); }
    setBusy(false);
  }

  async function send() {
    const body = text.trim();
    if (!body || !active || !me) return;
    setText(""); setShowEmoji(false);
    const optimistic = { id: "tmp-" + Date.now(), sender: me.id, recipient: active.id, body, kind: "text", media_url: null, created_at: new Date().toISOString() };
    setMessages(cur => [...cur, optimistic]);
    const { data, error } = await supabase.from("messages").insert({ sender: me.id, recipient: active.id, body, kind: "text" }).select().single();
    if (!error && data) setMessages(cur => cur.map(m => m.id === optimistic.id ? data : m));
    loadChats();
  }

  async function sendMedia(file) {
    if (!file || !active || !me) return;
    const kind = file.type.startsWith("video") ? "video" : "image";
    if (file.size > 50 * 1024 * 1024) { alert("Please pick a file under 50 MB."); return; }
    setUploading(true); setShowEmoji(false);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${me.id}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("chat-media").upload(path, file);
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("chat-media").getPublicUrl(path);
      const url = pub.publicUrl;
      const optimistic = { id: "tmp-" + Date.now(), sender: me.id, recipient: active.id, body: "", kind, media_url: url, created_at: new Date().toISOString() };
      setMessages(cur => [...cur, optimistic]);
      const { data, error } = await supabase.from("messages").insert({ sender: me.id, recipient: active.id, body: "", kind, media_url: url }).select().single();
      if (!error && data) setMessages(cur => cur.map(m => m.id === optimistic.id ? data : m));
      loadChats();
    } catch (e) { alert("Upload failed: " + (e.message || e) + "\n\nDid you run supabase-media.sql?"); }
    setUploading(false);
  }

  function onPickFile(e) { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (f) sendMedia(f); }
  function enableNotifs() { if ("Notification" in window) Notification.requestPermission().then(p => { if (p === "granted") beep(); }); }
  async function signOut() { await supabase.auth.signOut(); setMe(null); setChats([]); setActive(null); setMessages([]); setUnread({}); setQuery(""); }

  /* ---- render ---- */
  if (!configured) {
    return (<div className="tl"><div className="auth"><div className="card">
      <div className="logo display">T</div><h1>Almost there</h1>
      <p className="sub">Talks Live needs your Supabase keys.</p>
      <div className="note">Create a <b>.env</b> file with <b>VITE_SUPABASE_URL</b> and <b>VITE_SUPABASE_ANON_KEY</b>, then restart.</div>
    </div></div></div>);
  }
  if (booting) return <div className="tl"><style>{STYLE}</style><div className="welcome"><div className="ring display">T</div><div>Loading…</div></div></div>;

  if (!session) {
    return (
      <div className="tl"><style>{STYLE}</style>
        <div className="auth"><div className="card">
          <div className="logo display">T</div>
          <h1>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
          <p className="sub">{mode === "signup" ? "Pick a username your friends will see." : "Sign in to keep chatting."}</p>
          {err && <div className="err2">{err}</div>}
          {mode === "signup" && (<div className="field2"><label>Username</label>
            <input value={uname} onChange={e => setUname(e.target.value)} placeholder="e.g. jaikaran" autoCapitalize="none" /></div>)}
          <div className="field2"><label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" autoCapitalize="none" /></div>
          <div className="field2"><label>Password</label>
            <input value={pw} onChange={e => setPw(e.target.value)} placeholder="At least 6 characters" type="password" onKeyDown={e => e.key === "Enter" && submitAuth()} /></div>
          <button className="pbtn" disabled={busy} onClick={submitAuth}>{busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Sign in"}</button>
          <div className="swap">{mode === "signup" ? "Already have an account? " : "New here? "}
            <b onClick={() => { setErr(""); setMode(mode === "signup" ? "signin" : "signup"); }}>{mode === "signup" ? "Sign in" : "Create one"}</b></div>
        </div></div>
      </div>
    );
  }
  if (profileLoading) return <div className="tl"><style>{STYLE}</style><div className="welcome"><div className="ring display">T</div><div>Loading…</div></div></div>;
  if (!me) {
    return (
      <div className="tl"><style>{STYLE}</style>
        <div className="auth"><div className="card">
          <div className="logo display">T</div>
          <h1>Finish setting up</h1>
          <p className="sub">Your account is ready — just pick a username.</p>
          {err && <div className="err2">{err}</div>}
          <div className="field2"><label>Username</label>
            <input value={uname} onChange={e => setUname(e.target.value)} placeholder="e.g. jaikaran" autoCapitalize="none" onKeyDown={e => e.key === "Enter" && setupUsername()} /></div>
          <button className="pbtn" disabled={busy} onClick={setupUsername}>{busy ? "Please wait…" : "Save username"}</button>
          <div className="swap"><b onClick={signOut}>Sign out</b></div>
        </div></div>
      </div>
    );
  }

  const searching = query.trim().length > 0;

  return (
    <div className="tl" data-open={String(!!active)}>
      <style>{STYLE}</style>
      <div className="side">
        <div className="top">
          <div className="me">
            <div className="av" style={{ width: 40, height: 40, background: colorFor(me.username) }}>{initial(me.username)}</div>
            <div><b>{me.username}</b><small>Signed in</small></div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="icon" title="Enable notifications" onClick={enableNotifs}>🔔</button>
            <button className="icon" title="Sign out" onClick={signOut}>⎋</button>
          </div>
        </div>
        <div className="search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input value={query} placeholder="Search people by name" autoCapitalize="none" onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="seclabel">{searching ? "Search results" : "Chats"}</div>
        <div className="list">
          {searching ? (
            results.length === 0
              ? <div className="empty2">No one found matching “{query.trim()}”.</div>
              : results.map(p => (
                  <div key={p.id} className="crow" onClick={() => openChat(p)}>
                    <div className="av" style={{ background: colorFor(p.username) }}>{initial(p.username)}</div>
                    <div className="m"><b>{p.username}</b><span>Tap to start chatting</span></div>
                  </div>))
          ) : (
            chats.length === 0
              ? <div className="empty2">No chats yet.<br/>Search a friend's name above to start.</div>
              : chats.map(p => (
                  <div key={p.id} className={`crow ${active?.id === p.id ? "on" : ""}`} onClick={() => openChat(p)}>
                    <div className="av" style={{ background: colorFor(p.username) }}>{initial(p.username)}</div>
                    <div className="m"><b>{p.username}</b><span>{(p.last.sender === me.id ? "You: " : "") + preview(p.last)}</span></div>
                    {unread[p.id] > 0 && <div className="udot">{unread[p.id]}</div>}
                  </div>))
          )}
        </div>
      </div>

      {active ? (
        <div className="main">
          {uploading && <div className="uploading">Uploading…</div>}
          <div className="chead">
            <button className="icon back2" onClick={() => setActive(null)}>‹</button>
            <div className="av" style={{ width: 38, height: 38, background: colorFor(active.username) }}>{initial(active.username)}</div>
            <b>{active.username}</b>
          </div>
          <div className="thread" ref={threadRef}>
            {messages.map(m => (
              <div key={m.id} className={`b ${m.sender === me.id ? "me" : "them"} ${m.kind && m.kind !== "text" ? "media" : ""}`}>
                {m.kind === "image" ? <img className="media-img" src={m.media_url} alt="" onClick={() => window.open(m.media_url, "_blank")} />
                  : m.kind === "video" ? <video className="media-vid" src={m.media_url} controls />
                  : m.body}
                <time>{fmt(m.created_at)}</time>
              </div>
            ))}
            {messages.length === 0 && <div style={{ textAlign: "center", color: "var(--ink3)", fontSize: 13, marginTop: 20 }}>Say hi 👋 — messages are live.</div>}
          </div>

          {showEmoji && (
            <div className="emojipop">
              {EMOJIS.map(e => <button key={e} onClick={() => { setText(t => t + e); }}>{e}</button>)}
            </div>
          )}

          <div className="composer2">
            <button className="cbtn" title="Emoji" onClick={() => setShowEmoji(s => !s)}>😊</button>
            <button className="cbtn" title="Photo or video" disabled={uploading} onClick={() => fileRef.current?.click()}>📎</button>
            <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={onPickFile} />
            <input className="msgfield" value={text} placeholder="Write a message…" onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} onFocus={() => setShowEmoji(false)} />
            <button className="sendbtn" disabled={!text.trim()} onClick={send}>➤</button>
          </div>
        </div>
      ) : (
        <div className="main"><div className="welcome">
          <div className="ring display">T</div>
          <div><div className="display" style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Talks Live</div>
            <div style={{ maxWidth: 300 }}>Search a friend's name to start. Send text, emojis, photos and videos — all live.</div></div>
        </div></div>
      )}
    </div>
  );
}
