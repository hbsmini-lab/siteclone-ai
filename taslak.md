<!DOCTYPE html>
<html lang="tr" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BuildAI — Yapay Zeka ile Web Tasarımı</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet">
<style>
/* ═══════════════════════════════════════
   TEMA & DEĞIŞKENLER
═══════════════════════════════════════ */
:root {
  --bg:       #0a0a0a;
  --bg2:      #111111;
  --bg3:      #181818;
  --bg4:      #202020;
  --bg5:      #282828;
  --border:   #1e1e1e;
  --border2:  #2a2a2a;
  --text:     #f2f2f2;
  --text2:    #888;
  --text3:    #444;
  --accent:   #d4a843;
  --accent2:  #f0c060;
  --accent3:  #ffe799;
  --a10:      rgba(212,168,67,.10);
  --a18:      rgba(212,168,67,.18);
  --a30:      rgba(212,168,67,.30);
  --green:    #3ecf8e;
  --blue:     #4a9eff;
  --red:      #ff5555;
  --purple:   #a78bfa;
  --shadow:   0 20px 60px rgba(0,0,0,.6);
  --radius:   14px;
  --sidebar:  60px;
}
[data-theme="light"] {
  --bg:#f4f3ef; --bg2:#ffffff; --bg3:#eeede9; --bg4:#e5e4e0; --bg5:#d8d7d3;
  --border:#dddcda; --border2:#c8c7c4;
  --text:#0f0f0f; --text2:#666; --text3:#aaa;
  --accent:#b8942a; --accent2:#d4a843; --accent3:#f0c060;
  --a10:rgba(184,148,42,.10); --a18:rgba(184,148,42,.18); --a30:rgba(184,148,42,.28);
  --shadow:0 20px 60px rgba(0,0,0,.12);
}

/* ═══════════════════════════════════════
   RESET
═══════════════════════════════════════ */
*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100%;overflow:hidden;font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);}
*::-webkit-scrollbar{width:3px;height:3px;}
*::-webkit-scrollbar-track{background:transparent;}
*::-webkit-scrollbar-thumb{background:var(--border2);border-radius:20px;}
button,input,textarea,select{font-family:inherit;}
a{text-decoration:none;color:inherit;}

/* ═══════════════════════════════════════
   UYGULAMA KABUĞU
═══════════════════════════════════════ */
#app{display:flex;height:100vh;overflow:hidden;}

/* ═══════════════════════════════════════
   SOL NAVİGASYON
═══════════════════════════════════════ */
.sidebar{
  width:var(--sidebar);flex-shrink:0;
  background:var(--bg2);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;align-items:center;
  padding:14px 0 16px;gap:3px;
  z-index:300;transition:background .3s,border-color .3s;
}
.s-logo{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;
  margin-bottom:16px;cursor:pointer;flex-shrink:0;
  transition:transform .2s,box-shadow .2s;
  box-shadow:0 4px 16px var(--a30);
}
.s-logo:hover{transform:scale(1.06) rotate(-3deg);}
.s-logo svg{width:19px;height:19px;fill:#000;}
.s-icon{
  width:42px;height:42px;border-radius:10px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;cursor:pointer;color:var(--text3);transition:.18s;position:relative;
}
.s-icon:hover{background:var(--bg3);color:var(--text2);}
.s-icon.active{background:var(--a10);color:var(--accent);}
.s-icon svg{width:17px;height:17px;}
.s-icon .lbl{font-size:8px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;}
.s-divider{width:28px;height:1px;background:var(--border);margin:5px 0;}
.s-bottom{margin-top:auto;display:flex;flex-direction:column;align-items:center;gap:5px;}
.s-avatar{
  width:32px;height:32px;border-radius:50%;
  background:linear-gradient(135deg,var(--accent),#f0c060);
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;color:#000;cursor:pointer;
  border:2px solid transparent;transition:.2s;
}
.s-avatar:hover{border-color:var(--accent);}
.notif{position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:var(--red);border:2px solid var(--bg2);}
/* tooltip */
.s-icon[data-tip]{position:relative;}
.s-icon[data-tip]:hover::after{
  content:attr(data-tip);position:absolute;left:calc(100% + 10px);top:50%;transform:translateY(-50%);
  background:var(--bg4);color:var(--text);padding:5px 10px;border-radius:7px;font-size:11px;
  white-space:nowrap;border:1px solid var(--border);z-index:999;pointer-events:none;
  animation:fadeUp .15s ease;
}

/* ═══════════════════════════════════════
   İÇERİK ALANLARI
═══════════════════════════════════════ */
.view{position:absolute;inset:0;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity .25s;}
.view.visible{opacity:1;pointer-events:all;position:relative;flex:1;}

/* ═══════════════════════════════════════
   ████ ANASAYFA — PROMPT ████
═══════════════════════════════════════ */
#home{
  background:var(--bg);
  justify-content:center;align-items:center;
  overflow:hidden;position:relative;
}
/* Arka plan efekti */
.home-bg{
  position:absolute;inset:0;pointer-events:none;overflow:hidden;
}
.glow-orb{
  position:absolute;border-radius:50%;filter:blur(90px);opacity:.22;animation:orbFloat 8s ease-in-out infinite;
}
.orb1{width:500px;height:500px;background:var(--accent);top:-120px;left:-100px;animation-delay:0s;}
.orb2{width:400px;height:400px;background:#b06000;bottom:-80px;right:-60px;animation-delay:-3s;}
.orb3{width:300px;height:300px;background:var(--accent2);top:40%;left:55%;animation-delay:-5s;opacity:.12;}
@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(30px,-25px) scale(1.08);}}

/* Grid doku */
.home-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(var(--border) 1px,transparent 1px),
    linear-gradient(90deg,var(--border) 1px,transparent 1px);
  background-size:52px 52px;
  mask-image:radial-gradient(ellipse 80% 70% at 50% 50%,black 30%,transparent 100%);
  opacity:.5;
}

.home-center{
  position:relative;z-index:10;
  width:100%;max-width:780px;
  padding:0 24px;
  animation:homeIn .6s ease both;
}
@keyframes homeIn{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}

/* Üst etiket */
.home-badge{
  display:inline-flex;align-items:center;gap:7px;
  padding:5px 14px;border-radius:20px;
  border:1px solid var(--a30);background:var(--a10);
  font-size:11px;font-weight:600;color:var(--accent2);
  letter-spacing:.5px;text-transform:uppercase;
  margin-bottom:30px;
}
.home-badge span{width:6px;height:6px;border-radius:50%;background:var(--accent);display:inline-block;animation:pulse 1.8s ease infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}

/* Başlık */
.home-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(36px,5.5vw,62px);
  font-weight:800;line-height:1.08;
  letter-spacing:-1.5px;
  margin-bottom:18px;
}
.home-title .gold{color:var(--accent);}
.home-title .thin{font-weight:400;color:var(--text2);}

.home-sub{
  font-size:15px;color:var(--text2);line-height:1.7;
  max-width:520px;margin-bottom:40px;font-weight:300;
}

/* ANA PROMPT KUTUSU */
.prompt-box{
  background:var(--bg2);
  border:1px solid var(--border2);
  border-radius:20px;
  box-shadow:0 0 0 1px var(--a10), var(--shadow);
  overflow:hidden;
  transition:border-color .2s,box-shadow .2s;
}
.prompt-box:focus-within{
  border-color:var(--accent);
  box-shadow:0 0 0 3px var(--a10), var(--shadow);
}

.prompt-ta{
  width:100%;min-height:90px;max-height:180px;
  padding:22px 24px 14px;
  background:transparent;border:none;outline:none;resize:none;
  font-size:15px;color:var(--text);line-height:1.7;font-weight:400;
}
.prompt-ta::placeholder{color:var(--text3);}

/* Alt araç çubuğu */
.prompt-bar{
  display:flex;align-items:center;gap:8px;
  padding:10px 14px 14px;
  border-top:1px solid var(--border);
}
.pb-chip{
  display:flex;align-items:center;gap:5px;padding:6px 12px;
  border-radius:8px;border:1px solid var(--border);
  background:transparent;color:var(--text3);
  font-size:12px;cursor:pointer;transition:.15s;white-space:nowrap;
}
.pb-chip:hover{border-color:var(--accent);color:var(--accent);background:var(--a10);}
.pb-chip.on{border-color:var(--accent);color:var(--accent);background:var(--a10);}
.pb-chip svg{width:13px;height:13px;}
.pb-sep{width:1px;height:22px;background:var(--border);margin:0 2px;}
.pb-send{
  margin-left:auto;
  display:flex;align-items:center;gap:7px;
  padding:9px 22px;border-radius:10px;
  background:var(--accent);color:#000;border:none;
  font-size:13px;font-weight:700;cursor:pointer;
  transition:.2s;white-space:nowrap;flex-shrink:0;
}
.pb-send:hover{background:var(--accent2);transform:translateY(-1px);}
.pb-send svg{width:14px;height:14px;}

/* Mevcut modlar */
.mode-row{display:flex;gap:8px;margin-top:18px;flex-wrap:wrap;}
.mode-tag{
  display:flex;align-items:center;gap:6px;
  padding:7px 14px;border-radius:10px;
  border:1px solid var(--border);background:var(--bg2);
  font-size:12px;color:var(--text2);cursor:pointer;transition:.18s;
}
.mode-tag:hover,.mode-tag.on{
  border-color:var(--accent);background:var(--a10);color:var(--accent);
}
.mode-tag svg{width:13px;height:13px;}

/* Alt referans satırı */
.home-refs{
  display:flex;align-items:center;gap:20px;margin-top:36px;
  font-size:11px;color:var(--text3);flex-wrap:wrap;
}
.home-refs a{color:var(--text2);transition:.15s;}
.home-refs a:hover{color:var(--accent);}
.ref-dot{width:3px;height:3px;border-radius:50%;background:var(--border2);}

/* ═══════════════════════════════════════
   PAYLAŞILAN TOPBAR
═══════════════════════════════════════ */
.topbar{
  height:50px;flex-shrink:0;
  background:var(--bg2);border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 18px;gap:10px;
}
.tb-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;}
.tb-title span{color:var(--accent);}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:8px;}

/* ═══════════════════════════════════════
   BUTONLAR
═══════════════════════════════════════ */
.btn{padding:6px 14px;border-radius:9px;border:none;font-size:12.5px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:.18s;white-space:nowrap;}
.btn-primary{background:var(--accent);color:#000;font-weight:600;}
.btn-primary:hover{background:var(--accent2);transform:translateY(-1px);}
.btn-ghost{background:var(--bg3);color:var(--text2);border:1px solid var(--border);}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent);}
.btn-sm{padding:5px 11px;font-size:11.5px;}
.btn-icon{width:32px;height:32px;padding:0;justify-content:center;background:var(--bg3);color:var(--text2);border:1px solid var(--border);}
.btn-icon:hover{border-color:var(--accent);color:var(--accent);}
.btn-icon svg{width:14px;height:14px;}

/* ═══════════════════════════════════════
   ████ EDITOR ████
═══════════════════════════════════════ */
#editor{flex-direction:column;}

