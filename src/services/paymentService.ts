
import { Expense, ExpenseCategory } from "../types";

// This would be replaced with actual API integration once Supabase is connected
export async function fetchPaymentData(): Promise<Partial<Expense>[]> {
  // Simulating API call to payment provider (e.g., Plaid or bank API)
  // In a real implementation, this would call a Supabase Edge Function
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: "Grocery Store",
          amount: 45.99,
          date: new Date().toISOString(),
          notes: "Automatically imported transaction"
        },
        {
          title: "Coffee Shop",
          amount: 5.75,
          date: new Date().toISOString(),
          notes: "Automatically imported transaction"
        },
        {
          title: "Gas Station",
          amount: 38.50,
          date: new Date().toISOString(),
          notes: "Automatically imported transaction"
        },
        {
          title: "Monthly Subscription",
          amount: 9.99,
          date: new Date().toISOString(),
          notes: "Automatically imported transaction"
        }
      ]);
    }, 1500);
  });
}
