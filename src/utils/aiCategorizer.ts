
import { ExpenseCategory } from "../types";

// Keywords for each category to help with basic categorization
const categoryKeywords: Record<ExpenseCategory, string[]> = {
  food: ["grocery", "restaurant", "cafe", "pizza", "food", "coffee", "bakery", "meal", "diner", "lunch"],
  travel: ["gas", "uber", "lyft", "taxi", "flight", "hotel", "motel", "airbnb", "train", "bus", "car rental"],
  bills: ["utility", "water", "electricity", "gas bill", "phone", "internet", "insurance", "rent", "mortgage"],
  entertainment: ["movie", "netflix", "spotify", "disney", "hbo", "cinema", "concert", "theater", "game"],
  shopping: ["amazon", "walmart", "target", "clothing", "shoes", "electronics", "furniture", "mall"],
  other: []
};

// This would be replaced with a proper AI-based categorization using GPT or similar
// when Supabase is connected
export function categorizeExpense(title: string, amount: number): ExpenseCategory {
  title = title.toLowerCase();
  
  // Check if the title matches any keywords for each category
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => title.includes(keyword))) {
      return category as ExpenseCategory;
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
