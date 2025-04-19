
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

const ServicesOverview = () => {
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('renewal_date', { ascending: true });
        
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id}>
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted-foreground">
                Renews: {format(new Date(service.renewal_date), 'MMM dd, yyyy')}
              </p>
            </div>
            <p className="font-semibold">${service.cost.toFixed(2)}</p>
          </CardContent>
        </Card>
      ))}
      
      {services.length === 0 && (
        <p className="text-center text-muted-foreground">No active subscriptions</p>
      )}
    </div>
  );
};

export default ServicesOverview;
