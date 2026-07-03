import { Marquee } from "./ui/marquee";

const features = [
  "Conversion Rate Optimization",
  "Strategic Lead Generation",
  "High-Performance Websites",
  "Marketing Automation",
  "AI Receptionist",
  "B2B Sales Systems",
  "SEO & Content Strategy",
  "Paid Advertising",
  "Brand Strategy"
];

export default function FeaturesMarquee() {
  return (
    <section className="py-8 border-y border-zinc-200 bg-zinc-50 overflow-hidden">
      <div className="flex items-center justify-center w-full">
        <Marquee pauseOnHover={true} className="[--duration:600s]">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center mx-8">
              <span className="text-lg md:text-xl font-bold text-zinc-700 whitespace-nowrap tracking-tight">
                {feature}
              </span>
              <span className="mx-8 text-brand-red font-extrabold text-2xl">•</span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
