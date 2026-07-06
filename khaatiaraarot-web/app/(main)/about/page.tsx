import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Fraunces, Inter } from "next/font/google";
import { Leaf, Handshake, PackageOpen, HeartPulse, Sprout } from "lucide-react";

// ── Fonts ──────────────────────────────────────────────────────────
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "About Us | Khaati Aarot",
  description:
    "Khaati Aarot delivers fresh, preservative-free fruits and crops from the fields to your doorstep — grown with care, handpicked with love.",
};

// ── Content ────────────────────────────────────────────────────────
const pillars = [
  {
    icon: HeartPulse,
    title: "100% Preservative-Free",
    teaser: "Just as nature intended.",
    detail:
      "Our fruits are free from harmful chemicals, wax coatings, and artificial preservatives — nothing added, nothing hidden. What you taste is exactly what grew in the soil.",
  },
  {
    icon: Handshake,
    title: "Farmer-First Approach",
    teaser: "We work directly with local farmers.",
    detail:
      "No dishonest middlemen, no exploitation. We pay farmers fairly and build lasting relationships, so every purchase supports the hands that truly feed us.",
  },
  {
    icon: PackageOpen,
    title: "Sustainable Packaging",
    teaser: "Sustainability isn't a trend for us.",
    detail:
      "Our gift boxes are entirely plastic-free, padded with natural dry straw and sealed without staplers or synthetic adhesives. Bulk orders travel in reusable crates with recycled newspaper padding — nothing goes to waste.",
  },
];

const goals = [
  {
    number: "03",
    title: "Good Health and Well-being",
    copy: "By providing clean, chemical-free produce that nourishes rather than compromises.",
  },
  {
    number: "08",
    title: "Decent Work and Economic Growth",
    copy: "By empowering farmers and standing behind ethical, exploitation-free trade practices.",
  },
];

// ── Page ───────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div
      className={`${fraunces.variable} ${inter.variable} min-h-screen bg-[#fdf8f7] font-[family-name:var(--font-body)]`}
    >
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-14 sm:pb-20 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-[#5B1A18] bg-[#f9f1f0] border border-[#f0e8e7] px-3 py-1.5 rounded-full">
              <Sprout size={13} />
              From the fields to your doorstep
            </span>

            <h1 className="mt-5 font-[family-name:var(--font-display)] text-[2.5rem] leading-[1.05] sm:text-6xl sm:leading-[1.02] lg:text-[4rem] text-[#2d1010] font-medium">
              Where purity
              <br />
              <span className="italic text-[#5B1A18]">meets purpose.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#4a2020] leading-relaxed max-w-xl">
              Real health starts at the root — quite literally. We deliver
              fresh, preservative-free fruits and crops, grown with care,
              handpicked with love, and delivered with pride.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="px-6 py-3 rounded-xl bg-[#5B1A18] text-white text-sm font-semibold hover:bg-[#7a2320] transition-colors duration-200"
              >
                Shop the harvest
              </Link>
              <a
                href="#pillars"
                className="px-6 py-3 rounded-xl border-2 border-[#f0e8e7] text-[#5B1A18] text-sm font-semibold hover:border-[#5B1A18] transition-colors duration-200"
              >
                Our promise
              </a>
            </div>
          </div>

          {/* Hero image placeholder — swap src with a real product/farm photo */}
          <div className="relative mx-auto w-full max-w-[420px] rounded-3xl overflow-hidden border border-[#f0e8e7] bg-[#f9f1f0]">
            <Image
              src="/Images/aboutusphoto.jpg"
              alt="Freshly harvested fruit from Khaati Aarot"
              height={420}
              width={420}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── What Sets Us Apart (hover cards) ── */}
      <section id="pillars" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-wide uppercase text-[#9b7b7a]">
            What sets us apart
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-[#2d1010] font-medium">
            A promise in every crate.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {pillars.map(({ icon: Icon, title, teaser, detail }) => (
            <div
              key={title}
              tabIndex={0}
              className="group relative rounded-2xl border-2 border-[#f0e8e7] bg-white overflow-hidden transition-colors duration-300 hover:border-[#5B1A18] focus-visible:border-[#5B1A18] focus-visible:outline-none"
            >
              <div className="p-6 sm:p-7">
                <div className="w-11 h-11 rounded-xl bg-[#f9f1f0] flex items-center justify-center text-[#5B1A18] transition-colors duration-300 group-hover:bg-[#5B1A18] group-hover:text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#2d1010]">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-[#9b7b7a]">{teaser}</p>
              </div>

              {/* Paragraph tucked beneath the card — slides open on hover/focus */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                <div className="overflow-hidden">
                  <p className="px-6 sm:px-7 pb-6 sm:pb-7 pt-4 text-sm text-[#4a2020] leading-relaxed border-t border-[#f0e8e7]">
                    {detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Farmer-first pull quote ── */}
      <section className="bg-[#f9f1f0] border-y border-[#f0e8e7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <Leaf size={22} className="mx-auto text-[#5B1A18]" />
          <p className="mt-5 font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl lg:text-4xl text-[#2d1010] leading-snug">
            "When you buy from us, you're supporting the hands
            that truly feed us."
          </p>
          <p className="mt-4 text-sm text-[#9b7b7a]">
            Fair compensation. No middlemen. Just honest trade.
          </p>
        </div>
      </section>

      {/* ── SDG alignment ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-wide uppercase text-[#9b7b7a]">
            Aligned with global goals
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-[#2d1010] font-medium">
            Purpose you can trace back.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#4a2020] leading-relaxed">
            We shape the way we grow and package around the United Nations
            Sustainable Development Goals.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {goals.map((goal) => (
            <div
              key={goal.number}
              className="rounded-2xl border-2 border-[#f0e8e7] bg-white p-6 sm:p-8 flex gap-5"
            >
              <span className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[#5B1A18]/25 leading-none shrink-0">
                {goal.number}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[#2d1010]">
                  {goal.title}
                </h3>
                <p className="mt-2 text-sm text-[#4a2020] leading-relaxed">
                  {goal.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="rounded-3xl bg-[#5B1A18] px-6 py-12 sm:px-14 sm:py-16 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-white font-medium">
            Taste what purity feels like.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/70 max-w-md mx-auto">
            Fresh from the field, straight to your door — nothing added,
            nothing compromised.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-flex px-7 py-3 rounded-xl bg-white text-[#5B1A18] text-sm font-semibold hover:bg-[#fdf8f7] transition-colors duration-200"
          >
            Browse the shop
          </Link>
        </div>
      </section>
    </div>
  );
}