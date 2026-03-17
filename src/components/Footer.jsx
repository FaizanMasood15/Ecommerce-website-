import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Globe,
  Mail,
  MessageCircle,
} from 'lucide-react';

const Footer = () => {
  const platformLinks = [
    { title: 'Home', to: '/' },
    { title: 'Shop', to: '/shop' },
    { title: 'About', to: '/about' },
    { title: 'Contact', to: '/contact' },
    { title: 'Returns', to: '/returns' },
    { title: 'Privacy Policy', to: '/privacy-policy' },
  ];

  const developerLinks = [
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/faizanbutt15/' },
    { title: 'GitHub', href: 'https://github.com/Faizanbutt15' },
    { title: 'Portfolio', href: 'https://faizan-masood-portfolio.vercel.app' },
  ];

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
    <footer className="bg-white border-t-4 border-black pt-14 pb-8">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <h3 className="font-display text-2xl tracking-[0.18em] font-medium text-gray-900 mb-4">Funiro15</h3>
            <p className="text-sm text-gray-600 mb-5">Crafted with precision. Built for scale.</p>
            <p className="text-sm text-gray-500 mb-2">Sialkot, Punjab, Pakistan</p>
            <p className="text-sm text-gray-500 mb-2">
              Email:{' '}
              <a href="mailto:buttfaizan875@gmail.com" className="text-gray-900 hover:text-black underline underline-offset-2">
                buttfaizan875@gmail.com
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Phone:{' '}
              <a href="tel:+923027959570" className="text-gray-900 hover:text-black underline underline-offset-2">
                +92 302 7959570
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full md:w-auto">
            <div className="lg:pl-8">
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-5">Platform</h4>
              <ul className="space-y-3">
                {platformLinks.map((item) => (
                  <li key={item.title}>
                    <Link to={item.to} className="text-sm tracking-[0.08em] uppercase text-gray-900 hover:text-black transition">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-5">Developer</h4>
              <ul className="space-y-3">
                {developerLinks.map((item) => (
                  <li key={item.title}>
                    <a href={item.href} target="_blank" rel="noreferrer" className="text-sm tracking-[0.08em] uppercase text-gray-900 hover:text-black transition">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-5">Connect</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.title}
                      className="group inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-xs uppercase tracking-[0.14em] text-gray-700 hover:border-black hover:text-black transition"
                    >
                      <Icon className="w-4 h-4 text-black" />
                      {item.title}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-200">
          <p className="text-xs tracking-[0.16em] uppercase text-gray-600">
            © 2026 Funiro15 · Designed & Developed by Faizan Butt · BSc Software Engineering, UOL
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


