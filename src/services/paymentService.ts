
import { Expense } from '../types';

export async function fetchPaymentData(): Promise<Partial<Expense>[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock payment data
  return [
    {
      title: "Coffee Shop",
      amount: 4.50,
      category: "food",
      date: new Date().toISOString()
    },
    {
      title: "Bus Fare",
      amount: 2.75,
      category: "travel",
      date: new Date().toISOString()
    }
  ];
}
