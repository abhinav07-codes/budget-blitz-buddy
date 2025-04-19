
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { expenses, category } = await req.json();
    
    // Analyze spending patterns
    const totalSpent = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
    const avgSpent = totalSpent / expenses.length;
    
    // Generate category-specific insights
    let insights = '';
    if (category === 'food') {
      insights = `Based on your food expenses (avg: $${avgSpent.toFixed(2)}), consider meal prepping to reduce costs.`;
    } else if (category === 'transport') {
      insights = `Your transportation costs average $${avgSpent.toFixed(2)}. Consider carpooling or public transit.`;
    } else if (category === 'bills') {
      insights = `Your bills average $${avgSpent.toFixed(2)}. Look for better utility plans or ways to reduce consumption.`;
    }

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
