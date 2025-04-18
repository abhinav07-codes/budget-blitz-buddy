
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// This function updates the category limits and daily limits when new expenses are added
// It is meant to be triggered by a database webhook

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    
    // Check if this is a new record (insert) or update
    // The payload format depends on the webhook configuration
    const expense = payload.record
    
    if (!expense || !expense.user_id || !expense.category || expense.amount === undefined) {
      throw new Error('Invalid expense data')
    }
    
    // 1. Update category limit
    const { data: categoryLimit, error: categoryError } = await supabase
      .from('category_limits')
      .select('*')
      .eq('user_id', expense.user_id)
      .eq('category', expense.category)
      .maybeSingle()
    
    if (categoryError) throw categoryError
    
    if (categoryLimit) {
      // Update existing category limit
      await supabase
        .from('category_limits')
        .update({ 
          current_amount: categoryLimit.current_amount + expense.amount 
        })
        .eq('id', categoryLimit.id)
    } else {
      // Create new category limit with default
      await supabase
        .from('category_limits')
        .insert({
          user_id: expense.user_id,
          category: expense.category,
          limit_amount: 1000, // Default limit
          current_amount: expense.amount
        })
    }
    
    // 2. Update daily limit if expense is from today
    const expenseDate = new Date(expense.date).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    if (expenseDate === today) {
      const { data: dailyLimit, error: dailyError } = await supabase
        .from('daily_limits')
        .select('*')
        .eq('user_id', expense.user_id)
        .eq('date', today)
        .maybeSingle()
      
      if (dailyError) throw dailyError
      
      if (dailyLimit) {
        // Update existing daily limit
        await supabase
          .from('daily_limits')
          .update({ 
            current_amount: dailyLimit.current_amount + expense.amount 
          })
          .eq('id', dailyLimit.id)
      } else {
        // Create new daily limit with default
        await supabase
          .from('daily_limits')
          .insert({
            user_id: expense.user_id,
            date: today,
            limit_amount: 100, // Default daily limit
            current_amount: expense.amount
          })
      }
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
