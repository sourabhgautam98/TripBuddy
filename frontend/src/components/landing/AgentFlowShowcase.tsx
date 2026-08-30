import { Sparkles, Bot, Search, Route, ShieldCheck, MapPin, Zap } from 'lucide-react';

export function AgentFlowShowcase() {
  const steps = [
    {
      icon: Search,
      title: '1. Autonomous Research',
      desc: 'Calls Google Places to fetch verified coordinates, reviews, opening hours, and photos.',
      badge: 'searchPlaces',
    },
    {
      icon: Route,
      title: '2. Transit Route Modeling',
      desc: 'Calculates real-world bike/car travel times, distances, and speeds between stops.',
      badge: 'calculateRoute',
    },
    {
      icon: MapPin,
      title: '3. Contextual Dining',
      desc: 'Finds authentic regional cafes & restaurants near scheduled activities.',
      badge: 'searchRestaurants',
    },
    {
      icon: Zap,
      title: '4. Schedule Optimization',
      desc: 'Eliminates geographic backtracking using 2-opt TSP algorithms.',
      badge: 'optimizeRoute',
    },
    {
      icon: ShieldCheck,
      title: '5. Zod Validation',
      desc: 'Strictly validates JSON schemas to ensure zero broken or invented data.',
      badge: 'Schema Validated',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-950/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Bot className="w-3.5 h-3.5" />
            <span>Agentic Architecture</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Why It Feels Like a Real Concierge
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Unlike simple LLM chatbots that hallucinate distances and closed venues, our agent executes real backend tools to verify every single coordinate and travel segment.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="glass-card p-5 rounded-2xl flex flex-col justify-between relative group hover:border-cyan-500/40 transition-all duration-300"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800/80 text-amber-400 border border-amber-500/20 inline-block mb-2">
                    {step.badge}
                  </span>
                  <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
