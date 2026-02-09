"use client";

import { useEffect, useRef, useState } from "react";

// Counter animation hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }
  }, [startOnView]);

  useEffect(() => {
    if (!startOnView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [driftAnimated, setDriftAnimated] = useState(false);
  const driftRef = useRef<HTMLDivElement>(null);

  // Counter animations for stats
  const diabetics = useCountUp(101, 2000);
  const chronic = useCountUp(650, 2000);
  const spectrum = useCountUp(68, 1500);
  const cost = useCountUp(3.4, 2000);

  useEffect(() => {
    // Scroll progress bar
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);

    // Fade-in animation observer with stagger support
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("v");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

    // Drift ring animation observer
    const driftObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !driftAnimated) {
          setDriftAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (driftRef.current) {
      driftObserver.observe(driftRef.current);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });

    return () => {
      observer.disconnect();
      driftObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [driftAnimated]);

  return (
    <>
      <style jsx global>{`
        :root{--bg:#FAFAF8;--white:#fff;--text:#111;--t2:#555;--t3:#888;--green:#0C6B5E;--gl:#E6F5F1;--gd:#084D44;--red:#C0392B;--rl:#FDE8E8;--amber:#D4880F;--al:#FFF6E5;--purple:#6C4FD6;--pl:#EEEBFF;--blue:#2D6CDF;--bl:#EBF2FF;--border:#E2E0DA;--bl2:#F0EDE8;--sh:0 1px 3px rgba(0,0,0,.04);--shm:0 4px 20px rgba(0,0,0,.06);--shl:0 12px 40px rgba(0,0,0,.08)}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
        body{font-family:'Inter',var(--font-inter),-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden}

        /* Scroll Progress Bar */
        .scroll-progress{position:fixed;top:0;left:0;height:3px;background:var(--green);z-index:200;transition:width 0.1s linear}

        .w{max-width:1100px;margin:0 auto;padding:0 20px;width:100%}
        nav.landing-nav{position:fixed;top:3px;left:0;right:0;z-index:100;background:rgba(250,250,248,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--bl2)}
        nav.landing-nav .i{max-width:1100px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:56px}
        .logo{display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--text)}
        .lm{width:30px;height:30px;border-radius:8px;background:var(--green);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:14px}
        .lt{font-family:'Fraunces',var(--font-fraunces),serif;font-size:20px}
        .nr{display:flex;align-items:center;gap:24px}
        .nr a{text-decoration:none;color:var(--t2);font-size:13px;font-weight:600;transition:color .2s}
        .nr a:hover{color:var(--green)}
        .nb{background:var(--green);color:white!important;padding:8px 18px;border-radius:8px;box-shadow:0 2px 8px rgba(12,107,94,.2)}
        .nb:hover{background:var(--gd)}
        @media(max-width:768px){.nr a:not(.nb){display:none}}

        /* Hero - Keep 100vh */
        .hero{padding:110px 0 0;overflow:hidden;min-height:100vh;display:flex;align-items:center}
        .hero-top{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;min-height:auto}
        .hero-l{padding:40px 0}
        .htag{display:inline-flex;align-items:center;gap:7px;background:var(--gl);color:var(--green);padding:4px 13px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-bottom:20px}
        .htag i{width:5px;height:5px;border-radius:50%;background:var(--green);animation:bk 2s infinite}
        @keyframes bk{0%,100%{opacity:1}50%{opacity:.3}}
        .hero h1{font-family:'Fraunces',var(--font-fraunces),serif;font-size:clamp(32px,4.5vw,52px);line-height:1.08;letter-spacing:-1.5px;margin-bottom:18px}
        .hero h1 em{font-style:italic;color:var(--green)}
        .hero .sub{font-size:16px;color:var(--t2);line-height:1.7;margin-bottom:28px;max-width:460px}
        .hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px}
        .bp{display:inline-flex;align-items:center;gap:6px;background:var(--green);color:white;border:none;padding:13px 26px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;text-decoration:none;font-family:inherit;box-shadow:0 3px 12px rgba(12,107,94,.2)}
        .bp:hover{background:var(--gd);transform:translateY(-1px)}
        .bs{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--text);border:2px solid var(--border);padding:11px 22px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;text-decoration:none;font-family:inherit}
        .bs:hover{border-color:var(--green);color:var(--green)}
        .hero-proof{display:flex;gap:24px;font-size:12px;color:var(--t3)}
        .hero-proof strong{color:var(--text);font-weight:700}
        .hero-r{position:relative;display:flex;justify-content:center;padding:20px 0}
        .mock-phone{width:260px;background:#0a0a0a;border-radius:36px;padding:6px;box-shadow:var(--shl);position:relative;z-index:2}
        .mock-screen{background:white;border-radius:31px;overflow:hidden;height:500px;display:flex;flex-direction:column}
        .mock-bar{height:32px;background:#f5f5f5;display:flex;align-items:center;justify-content:center}
        .mock-notch{width:70px;height:20px;background:#0a0a0a;border-radius:14px}
        .mock-body{flex:1;padding:16px;background:linear-gradient(180deg,#fff 0%,#f0faf8 100%);display:flex;flex-direction:column}
        .mock-greeting{font-size:11px;color:var(--t3);margin-bottom:4px}
        .mock-name{font-size:16px;font-weight:700;margin-bottom:16px}
        .mock-ring{width:110px;height:110px;margin:0 auto 12px;position:relative}
        .mock-ring svg{width:110px;height:110px}
        .mock-ring .bg{fill:none;stroke:#e2e0da;stroke-width:8}
        .mock-ring .fl{fill:none;stroke:var(--green);stroke-width:8;stroke-linecap:round;stroke-dasharray:314;stroke-dashoffset:88;transform:rotate(-90deg);transform-origin:center}
        .mock-ring .center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
        .mock-ring .sc{font-family:'Fraunces',var(--font-fraunces),serif;font-size:32px;color:var(--green);line-height:1}
        .mock-ring .sl{font-size:9px;color:var(--t3);font-weight:600}
        .mock-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:12px 0}
        .ms{background:white;border-radius:10px;padding:8px 4px;text-align:center;box-shadow:var(--sh);border:1px solid #f0f0f0}
        .ms .v{font-size:14px;font-weight:800;color:var(--text)}
        .ms .l{font-size:8px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
        .mock-alerts{flex:1;display:flex;flex-direction:column;gap:6px;margin-top:8px}
        .ma{display:flex;align-items:center;gap:8px;background:#f8f8f6;border-radius:10px;padding:8px 10px;font-size:10px;border:1px solid #f0ede8}
        .ma .mai{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
        .ma .mat{font-weight:600;color:var(--text)}
        .ma .mas{color:var(--t3);font-size:9px}
        .fn{position:absolute;background:white;border-radius:12px;padding:8px 12px;box-shadow:var(--shl);border:1px solid var(--bl2);z-index:3;white-space:nowrap}
        .fn .ft{display:flex;align-items:center;gap:6px}
        .fn .fi{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px}
        .fn .fl2{font-size:11px;font-weight:700}
        .fn .fs{font-size:9px;color:var(--t3)}
        .fn1{top:40px;left:-30px;animation:fa 6s ease-in-out infinite}
        .fn2{top:120px;right:-40px;animation:fb 6s ease-in-out infinite}
        .fn3{bottom:140px;left:-40px;animation:fc 6s ease-in-out infinite}
        .fn4{bottom:60px;right:-30px;animation:fd 6s ease-in-out infinite}
        .fn1 .fi{background:#FFF3E0}
        .fn2 .fi{background:var(--pl)}
        .fn3 .fi{background:var(--bl)}
        .fn4 .fi{background:var(--gl)}
        @keyframes fa{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fb{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes fc{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fd{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @media(max-width:860px){
          .hero-top{grid-template-columns:1fr;text-align:center}
          .hero .sub{margin:0 auto 28px}
          .hero-btns{justify-content:center}
          .hero-proof{justify-content:center}
          .fn{display:none}
        }

        .stag{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--green);font-weight:700;margin-bottom:12px}
        .sh{font-family:'Fraunces',var(--font-fraunces),serif;font-size:clamp(26px,3.5vw,40px);line-height:1.15;letter-spacing:-1.2px;margin-bottom:12px}
        .sl{font-size:16px;color:var(--t2);line-height:1.7}

        /* Problem - Reduced height with ticker stats */
        .problem{padding:80px 0;background:white}
        .prob-g{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
        .prob-l{position:sticky;top:80px}
        .prob-l .sl{margin-bottom:24px;max-width:420px}
        .prob-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:28px}
        .prob-stat{background:var(--bg);border-radius:12px;padding:16px;border:1px solid var(--bl2)}
        .prob-stat .ps-n{font-family:'Fraunces',var(--font-fraunces),serif;font-size:28px;color:var(--green);line-height:1}
        .prob-stat .ps-l{font-size:11px;color:var(--t2);margin-top:4px}
        .prob-cards{display:flex;flex-direction:column;gap:16px}
        .pc{background:var(--bg);border-radius:16px;padding:24px;border:1px solid var(--bl2);display:grid;grid-template-columns:48px 1fr;gap:16px;transition:all .3s cubic-bezier(0.22, 1, 0.36, 1)}
        .pc:hover{box-shadow:0 12px 40px rgba(0,0,0,.1);border-color:var(--border);transform:translateY(-4px) scale(1.01)}
        .pc .pi{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px}
        .pc h3{font-size:15px;font-weight:700;margin-bottom:4px}
        .pc p{font-size:13px;color:var(--t2);line-height:1.5}
        .pc .ptag{display:inline-block;margin-top:8px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:var(--red);background:var(--rl);padding:2px 8px;border-radius:4px}
        @media(max-width:860px){
          .prob-g{grid-template-columns:1fr}
          .prob-l{position:static}
        }

        /* Solution (merged How It Works + The Herd) - Reduced height */
        .solution{padding:80px 0;background:var(--bg)}
        .solution-top{text-align:center;margin-bottom:40px;max-width:600px;margin-left:auto;margin-right:auto}
        .how-flow{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;background:var(--border);border-radius:18px;overflow:hidden;margin-bottom:48px}
        .hf{background:white;padding:28px 16px;text-align:center;transition:background .3s;position:relative}
        .hf:hover{background:var(--gl)}
        .hf .hn{width:28px;height:28px;border-radius:50%;background:var(--green);color:white;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 10px}
        .hf .he{font-size:24px;margin-bottom:8px}
        .hf h4{font-size:13px;font-weight:700;margin-bottom:4px}
        .hf p{font-size:11px;color:var(--t2);line-height:1.5}
        .hf .hx{margin-top:8px;font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--green);background:var(--gl);padding:3px 8px;border-radius:4px;display:inline-block}
        @media(max-width:900px){.how-flow{grid-template-columns:1fr}}

        /* The Herd Grid */
        .herd-section{margin-top:48px}
        .herd-header{text-align:center;margin-bottom:32px}
        .herd-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
        .hc{background:white;border-radius:14px;padding:20px;border:1px solid var(--bl2);transition:all .3s cubic-bezier(0.22, 1, 0.36, 1)}
        .hc:hover{box-shadow:0 12px 40px rgba(0,0,0,.1);transform:translateY(-4px) scale(1.01)}
        .hc .hci{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:10px}
        .hc h4{font-size:13px;font-weight:700;margin-bottom:3px}
        .hc p{font-size:11px;color:var(--t2);line-height:1.5}
        .hc .hce{margin-top:8px;font-size:10px;color:var(--t3);font-style:italic}
        @media(max-width:900px){.herd-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:500px){.herd-grid{grid-template-columns:1fr}}

        /* Domains - Keep 100vh */
        .domains{padding:72px 0;background:white;min-height:100vh;display:flex;align-items:center}
        .dom-top{text-align:center;max-width:600px;margin:0 auto 40px}
        .dom-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:16px}
        .dc{border-radius:18px;padding:32px;border:1px solid var(--bl2);transition:all .3s cubic-bezier(0.22, 1, 0.36, 1);position:relative;overflow:hidden}
        .dc:hover{box-shadow:var(--shl);transform:translateY(-4px) scale(1.01)}
        .dc-h{background:linear-gradient(150deg,#f0faf8,#dff0ec);grid-row:1/3}
        .dc-a{background:linear-gradient(150deg,#f3f0ff,#e8e4ff)}
        .dc-c{background:var(--bg);border-style:dashed}
        .db{display:inline-block;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px}
        .db-h{background:var(--green);color:white}
        .db-a{background:var(--purple);color:white}
        .db-c{background:var(--border);color:var(--t2)}
        .dc h3{font-family:'Fraunces',var(--font-fraunces),serif;font-size:22px;line-height:1.2;letter-spacing:-.4px;margin-bottom:8px}
        .dc .dp{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:14px}
        .dh{display:flex;flex-wrap:wrap;gap:5px}
        .dh span{font-size:11px;background:rgba(255,255,255,.65);padding:3px 10px;border-radius:100px;border:1px solid rgba(0,0,0,.05);font-weight:500}
        .dc-mock{margin-top:20px;background:white;border-radius:12px;padding:16px;border:1px solid rgba(0,0,0,.06)}
        .dm-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f3f0;font-size:12px}
        .dm-row:last-child{border:none}
        .dm-row .dm-l{display:flex;align-items:center;gap:8px}
        .dm-row .dm-i{font-size:14px}
        .dm-row .dm-n{font-weight:600}
        .dm-row .dm-v{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--green);font-weight:600}
        .dm-row .dm-d{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--red);font-weight:600}
        @media(max-width:768px){.dom-grid{grid-template-columns:1fr}.dc-h{grid-row:auto}}

        /* Drift Score - Keep 100vh */
        .drift{padding:72px 0;background:var(--bg);min-height:100vh;display:flex;align-items:center}
        .drift-g{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
        .dv{background:linear-gradient(140deg,#eef8f5,#e0f0ec);border-radius:20px;padding:36px}
        .dv-top{display:flex;align-items:center;gap:24px;margin-bottom:24px}
        .dv-ring{width:140px;height:140px;position:relative;flex-shrink:0}
        .dv-ring svg{width:140px;height:140px}
        .dv-ring .rbg{fill:none;stroke:#cce5df;stroke-width:9}
        .dv-ring .rfl{fill:none;stroke:var(--green);stroke-width:9;stroke-linecap:round;stroke-dasharray:396;stroke-dashoffset:396;transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)}
        .dv-ring .rfl.animated{stroke-dashoffset:110}
        .dv-ring .rc{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
        .dv-ring .rn{font-family:'Fraunces',var(--font-fraunces),serif;font-size:42px;color:var(--green);line-height:1}
        .dv-ring .rl{font-size:11px;color:var(--t3);font-weight:600}
        .dv-info h4{font-size:15px;font-weight:700;margin-bottom:4px}
        .dv-info p{font-size:12px;color:var(--t2);line-height:1.5}
        .dv-factors{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
        .df{background:white;border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:8px;box-shadow:var(--sh)}
        .df .di{font-size:15px}
        .df .dfl{font-size:10px;color:var(--t3)}
        .df .dfv{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600}
        .dv-esc{margin-top:20px;background:white;border-radius:12px;padding:14px;border:1px solid rgba(0,0,0,.05)}
        .dv-esc h5{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--t3);font-weight:600;margin-bottom:10px}
        .esc-row{display:flex;align-items:center;gap:10px;padding:5px 0;font-size:11px}
        .esc-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .esc-line{flex:1;height:1px;background:var(--border)}
        .esc-who{font-weight:600;white-space:nowrap}
        .di-content .sl{margin-bottom:24px}
        .dl{background:white;border-radius:12px;overflow:hidden;border:1px solid var(--bl2)}
        .dlr{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--bl2);transition:background .2s}
        .dlr:last-child{border:none}
        .dlr:hover{background:var(--gl)}
        .dlr .dd{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .dlr .dr{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t3);width:44px}
        .dlr .dn{font-size:13px;font-weight:700;flex:1}
        .dlr .da{font-size:11px;color:var(--t2)}
        @media(max-width:860px){.drift-g{grid-template-columns:1fr}}

        /* CTA with market stats - Keep 100vh */
        .cta{padding:72px 0;background:var(--text);position:relative;overflow:hidden;min-height:100vh;display:flex;align-items:center}
        .cta::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at top,rgba(12,107,94,.12)0%,transparent 60%)}
        .cta-g{position:relative}
        .cta-main{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;margin-bottom:48px}
        .cta-l .sh{color:white}
        .cta-l .sl{color:rgba(255,255,255,.5);margin-bottom:28px}
        .cta-btn{display:inline-flex;align-items:center;gap:8px;background:var(--green);color:white;border:none;padding:15px 32px;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;transition:all .2s;text-decoration:none;font-family:inherit;box-shadow:0 4px 20px rgba(12,107,94,.3)}
        .cta-btn:hover{transform:translateY(-2px);background:#15907f}
        .cta-note{margin-top:14px;font-size:12px;color:rgba(255,255,255,.3)}
        .cta-r{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .cta-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:18px;transition:all .3s cubic-bezier(0.22, 1, 0.36, 1)}
        .cta-card:hover{background:rgba(255,255,255,.1);transform:translateY(-2px)}
        .cta-card .cc-i{font-size:20px;margin-bottom:8px}
        .cta-card h4{font-size:13px;font-weight:700;color:white;margin-bottom:3px}
        .cta-card p{font-size:11px;color:rgba(255,255,255,.45);line-height:1.4}

        /* Market stats in CTA */
        .cta-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding-top:32px;border-top:1px solid rgba(255,255,255,.08)}
        .cta-stat{text-align:center}
        .cta-stat .cs-n{font-family:'Fraunces',var(--font-fraunces),serif;font-size:32px;color:var(--green);line-height:1}
        .cta-stat .cs-l{font-size:11px;color:rgba(255,255,255,.4);margin-top:4px}
        .cta-stat .cs-x{font-size:9px;color:rgba(255,255,255,.25);margin-top:2px;font-style:italic}
        @media(max-width:860px){
          .cta-main{grid-template-columns:1fr}
          .cta-stats{grid-template-columns:repeat(2,1fr)}
        }

        /* Mission callout */
        .mission{padding:48px 0;background:var(--green);color:white;position:relative;overflow:hidden}
        .mission::before{content:'';position:absolute;top:-60px;right:-60px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,.03)}
        .mission-content{position:relative;max-width:800px;margin:0 auto;text-align:center}
        .mission blockquote{font-family:'Fraunces',var(--font-fraunces),serif;font-size:clamp(18px,2.5vw,24px);line-height:1.6;letter-spacing:-.3px;margin-bottom:16px;font-style:italic;opacity:.95}
        .mission .attr{font-size:13px;opacity:.6}
        .mission .research{display:flex;gap:16px;justify-content:center;margin-top:32px;flex-wrap:wrap}
        .mission .lbox{background:rgba(255,255,255,.1);border-radius:12px;padding:14px 18px;font-size:12px;line-height:1.6;border:1px solid rgba(255,255,255,.1);max-width:340px;text-align:left}
        .mission .lbox .lbt{font-weight:700;font-size:9px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;opacity:.5}
        .mission .lbox p{opacity:.85}

        .landing-footer{padding:32px 0;background:var(--text);border-top:1px solid rgba(255,255,255,.05);text-align:center}
        .landing-footer p{font-size:11px;color:rgba(255,255,255,.2)}
        .landing-footer a{color:rgba(255,255,255,.35);text-decoration:none;font-size:11px}
        .landing-footer .fl{display:flex;justify-content:center;gap:16px;margin-bottom:10px}

        /* Enhanced fade-in animations */
        .fade-in{opacity:0;transform:translateY(24px);transition:opacity .6s cubic-bezier(0.22, 1, 0.36, 1),transform .6s cubic-bezier(0.22, 1, 0.36, 1)}
        .fade-in.v{opacity:1;transform:translateY(0)}

        /* Staggered delays */
        .stagger-1{transition-delay:.1s}
        .stagger-2{transition-delay:.2s}
        .stagger-3{transition-delay:.3s}
        .stagger-4{transition-delay:.4s}
        .stagger-5{transition-delay:.5s}

        /* Legacy delay classes */
        .fd1{transition-delay:.08s}.fd2{transition-delay:.16s}.fd3{transition-delay:.24s}.fd4{transition-delay:.32s}
      `}</style>

      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <nav className="landing-nav">
        <div className="i">
          <a href="#" className="logo">
            <div className="lm">u</div>
            <span className="lt">uBelong</span>
          </a>
          <div className="nr">
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#domains">Domains</a>
            <a href="#drift">Drift Score</a>
            <a href="#contact" className="nb">Early Access</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="w">
          <div className="hero-top">
            <div className="hero-l">
              <div className="htag"><i></i> Now live in Bangalore</div>
              <h1>Patients don&apos;t fail.<br /><em>The systems around them do.</em></h1>
              <p className="sub">uBelong detects when someone drifts from their care plan — then coaches every person around them. Diet, fitness, medication, therapy. We build the herd that keeps them on track.</p>
              <div className="hero-btns">
                <a href="#contact" className="bp">Get Early Access →</a>
                <a href="#solution" className="bs">How It Works</a>
              </div>
              <div className="hero-proof">
                <span><strong>2</strong> patients live</span>
                <span><strong>5</strong> herd members active</span>
                <span><strong>92%</strong> med compliance</span>
              </div>
            </div>
            <div className="hero-r">
              <div className="fn fn1"><div className="ft"><div className="fi">🍽️</div><div><div className="fl2">Cook</div><div className="fs">WhatsApp meal plan sent</div></div></div></div>
              <div className="fn fn2"><div className="ft"><div className="fi">💊</div><div><div className="fl2">Spouse</div><div className="fs">Missed med alert</div></div></div></div>
              <div className="fn fn3"><div className="ft"><div className="fi">🩺</div><div><div className="fl2">Doctor</div><div className="fs">SOAP note ready</div></div></div></div>
              <div className="fn fn4"><div className="ft"><div className="fi">🏃</div><div><div className="fl2">Trainer</div><div className="fs">Plan adjusted</div></div></div></div>
              <div className="mock-phone">
                <div className="mock-screen">
                  <div className="mock-bar"><div className="mock-notch"></div></div>
                  <div className="mock-body">
                    <div className="mock-greeting">Good evening</div>
                    <div className="mock-name">Your Dashboard</div>
                    <div className="mock-ring">
                      <svg viewBox="0 0 110 110"><circle className="bg" cx="55" cy="55" r="48" /><circle className="fl" cx="55" cy="55" r="48" /></svg>
                      <div className="center"><div className="sc">72</div><div className="sl">Mild Drift</div></div>
                    </div>
                    <div className="mock-stats">
                      <div className="ms"><div className="v">92%</div><div className="l">Meds</div></div>
                      <div className="ms"><div className="v">6/7</div><div className="l">Meals</div></div>
                      <div className="ms"><div className="v">3.5k</div><div className="l">Steps</div></div>
                      <div className="ms"><div className="v">137d</div><div className="l">Dr Visit</div></div>
                    </div>
                    <div className="mock-alerts">
                      <div className="ma"><div className="mai" style={{ background: "#FFF3E0" }}>🍽️</div><div><div className="mat">Cook got tonight&apos;s plan</div><div className="mas">Ragi dosa + sambar • Low GI</div></div></div>
                      <div className="ma"><div className="mai" style={{ background: "var(--rl)" }}>⚠️</div><div><div className="mat">Evening med missed</div><div className="mas">Spouse alerted 5 min ago</div></div></div>
                      <div className="ma"><div className="mai" style={{ background: "var(--bl)" }}>📋</div><div><div className="mat">SOAP note generated</div><div className="mas">137-day summary for your doctor</div></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM with integrated stats */}
      <section className="problem" id="problem">
        <div className="w">
          <div className="prob-g">
            <div className="prob-l">
              <div className="stag">The Problem</div>
              <h2 className="sh fade-in">Every system around the patient is broken.</h2>
              <p className="sl fade-in">Doctors prescribe into the void. Families can&apos;t see what&apos;s happening. Health apps notify the one person who&apos;s already overwhelmed. The patient is the single point of failure.</p>
              <div className="prob-stats">
                <div className="prob-stat fade-in stagger-1">
                  <div className="ps-n">50%</div>
                  <div className="ps-l">of chronic patients don&apos;t follow care plans</div>
                </div>
                <div className="prob-stat fade-in stagger-2">
                  <div className="ps-n">137</div>
                  <div className="ps-l">days average between doctor visits</div>
                </div>
                <div className="prob-stat fade-in stagger-3">
                  <div className="ps-n">38.9%</div>
                  <div className="ps-l">of Indian adults have fatty liver</div>
                </div>
                <div className="prob-stat fade-in stagger-4">
                  <div className="ps-n">53%</div>
                  <div className="ps-l">HbA1c unreliable due to anemia</div>
                </div>
              </div>
            </div>
            <div className="prob-cards">
              <div className="pc fade-in">
                <div className="pi" style={{ background: "var(--bl)" }}>🏥</div>
                <div>
                  <h3>Doctor prescribes, then disappears</h3>
                  <p>15-minute appointment. A care plan on paper. Then silence for months. Zero visibility into whether the patient followed through, drifted, or got worse.</p>
                  <div className="ptag">No data between visits</div>
                </div>
              </div>
              <div className="pc fade-in stagger-1">
                <div className="pi" style={{ background: "#FFF3E0" }}>🏠</div>
                <div>
                  <h3>Household doesn&apos;t know the plan</h3>
                  <p>The person cooking doesn&apos;t know the diet restrictions. The spouse doesn&apos;t see missed meds. The trainer doesn&apos;t know the limitations. Nobody has the full picture.</p>
                  <div className="ptag">5 people, zero coordination</div>
                </div>
              </div>
              <div className="pc fade-in stagger-2">
                <div className="pi" style={{ background: "var(--rl)" }}>📱</div>
                <div>
                  <h3>Apps talk to the wrong person</h3>
                  <p>Every health app sends reminders to the patient — the person already drowning. When they stop engaging, the app goes silent. Nobody else in the system is told.</p>
                  <div className="ptag">Patient = single point of failure</div>
                </div>
              </div>
              <div className="pc fade-in stagger-3">
                <div className="pi" style={{ background: "var(--pl)" }}>🧩</div>
                <div>
                  <h3>Special needs families carry it alone</h3>
                  <p>A child on the spectrum has 5 therapists, zero shared context, and parents as the only link. One missed session, one forgotten update, and therapy drifts backward.</p>
                  <div className="ptag">Parents = the entire system</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION (merged How It Works + The Herd) */}
      <section className="solution" id="solution">
        <div className="w">
          <div className="solution-top">
            <div className="stag">The Solution</div>
            <h2 className="sh fade-in">Detect drift. Coach the herd. Reverse the slide.</h2>
            <p className="sl fade-in">One AI engine. Five steps. Every person around the patient gets the right information at the right time.</p>
          </div>
          <div className="how-flow fade-in">
            <div className="hf">
              <div className="hn">1</div>
              <div className="he">📋</div>
              <h4>Detect</h4>
              <p>AI parses lab reports, tracks meds, monitors activity. Calculates a real-time Drift Score.</p>
              <div className="hx">drift_score = 72</div>
            </div>
            <div className="hf">
              <div className="hn">2</div>
              <div className="he">🎯</div>
              <h4>Plan</h4>
              <p>Generates condition-specific meal plans, exercise routines, therapy schedules for the patient.</p>
              <div className="hx">4 conditions detected</div>
            </div>
            <div className="hf">
              <div className="hn">3</div>
              <div className="he">📲</div>
              <h4>Distribute</h4>
              <p>Sends plans to the right people — cook on WhatsApp, trainer via app, therapist via dashboard.</p>
              <div className="hx">5 people coached</div>
            </div>
            <div className="hf">
              <div className="hn">4</div>
              <div className="he">🚨</div>
              <h4>Escalate</h4>
              <p>When drift detected, alerts move up: patient → family → caregiver → doctor. Until someone acts.</p>
              <div className="hx">auto-escalation</div>
            </div>
            <div className="hf">
              <div className="hn">5</div>
              <div className="he">↩️</div>
              <h4>Recover</h4>
              <p>The herd closes in. Drift reverses. Nobody falls through the cracks alone.</p>
              <div className="hx">drift → 0</div>
            </div>
          </div>

          {/* The Herd */}
          <div className="herd-section">
            <div className="herd-header">
              <div className="stag">The Herd</div>
              <h2 className="sh fade-in">We coach every system around the patient.</h2>
              <p className="sl fade-in" style={{ maxWidth: "600px", margin: "0 auto" }}>Diet, fitness, medication, clinical, family — each one gets the right information. The patient can&apos;t fail alone because the people around them won&apos;t let them.</p>
            </div>
            <div className="herd-grid" style={{ marginTop: "32px" }}>
              <div className="hc fade-in stagger-1"><div className="hci" style={{ background: "#FFF3E0" }}>🍽️</div><h4>Diet</h4><p>Condition-specific meal plans from lab reports. Sent to whoever cooks.</p><div className="hce">→ Cook gets WhatsApp plan</div></div>
              <div className="hc fade-in stagger-2"><div className="hci" style={{ background: "var(--gl)" }}>🏃</div><h4>Fitness</h4><p>Exercise calibrated to conditions, energy, limitations. Updated daily.</p><div className="hce">→ Trainer gets restrictions</div></div>
              <div className="hc fade-in stagger-3"><div className="hci" style={{ background: "var(--pl)" }}>💊</div><h4>Medication</h4><p>Compliance tracked. Missed doses escalate from patient → spouse → doctor.</p><div className="hce">→ Spouse gets alerts</div></div>
              <div className="hc fade-in stagger-4"><div className="hci" style={{ background: "var(--bl)" }}>🩺</div><h4>Clinical</h4><p>Auto-generated SOAP notes. Drift dashboard. Months of data in 30 seconds.</p><div className="hce">→ Doctor gets prep pack</div></div>
              <div className="hc fade-in stagger-5"><div className="hci" style={{ background: "var(--rl)" }}>👨‍👩‍👦</div><h4>Family</h4><p>Drift alerts, progress updates, care coordination. Family becomes the safety net.</p><div className="hce">→ Family sees Drift Score</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <section className="domains" id="domains">
        <div className="w">
          <div className="dom-top">
            <div className="stag">One Engine, Every Domain</div>
            <h2 className="sh fade-in">Drift happens wherever someone has a plan and people who should help.</h2>
            <p className="sl fade-in">Health is where we start — because drift kills people. The same engine works for autism, development, and beyond.</p>
          </div>
          <div className="dom-grid">
            <div className="dc dc-h fade-in">
              <div className="db db-h">● Health — Live Now</div>
              <h3>Chronic disease management through the household</h3>
              <p className="dp">Diabetes, fatty liver, hypertension, deficiencies. Upload a lab report. AI builds the care plan and distributes it to everyone who controls the patient&apos;s daily outcomes.</p>
              <div className="dh">
                <span>🍽️ Diet</span><span>🏃 Fitness</span><span>💊 Meds</span><span>🩺 Doctor</span><span>👨‍👩‍👦 Family</span><span>🛒 Grocery</span>
              </div>
              <div className="dc-mock">
                <div className="dm-row"><div className="dm-l"><span className="dm-i">🩸</span><span className="dm-n">HbA1c</span></div><div className="dm-d">Elevated ↑</div></div>
                <div className="dm-row"><div className="dm-l"><span className="dm-i">🫀</span><span className="dm-n">Fatty Liver</span></div><div className="dm-d">Detected</div></div>
                <div className="dm-row"><div className="dm-l"><span className="dm-i">💊</span><span className="dm-n">Med Compliance</span></div><div className="dm-v">92% ✓</div></div>
                <div className="dm-row"><div className="dm-l"><span className="dm-i">🍽️</span><span className="dm-n">Meal Adherence</span></div><div className="dm-v">6/7 days</div></div>
                <div className="dm-row"><div className="dm-l"><span className="dm-i">🩺</span><span className="dm-n">Last Doctor Visit</span></div><div className="dm-d">137 days ago</div></div>
              </div>
            </div>
            <div className="dc dc-a fade-in stagger-1">
              <div className="db db-a">● Autism & Development</div>
              <h3>Therapy coordination for special needs families</h3>
              <p className="dp">5 therapists, zero shared context, parents as the only link. uBelong tracks milestones, detects therapy drift, and coaches every person in the care team.</p>
              <div className="dh">
                <span>🗣️ Speech</span><span>🧠 Behavioral</span><span>🏫 School</span><span>👨‍👩‍👦 Parents</span><span>🤲 Aide</span>
              </div>
            </div>
            <div className="dc dc-c fade-in stagger-2">
              <div className="db db-c">● Coming Soon</div>
              <h3>Elderly care, recovery, post-surgery, and beyond</h3>
              <p className="dp">Drift engine is domain-agnostic. Anywhere someone is supposed to stay on track and has people around them — that&apos;s uBelong.</p>
              <div className="dh">
                <span>👴 Elderly</span><span>🧘 Recovery</span><span>🏥 Post-op</span><span>📚 Education</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRIFT SCORE */}
      <section className="drift" id="drift">
        <div className="w">
          <div className="drift-g">
            <div className="dv fade-in" ref={driftRef}>
              <div className="dv-top">
                <div className="dv-ring">
                  <svg viewBox="0 0 140 140">
                    <circle className="rbg" cx="70" cy="70" r="63" />
                    <circle className={`rfl ${driftAnimated ? 'animated' : ''}`} cx="70" cy="70" r="63" />
                  </svg>
                  <div className="rc"><div className="rn">72</div><div className="rl">Mild Drift</div></div>
                </div>
                <div className="dv-info"><h4>Sample Patient</h4><p>Type 2 Diabetes, Fatty Liver,<br />Multiple deficiencies detected</p></div>
              </div>
              <div className="dv-factors">
                <div className="df"><span className="di">💊</span><div><div className="dfv">92%</div><div className="dfl">Med compliance</div></div></div>
                <div className="df"><span className="di">🍽️</span><div><div className="dfv">6/7</div><div className="dfl">Meals followed</div></div></div>
                <div className="df"><span className="di">🩺</span><div><div className="dfv">137d</div><div className="dfl">Since last visit</div></div></div>
                <div className="df"><span className="di">🏃</span><div><div className="dfv">3,582</div><div className="dfl">Avg steps/day</div></div></div>
              </div>
              <div className="dv-esc">
                <h5>Escalation Chain Active</h5>
                <div className="esc-row"><div className="esc-dot" style={{ background: "var(--green)" }}></div><div className="esc-who">Patient</div><div className="esc-line"></div><span style={{ fontSize: "10px", color: "var(--t3)" }}>self-managed</span></div>
                <div className="esc-row"><div className="esc-dot" style={{ background: "var(--amber)" }}></div><div className="esc-who">Cook + Trainer</div><div className="esc-line"></div><span style={{ fontSize: "10px", color: "var(--amber)", fontWeight: 600 }}>active now</span></div>
                <div className="esc-row"><div className="esc-dot" style={{ background: "#ccc" }}></div><div className="esc-who">Spouse</div><div className="esc-line"></div><span style={{ fontSize: "10px", color: "var(--t3)" }}>standby</span></div>
                <div className="esc-row"><div className="esc-dot" style={{ background: "#ccc" }}></div><div className="esc-who">Doctor</div><div className="esc-line"></div><span style={{ fontSize: "10px", color: "var(--t3)" }}>standby</span></div>
              </div>
            </div>
            <div className="di-content fade-in">
              <div className="stag">Drift Score</div>
              <h2 className="sh">One number. Is this person slipping?</h2>
              <p className="sl">Medication, diet, fitness, appointments, therapy sessions — all compressed into a 0–100 score. When it drops, the right people activate in order.</p>
              <div className="dl">
                <div className="dlr"><div className="dd" style={{ background: "var(--green)" }}></div><div className="dr">80–100</div><div className="dn">On Track</div><div className="da">Patient self-managed</div></div>
                <div className="dlr"><div className="dd" style={{ background: "var(--amber)" }}></div><div className="dr">60–79</div><div className="dn">Mild Drift</div><div className="da">Caregivers coached</div></div>
                <div className="dlr"><div className="dd" style={{ background: "#E87040" }}></div><div className="dr">40–59</div><div className="dn">Moderate</div><div className="da">Family alerted</div></div>
                <div className="dlr"><div className="dd" style={{ background: "var(--red)" }}></div><div className="dr">0–39</div><div className="dn">Critical</div><div className="da">Doctor escalated</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION (replaced Story) */}
      <section className="mission">
        <div className="w">
          <div className="mission-content fade-in">
            <blockquote>&quot;The healthcare system is designed for episodes, not journeys. A 15-minute appointment, a prescription, and then silence. We built uBelong because the 137 days between doctor visits matter more than the 15 minutes inside the clinic.&quot;</blockquote>
            <p className="attr">— The uBelong Team</p>
            <div className="research">
              <div className="lbox">
                <div className="lbt">📰 Lancet • Feb 2026</div>
                <p>38.9% of Indian adults have fatty liver disease, driven by diabetes and obesity.</p>
              </div>
              <div className="lbox">
                <div className="lbt">📰 Lancet • Feb 2026</div>
                <p>HbA1c — the gold standard diabetes test — is unreliable in 53% of Indians due to endemic anemia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA with market stats */}
      <section className="cta" id="contact">
        <div className="w">
          <div className="cta-g">
            <div className="cta-main">
              <div className="cta-l">
                <h2 className="sh">Nobody drifts alone anymore.</h2>
                <p className="sl">Whether you&apos;re a doctor with patients who stop showing up, a family managing diabetes, or a parent navigating autism — we&apos;re building this for you.</p>
                <a href="mailto:bernard@ubelong.ai" className="cta-btn">bernard@ubelong.ai →</a>
                <p className="cta-note">uBelong Inc. • Delaware C-Corp • Bangalore, India</p>
              </div>
              <div className="cta-r">
                <div className="cta-card"><div className="cc-i">🩺</div><h4>Doctors</h4><p>Free drift dashboard. See which patients are slipping between visits.</p></div>
                <div className="cta-card"><div className="cc-i">👨‍👩‍👦</div><h4>Families</h4><p>Manage diabetes, autism, or any chronic condition as a team.</p></div>
                <div className="cta-card"><div className="cc-i">🍽️</div><h4>Caregivers</h4><p>Get the right plan for the right condition. No more guessing.</p></div>
                <div className="cta-card"><div className="cc-i">🏥</div><h4>Clinics</h4><p>Patient compliance data. SOAP notes. Drift scores for your panel.</p></div>
              </div>
            </div>
            <div className="cta-stats">
              <div className="cta-stat fade-in stagger-1">
                <div className="cs-n"><span ref={diabetics.ref}>{diabetics.count}</span>M</div>
                <div className="cs-l">Diabetics in India</div>
                <div className="cs-x">Growing 20% per decade</div>
              </div>
              <div className="cta-stat fade-in stagger-2">
                <div className="cs-n"><span ref={chronic.ref}>{chronic.count}</span>M</div>
                <div className="cs-l">Chronic conditions</div>
                <div className="cs-x">1 in 2 Indian adults</div>
              </div>
              <div className="cta-stat fade-in stagger-3">
                <div className="cs-n">1 in <span ref={spectrum.ref}>{spectrum.count}</span></div>
                <div className="cs-l">Children on the spectrum</div>
                <div className="cs-x">5 therapists, zero coordination</div>
              </div>
              <div className="cta-stat fade-in stagger-4">
                <div className="cs-n">$<span ref={cost.ref}>{cost.count.toFixed(1)}</span>T</div>
                <div className="cs-l">Global chronic disease cost</div>
                <div className="cs-x">80% preventable with adherence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="w">
          <div className="fl">
            <a href="https://ubelong.to">ubelong.to</a>
            <a href="mailto:bernard@ubelong.ai">Contact</a>
          </div>
          <p>© 2026 uBelong Inc. Building systems that care.</p>
        </div>
      </footer>
    </>
  );
}
