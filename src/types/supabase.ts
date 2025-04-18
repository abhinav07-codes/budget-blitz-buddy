
export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number
          category: string
          date: string
          notes?: string | null
          imported: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          title: string
          amount: number
          category: string
          date: string
          notes?: string | null
          imported?: boolean
          created_at?: string
        }
        Update: {
          user_id?: string
          title?: string
          amount?: number
          category?: string
          date?: string
          notes?: string | null
          imported?: boolean
          created_at?: string
        }
      }
      category_limits: {
        Row: {
          id: string
          user_id: string
          category: string
          limit_amount: number
          current_amount: number
          created_at: string
        }
        Insert: {
          user_id: string
          category: string
          limit_amount: number
          current_amount?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          category?: string
          limit_amount?: number
          current_amount?: number
          created_at?: string
        }
      }
      daily_limits: {
        Row: {
          id: string
          user_id: string
          limit_amount: number
          current_amount: number
          date: string
          created_at: string
        }
        Insert: {
          user_id: string
          limit_amount: number
          current_amount?: number
          date?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          limit_amount?: number
          current_amount?: number
          date?: string
          created_at?: string
        }
      }
    }
  }
}
