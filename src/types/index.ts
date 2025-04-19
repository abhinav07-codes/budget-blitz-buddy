export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date string format
  notes?: string;
  description?: string;
  source?: string;
  isRecurring?: boolean;
}

export type ExpenseCategory = 
  | "food" 
  | "travel" 
  | "bills" 
  | "entertainment" 
  | "shopping" 
  | "other";

export interface CategoryLimit {
  category: ExpenseCategory;
  limit: number;
  current: number;
}

export interface DailyLimit {
  limit: number;
  current: number;
  date: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  remainingAmount: number;
  startDate: string;
  dueDate: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  lastUsed?: string;
  category: ExpenseCategory;
}

export interface Challenge {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: number;
  current: number;
  participants: string[];
}

export interface Service {
  id: string;
  name: string;
  cost: number;
  renewalDate: string;
  userId: string;
}
