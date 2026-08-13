export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          partner_id: string | null
          couple_id: string | null
          invite_code: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          partner_id?: string | null
          couple_id?: string | null
          invite_code?: string | null
          created_at?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          partner_id?: string | null
          couple_id?: string | null
          invite_code?: string | null
        }
        Relationships: []
      }
      couples: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          anniversary_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          anniversary_date?: string | null
          created_at?: string
        }
        Update: { anniversary_date?: string | null }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          couple_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          sender_id: string
          content: string
          created_at?: string
        }
        Update: { content?: string }
        Relationships: []
      }
      memories: {
        Row: {
          id: string
          couple_id: string
          uploaded_by: string
          url: string
          caption: string | null
          taken_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          uploaded_by: string
          url: string
          caption?: string | null
          taken_at?: string | null
          created_at?: string
        }
        Update: { caption?: string | null; taken_at?: string | null }
        Relationships: []
      }
      journal_entries: {
        Row: {
          id: string
          author_id: string
          title: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title?: string | null
          content: string
          created_at?: string
        }
        Update: { title?: string | null; content?: string }
        Relationships: []
      }
      milestones: {
        Row: {
          id: string
          couple_id: string
          created_by: string
          title: string
          description: string | null
          event_date: string
          emoji: string | null
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          created_by: string
          title: string
          description?: string | null
          event_date: string
          emoji?: string | null
          created_at?: string
        }
        Update: { title?: string; description?: string | null; event_date?: string; emoji?: string | null }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