.editor-topbar{
  height:50px;flex-shrink:0;
  background:var(--bg2);border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 12px;gap:8px;
}
.proj-pill{
  display:flex;align-items:center;gap:6px;
  padding:5px 11px;background:var(--bg3);
  border:1px solid var(--border);border-radius:8px;
  font-size:12.5px;color:var(--text2);cursor:pointer;transition:.15s;
}
.proj-pill:hover{border-color:var(--accent);color:var(--text);}
.proj-pill svg{width:12px;height:12px;}
.dev-grp{display:flex;gap:2px;}
.dv{width:30px;height:30px;border-radius:7px;border:none;background:transparent;color:var(--text3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s;}
.dv:hover{background:var(--bg3);color:var(--text2);}
.dv.on{background:var(--a10);color:var(--accent);}
.dv svg{width:14px;height:14px;}

.editor-body{flex:1;display:flex;overflow:hidden;}

/* LEFT PANEL */
.e-panel{
  width:320px;flex-shrink:0;
  background:var(--bg2);border-right:1px solid var(--border);
  display:flex;flex-direction:column;overflow:hidden;
  transition:width .3s ease;
}
.e-panel.hide{width:0;}

/* Panel tab bar */
.ptabs{display:flex;border-bottom:1px solid var(--border);flex-shrink:0;}
.pt{
  flex:1;padding:10px 6px;font-size:10px;font-weight:600;letter-spacing:.5px;
  text-transform:uppercase;color:var(--text3);cursor:pointer;text-align:center;
  border-bottom:2px solid transparent;transition:.15s;
}
.pt:hover{color:var(--text2);}
.pt.on{color:var(--accent);border-bottom-color:var(--accent);}

/* Panel sections */
.psec{display:none;flex-direction:column;flex:1;overflow:hidden;animation:fadeUp .2s ease;}
.psec.on{display:flex;}

/* Chat */
.chat-scroll{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:9px;}
.msg{display:flex;gap:8px;align-items:flex-start;animation:fadeUp .2s ease;}
.msg.u{flex-direction:row-reverse;}
.bubble{
  padding:9px 12px;border-radius:12px;font-size:12.5px;line-height:1.6;
  max-width:calc(100% - 34px);
}
.bubble b{font-weight:600;}
.bubble code{background:var(--bg4);padding:1px 5px;border-radius:4px;font-size:11px;color:var(--accent);font-family:monospace;}
.msg .bubble{background:var(--bg3);border:1px solid var(--border);}
.msg.u .bubble{background:var(--a10);border:1px solid var(--a18);}
.av{width:28px;height:28px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;}
.av.ai{background:var(--accent);color:#000;}
.av.u{background:var(--bg4);color:var(--text2);}

/* Typing indicator */
.typing-ind{display:flex;gap:4px;align-items:center;padding:4px 2px;}
.typing-ind span{width:5px;height:5px;border-radius:50%;background:var(--text3);animation:tdot .9s infinite;}
.typing-ind span:nth-child(2){animation-delay:.15s;}
.typing-ind span:nth-child(3){animation-delay:.3s;}
@keyframes tdot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}

/* Quick suggestions */
.suggestions{padding:10px 14px 6px;display:flex;flex-direction:column;gap:4px;flex-shrink:0;}
.sug-title{font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:4px;}
.sug{padding:7px 10px;border-radius:8px;border:1px solid var(--border);font-size:11.5px;color:var(--text2);cursor:pointer;transition:.12s;}
.sug:hover{border-color:var(--accent);color:var(--text);background:var(--a10);}

/* Chat input */
.chat-inp-wrap{padding:10px 12px;border-top:1px solid var(--border);flex-shrink:0;}
.chat-box{background:var(--bg3);border:1px solid var(--border);border-radius:11px;overflow:hidden;transition:.2s;}
.chat-box:focus-within{border-color:var(--accent);}
.chat-ta{width:100%;padding:9px 11px;background:transparent;border:none;outline:none;resize:none;font-size:12.5px;color:var(--text);min-height:50px;max-height:100px;}
.chat-ta::placeholder{color:var(--text3);}
.chat-btns{display:flex;align-items:center;gap:5px;padding:5px 9px 7px;}
.ci-btn{width:26px;height:26px;border-radius:5px;border:none;background:transparent;color:var(--text3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.12s;}
.ci-btn:hover{background:var(--bg4);color:var(--text2);}
.ci-btn svg{width:13px;height:13px;}
.send-b{margin-left:auto;padding:5px 13px;background:var(--accent);color:#000;border:none;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;transition:.2s;}
.send-b:hover{background:var(--accent2);}
.send-b:disabled{opacity:.4;cursor:not-allowed;}
.stop-b{margin-left:auto;padding:5px 13px;background:var(--bg4);color:var(--text2);border:1px solid var(--border2);border-radius:7px;font-size:11.5px;font-weight:600;cursor:pointer;display:none;align-items:center;gap:4px;transition:.15s;}
.stop-b.show{display:flex;}
.stop-b:hover{color:var(--red);border-color:var(--red);}

/* Clone panel */
.clone-area{flex:1;overflow-y:auto;padding:14px;}
.clone-area h4{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;margin-bottom:10px;}
.url-row{display:flex;gap:6px;margin-bottom:8px;}
.url-i{flex:1;padding:9px 11px;background:var(--bg3);border:1px solid var(--border);border-radius:9px;color:var(--text);font-size:12px;outline:none;transition:.2s;}
.url-i::placeholder{color:var(--text3);}
.url-i:focus{border-color:var(--accent);}
.clone-go{padding:9px 14px;background:var(--accent);color:#000;border:none;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:.15s;display:flex;align-items:center;gap:5px;}
.clone-go:hover{background:var(--accent2);}
.clone-go:disabled{opacity:.5;cursor:not-allowed;}

/* Progress */
.prog-box{background:var(--bg3);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:10px;display:none;}
.prog-box.show{display:block;}
.prog-head{padding:9px 12px;display:flex;align-items:center;gap:7px;border-bottom:1px solid var(--border);}
.prog-track{height:2px;background:var(--bg4);}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));width:0%;transition:width .5s ease;}
.prog-steps{padding:9px 12px;display:flex;flex-direction:column;gap:5px;}
.ps{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--text3);}
.ps.done{color:var(--green);}
.ps.cur{color:var(--accent);}
.ps-d{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;}

.api-box{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px;margin-top:10px;}
.api-box label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);display:block;margin-bottom:6px;}
.api-i{width:100%;padding:7px 10px;background:var(--bg4);border:1px solid var(--border);border-radius:7px;color:var(--text);font-size:11.5px;outline:none;transition:.2s;}
.api-i:focus{border-color:var(--accent);}

/* Quick templates */
.tmpl-list{margin-top:14px;}
.tmpl-title{font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:8px;}
.tmpl{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:9px;border:1px solid var(--border);background:transparent;font-size:12px;color:var(--text2);cursor:pointer;transition:.15s;margin-bottom:4px;}
.tmpl:hover{border-color:var(--accent);color:var(--text);background:var(--a10);}
.tmpl-ico{width:28px;height:28px;border-radius:7px;background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
.tmpl-tag{margin-left:auto;padding:2px 6px;border-radius:4px;font-size:9px;background:var(--bg4);color:var(--text3);}

/* Layers */
.layers-area{flex:1;overflow-y:auto;padding:10px;}
.lay{display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:8px;font-size:12px;color:var(--text2);cursor:pointer;border:1px solid transparent;transition:.12s;}
.lay:hover{background:var(--bg3);border-color:var(--border);}
.lay.sel{background:var(--a10);border-color:var(--a18);color:var(--accent);}
.lay svg{width:13px;height:13px;flex-shrink:0;}
.l1{margin-left:16px;}
.l2{margin-left:32px;}
.lay-tag{margin-left:auto;padding:1px 5px;border-radius:3px;font-size:9.5px;background:var(--bg4);color:var(--text3);}

/* Modified files */
.mod-files{margin:8px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:9px 11px;display:none;}
.mod-files.show{display:block;}
.mf-h{font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:7px;}
.mf-chips{display:flex;flex-wrap:wrap;gap:4px;}
.mf-c{padding:2px 7px;background:var(--a10);border:1px solid var(--a18);border-radius:4px;font-size:10.5px;color:var(--accent);cursor:pointer;}

/* Version */
.ver-bar{padding:8px 14px;border-top:1px solid var(--border);display:none;align-items:center;gap:6px;flex-shrink:0;}
.ver-bar.show{display:flex;}
.vbadge{padding:3px 9px;border-radius:5px;font-size:10.5px;font-weight:700;background:var(--a10);border:1px solid var(--accent);color:var(--accent);}
.vthumbs{display:flex;gap:3px;}
.vt{width:24px;height:24px;border-radius:5px;border:1px solid var(--border);background:transparent;color:var(--text3);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:.1s;}
.vt:hover{border-color:var(--accent);}

/* ═══════════════════════════════════════
   PREVIEW
═══════════════════════════════════════ */
.preview{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;}
.prev-bar{
  height:38px;background:var(--bg2);border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 10px;gap:7px;flex-shrink:0;
}
.url-pill{
  flex:1;padding:5px 10px;background:var(--bg3);border:1px solid var(--border);
  border-radius:7px;font-size:11.5px;color:var(--text2);
  display:flex;align-items:center;gap:6px;
}
.url-pill svg{width:12px;height:12px;color:var(--green);flex-shrink:0;}
.frame-zone{flex:1;display:flex;justify-content:center;overflow:auto;background:var(--bg);}
.frame-zone.desktop iframe{width:100%;height:100%;border:none;}
.frame-zone.tablet iframe{width:768px;height:calc(100% - 28px);margin:14px auto;border-radius:10px;border:2px solid var(--border2);box-shadow:var(--shadow);}
.frame-zone.mobile iframe{width:390px;height:calc(100% - 28px);margin:14px auto;border-radius:20px;border:5px solid var(--border2);box-shadow:var(--shadow);}
iframe{background:#fff;display:block;}

/* Loading overlay */
.prev-load{position:absolute;inset:0;background:var(--bg);z-index:5;display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;}
.prev-load.show{display:flex;}
.load-icon{width:52px;height:52px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:14px;display:flex;align-items:center;justify-content:center;}
.load-icon svg{width:26px;height:26px;fill:#000;}
.load-t{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--text2);}
.dots span{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--accent);margin:0 2.5px;animation:ddot .8s infinite;}
.dots span:nth-child(2){animation-delay:.13s;}
.dots span:nth-child(3){animation-delay:.26s;}
@keyframes ddot{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}

/* Empty state */
.prev-empty{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  color:var(--text3);gap:12px;padding:40px;text-align:center;
}
.prev-empty svg{width:64px;height:64px;opacity:.15;}
.prev-empty h3{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;color:var(--text2);}
.prev-empty p{font-size:13px;max-width:260px;line-height:1.6;}

/* ═══════════════════════════════════════
   INSPECTOR
═══════════════════════════════════════ */
.insp{
  width:0;flex-shrink:0;background:var(--bg2);border-left:1px solid var(--border);
  overflow:hidden;display:flex;flex-direction:column;transition:width .3s ease;
}
.insp.open{width:240px;}
.insp-h{padding:11px 14px;border-bottom:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:space-between;}
.insp-title{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;}
.insp-body{flex:1;overflow-y:auto;padding:12px 14px;}
.pg{margin-bottom:14px;}
.pg-title{font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--border);}
.pr{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;}
.pl{font-size:11.5px;color:var(--text2);}
.pi{padding:4px 8px;background:var(--bg3);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:11px;font-family:inherit;outline:none;width:88px;transition:.15s;}
.pi:focus{border-color:var(--accent);}
.csw{width:22px;height:22px;border-radius:5px;cursor:pointer;border:2px solid var(--border);outline:none;}

/* ═══════════════════════════════════════
   ████ DASHBOARD ████
═══════════════════════════════════════ */
#dashboard{flex-direction:column;}
.dash-scroll{flex:1;overflow-y:auto;padding:22px;}

.ph{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px;}
.ph-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;}
.ph-title span{color:var(--accent);}
.ph-sub{font-size:12px;color:var(--text3);margin-top:3px;}

