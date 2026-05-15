"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  Clock,
  FacebookLogo,
  InstagramLogo,
  WhatsappLogo,
  YoutubeLogo,
  ArrowRight,
} from "@phosphor-icons/react";

const footerLinks = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Offers", href: "/offers" },
    { label: "Contact", href: "/contact" },
  ],
  categories: [
    { label: "Shossho (শস্য)", href: "/category/shossho" },
    { label: "Moshla (মশলা)", href: "/category/moshla" },
    { label: "Fruits (ফলমূল)", href: "/category/fruits" },
    { label: "Oil (তেল)", href: "/category/oil" },
    { label: "Imported Goods", href: "/category/imported-goods" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Shipping Policy", href: "/shipping" },
  ],
};

const socials = [
  {
    icon: FacebookLogo,
    href: "https://facebook.com",
    label: "Facebook",
    color: "hover:bg-blue-600",
  },
  {
    icon: InstagramLogo,
    href: "https://instagram.com",
    label: "Instagram",
    color: "hover:bg-pink-600",
  },
  {
    icon: WhatsappLogo,
    href: "https://whatsapp.com",
    label: "WhatsApp",
    color: "hover:bg-green-600",
  },
  {
    icon: YoutubeLogo,
    href: "https://youtube.com",
    label: "YouTube",
    color: "hover:bg-red-600",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a0a0a]">

      {/* ── Newsletter strip ── */}
      {/* <div className="border-b border-[#2e1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              Stay fresh with our newsletter
            </h3>
            <p className="text-sm text-[#a07850]">
              Weekly deals, seasonal picks and farm stories — straight to your inbox.
            </p>
          </div>
          <div className="flex items-center w-full sm:w-auto gap-0 rounded-xl overflow-hidden border border-[#3d1f0a] shrink-0">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-64 px-4 py-3 bg-[#2c1a0e] text-sm text-white placeholder-[#7a5535] outline-none"
            />
            <button className="flex items-center gap-2 bg-[#8B0000] hover:bg-[#6e0000] text-white text-sm font-semibold px-5 py-3 transition-colors duration-200 shrink-0">
              Subscribe
              <ArrowRight size={15} weight="bold" />
            </button>
          </div>
        </div>
      </div> */}

      {/* ── Main footer ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand col ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="mb-5">
              <p className="text-xl font-bold text-[#FAC775]">
                খাঁটি <span className="text-white">আরত</span>
              </p>
              <p className="text-[10px] tracking-widest text-[#FEEFB6] uppercase mt-0.5">
                Pure · Fresh · Local
              </p>
            </div>

            <p className="text-sm text-ex text-[#FEEFB6] leading-relaxed mb-6">
              Your trusted source for fresh, preservative-free groceries.
              Sourced directly from local farms across Bangladesh and
              delivered with love.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl bg-[#2c1a0e] flex items-center justify-center cursor-not-allowed text-[#c8a882] ${color} hover:text-white transition-all duration-200`}
                >
                  <Icon size={18} weight="fill" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-sm font-bold text-white ml-4 mb-5 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#FEEFB6] hover:text-[#FAC775] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={12}
                      weight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#8B0000]"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div>
            <h4 className="text-sm font-bold text-white ml-4 mb-5 uppercase tracking-wider">
              Categories
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.categories.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#FEEFB6] hover:text-[#FAC775] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={12}
                      weight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#8B0000]"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2c1a0e] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={15} weight="fill" className="text-[#8B0000]" />
                </div>
                <p className="text-sm text-[#FEEFB6] leading-relaxed">
                  Dhaka, Bangladesh
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2c1a0e] flex items-center justify-center shrink-0">
                  <Phone size={15} weight="fill" className="text-[#8B0000]" />
                </div>
                <a
                  href="tel:+8801700000000"
                  className="text-sm text-[#FEEFB6] hover:text-[#FAC775] transition-colors duration-200"
                >
                  +880 170-000-0000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2c1a0e] flex items-center justify-center shrink-0">
                  <EnvelopeSimple size={15} weight="fill" className="text-[#8B0000]" />
                </div>
                <a
                  href="mailto:hello@khaatiaarot.com"
                  className="text-sm text-[#FEEFB6] hover:text-[#FAC775] transition-colors duration-200 break-all"
                >
                  hello@khaatiaarot.com
                </a>
              </li>
              {/* <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2c1a0e] flex items-center justify-center shrink-0">
                  <Clock size={15} weight="fill" className="text-[#8B0000]" />
                </div>
                <p className="text-sm text-[#FEEFB6] leading-relaxed">
                  Sat – Thu: 8AM – 9PM
                </p>
              </li> */}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#2e1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#5a3520] text-center sm:text-left">
            © {new Date().getFullYear()} খাঁটি আরত. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {footerLinks.policies.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[11px] text-[#5a3520] hover:text-[#a07850] transition-colors duration-200 whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}