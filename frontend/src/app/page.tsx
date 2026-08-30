import { Hero } from '@/components/landing/Hero';
import { PopularDestinations } from '@/components/landing/PopularDestinations';
import { AgentFlowShowcase } from '@/components/landing/AgentFlowShowcase';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <AgentFlowShowcase />
      <PopularDestinations />
    </div>
  );
}