/* Stats */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;}
.stat{
  background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);
  padding:16px;cursor:pointer;transition:.18s;position:relative;overflow:hidden;
}
.stat::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--accent);transform:scaleX(0);transition:.2s;transform-origin:left;}
.stat:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.25);}
.stat:hover::after{transform:scaleX(1);}
.stat-lbl{font-size:10.5px;color:var(--text3);font-weight:600;letter-spacing:.4px;text-transform:uppercase;margin-bottom:8px;}
.stat-val{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;}
.stat-change{font-size:11px;color:var(--green);margin-top:3px;}
.stat-change.dn{color:var(--red);}

/* 2-col layout */
.two{display:grid;grid-template-columns:1fr 330px;gap:14px;margin-bottom:16px;}
.rstack{display:flex;flex-direction:column;gap:12px;}

/* Card */
.card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.card-h{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.card-t{font-family:'Syne',sans-serif;font-size:12.5px;font-weight:700;}

/* Table */
.tbl{width:100%;border-collapse:collapse;}
.tbl th{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;color:var(--text3);padding:8px 16px;text-align:left;border-bottom:1px solid var(--border);}
.tbl td{padding:10px 16px;font-size:12.5px;border-bottom:1px solid var(--border);}
.tbl tr:last-child td{border-bottom:none;}
.tbl tbody tr{cursor:pointer;transition:.12s;}
.tbl tbody tr:hover{background:var(--bg3);}
.pname{font-weight:500;}
.purl{font-size:10.5px;color:var(--text3);margin-top:1px;}

.badge{padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;display:inline-flex;align-items:center;gap:3px;}
.bg{background:rgba(62,207,142,.1);color:var(--green);}
.by{background:rgba(212,168,67,.1);color:var(--accent);}
.br{background:rgba(255,85,85,.1);color:var(--red);}
.bb{background:rgba(74,158,255,.1);color:var(--blue);}
.bdot{width:5px;height:5px;border-radius:50%;background:currentColor;}

/* Jobs */
.job-item{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;transition:.12s;cursor:pointer;}
.job-item:last-child{border-bottom:none;}
.job-item:hover{background:var(--bg3);}
.job-ico{width:32px;height:32px;border-radius:8px;background:var(--a10);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0;}
.job-ico svg{width:15px;height:15px;}
.job-info{flex:1;min-width:0;}
.job-name{font-size:12.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.job-sub{font-size:10.5px;color:var(--text3);margin-top:2px;}
.pbar{height:3px;background:var(--bg4);border-radius:10px;overflow:hidden;margin-top:4px;}
.pbar-fill{height:100%;border-radius:10px;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width 1s ease;}

/* Activity */
.act{padding:9px 16px;border-bottom:1px solid var(--border);display:flex;gap:9px;align-items:flex-start;}
.act:last-child{border-bottom:none;}
.act-d{width:7px;height:7px;border-radius:50%;background:var(--accent);margin-top:4px;flex-shrink:0;}
.act-txt{font-size:12px;color:var(--text2);line-height:1.5;}
.act-txt strong{color:var(--text);font-weight:500;}
.act-time{font-size:10.5px;color:var(--text3);margin-top:1px;}

/* Chart */
.chart{height:150px;background:var(--bg3);border-radius:10px;display:flex;align-items:flex-end;padding:12px;gap:5px;overflow:hidden;}
.cbar{flex:1;border-radius:4px 4px 0 0;background:var(--accent);opacity:.65;transform-origin:bottom;animation:barUp .7s ease both;}
.cbar:hover{opacity:1;cursor:pointer;}
@keyframes barUp{from{transform:scaleY(0)}to{transform:scaleY(1)}}

/* ═══════════════════════════════════════
   ████ ANALYTICS ████
═══════════════════════════════════════ */
#analytics{flex-direction:column;}

/* ═══════════════════════════════════════
   ████ AI JOBS ████
═══════════════════════════════════════ */
#aijobs{flex-direction:column;}

/* ═══════════════════════════════════════
   ████ SETTINGS ████
═══════════════════════════════════════ */
#settings{flex-direction:column;}
.two-col-settings{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.ss{margin-bottom:18px;}
.ss-title{font-family:'Syne',sans-serif;font-size:12.5px;font-weight:700;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border);}
.sr{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);}
.sr:last-child{border-bottom:none;}
.sl{font-size:13px;font-weight:500;}
.sd{font-size:11px;color:var(--text3);margin-top:1px;}
.si{padding:7px 10px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:inherit;font-size:12.5px;outline:none;width:190px;transition:.18s;}
.si:focus{border-color:var(--accent);}
.tog{width:40px;height:21px;background:var(--bg5);border-radius:11px;position:relative;cursor:pointer;border:none;transition:.2s;flex-shrink:0;}
.tog.on{background:var(--accent);}
.tog::after{content:'';position:absolute;width:15px;height:15px;background:#fff;border-radius:50%;top:3px;left:3px;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.tog.on::after{left:22px;}

/* ═══════════════════════════════════════
   MODAL
═══════════════════════════════════════ */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000;display:none;align-items:center;justify-content:center;backdrop-filter:blur(8px);}
.modal-bg.open{display:flex;animation:fadeIn .2s ease;}
.modal{background:var(--bg2);border:1px solid var(--border2);border-radius:18px;padding:26px;width:440px;max-width:90vw;box-shadow:0 24px 80px rgba(0,0,0,.6);}
.modal h3{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;margin-bottom:3px;}
.modal p{font-size:11.5px;color:var(--text3);margin-bottom:18px;}
.fg{margin-bottom:12px;}
.flabel{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text2);display:block;margin-bottom:5px;}
.finput{width:100%;padding:9px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:9px;color:var(--text);font-family:inherit;font-size:13px;outline:none;transition:.18s;}
.finput:focus{border-color:var(--accent);}
.fta{resize:vertical;min-height:68px;}
.modal-acts{display:flex;gap:8px;justify-content:flex-end;margin-top:18px;}

/* CTX MENU */
.ctx{position:fixed;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:5px;z-index:2000;min-width:160px;box-shadow:var(--shadow);display:none;}
.ctx.show{display:block;animation:ctxPop .12s ease;}
@keyframes ctxPop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
.ctx-i{padding:7px 10px;border-radius:7px;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:7px;color:var(--text2);transition:.1s;}
.ctx-i:hover{background:var(--bg3);color:var(--text);}
.ctx-i.danger:hover{background:rgba(255,85,85,.1);color:var(--red);}
.ctx-i svg{width:13px;height:13px;}
.ctx-div{height:1px;background:var(--border);margin:4px 0;}

/* TOAST */
.toast{
  position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(70px);
  background:var(--bg3);border:1px solid var(--border2);border-radius:10px;
  padding:9px 16px;font-size:12.5px;color:var(--text);box-shadow:var(--shadow);
  z-index:9999;transition:transform .25s cubic-bezier(.34,1.4,.64,1);
  display:flex;align-items:center;gap:8px;white-space:nowrap;
}
.toast.show{transform:translateX(-50%) translateY(0);}
.toast-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0;}

/* ANIM */
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{display:inline-block;animation:spin .8s linear infinite;}

