'use client';

import { RiskScoreCard } from '@/components/features/RiskScoreCard';
import { GlobalMap } from '@/components/features/GlobalMap';
import { InitiativesTracker } from '@/components/features/InitiativesTracker';
import { ImpactProjections } from '@/components/features/ImpactProjections';
import { CompanyKPIs } from '@/components/features/CompanyKPIs';
import { TopLocations } from '@/components/features/TopLocations';
import { TopRisks } from '@/components/features/TopRisks';

export default function DashboardPage() {
  const cardStyle = "bg-blue-100 border-blue-300 border-2";

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[calc(100vh-6rem)]">
      {/* Section A1: Top Left 2x2 Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        <RiskScoreCard className={cardStyle} />
        <CompanyKPIs className={cardStyle} />
        <TopLocations className={cardStyle} />
        <TopRisks className={cardStyle} />
      </div>

      {/* Section B1: Top Right */}
      <div className="h-full">
        <GlobalMap className={`${cardStyle} h-full`} />
      </div>

      {/* Section A2: Bottom Left */}
      <div className="h-full">
        <InitiativesTracker className={`${cardStyle} h-full`} />
      </div>

      {/* Section B2: Bottom Right */}
      <div className="h-full">
        <ImpactProjections className={`${cardStyle} h-full`} />
      </div>
    </div>
  );
}