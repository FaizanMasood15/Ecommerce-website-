import React, { useEffect, useRef, useState } from 'react';
import { Linkedin, Github, Globe, Mail, Instagram, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  const revealRefs = useRef([]);
  const [revealed, setRevealed] = useState({});
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onChange = (event) => setReducedMotion(event.matches);
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const key = entry.target.dataset.revealKey;
          if (!key) return;
          setRevealed((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    revealRefs.current.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [reducedMotion]);

  const registerReveal = (key) => (node) => {
    if (!node) return;
    node.dataset.revealKey = key;
    if (!revealRefs.current.includes(node)) {
      revealRefs.current.push(node);
    }
    if (reducedMotion) {
      setRevealed((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
    }
  };

  const revealClass = (key, base = '') =>
    `${base} transition-all duration-700 ease-out ${reducedMotion || revealed[key] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  const socials = [
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/faizanbutt15/', icon: Linkedin },
    { title: 'GitHub', href: 'https://github.com/Faizanbutt15', icon: Github },
    { title: 'Instagram', href: 'https://www.instagram.com/faizanbutt_15/', icon: Instagram },
    { title: 'Portfolio', href: 'https://faizan-masood-portfolio.vercel.app', icon: Globe },
    { title: 'Email', href: 'mailto:buttfaizan875@gmail.com', icon: Mail },
  ];

  const founderImage = '/FaizanMasood-Founder.jpeg';

  return (
    <div className="bg-white text-gray-900">
      <section className="relative border-b border-stone-200 bg-black text-white overflow-hidden">
        <div className="about-stars" aria-hidden="true" />
        <div className="about-stars about-stars-layer" aria-hidden="true" />
        <div className="container mx-auto max-w-6xl px-4 lg:px-8 py-20 md:py-24 relative z-10">
          <div
            ref={registerReveal('hero')}
            className={revealClass('hero', 'grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start')}
          >
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-white/60 mb-4">About</p>
              <h1 className="font-display text-4xl md:text-5xl leading-tight mb-5">
                A clean, client-ready commerce experience.
              </h1>
              <p className="text-base md:text-lg text-white/75 leading-relaxed">
                Built for businesses that need a premium storefront without the complexity. Clear structure, fast pages,
                and a checkout flow that feels effortless for customers.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Conversion-focused', 'Mobile-first', 'Easy to scale'].map((item) => (
                  <span
                    key={item}
                    className="text-xs uppercase tracking-[0.3em] border border-white/25 px-3 py-2 rounded-full text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 p-6 bg-black/60 backdrop-blur shadow-sm">
              <p className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4">Client Snapshot</p>
              <div className="space-y-3 text-sm">
                {[
                  'Launch-ready in weeks, not months',
                  'Fast load times on any device',
                  'Clean UX that builds instant trust',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-white mt-0.5" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                {[
                  { label: 'Launch', value: '14d' },
                  { label: 'Lift', value: '32%' },
                  { label: 'Speed', value: '90+' },
                ].map((item) => (
                  <div key={item.label} className="border border-white/20 rounded-xl py-3">
                    <p className="text-lg font-semibold">{item.value}</p>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white text-gray-900">
        <div className="container mx-auto max-w-6xl px-4 lg:px-8">
          <div ref={registerReveal('capabilities')} className={revealClass('capabilities', 'max-w-3xl')}>
            <p className="text-xs tracking-[0.35em] uppercase text-gray-500 mb-4">Capabilities</p>
            <h2 className="font-display text-3xl md:text-4xl mb-4">Simple aesthetics with real business impact.</h2>
            <p className="text-gray-600">
              Clean typography, strong spacing, and a clear hierarchy so buyers focus on products, not noise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {[
              {
                title: 'Clear Structure',
                body: 'Simple layouts that guide attention and shorten decision time.',
              },
              {
                title: 'Product-First Layouts',
                body: 'Grid and detail views that make items feel premium and easy to compare.',
              },
              {
                title: 'Fast Performance',
                body: 'Lightweight pages that feel instant on mobile and desktop.',
              },
              {
                title: 'Trust Signals',
                body: 'Consistent spacing, clean UI, and polished details that feel reliable.',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                ref={registerReveal(`cap-${index}`)}
                style={{ transitionDelay: `${index * 120}ms` }}
                className={revealClass(
                  `cap-${index}`,
                  'relative overflow-hidden rounded-2xl border border-black p-6 bg-black text-white'
                )}
              >
                <div className="about-stars" aria-hidden="true" />
                <div className="about-stars about-stars-layer" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2 relative z-10">{item.title}</h3>
                <p className="text-sm text-white/75 leading-relaxed relative z-10">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f7f7f7] text-gray-900">
        <div className="container mx-auto max-w-6xl px-4 lg:px-8">
          <div ref={registerReveal('stats')} className={revealClass('stats', 'max-w-3xl')}>
            <p className="text-xs tracking-[0.35em] uppercase text-gray-500 mb-4">Highlights</p>
            <h2 className="font-display text-3xl md:text-4xl mb-4">Built to perform from day one.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { label: 'Launch Ready', value: '14 Days' },
              { label: 'Conversion Lift', value: '32%' },
              { label: 'Speed Score', value: '90+' },
            ].map((item, index) => (
              <div
                key={item.label}
                ref={registerReveal(`stat-${index}`)}
                style={{ transitionDelay: `${index * 120}ms` }}
                className={revealClass(
                  `stat-${index}`,
                  'relative overflow-hidden bg-black border border-black rounded-2xl p-6 text-center text-white shadow-sm'
                )}
              >
                <div className="about-stars" aria-hidden="true" />
                <div className="about-stars about-stars-layer" aria-hidden="true" />
                <p className="text-2xl font-semibold relative z-10">{item.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60 mt-2 relative z-10">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white text-gray-900">
        <div className="container mx-auto max-w-6xl px-4 lg:px-8">
          <div ref={registerReveal('process')} className={revealClass('process', 'max-w-3xl')}>
            <p className="text-xs tracking-[0.35em] uppercase text-gray-500 mb-4">Process</p>
            <h2 className="font-display text-3xl md:text-4xl mb-4">A short, focused delivery cycle.</h2>
            <p className="text-gray-600">
              Clear steps keep the project fast, aligned, and ready for launch without rework.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { title: 'Discover', body: 'Map the brand, audience, and product structure.' },
              { title: 'Design + Build', body: 'Create the UI and wire up the storefront in parallel.' },
              { title: 'Launch', body: 'Finalize polish, test flows, and go live.' },
            ].map((item, index) => (
              <div
                key={item.title}
                ref={registerReveal(`process-${index}`)}
                style={{ transitionDelay: `${index * 120}ms` }}
                className={revealClass(
                  `process-${index}`,
                  'relative overflow-hidden rounded-2xl border border-black p-6 bg-black text-white'
                )}
              >
                <div className="about-stars" aria-hidden="true" />
                <div className="about-stars about-stars-layer" aria-hidden="true" />
                <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3 relative z-10">Step {index + 1}</p>
                <h3 className="text-lg font-semibold mb-2 relative z-10">{item.title}</h3>
                <p className="text-sm text-white/75 leading-relaxed relative z-10">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-black text-white overflow-hidden">
        <div className="about-stars" aria-hidden="true" />
        <div className="about-stars about-stars-layer" aria-hidden="true" />
        <div className="container mx-auto max-w-6xl px-4 lg:px-8 relative z-10">
          <div ref={registerReveal('founder')} className={revealClass('founder', 'grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start')}>
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-white/60 mb-4">Founder</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">Faizan Butt</h2>
              <p className="text-white/70 leading-relaxed">
                Full-stack developer focused on clean, conversion-led e-commerce experiences. The goal is simple: help
                businesses present their products beautifully and sell with confidence.
              </p>
              <p className="mt-4 text-sm text-white/70">
                Helping brands convert with clean, fast storefronts.
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/75">
                <p><span className="text-white/60">Education:</span> BSc Software Engineering, University of Lahore (2020–2024)</p>
                <p><span className="text-white/60">Experience:</span> 2+ years building production-ready web apps across MERN and Laravel</p>
                <p><span className="text-white/60">Projects:</span> Gymdesk15 (SaaS), School Management System (SaaS), Plant Pal Pro (AI), and this E-Commerce platform</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                <span className="border border-white/20 px-3 py-2 rounded-full">5+ Products Shipped</span>
                <span className="border border-white/20 px-3 py-2 rounded-full">Sialkot, Pakistan</span>
              </div>
            </div>
            <div className="rounded-2xl border border-[#3a0a12] p-6 bg-[#0b0c10]/80 backdrop-blur">
              <div className="relative w-32 h-32 mx-auto">
                <div className="about-ring w-32 h-32 rounded-full flex items-center justify-center text-xl font-semibold overflow-hidden">
                  {founderImage ? (
                    <img
                      src={founderImage}
                      alt="Faizan Butt"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    'FM'
                  )}
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#0b0c10]" />
              </div>
              <h3 className="text-center text-2xl font-semibold text-white mt-4">Faizan Butt</h3>
              <p className="text-center text-sm uppercase tracking-[0.3em] text-[#a1152d] mt-1">Founder & CEO</p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-full border border-white/20 px-4 py-2">
                  <span className="text-white/60">Role</span>
                  <span className="text-white">Full-Stack Developer</span>
                </div>
                <div className="flex items-center justify-between rounded-full border border-white/20 px-4 py-2">
                  <span className="text-white/60">Focus</span>
                  <span className="text-white">E-Commerce Growth</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-3">
                {socials.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/25 text-white/80 hover:border-white hover:text-white transition"
                      aria-label={item.title}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-ring {
          position: relative;
          border-radius: 999px;
          box-shadow: 0 0 18px rgba(161,21,45,0.45);
        }

        .about-ring::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          background: conic-gradient(
            from 0deg,
            rgba(161,21,45,0.15),
            rgba(161,21,45,0.95) 18%,
            rgba(161,21,45,0.2) 38%,
            rgba(161,21,45,0.9) 60%,
            rgba(161,21,45,0.2) 78%,
            rgba(161,21,45,0.8)
          );
          animation: about-ring-spin 6s linear infinite;
          z-index: 0;
        }

        .about-ring::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: #0b0c10;
          border-radius: 999px;
          z-index: 1;
        }

        .about-ring > img,
        .about-ring > span {
          position: relative;
          z-index: 2;
          border-radius: 999px;
        }

        @keyframes about-ring-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .about-stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(3px 3px at 20px 30px, rgba(255,255,255,0.95), transparent 55%),
            radial-gradient(2px 2px at 80px 120px, rgba(255,255,255,0.9), transparent 55%),
            radial-gradient(3px 3px at 160px 200px, rgba(255,255,255,0.9), transparent 55%),
            radial-gradient(2px 2px at 220px 80px, rgba(255,255,255,0.95), transparent 55%),
            radial-gradient(2px 2px at 300px 160px, rgba(255,255,255,0.9), transparent 55%),
            radial-gradient(3px 3px at 420px 60px, rgba(255,255,255,0.95), transparent 55%),
            radial-gradient(2px 2px at 520px 180px, rgba(255,255,255,0.9), transparent 55%),
            radial-gradient(3px 3px at 620px 120px, rgba(255,255,255,0.95), transparent 55%),
            radial-gradient(2px 2px at 720px 200px, rgba(255,255,255,0.9), transparent 55%),
            radial-gradient(3px 3px at 860px 80px, rgba(255,255,255,0.95), transparent 55%);
          background-size: 220px 160px;
          background-repeat: repeat;
          opacity: 1;
          pointer-events: none;
          z-index: 0;
        }

        .about-stars-layer {
          background-size: 300px 200px;
          filter: blur(0.3px);
          opacity: 0.8;
          animation: star-drift 14s linear infinite;
        }

        @keyframes star-drift {
          0% { transform: translateY(0); }
          100% { transform: translateY(120px); }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