/* RESPONSIVE */
@media(max-width:1100px){.two{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.two-col-settings{grid-template-columns:1fr}}
</style>
</head>
<body>
<div id="app">

<!-- ════════════════════════════════════
     SOL NAVİGASYON
════════════════════════════════════ -->
<nav class="sidebar">
  <div class="s-logo" onclick="goHome()">
    <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  </div>

  <div class="s-icon" id="nav-home" data-tip="Ana Sayfa" onclick="showView('home')">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    <span class="lbl">Ana</span>
  </div>
  <div class="s-icon" id="nav-dashboard" data-tip="Gösterge Paneli" onclick="showView('dashboard')">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    <span class="lbl">Panel</span>
  </div>
  <div class="s-icon" id="nav-editor" data-tip="Site Editörü" onclick="showView('editor')">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
    <span class="lbl">Editör</span>
  </div>
  <div class="s-icon" id="nav-analytics" data-tip="Analitik" onclick="showView('analytics')">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    <span class="lbl">Analiz</span>
  </div>
  <div class="s-icon" id="nav-aijobs" data-tip="AI İşler" onclick="showView('aijobs')" style="position:relative">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12"/></svg>
    <span class="lbl">AI İş</span>
    <div class="notif"></div>
  </div>

  <div class="s-divider"></div>

  <div class="s-icon" id="nav-email" data-tip="E-posta" onclick="showView('email')">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    <span class="lbl">Posta</span>
  </div>
  <div class="s-icon" id="nav-settings" data-tip="Ayarlar" onclick="showView('settings')">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    <span class="lbl">Ayar</span>
  </div>

  <div class="s-bottom">
    <button class="btn btn-icon" onclick="toggleTheme()" title="Tema" style="width:34px;height:34px;border-radius:9px;">
      <svg id="theme-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15" height="15"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
    <div class="s-avatar">M</div>
  </div>
</nav>

<!-- ════════════════════════════════════
     ANA SAYFA — PROMPT EKRANI
════════════════════════════════════ -->
<div class="view visible" id="home">
  <div class="home-bg">
    <div class="home-grid"></div>
    <div class="glow-orb orb1"></div>
    <div class="glow-orb orb2"></div>
    <div class="glow-orb orb3"></div>
  </div>

  <div class="home-center">
    <div class="home-badge">
      <span></span>
      AI Destekli Site Üretici
    </div>

    <h1 class="home-title">
      Web sitenizi<br>
      <span class="gold">saniyeler</span> içinde <span class="thin">yaratın</span>
    </h1>

    <p class="home-sub">
      Fikrinizi yazın ya da bir URL yapıştırın. AI anında profesyonel,
      yayına hazır bir site oluştursun.
    </p>

    <!-- ANA PROMPT KUTUSU -->
    <div class="prompt-box" id="main-prompt-box">
      <textarea class="prompt-ta" id="main-prompt" rows="3"
        placeholder="Sitenizi tanımlayın... (ör: 'shiba inu köpek sahipleri için sıcak bir topluluk sitesi') veya bir URL yapıştırın"></textarea>
      <div class="prompt-bar">
        <!-- Sol chip'ler -->
        <button class="pb-chip" onclick="setPMode('idea',this)" id="pchip-idea">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Fikir
        </button>
        <button class="pb-chip on" onclick="setPMode('clone',this)" id="pchip-clone">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Klonla
        </button>
        <button class="pb-chip" onclick="setPMode('redesign',this)" id="pchip-redesign">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Redesign
        </button>
        <button class="pb-chip" onclick="setPMode('local',this)" id="pchip-local">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          İşletme
        </button>

        <div class="pb-sep"></div>

        <!-- Enhance -->
        <button class="pb-chip" onclick="enhancePrompt()" title="Prompt'u AI ile geliştir">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Geliştir
        </button>

        <!-- Gönder -->
        <button class="pb-send" onclick="handleMainPrompt()">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3"/></svg>
          Oluştur
        </button>
      </div>
    </div>

    <!-- Popüler başlangıçlar -->
    <div class="mode-row">
      <div class="mode-tag" onclick="quickStart('https://stripe.com')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        Stripe
      </div>
      <div class="mode-tag" onclick="quickStart('https://linear.app')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Linear
      </div>
      <div class="mode-tag" onclick="quickStart('https://vercel.com')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><polygon points="12 2 22 20 2 20"/></svg>
        Vercel
      </div>
      <div class="mode-tag" onclick="quickStart('https://notion.so')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><path d="M3 7h18M3 12h18M3 17h12"/></svg>
        Notion
      </div>
      <div class="mode-tag" onclick="quickStart('https://shopify.com')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>
        Shopify
      </div>
      <div class="mode-tag" onclick="openModal()">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Yeni Proje
      </div>
    </div>

    <div class="home-refs">
      <span>24 aktif proje</span>
      <div class="ref-dot"></div>
      <span>18.4K aylık ziyaretçi</span>
      <div class="ref-dot"></div>
      <a onclick="showView('dashboard')">Gösterge Paneli</a>
      <div class="ref-dot"></div>
      <a onclick="showView('aijobs')">AI İşler <span class="badge bb" style="font-size:9px">3 aktif</span></a>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════
     EDİTÖR
════════════════════════════════════ -->
<div class="view" id="editor">

  <!-- Editör Topbar -->
  <div class="editor-topbar">
    <button class="btn btn-ghost btn-sm" onclick="showView('home')" style="gap:5px;padding:5px 10px;">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <div class="proj-pill" id="proj-pill">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18"/></svg>
      <span id="proj-name">Yeni Proje</span>
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="11" height="11"><polyline points="6 9 12 15 18 9"/></svg>
    </div>

    <button class="btn btn-icon" onclick="undo()" title="Geri Al">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
    </button>
    <button class="btn btn-icon" onclick="redo()" title="Yinele">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 0 4-4h12"/></svg>
    </button>

    <div class="dev-grp">
      <button class="dv on" id="dv-d" onclick="setDev('d')" title="Masaüstü"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></button>
      <button class="dv" id="dv-t" onclick="setDev('t')" title="Tablet"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></button>
      <button class="dv" id="dv-m" onclick="setDev('m')" title="Mobil"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></button>
    </div>

    <div style="margin-left:auto;display:flex;gap:7px;align-items:center;">
      <button class="btn btn-ghost btn-sm" onclick="togglePanel()" title="Paneli Gizle/Göster">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
        Panel
      </button>
      <button class="btn btn-ghost btn-sm" onclick="toggleInsp()">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><circle cx="12" cy="12" r="3"/></svg>
        Özellikler
      </button>
      <button class="btn btn-ghost btn-sm" onclick="openFullPreview()">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3"/></svg>
        Tam Ekran
      </button>
      <button class="btn btn-primary btn-sm" onclick="publishSite()">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><polyline points="5 15 12 22 19 15"/><polyline points="5 9 12 2 19 9"/></svg>
        Yayınla
      </button>
    </div>
  </div>

  <!-- Editör Gövdesi -->
  <div class="editor-body">

    <!-- Sol Panel -->
    <div class="e-panel" id="e-panel">
      <div class="ptabs">
        <div class="pt on" id="pt-chat" onclick="switchPTab('chat')">AI Sohbet</div>
        <div class="pt" id="pt-clone" onclick="switchPTab('clone')">Klonla</div>
        <div class="pt" id="pt-layers" onclick="switchPTab('layers')">Katmanlar</div>
        <div class="pt" id="pt-assets" onclick="switchPTab('assets')">Varlıklar</div>
      </div>

      <!-- CHAT -->
      <div class="psec on" id="pp-chat">
        <div class="suggestions" id="sugg-area">
          <div class="sug-title">Öneriler</div>
          <div class="sug" onclick="useSug(this)">🎨 Renk paletini modernize et</div>
          <div class="sug" onclick="useSug(this)">📱 Mobil görünümü düzelt</div>
          <div class="sug" onclick="useSug(this)">✍️ Hero başlığını güçlendir</div>
        </div>
        <div class="chat-scroll" id="chat-area">
          <div class="msg">
            <div class="av ai">AI</div>
            <div class="bubble">Merhaba! 👋 Site editörüne hoş geldiniz. Değişiklik yapmak, yeni bölüm eklemek veya tasarım önerisi almak için yazın.</div>
          </div>
        </div>
        <div class="mod-files" id="mod-files">
          <div class="mf-h">📁 Değiştirilen Dosyalar</div>
          <div class="mf-chips" id="mf-ch"></div>
        </div>
        <div class="ver-bar" id="ver-bar">
          <span class="vbadge">v1.0</span>
          <div class="vthumbs">
            <button class="vt" onclick="toast('👍')">👍</button>
            <button class="vt" onclick="toast('👎')">👎</button>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="publishSite()">Yayınla</button>
        </div>
        <div class="chat-inp-wrap">
          <div class="chat-box">
            <textarea class="chat-ta" id="chat-inp" placeholder="Değişiklik isteyin... (ör: 'CTA butonunu daha büyük yap')" onkeydown="chatKey(event)" rows="2"></textarea>
            <div class="chat-btns">
              <button class="ci-btn" title="Dosya ekle"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
              <button class="ci-btn" onclick="enhanceChatPrompt()" title="Geliştir"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
              <button class="ci-btn" onclick="clearChat()" title="Sohbeti Temizle"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
              <button class="stop-b" id="stop-btn" onclick="stopGen()">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="11" height="11"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                Durdur
              </button>
              <button class="send-b" id="send-btn" onclick="sendChat()">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="12" height="12"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Gönder
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CLONE -->
      <div class="psec" id="pp-clone">
        <div class="clone-area">
          <h4>🌐 Web Sitesi Klonla</h4>
          <p style="font-size:11.5px;color:var(--text3);margin-bottom:10px;line-height:1.5;">URL girin, AI yeniden oluşturacak</p>
          <div class="url-row">
            <input class="url-i" id="clone-url" placeholder="https://stripe.com" onkeydown="if(e.key==='Enter')startClone()"/>
            <button class="clone-go" id="clone-btn" onclick="startClone()">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="12" height="12"><circle cx="12" cy="12" r="3"/></svg>
              Klonla
            </button>
          </div>

          <!-- Progress -->
          <div class="prog-box" id="prog-box">
            <div class="prog-head">
              <span class="spin" style="font-size:12px">⚙</span>
              <span style="font-size:12px;font-weight:600;">AI Analiz Ediyor</span>
              <span id="prog-pct" style="margin-left:auto;font-size:11.5px;font-weight:700;color:var(--accent)">0%</span>
            </div>
            <div class="prog-track"><div class="prog-fill" id="prog-fill"></div></div>
            <div class="prog-steps">
              <div class="ps" id="ps1"><div class="ps-d"></div>Site yapısı analiz ediliyor</div>
              <div class="ps" id="ps2"><div class="ps-d"></div>Renk paleti çıkarılıyor</div>
              <div class="ps" id="ps3"><div class="ps-d"></div>Tipografi belirleniyor</div>
              <div class="ps" id="ps4"><div class="ps-d"></div>Bileşenler oluşturuluyor</div>
              <div class="ps" id="ps5"><div class="ps-d"></div>HTML/CSS yazılıyor</div>
              <div class="ps" id="ps6"><div class="ps-d"></div>Önizleme hazırlanıyor</div>
            </div>
          </div>

          <!-- Templates -->
          <div class="tmpl-list">
            <div class="tmpl-title">Popüler Şablonlar</div>
            <div class="tmpl" onclick="quickClone('https://stripe.com')"><div class="tmpl-ico">💳</div>Stripe — Ödeme<div class="tmpl-tag">Fintech</div></div>
            <div class="tmpl" onclick="quickClone('https://linear.app')"><div class="tmpl-ico">📊</div>Linear — SaaS<div class="tmpl-tag">SaaS</div></div>
            <div class="tmpl" onclick="quickClone('https://vercel.com')"><div class="tmpl-ico">▲</div>Vercel — Deploy<div class="tmpl-tag">Dev</div></div>
            <div class="tmpl" onclick="quickClone('https://notion.so')"><div class="tmpl-ico">📄</div>Notion — Wiki<div class="tmpl-tag">Productivity</div></div>
            <div class="tmpl" onclick="quickClone('https://shopify.com')"><div class="tmpl-ico">🛍</div>Shopify — Mağaza<div class="tmpl-tag">Store</div></div>
          </div>

          <div class="api-box">
            <label>🔑 Anthropic API Anahtarı</label>
            <p style="font-size:11px;color:var(--text3);line-height:1.5;margin-bottom:7px;">Gerçek AI klonlama için anahtarınızı girin. Anahtarsız demo moda geçilir.</p>
            <input class="api-i" type="password" id="api-key" placeholder="sk-ant-api03-..."/>
          </div>
        </div>
      </div>

      <!-- LAYERS -->
      <div class="psec" id="pp-layers">
        <div class="layers-area">
          <div style="font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:9px;">Sayfa Yapısı</div>
          <div class="lay" onclick="selLay(this,'body')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>body</div>
          <div class="lay l1" onclick="selLay(this,'header')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16"/></svg>header<span class="lay-tag">Nav</span></div>
          <div class="lay l1" onclick="selLay(this,'section.hero')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>section.hero</div>
          <div class="lay l2" onclick="selLay(this,'h1.headline')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h8"/></svg>h1.headline</div>
          <div class="lay l2" onclick="selLay(this,'p.subtitle')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h12"/></svg>p.subtitle</div>
          <div class="lay l2" onclick="selLay(this,'.hero-cta')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="2"/></svg>.hero-cta</div>
          <div class="lay l1" onclick="selLay(this,'section.features')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="1" width="9" height="9" rx="1"/><rect x="14" y="1" width="9" height="9" rx="1"/></svg>section.features</div>
          <div class="lay l2" onclick="selLay(this,'.feature-card')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>.feature-card ×3</div>
          <div class="lay l1" onclick="selLay(this,'section.pricing')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5"/></svg>section.pricing</div>
          <div class="lay l1" onclick="selLay(this,'section.testimonials')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>section.testimonials</div>
          <div class="lay l1" onclick="selLay(this,'footer')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 18h16M4 14h10"/></svg>footer</div>
        </div>
      </div>

      <!-- ASSETS -->
      <div class="psec" id="pp-assets">
        <div style="flex:1;overflow-y:auto;padding:14px;">
          <div style="font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:10px;">Varlıklar</div>
          <div style="background:var(--bg3);border:2px dashed var(--border);border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:.15s;margin-bottom:12px;" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
            <div style="font-size:22px;margin-bottom:6px;">📁</div>
            <div style="font-size:12px;color:var(--text2);margin-bottom:3px;">Dosya Yükle</div>
            <div style="font-size:10.5px;color:var(--text3);">PNG, SVG, JPG, GIF</div>
          </div>
          <div style="font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:7px;">Son Yüklenenler</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;">
            <div style="aspect-ratio:1;background:var(--bg3);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;transition:.15s;" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">🌟</div>
            <div style="aspect-ratio:1;background:var(--bg3);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;transition:.15s;" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">🎨</div>
            <div style="aspect-ratio:1;background:var(--bg3);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;transition:.15s;" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">📸</div>
            <div style="aspect-ratio:1;background:var(--bg3);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;transition:.15s;" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">🖼</div>
          </div>

          <div style="font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin:14px 0 8px;">AI Görsel Üret</div>
          <input class="url-i" placeholder="Görsel açıklayın..." style="margin-bottom:6px;"/>
          <button class="btn btn-primary" style="width:100%;justify-content:center;">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><circle cx="12" cy="12" r="3"/></svg>
            Görsel Oluştur
          </button>
        </div>
      </div>

    </div><!-- /e-panel -->

    <!-- Önizleme -->
    <div class="preview" id="preview">
      <div class="prev-bar">
        <button class="btn btn-icon" onclick="reloadPrev()" title="Yenile" style="width:28px;height:28px;border-radius:7px;">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <div class="url-pill">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span id="prev-url" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">Önizleme yüklenmedi</span>
        </div>
        <button class="btn btn-icon" onclick="sharePreview()" title="Paylaş" style="width:28px;height:28px;border-radius:7px;">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
        <button class="btn btn-icon" onclick="openFullPreview()" title="Tam Ekran" style="width:28px;height:28px;border-radius:7px;">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13" height="13"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </button>
      </div>

      <!-- Loading -->
      <div class="prev-load" id="prev-load">
        <div class="load-icon"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
        <div class="load-t" id="load-t">Analiz ediliyor...</div>
        <div style="font-size:11px;color:var(--text3);">AI içerik üretiyor</div>
        <div class="dots"><span></span><span></span><span></span></div>
      </div>

      <!-- Empty -->
      <div class="prev-empty" id="prev-empty">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>
        <h3>Önizleme Alanı</h3>
        <p>Bir URL girerek site klonlayın, ya da AI sohbetiyle yeni bir site oluşturun</p>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-ghost btn-sm" onclick="switchPTab('clone')">🌐 Klonla</button>
          <button class="btn btn-primary btn-sm" onclick="runDemo()">✨ Demo Gör</button>
        </div>
      </div>

      <!-- iframe -->
      <div class="frame-zone desktop" id="frame-zone" style="display:none;">
        <iframe id="pframe" sandbox="allow-scripts allow-same-origin"></iframe>
      </div>
    </div>

    <!-- Inspector -->
    <div class="insp" id="insp">
      <div class="insp-h">
        <div class="insp-title">⚙️ Özellikler</div>
        <span style="cursor:pointer;color:var(--text3);font-size:16px;" onclick="toggleInsp()">✕</span>
      </div>
      <div class="insp-body">
        <div class="pg">
          <div class="pg-title">📐 Boyut & Boşluk</div>
          <div class="pr"><span class="pl">Genişlik</span><input class="pi" value="100%"/></div>
          <div class="pr"><span class="pl">Yükseklik</span><input class="pi" value="auto"/></div>
          <div class="pr"><span class="pl">Padding</span><input class="pi" value="16px 24px"/></div>
          <div class="pr"><span class="pl">Margin</span><input class="pi" value="0"/></div>
          <div class="pr"><span class="pl">Radius</span><input class="pi" value="8px"/></div>
        </div>
        <div class="pg">
          <div class="pg-title">🎨 Renkler</div>
          <div class="pr"><span class="pl">Arka Plan</span><input type="color" class="csw" value="#0a0a0a"/></div>
          <div class="pr"><span class="pl">Yazı Rengi</span><input type="color" class="csw" value="#f2f2f2"/></div>
          <div class="pr"><span class="pl">Border</span><input class="pi" value="none"/></div>
          <div class="pr"><span class="pl">Box Shadow</span><input class="pi" value="none"/></div>
        </div>
        <div class="pg">
          <div class="pg-title">✏️ Tipografi</div>
          <div class="pr"><span class="pl">Font</span><select class="pi"><option>Syne</option><option>DM Sans</option><option>Inter</option><option>Fraunces</option></select></div>
          <div class="pr"><span class="pl">Boyut</span><input class="pi" value="16px"/></div>
          <div class="pr"><span class="pl">Ağırlık</span><select class="pi"><option>300</option><option>400</option><option selected>500</option><option>600</option><option>700</option><option>800</option></select></div>
          <div class="pr"><span class="pl">Satır Aralığı</span><input class="pi" value="1.6"/></div>
        </div>
        <div class="pg">
          <div class="pg-title">⚡ Animasyon</div>
          <div class="pr"><span class="pl">Transition</span><input class="pi" value="0.2s ease"/></div>
          <div class="pr"><span class="pl">Transform</span><input class="pi" value="none"/></div>
          <div class="pr"><span class="pl">Opacity</span><input class="pi" value="1" type="number" min="0" max="1" step="0.1"/></div>
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="toast('✅ Değişiklikler uygulandı')">Uygula</button>
        <button class="btn btn-ghost" style="width:100%;justify-content:center;margin-top:6px;" onclick="toast('📋 CSS kopyalandı')">CSS Kopyala</button>
      </div>
    </div>

  </div>
</div>

<!-- ════════════════════════════════════
     DASHBOARD
════════════════════════════════════ -->
<div class="view" id="dashboard">
  <div class="topbar">
    <div class="tb-title">AI Builder <span>Gösterge Paneli</span></div>
    <div class="tb-right">
      <button class="btn btn-ghost btn-sm" onclick="openModal()">+ Yeni Proje</button>
      <button class="btn btn-primary btn-sm" onclick="showView('editor')">Editöre Geç</button>
    </div>
  </div>
  <div class="dash-scroll">
    <div class="ph">
      <div><div class="ph-title">Hoş geldiniz, <span>Mert 👋</span></div><div class="ph-sub">Bugün 3 aktif AI işi var</div></div>
      <span class="badge bb" style="padding:5px 12px;font-size:11px;">PRO PLAN</span>
    </div>
    <div class="stats">
      <div class="stat"><div class="stat-lbl">Toplam Proje</div><div class="stat-val">24</div><div class="stat-change">↑ +3 bu ay</div></div>
      <div class="stat"><div class="stat-lbl">Aylık Ziyaretçi</div><div class="stat-val">18.4K</div><div class="stat-change">↑ +12.5%</div></div>
      <div class="stat"><div class="stat-lbl">AI İşlem</div><div class="stat-val">1,247</div><div class="stat-change">↑ +247 bu hafta</div></div>
      <div class="stat"><div class="stat-lbl">Dönüşüm</div><div class="stat-val">3.2%</div><div class="stat-change dn">↓ -0.4%</div></div>
    </div>

    <div class="two">
      <div class="card">
        <div class="card-h"><div class="card-t">Son Projeler</div><button class="btn btn-ghost btn-sm">Tümünü Gör</button></div>
        <table class="tbl">
          <thead><tr><th>Proje</th><th>Durum</th><th>Ziyaretçi</th><th>Güncelleme</th><th></th></tr></thead>
          <tbody>
            <tr onclick="openProj('Shiba Inu Topluluğu','shibaclub.ai')"><td><div class="pname">Shiba Inu Topluluğu</div><div class="purl">shibaclub.ai</div></td><td><span class="badge bg"><span class="bdot"></span> Yayında</span></td><td>2,410</td><td style="font-size:11px;color:var(--text3)">2 sa. önce</td><td><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openProj('Shiba Inu Topluluğu','shibaclub.ai')">Düzenle</button></td></tr>
            <tr onclick="openProj('Makro Fitness','macrofitness.co')"><td><div class="pname">Makro Fitness</div><div class="purl">macrofitness.co</div></td><td><span class="badge by"><span class="bdot"></span> Taslak</span></td><td>1,840</td><td style="font-size:11px;color:var(--text3)">Dün</td><td><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openProj('Makro Fitness','macrofitness.co')">Düzenle</button></td></tr>
            <tr><td><div class="pname">Tech Blog</div><div class="purl">techblog.dev</div></td><td><span class="badge bg"><span class="bdot"></span> Yayında</span></td><td>5,120</td><td style="font-size:11px;color:var(--text3)">3 gün önce</td><td><button class="btn btn-ghost btn-sm" onclick="openProj('Tech Blog','techblog.dev')">Düzenle</button></td></tr>
            <tr><td><div class="pname">Portfolio v2</div><div class="purl">mertdesign.io</div></td><td><span class="badge bb"><span class="bdot"></span> AI Üretiyor</span></td><td>—</td><td style="font-size:11px;color:var(--text3)">Şimdi</td><td><button class="btn btn-ghost btn-sm">İzle</button></td></tr>
          </tbody>
        </table>
      </div>
      <div class="rstack">
        <div class="card">
          <div class="card-h"><div class="card-t">Aktif AI İşleri</div><span class="spin" style="font-size:12px;">⚙</span></div>
          <div class="job-item"><div class="job-ico"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15" height="15"><circle cx="12" cy="12" r="3"/></svg></div><div class="job-info"><div class="job-name">Admin Panel</div><div class="pbar"><div class="pbar-fill" style="width:63%"></div></div><div class="job-sub">63% • 5/8 bileşen</div></div></div>
          <div class="job-item"><div class="job-ico"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15" height="15"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="job-info"><div class="job-name">SEO Optimizasyon</div><div class="pbar"><div class="pbar-fill" style="width:28%;background:linear-gradient(90deg,var(--blue),#60c0ff)"></div></div><div class="job-sub">28% • Meta etiketler</div></div></div>
          <div class="job-item"><div class="job-ico"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15" height="15"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div><div class="job-info"><div class="job-name">Landing Page</div><div class="pbar"><div class="pbar-fill" style="width:89%;background:linear-gradient(90deg,var(--green),#6ee7b7)"></div></div><div class="job-sub">89% • Son rötuşlar</div></div></div>
        </div>
        <div class="card">
          <div class="card-h"><div class="card-t">Etkinlik</div></div>
          <div class="act"><div class="act-d"></div><div><div class="act-txt"><strong>shibaclub.ai</strong> yayına alındı</div><div class="act-time">08:39 • Bugün</div></div></div>
          <div class="act"><div class="act-d" style="background:var(--blue)"></div><div><div class="act-txt">AI <strong>12 bileşen</strong> oluşturdu</div><div class="act-time">08:22 • Bugün</div></div></div>
          <div class="act"><div class="act-d" style="background:var(--purple)"></div><div><div class="act-txt">Yeni proje başlatıldı</div><div class="act-time">21:10 • Dün</div></div></div>
          <div class="act"><div class="act-d" style="background:var(--green)"></div><div><div class="act-txt">Form: <strong>47 yeni kayıt</strong></div><div class="act-time">18:55 • Dün</div></div></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-h"><div class="card-t">Ziyaretçi Grafiği (Son 30 Gün)</div></div>
      <div style="padding:16px;">
        <div class="chart">
          <div class="cbar" style="height:45%;animation-delay:0s"></div>
          <div class="cbar" style="height:60%;animation-delay:.04s;opacity:.8"></div>
          <div class="cbar" style="height:38%;animation-delay:.08s;opacity:.7"></div>
          <div class="cbar" style="height:75%;animation-delay:.12s"></div>
          <div class="cbar" style="height:55%;animation-delay:.16s;opacity:.8"></div>
          <div class="cbar" style="height:90%;animation-delay:.2s"></div>
          <div class="cbar" style="height:68%;animation-delay:.24s;opacity:.8"></div>
          <div class="cbar" style="height:82%;animation-delay:.28s"></div>
          <div class="cbar" style="height:95%;animation-delay:.32s"></div>
          <div class="cbar" style="height:63%;animation-delay:.36s;opacity:.8"></div>
          <div class="cbar" style="height:78%;animation-delay:.4s"></div>
          <div class="cbar" style="height:85%;animation-delay:.44s"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;"><span style="font-size:10px;color:var(--text3)">1 Şub</span><span style="font-size:10px;color:var(--text3)">15 Şub</span><span style="font-size:10px;color:var(--text3)">1 Mar</span></div>
      </div>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════
     ANALİTİK
════════════════════════════════════ -->
<div class="view" id="analytics">
  <div class="topbar"><div class="tb-title">AI Builder <span>Analitik</span></div><div class="tb-right"><button class="btn btn-ghost btn-sm">7 Gün</button><button class="btn btn-primary btn-sm">30 Gün</button><button class="btn btn-ghost btn-sm">3 Ay</button></div></div>
  <div class="dash-scroll">
    <div class="stats">
      <div class="stat"><div class="stat-lbl">Toplam Görüntüleme</div><div class="stat-val">84.2K</div><div class="stat-change">↑ +18.3%</div></div>
      <div class="stat"><div class="stat-lbl">Benzersiz Ziyaretçi</div><div class="stat-val">18.4K</div><div class="stat-change">↑ +12.5%</div></div>
      <div class="stat"><div class="stat-lbl">Ort. Oturum Süresi</div><div class="stat-val">3:42</div><div class="stat-change">↑ +8sn</div></div>
      <div class="stat"><div class="stat-lbl">Çıkış Oranı</div><div class="stat-val">41%</div><div class="stat-change dn">↓ +2.1%</div></div>
    </div>
    <div class="two">
      <div class="card">
        <div class="card-h"><div class="card-t">Ziyaretçi Grafiği</div></div>
        <div style="padding:16px;">
          <div class="chart">
            <div class="cbar" style="height:42%"></div><div class="cbar" style="height:58%;opacity:.8"></div><div class="cbar" style="height:35%;opacity:.7"></div><div class="cbar" style="height:72%"></div><div class="cbar" style="height:52%;opacity:.8"></div><div class="cbar" style="height:88%"></div><div class="cbar" style="height:65%;opacity:.8"></div><div class="cbar" style="height:79%"></div><div class="cbar" style="height:92%"></div><div class="cbar" style="height:60%;opacity:.8"></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-h"><div class="card-t">En Çok Trafik</div></div>
        <div class="job-item"><div class="job-info"><div class="job-name">techblog.dev</div><div class="pbar"><div class="pbar-fill" style="width:82%"></div></div></div><div style="font-size:13px;font-weight:600;color:var(--text2)">5.1K</div></div>
        <div class="job-item"><div class="job-info"><div class="job-name">shibaclub.ai</div><div class="pbar"><div class="pbar-fill" style="width:55%;background:linear-gradient(90deg,var(--blue),#60c0ff)"></div></div></div><div style="font-size:13px;font-weight:600;color:var(--text2)">2.4K</div></div>
        <div class="job-item"><div class="job-info"><div class="job-name">macrofitness.co</div><div class="pbar"><div class="pbar-fill" style="width:38%;background:linear-gradient(90deg,var(--purple),#c4b5fd)"></div></div></div><div style="font-size:13px;font-weight:600;color:var(--text2)">1.8K</div></div>
      </div>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════
     AI JOBS
════════════════════════════════════ -->
<div class="view" id="aijobs">
  <div class="topbar"><div class="tb-title">AI Builder <span>İş Kuyruğu</span></div><div class="tb-right"><span class="badge bb">3 Çalışıyor</span></div></div>
  <div class="dash-scroll">
    <div class="card" style="margin-bottom:14px;">
      <div class="card-h"><div class="card-t">Aktif İşlemler</div><span class="spin" style="font-size:12px;">⚙</span></div>
      <div class="job-item"><div class="job-ico"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15" height="15"><circle cx="12" cy="12" r="3"/></svg></div><div class="job-info" style="flex:1"><div style="display:flex;justify-content:space-between"><div class="job-name">Turkish AI Builder Panel</div><span class="badge bb">63%</span></div><div class="job-sub">React bileşenleri • 5/8 dosya</div><div class="pbar"><div class="pbar-fill" style="width:63%"></div></div></div></div>
      <div class="job-item"><div class="job-ico"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15" height="15"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="job-info" style="flex:1"><div style="display:flex;justify-content:space-between"><div class="job-name">SEO Metadata</div><span class="badge by">28%</span></div><div class="job-sub">Meta etiketler analiz ediliyor</div><div class="pbar"><div class="pbar-fill" style="width:28%;background:linear-gradient(90deg,var(--blue),#60c0ff)"></div></div></div></div>
      <div class="job-item"><div class="job-ico"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15" height="15"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div><div class="job-info" style="flex:1"><div style="display:flex;justify-content:space-between"><div class="job-name">Landing Page Tasarımı</div><span class="badge bg">89%</span></div><div class="job-sub">Son rötuşlar</div><div class="pbar"><div class="pbar-fill" style="width:89%;background:linear-gradient(90deg,var(--green),#6ee7b7)"></div></div></div></div>
    </div>
    <div class="card">
      <div class="card-h"><div class="card-t">Tamamlananlar</div></div>
      <table class="tbl"><thead><tr><th>İş</th><th>Proje</th><th>Süre</th><th>Durum</th></tr></thead><tbody>
        <tr><td>Homepage tasarımı</td><td>shibaclub.ai</td><td>2dk 14sn</td><td><span class="badge bg">Tamamlandı</span></td></tr>
        <tr><td>Form entegrasyonu</td><td>macrofitness.co</td><td>58sn</td><td><span class="badge bg">Tamamlandı</span></td></tr>
        <tr><td>Blog şablonu</td><td>techblog.dev</td><td>1dk 32sn</td><td><span class="badge bg">Tamamlandı</span></td></tr>
        <tr><td>Mobil responsive</td><td>shopnow.tr</td><td>3dk 8sn</td><td><span class="badge br">Hata</span></td></tr>
      </tbody></table>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════
     E-POSTA
════════════════════════════════════ -->
<div class="view" id="email">
  <div class="topbar"><div class="tb-title">AI Builder <span>E-posta</span></div><div class="tb-right"><button class="btn btn-primary btn-sm">+ Kampanya Oluştur</button></div></div>
  <div class="dash-scroll">
    <div class="card">
      <table class="tbl"><thead><tr><th>Kampanya</th><th>Alıcılar</th><th>Açılma</th><th>Tıklama</th><th>Durum</th></tr></thead><tbody>
        <tr><td><div class="pname">Hoş Geldin Serisi</div></td><td>1,240</td><td>68%</td><td>24%</td><td><span class="badge bg">Aktif</span></td></tr>
        <tr><td><div class="pname">Haftalık Bülten</div></td><td>3,810</td><td>42%</td><td>12%</td><td><span class="badge bg">Aktif</span></td></tr>
        <tr><td><div class="pname">Promosyon - Mart</div></td><td>5,200</td><td>—</td><td>—</td><td><span class="badge by">Taslak</span></td></tr>
      </tbody></table>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════
     AYARLAR
════════════════════════════════════ -->
<div class="view" id="settings">
  <div class="topbar"><div class="tb-title">AI Builder <span>Ayarlar</span></div><div class="tb-right"><button class="btn btn-primary btn-sm" onclick="toast('✅ Kaydedildi')">Kaydet</button></div></div>
  <div class="dash-scroll">
    <div class="two-col-settings">
      <div class="card" style="padding:20px;">
        <div class="ss">
          <div class="ss-title">Hesap Bilgileri</div>
          <div class="sr"><div><div class="sl">Ad Soyad</div><div class="sd">Profilinizde görünür</div></div><input class="si" value="Mert Yılmaz"/></div>
          <div class="sr"><div><div class="sl">E-posta</div><div class="sd">Giriş adresi</div></div><input class="si" value="mert@example.com"/></div>
          <div class="sr"><div><div class="sl">Plan</div><div class="sd">Aktif abonelik</div></div><span class="badge bb" style="padding:5px 12px">PRO PLAN</span></div>
        </div>
        <div class="ss">
          <div class="ss-title">API Ayarları</div>
          <div class="sr"><div><div class="sl">Anthropic API</div><div class="sd">AI klonlama için</div></div><input class="si" type="password" value="sk-ant-••••••••"/></div>
          <div class="sr"><div><div class="sl">Webhook URL</div><div class="sd">Bildirim endpoint</div></div><input class="si" placeholder="https://..."/></div>
        </div>
      </div>
      <div class="card" style="padding:20px;">
        <div class="ss">
          <div class="ss-title">Bildirimler</div>
          <div class="sr"><div><div class="sl">AI İş Bildirimleri</div><div class="sd">Tamamlandığında bildir</div></div><button class="tog on" onclick="this.classList.toggle('on')"></button></div>
          <div class="sr"><div><div class="sl">E-posta Özeti</div><div class="sd">Haftalık performans raporu</div></div><button class="tog on" onclick="this.classList.toggle('on')"></button></div>
          <div class="sr"><div><div class="sl">Güvenlik Uyarıları</div><div class="sd">Şüpheli giriş</div></div><button class="tog on" onclick="this.classList.toggle('on')"></button></div>
          <div class="sr"><div><div class="sl">Pazarlama</div><div class="sd">Ürün güncellemeleri</div></div><button class="tog" onclick="this.classList.toggle('on')"></button></div>
        </div>
        <div class="ss">
          <div class="ss-title">Görünüm</div>
          <div class="sr"><div><div class="sl">Tema</div><div class="sd">Koyu / Açık mod</div></div><button class="btn btn-ghost btn-sm" onclick="toggleTheme()">Değiştir</button></div>
          <div class="sr"><div><div class="sl">Dil</div><div class="sd">Arayüz dili</div></div><select class="si" style="width:130px;cursor:pointer;"><option selected>Türkçe</option><option>English</option><option>Deutsch</option></select></div>
        </div>
      </div>
    </div>
  </div>
</div>

</div><!-- /app -->

<!-- ════════════════════════════════════
     MODAL
════════════════════════════════════ -->
<div class="modal-bg" id="modal-bg" onclick="closeModal(event)">
  <div class="modal">
    <h3>Yeni Proje</h3>
    <p>AI ile web sitenizi dakikalar içinde oluşturun</p>
    <div class="fg"><label class="flabel">Proje Adı</label><input class="finput" id="m-name" placeholder="Örn: Şirket Web Sitesi"/></div>
    <div class="fg"><label class="flabel">Açıklama veya URL</label><textarea class="finput fta" id="m-desc" placeholder="Projenizi anlatın ya da klonlamak için URL girin..."></textarea></div>
    <div class="fg"><label class="flabel">Tür</label><select class="finput" id="m-type"><option>Yeni Fikir</option><option>Site Klonu</option><option>Yerel İşletme</option><option>Yeniden Tasarım</option></select></div>
    <div class="modal-acts">
      <button class="btn btn-ghost" onclick="closeModal()">İptal</button>
      <button class="btn btn-primary" onclick="createProject()">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="12" height="12"><circle cx="12" cy="12" r="3"/></svg>
        AI ile Oluştur
      </button>
    </div>
  </div>
</div>

<!-- CTX MENU -->
<div class="ctx" id="ctx-menu">
  <div class="ctx-i" onclick="ctxDo('edit')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>AI ile Düzenle</div>
  <div class="ctx-i" onclick="ctxDo('dup')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Kopyala</div>
  <div class="ctx-i" onclick="ctxDo('insp')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>İncele</div>
  <div class="ctx-i" onclick="ctxDo('wrap')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>Kapsayıcıya Al</div>
  <div class="ctx-div"></div>
  <div class="ctx-i danger" onclick="ctxDo('del')"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Sil</div>
</div>

<!-- TOAST -->
<div class="toast" id="toast"><div class="toast-dot"></div><span id="toast-txt"></span></div>

<script>
/* ══════════════════════════════
   GÖRÜNÜM YÖNETİMİ
══════════════════════════════ */
const VIEWS = ['home','editor','dashboard','analytics','aijobs','email','settings'];
let currentView = 'home';

function showView(v) {
  currentView = v;
  VIEWS.forEach(id => {
    const el = document.getElementById(id);
    const nav = document.getElementById('nav-'+id);
    if (el) el.classList.toggle('visible', id === v);
    if (nav) nav.classList.toggle('active', id === v);
  });
}

function goHome() { showView('home'); }

/* ══════════════════════════════
   TEMA
══════════════════════════════ */
function toggleTheme() {
  const html = document.documentElement;
  const dark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', dark ? 'light' : 'dark');
  document.getElementById('theme-svg').innerHTML = dark
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
}

/* ══════════════════════════════
   ANA SAYFA
══════════════════════════════ */
let promptMode = 'clone';

function setPMode(m, el) {
  promptMode = m;
  document.querySelectorAll('.pb-chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  const hints = {
    idea: 'Hayal ettiğiniz siteyi anlatın... (ör: "evcil hayvanlar için sosyal platform")',
    clone: 'Klonlamak istediğiniz sitenin URL\'sini girin...',
    redesign: 'Mevcut sitenizin URL\'si veya sorunlarını anlatın...',
    local: 'İşletme adı, şehir ve sektör bilgisini girin...'
  };
  document.getElementById('main-prompt').placeholder = hints[m] || '';
}

function enhancePrompt() {
  const ta = document.getElementById('main-prompt');
  if (!ta.value.trim()) { toast('⚠️ Önce bir şeyler yazın'); return; }
  ta.value += ', modern ve minimalist tasarım, koyu tema, profesyonel görünüm';
  toast('✨ Prompt geliştirildi');
}

function quickStart(url) {
  document.getElementById('main-prompt').value = url;
  setPMode('clone', document.getElementById('pchip-clone'));
  handleMainPrompt();
}

function handleMainPrompt() {
  const val = document.getElementById('main-prompt').value.trim();
  if (!val) { toast('⚠️ Lütfen bir şeyler yazın'); return; }
  const isUrl = /^(https?:\/\/|www\.)|(\.(com|ai|io|co|tr|net|org|app|dev))/i.test(val);
  showView('editor');
  setTimeout(() => {
    if (isUrl || promptMode === 'clone') {
      document.getElementById('clone-url').value = val.startsWith('http') ? val : 'https://' + val;
      switchPTab('clone');
      setTimeout(startClone, 200);
    } else {
      switchPTab('chat');
      document.getElementById('chat-inp').value = val;
      sendChat();
    }
  }, 200);
}

/* ══════════════════════════════
   EDITOR — PANEL
══════════════════════════════ */
let panelVisible = true;
let inspVisible = false;

function togglePanel() {
  panelVisible = !panelVisible;
  document.getElementById('e-panel').classList.toggle('hide', !panelVisible);
}

function toggleInsp() {
  inspVisible = !inspVisible;
  document.getElementById('insp').classList.toggle('open', inspVisible);
}

function switchPTab(t) {
  ['chat','clone','layers','assets'].forEach(id => {
    document.getElementById('pt-'+id)?.classList.toggle('on', id === t);
    document.getElementById('pp-'+id)?.classList.toggle('on', id === t);
  });
  document.getElementById('sugg-area').style.display = t === 'chat' ? 'flex' : 'none';
}

/* ══════════════════════════════
   DEVICE
══════════════════════════════ */
function setDev(d) {
  ['d','t','m'].forEach(v => document.getElementById('dv-'+v)?.classList.toggle('on', v === d));
  const map = {d:'desktop',t:'tablet',m:'mobile'};
  document.getElementById('frame-zone').className = 'frame-zone ' + (map[d] || 'desktop');
}

/* ══════════════════════════════
   CLONE
══════════════════════════════ */
let previewHTML = '';
let cloneTimer = null;

function quickClone(url) {
  document.getElementById('clone-url').value = url;
  startClone();
}

async function startClone() {
  const raw = document.getElementById('clone-url').value.trim();
  if (!raw) { toast('⚠️ URL girin'); return; }
  const url = raw.startsWith('http') ? raw : 'https://' + raw;
  let domain;
  try { domain = new URL(url).hostname.replace('www.',''); } catch { domain = raw; }

  document.getElementById('clone-btn').disabled = true;
  document.getElementById('prog-box').classList.add('show');
  document.getElementById('prev-empty').style.display = 'none';
  document.getElementById('prev-load').classList.add('show');
  document.getElementById('prev-url').textContent = url;
  document.getElementById('proj-name').textContent = domain;

  ['ps1','ps2','ps3','ps4','ps5','ps6'].forEach(id => {
    const e = document.getElementById(id);
    if (e) e.className = 'ps';
  });

  let pct = 0, step = 0;
  const steps = ['ps1','ps2','ps3','ps4','ps5','ps6'];
  const loadTexts = ['Site analiz ediliyor...','Renkler çıkarılıyor...','HTML üretiliyor...','Bileşenler oluşturuluyor...','Son rötuşlar...'];
  clearInterval(cloneTimer);
  cloneTimer = setInterval(() => {
    pct += Math.random() * 14 + 6;
    if (pct > 100) pct = 100;
    document.getElementById('prog-fill').style.width = pct + '%';
    document.getElementById('prog-pct').textContent = Math.round(pct) + '%';
    const ltEl = document.getElementById('load-t');
    if (ltEl) ltEl.textContent = loadTexts[Math.min(step, 4)];
    if (step < steps.length) {
      if (step > 0) { const p = document.getElementById(steps[step-1]); if(p) p.className='ps done'; }
      const c = document.getElementById(steps[step]); if(c) c.className='ps cur';
      step++;
    }
    if (pct >= 100) { clearInterval(cloneTimer); setTimeout(() => finishClone(url, domain), 600); }
  }, 400);

  callAPI(url, domain);
}

async function callAPI(url, domain) {
  const apiKey = document.getElementById('api-key')?.value?.trim();
  const name = domain.split('.')[0];
  const cap = name.charAt(0).toUpperCase() + name.slice(1);
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: `Create a complete, beautiful, modern HTML landing page inspired by ${url}. Include: navbar with logo and links, hero section with headline/subtext/CTA buttons, features section (3 cards with icons), pricing section (3 tiers), testimonials, footer. Use embedded CSS only. Dark theme, professional, modern design. Brand name: "${cap}". Return ONLY the complete HTML document, nothing else.` }]
      })
    });
    if (r.ok) { const d = await r.json(); previewHTML = d.content[0].text; }
    else { previewHTML = genDemo(url, cap); }
  } catch { previewHTML = genDemo(url, domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)); }
}

