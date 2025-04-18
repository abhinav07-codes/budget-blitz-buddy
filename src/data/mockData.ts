
import { Expense, CategoryLimit, DailyLimit } from "../types";

export const mockExpenses: Expense[] = [
  {
    id: "1",
    title: "Grocery Shopping",
    amount: 65.75,
    category: "food",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: "2",
    title: "Movie Tickets",
    amount: 25.99,
    category: "entertainment",
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: "3",
    title: "Gas",
    amount: 45.50,
    category: "travel",
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
  },
  {
    id: "4",
    title: "Internet Bill",
    amount: 79.99,
    category: "bills",
    date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
  },
  {
    id: "5",
    title: "New Shoes",
    amount: 89.95,
    category: "shopping",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: "6",
    title: "Coffee",
    amount: 4.50,
    category: "food",
    date: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Mobile Bill",
    amount: 55.00,
    category: "bills",
    date: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Uber",
    amount: 18.75,
    category: "travel",
    date: new Date().toISOString(),
  },
];

export const mockCategoryLimits: CategoryLimit[] = [
  { category: "food", limit: 500, current: 185.25 },
  { category: "travel", limit: 200, current: 64.25 },
  { category: "bills", limit: 300, current: 134.99 },
  { category: "entertainment", limit: 150, current: 25.99 },
  { category: "shopping", limit: 200, current: 89.95 },
  { category: "other", limit: 100, current: 0 },
];

export const mockDailyLimit: DailyLimit = {
  limit: 50,
  current: 78.25,
  date: new Date().toISOString(),
};

export const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    food: '#F59E0B',
    travel: '#3B82F6',
    bills: '#8B5CF6',
    entertainment: '#EC4899',
    shopping: '#06B6D4',
    other: '#6B7280',
  };
  
  return categoryColors[category] || categoryColors.other;
};
