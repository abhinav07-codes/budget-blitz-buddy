
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentData {
  title: string
  amount: number
  date: string
  notes?: string
}

function categorizeExpense(title: string, amount: number): string {
  const title_lower = title.toLowerCase()
  
  // Basic categorization logic (you can enhance this with GPT later)
  const categories = {
    food: ['grocery', 'restaurant', 'cafe', 'pizza', 'food', 'coffee'],
    travel: ['gas', 'uber', 'lyft', 'taxi', 'flight', 'hotel'],
    bills: ['utility', 'water', 'electricity', 'phone', 'internet'],
    entertainment: ['movie', 'netflix', 'spotify', 'disney'],
    shopping: ['amazon', 'walmart', 'target', 'clothing'],
  }
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => title_lower.includes(keyword))) {
      return category
    }
  }
  
  return 'other'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // For demo purposes, we'll simulate fetching payment data
    // In a real app, you'd integrate with Plaid/Stripe here
    const mockPayments: PaymentData[] = [
      {
        title: "Grocery Store",
        amount: 45.99,
        date: new Date().toISOString(),
        notes: "Weekly groceries"
      },
      {
        title: "Coffee Shop",
        amount: 5.75,
        date: new Date().toISOString(),
        notes: "Morning coffee"
      }
    ]

    const { user, error: authError } = await supabase.auth.getUser(
      req.headers.get('Authorization')!
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const processedExpenses = mockPayments.map(payment => ({
      user_id: user.id,
      title: payment.title,
      amount: payment.amount,
      category: categorizeExpense(payment.title, payment.amount),
      date: payment.date,
      notes: payment.notes,
      imported: true
    }))

    const { data, error } = await supabase
      .from('expenses')
      .insert(processedExpenses)
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
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