function finishClone(url, domain) {
  clearInterval(cloneTimer);
  document.getElementById('prev-load').classList.remove('show');
  document.getElementById('prog-box').classList.remove('show');
  document.getElementById('clone-btn').disabled = false;
  ['ps1','ps2','ps3','ps4','ps5','ps6'].forEach(id => { const e=document.getElementById(id); if(e) e.className='ps done'; });
  document.getElementById('pframe').srcdoc = previewHTML;
  document.getElementById('frame-zone').style.display = 'flex';
  const ch = document.getElementById('mf-ch');
  ch.innerHTML = ['index.html','styles.css','components.js','config.json'].map(f=>`<div class="mf-c">${f}</div>`).join('');
  document.getElementById('mod-files').classList.add('show');
  document.getElementById('ver-bar').classList.add('show');
  addMsg('ai', `✅ <b>${domain}</b> başarıyla klonlandı! Önizleme hazır. Değişiklik yapmak ister misiniz?`);
  toast('🎉 Klonlama tamamlandı!');
  switchPTab('chat');
}

/* ══════════════════════════════
   CHAT
══════════════════════════════ */
let isGen = false;

function chatKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }

function useSug(el) {
  document.getElementById('chat-inp').value = el.textContent.trim();
  sendChat();
}

function clearChat() {
  document.getElementById('chat-area').innerHTML = `<div class="msg"><div class="av ai">AI</div><div class="bubble">Sohbet temizlendi. Yeni bir şey denemek ister misiniz?</div></div>`;
  toast('🗑 Sohbet temizlendi');
}

