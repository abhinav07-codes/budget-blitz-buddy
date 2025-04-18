
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Keywords for each category to help with basic categorization
const categoryKeywords: Record<string, string[]> = {
  food: ["grocery", "restaurant", "cafe", "pizza", "food", "coffee", "bakery", "meal", "diner", "lunch"],
  travel: ["gas", "uber", "lyft", "taxi", "flight", "hotel", "motel", "airbnb", "train", "bus", "car rental"],
  bills: ["utility", "water", "electricity", "gas bill", "phone", "internet", "insurance", "rent", "mortgage"],
  entertainment: ["movie", "netflix", "spotify", "disney", "hbo", "cinema", "concert", "theater", "game"],
  shopping: ["amazon", "walmart", "target", "clothing", "shoes", "electronics", "furniture", "mall"],
  other: []
};

function categorizeExpense(title: string, amount: number): string {
  title = title.toLowerCase();
  
  // Check if the title matches any keywords for each category
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => title.includes(keyword))) {
      return category;
    }
  }
  
  // Simple heuristics for common expenses
  if (amount < 15 && (title.includes("coffee") || title.includes("cafe"))) {
    return "food";
  }
  
  if (amount > 100 && amount < 300 && title.includes("store")) {
    return "shopping";
  }
  
  if (title.includes("subscription") || (amount < 20 && amount > 5 && /monthly|weekly|annual/.test(title))) {
    return "entertainment";
  }
  
  return "other";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, amount } = await req.json()
    
    if (!title || amount === undefined) {
      throw new Error('Missing required fields: title and amount')
    }
    
    const category = categorizeExpense(title, amount)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        category 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
