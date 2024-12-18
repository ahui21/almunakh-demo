'use client';

import { Card } from '@/components/ui/card';
import { CardHeader } from '@/components/features/shared/CardHeader';

export function HeaderTest() {
  return (
    <Card className="p-6">
      <CardHeader 
        title="Test Header"
        subtitle="This is a test"
      />
      <div>Content</div>
    </Card>
  );
} 