async function sendChat() {
  const inp = document.getElementById('chat-inp');
  const msg = inp.value.trim();
  if (!msg || isGen) return;
  inp.value = '';
  document.getElementById('sugg-area').style.display = 'none';
  addMsg('user', msg);
  isGen = true;
  document.getElementById('send-btn').disabled = true;
  document.getElementById('stop-btn').classList.add('show');
  const thinkId = addMsg('ai', '<div class="typing-ind"><span></span><span></span><span></span></div>');
  const apiKey = document.getElementById('api-key')?.value?.trim();
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: 'Sen bir AI web builder asistanısın. Türkçe yanıtla. Kısa, etkili ve özlü ol.',
        messages: [{ role: 'user', content: msg }]
      })
    });
    let reply;
    if (r.ok) { const d = await r.json(); reply = d.content[0].text; }
    else { reply = localReply(msg); }
    updateMsg(thinkId, reply);
    if (previewHTML && (reply.includes('```html') || msg.toLowerCase().includes('yenile') || msg.toLowerCase().includes('güncelle'))) {
      showToastUpdate();
    }
    addModFile('index.html');
  } catch { updateMsg(thinkId, localReply(msg)); }
  isGen = false;
  document.getElementById('send-btn').disabled = false;
  document.getElementById('stop-btn').classList.remove('show');
}

