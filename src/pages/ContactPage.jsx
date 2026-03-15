import React from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Globe,
  Mail,
  MessageCircle,
} from 'lucide-react';

const ContactPage = () => {
  const socialLinks = [
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/faizanbutt15/', icon: Linkedin },
    { title: 'GitHub', href: 'https://github.com/Faizanbutt15', icon: Github },
    { title: 'Portfolio', href: 'https://faizan-masood-portfolio.vercel.app', icon: Globe },
    { title: 'Email', href: 'mailto:buttfaizan875@gmail.com', icon: Mail },
    { title: 'WhatsApp', href: 'https://wa.me/923027959570', icon: MessageCircle },
    { title: 'Facebook', href: 'https://www.facebook.com/faizan.butt.172856/', icon: Facebook },
    { title: 'Instagram', href: 'https://www.instagram.com/faizanbutt_15/', icon: Instagram },
  ];

  return (
    <>
      <div className="relative py-24 text-center bg-black text-white border-b border-stone-200 overflow-hidden">
        <div className="about-stars" aria-hidden="true" />
        <div className="about-stars about-stars-layer" aria-hidden="true" />
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.12em] uppercase font-medium text-white mb-2 relative z-10">
            Contact Us
          </h1>
          <p className="text-white/70 text-xs tracking-[0.1em] uppercase relative z-10">
            Home <span className="font-semibold text-white"> &gt; Contact</span>
          </p>
        </div>
      </div>

      <section className="py-16 bg-[#efefef]">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-stone-200 p-8">
            <h2 className="font-display text-2xl md:text-3xl tracking-[0.08em] uppercase text-[#0b1f47] mb-6">
              Get In Touch
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Address:</span> Sialkot, Punjab, Pakistan
              </p>
              <p>
                <span className="font-semibold text-gray-900">Email:</span>{' '}
                <a href="mailto:buttfaizan875@gmail.com" className="underline underline-offset-2">
                  buttfaizan875@gmail.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-900">Phone:</span>{' '}
                <a href="tel:+923027959570" className="underline underline-offset-2">
                  +92 302 7959570
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-900">Working Hours:</span> Mon - Sat, 8:00 AM - 11:00 PM
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.title}
                    className="inline-flex items-center justify-center w-9 h-9 border border-black text-black hover:bg-gray-700 hover:text-white transition"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-8">
            <h3 className="text-sm tracking-[0.12em] uppercase font-semibold text-gray-900 mb-6">Send Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs tracking-[0.08em] uppercase text-gray-500 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full h-12 border border-stone-300 px-4 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.08em] uppercase text-gray-500 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 border border-stone-300 px-4 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.08em] uppercase text-gray-500 mb-2">Message</label>
                <textarea
                  rows={5}
                  placeholder="Write your message"
                  className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
              <button
                type="button"
                className="bg-black text-white  hover:bg-gray-700 text-xs tracking-[0.14em] uppercase font-semibold py-3 px-6 transition duration-200"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
      <style>{`
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
    </>
  );
};

export default ContactPage;

