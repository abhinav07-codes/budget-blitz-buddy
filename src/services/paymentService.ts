
import { supabase } from '@/lib/supabase';
import { Expense } from '../types';

export async function fetchPaymentData(): Promise<Partial<Expense>[]> {
  try {
    const response = await supabase.functions.invoke('process-payments');
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching payment data:', error);
    throw error;
  }
}