function localReply(m) {
  m = m.toLowerCase();
  if (m.includes('renk') || m.includes('color')) return '🎨 Renk değişikliği yapabilirim. CSS değişkenlerini güncelleyeceğim. Hangi elementi değiştirmek istiyorsunuz?';
  if (m.includes('font') || m.includes('yazı')) return '✍️ Font değişikliği için önerim: Syne (başlık) + DM Sans (içerik). Başka tercih var mı?';
  if (m.includes('mobil') || m.includes('responsive')) return '📱 Responsive CSS düzenleyeceğim. Media query breakpoint\'lerini ayarlıyorum...';
  if (m.includes('fiyat') || m.includes('pricing')) return '💰 Fiyatlandırma bölümünü düzenleyebilirim. Kaç tier ve hangi fiyatlar?';
  if (m.includes('başlık') || m.includes('hero')) return '🚀 Hero bölümünü güçlendiriyorum. Headline\'ı daha etkileyici hale getireceğim.';
  if (m.includes('koyu') || m.includes('dark')) return '🌙 Koyu tema aktif. Arka plan ve kontrast değerlerini optimize edeceğim.';
  return '✅ Talebiniz alındı. API anahtarı ekleyerek gerçek AI desteğini aktifleştirin. Sol paneldeki "Klonla" sekmesinde API anahtarı alanı mevcut.';
}

function showToastUpdate() { toast('🔄 Önizleme güncellendi'); }

function addMsg(role, text) {
  const area = document.getElementById('chat-area');
  const id = 'msg-' + Date.now();
  const fmt = text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>');
  area.insertAdjacentHTML('beforeend', `<div class="msg${role==='user'?' u':''}" id="${id}"><div class="av ${role==='ai'?'ai':'u'}">${role==='ai'?'AI':'M'}</div><div class="bubble">${fmt}</div></div>`);
  area.scrollTop = area.scrollHeight;
  return id;
}

function updateMsg(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  const fmt = text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>');
  el.querySelector('.bubble').innerHTML = fmt;
}

function addModFile(f) {
  const ch = document.getElementById('mf-ch');
  if (!ch || ch.querySelector(`[data-f="${f}"]`)) return;
  ch.insertAdjacentHTML('beforeend', `<div class="mf-c" data-f="${f}">${f}</div>`);
  document.getElementById('mod-files').classList.add('show');
}

function stopGen() {
  isGen = false;
  document.getElementById('send-btn').disabled = false;
  document.getElementById('stop-btn').classList.remove('show');
  toast('⏹ Durduruldu');
}

function enhanceChatPrompt() {
  const ta = document.getElementById('chat-inp');
  if (!ta.value.trim()) { toast('⚠️ Önce yazın'); return; }
  ta.value += ', modern ve profesyonel';
  toast('✨ Geliştirildi');
}

/* ══════════════════════════════
   ÖNIZLEME
══════════════════════════════ */
function reloadPrev() {
  if (previewHTML) { document.getElementById('pframe').srcdoc = previewHTML; toast('🔄 Yenilendi'); }
  else toast('⚠️ Önce site oluşturun');
}

function openFullPreview() {
  if (!previewHTML) { toast('⚠️ Önce site oluşturun'); return; }
  const w = window.open('', '_blank');
  w.document.write(previewHTML);
  w.document.close();
}

function sharePreview() { toast('🔗 Bağlantı kopyalandı (yakında)'); }
function publishSite() { toast('🚀 Site yayınlanıyor...'); setTimeout(()=>toast('✅ Site yayına alındı!'),2000); }

/* ══════════════════════════════
   LAYERS
══════════════════════════════ */
function selLay(el, name) {
  document.querySelectorAll('.lay').forEach(l => l.classList.remove('sel'));
  el.classList.add('sel');
  if (!inspVisible) toggleInsp();
  document.getElementById('chat-inp').value = `"${name}" öğesini düzenle: `;
  switchPTab('chat');
  document.getElementById('chat-inp').focus();
  toast('📐 Seçildi: ' + name);
}

/* ══════════════════════════════
   DEMO
══════════════════════════════ */
function runDemo() {
  document.getElementById('clone-url').value = 'https://stripe.com';
  switchPTab('clone');
  setTimeout(startClone, 150);
}

/* ══════════════════════════════
   PROJE AÇMA
══════════════════════════════ */
function openProj(name, url) {
  document.getElementById('proj-name').textContent = name;
  document.getElementById('prev-url').textContent = url;
  showView('editor');
  setTimeout(() => {
    previewHTML = genDemo('https://'+url, name.split(' ')[0]);
    document.getElementById('pframe').srcdoc = previewHTML;
    document.getElementById('frame-zone').style.display = 'flex';
    document.getElementById('prev-empty').style.display = 'none';
    document.getElementById('ver-bar').classList.add('show');
    addMsg('ai', `✅ <b>${name}</b> projesi yüklendi. Ne değiştirmek istersiniz?`);
    switchPTab('chat');
  }, 300);
}

/* ══════════════════════════════
   DEMO HTML
══════════════════════════════ */
function genDemo(url, name) {
  let n = name || 'Brand';
  try { if (!name || name.length < 2) n = new URL(url).hostname.replace('www.','').split('.')[0]; } catch {}
  const cap = n.charAt(0).toUpperCase() + n.slice(1);
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${cap}</title><link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;background:#080808;color:#f0f0f0}nav{display:flex;align-items:center;padding:18px 60px;border-bottom:1px solid #181818;background:rgba(8,8,8,.9);position:sticky;top:0;backdrop-filter:blur(10px);z-index:10}.nl{font-family:'Syne',sans-serif;font-weight:800;font-size:19px;color:#d4a843}.nav-links{display:flex;gap:28px;margin:0 auto}.nav-links a{text-decoration:none;color:#666;font-size:13px;transition:.2s}.nav-links a:hover{color:#f0f0f0}.nc{padding:7px 20px;background:#d4a843;color:#000;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:.2s}.nc:hover{background:#f0c060}.hero{padding:120px 60px 100px;text-align:center;background:radial-gradient(ellipse 70% 55% at 50% 0%,rgba(212,168,67,.07),transparent)}.hero h1{font-family:'Syne',sans-serif;font-size:clamp(38px,5.5vw,68px);font-weight:800;line-height:1.08;letter-spacing:-2px;margin-bottom:22px}.hero h1 span{color:#d4a843}.hero p{color:#666;font-size:16px;max-width:480px;margin:0 auto 36px;line-height:1.7}.hbtns{display:flex;gap:12px;justify-content:center}.hp{padding:14px 32px;background:#d4a843;color:#000;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:.2s}.hp:hover{background:#f0c060;transform:translateY(-1px)}.hs{padding:14px 32px;background:transparent;color:#f0f0f0;border:1px solid #252525;border-radius:10px;font-size:14px;cursor:pointer;transition:.2s}.hs:hover{border-color:#d4a843}.features{padding:100px 60px;max-width:1160px;margin:0 auto}.features h2{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;text-align:center;margin-bottom:52px;letter-spacing:-1px}.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.fc{padding:30px;background:#0f0f0f;border:1px solid #1a1a1a;border-radius:14px;transition:.2s}.fc:hover{border-color:#d4a843;transform:translateY(-3px)}.fi{width:44px;height:44px;background:rgba(212,168,67,.1);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px}.ft{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:10px}.fd{color:#555;font-size:13.5px;line-height:1.65}.pricing{padding:100px 60px;text-align:center;background:radial-gradient(ellipse 60% 40% at 50% 100%,rgba(212,168,67,.04),transparent)}.pricing h2{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;margin-bottom:52px;letter-spacing:-1px}.pg{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:980px;margin:0 auto}.plan{padding:34px;background:#0f0f0f;border:1px solid #1a1a1a;border-radius:14px;transition:.2s}.plan.f{border-color:#d4a843;position:relative}.plan.f::before{content:'Popüler';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#d4a843;color:#000;padding:3px 14px;border-radius:20px;font-size:11px;font-weight:700}.pname{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#555;margin-bottom:12px}.price{font-family:'Syne',sans-serif;font-size:48px;font-weight:800;margin-bottom:6px}.price span{font-size:16px;color:#555}.pdesc{color:#555;font-size:12px;margin-bottom:28px}.pbtn{width:100%;padding:12px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:.2s}.plan .pbtn{background:#1a1a1a;color:#f0f0f0}.plan.f .pbtn{background:#d4a843;color:#000}.plan .pbtn:hover{background:#252525}.plan.f .pbtn:hover{background:#f0c060}.testi{padding:80px 60px;}.testi h2{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;text-align:center;margin-bottom:42px;letter-spacing:-1px}.tg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1100px;margin:0 auto}.tc{padding:24px;background:#0f0f0f;border:1px solid #1a1a1a;border-radius:12px}.tq{font-size:13.5px;color:#888;line-height:1.65;margin-bottom:16px}.ta{display:flex;align-items:center;gap:10px}.tav{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#d4a843,#f0c060);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#000}.tname{font-size:13px;font-weight:600}.trole{font-size:11px;color:#555}footer{padding:52px 60px;border-top:1px solid #141414;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}.fl{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#d4a843}.flinks{display:flex;gap:20px}.flinks a{text-decoration:none;color:#555;font-size:12.5px;transition:.2s}.flinks a:hover{color:#d4a843}.fc2{font-size:12px;color:#333}</style></head><body><nav><div class="nl">${cap}</div><div class="nav-links"><a href="#">Ürün</a><a href="#">Özellikler</a><a href="#">Fiyatlar</a><a href="#">Blog</a><a href="#">İletişim</a></div><button class="nc">Ücretsiz Başla →</button></nav><section class="hero"><h1>Geleceğin platformu<br><span>bugün hazır</span></h1><p>${cap} ile işinizi bir üst seviyeye taşıyın. AI destekli araçlar, anlık sonuçlar.</p><div class="hbtns"><button class="hp">Hemen Başla →</button><button class="hs">Demo İzle ▶</button></div></section><section class="features"><h2>Neden ${cap}?</h2><div class="feat-grid"><div class="fc"><div class="fi">⚡</div><div class="ft">Yıldırım Hızı</div><div class="fd">Saniyeler içinde çalışmaya başlayın. Zero downtime, sonsuz ölçeklenebilirlik.</div></div><div class="fc"><div class="fi">🔒</div><div class="ft">Kurumsal Güvenlik</div><div class="fd">SOC 2 uyumlu altyapı. Verileriniz her zaman şifreli ve güvende.</div></div><div class="fc"><div class="fi">🤖</div><div class="ft">AI Destekli</div><div class="fd">Yapay zeka iş akışlarınızı otomatize eder, zaman kazanmanızı sağlar.</div></div></div></section><section class="pricing"><h2>Şeffaf Fiyatlandırma</h2><div class="pg"><div class="plan"><div class="pname">Başlangıç</div><div class="price">₺0<span>/ay</span></div><div class="pdesc">Bireysel projeler için</div><button class="pbtn">Ücretsiz Başla</button></div><div class="plan f"><div class="pname">Pro</div><div class="price">₺299<span>/ay</span></div><div class="pdesc">Büyüyen ekipler için</div><button class="pbtn">Pro'ya Geç</button></div><div class="plan"><div class="pname">Kurumsal</div><div class="price">₺999<span>/ay</span></div><div class="pdesc">Büyük organizasyonlar için</div><button class="pbtn">İletişime Geç</button></div></div></section><section class="testi"><h2>Kullanıcılar Ne Diyor?</h2><div class="tg"><div class="tc"><div class="tq">"${cap} iş akışımızı tamamen değiştirdi. Artık 3x daha hızlı geliştiriyoruz."</div><div class="ta"><div class="tav">A</div><div><div class="tname">Ahmet Kaya</div><div class="trole">CTO, TechStart</div></div></div></div><div class="tc"><div class="tq">"Fiyat-performans açısından piyasadaki en iyi araç. Kesinlikle tavsiye ederim."</div><div class="ta"><div class="tav">S</div><div><div class="tname">Selin Öz</div><div class="trole">Founder, DesignCo</div></div></div></div><div class="tc"><div class="tq">"Müşterilerimize daha iyi hizmet sunabiliyoruz. Harika bir platform."</div><div class="ta"><div class="tav">M</div><div><div class="tname">Mert Demir</div><div class="trole">PM, GrowthLab</div></div></div></div></div></section><footer><div class="fl">${cap}</div><div class="flinks"><a href="#">Ürün</a><a href="#">Fiyatlar</a><a href="#">Gizlilik</a><a href="#">Şartlar</a><a href="#">İletişim</a></div><div class="fc2">© 2026 ${cap}. Tüm hakları saklıdır.</div></footer></body></html>`;
}

/* ══════════════════════════════
   MODAL
══════════════════════════════ */
function openModal() { document.getElementById('modal-bg').classList.add('open'); }
function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-bg'))
    document.getElementById('modal-bg').classList.remove('open');
}
function createProject() {
  const name = document.getElementById('m-name').value.trim() || 'Yeni Proje';
  const desc = document.getElementById('m-desc').value.trim();
  const type = document.getElementById('m-type').value;
  closeModal();
  document.getElementById('proj-name').textContent = name;
  showView('editor');
  toast('🚀 Proje oluşturuluyor...');
  setTimeout(() => {
    if (type === 'Site Klonu' && desc.includes('http')) {
      document.getElementById('clone-url').value = desc;
      switchPTab('clone');
      setTimeout(startClone, 200);
    } else {
      switchPTab('chat');
      document.getElementById('chat-inp').value = desc || name + ' için web sitesi oluştur';
      sendChat();
    }
  }, 400);
}

/* ══════════════════════════════
   CTX MENU
══════════════════════════════ */
document.addEventListener('contextmenu', e => {
  const fz = document.getElementById('frame-zone');
  if (fz && fz.style.display !== 'none' && currentView === 'editor') {
    e.preventDefault();
    const m = document.getElementById('ctx-menu');
    m.style.left = Math.min(e.clientX, window.innerWidth - 170) + 'px';
    m.style.top = Math.min(e.clientY, window.innerHeight - 190) + 'px';
    m.classList.add('show');
  }
});
document.addEventListener('click', () => document.getElementById('ctx-menu').classList.remove('show'));
function ctxDo(a) {
  const msgs = { edit:'AI Düzenleyici açılıyor...', dup:'✅ Kopyalandı', insp:'🔍 İnceleniyor', wrap:'📦 Kapsayıcıya alındı', del:'🗑 Silindi' };
  toast(msgs[a] || 'İşlem yapıldı');
  if (a === 'edit') switchPTab('chat');
  if (a === 'insp' && !inspVisible) toggleInsp();
}

/* ══════════════════════════════
   EDITOR SHORTCUTS
══════════════════════════════ */
function undo() { toast('↩ Geri alındı'); }
function redo() { toast('↪ Yinelendi'); }

/* ══════════════════════════════
   TOAST
══════════════════════════════ */
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-txt').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ══════════════════════════════
   INIT
══════════════════════════════ */
showView('home');
// Animate stat progress bars on dashboard visit
document.getElementById('nav-dashboard').addEventListener('click', () => {
  setTimeout(() => {
    document.querySelectorAll('.pbar-fill').forEach(b => {
      const w = b.style.width; b.style.width = '0';
      setTimeout(() => b.style.width = w, 100);
    });
  }, 200);
});
</script>
</body>
</html>