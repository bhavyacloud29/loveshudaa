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
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          partner_id?: string | null
          created_at?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          partner_id?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          created_at?: string
        }
        Update: { content?: string }
      }
      memories: {
        Row: {
          id: string
          uploaded_by: string
          url: string
          caption: string | null
          taken_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          uploaded_by: string
          url: string
          caption?: string | null
          taken_at?: string | null
          created_at?: string
        }
        Update: { caption?: string | null; taken_at?: string | null }
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
      }
      milestones: {
        Row: {
          id: string
          created_by: string
          title: string
          description: string | null
          event_date: string
          emoji: string | null
          created_at: string
        }
        Insert: {
          id?: string
          created_by: string
          title: string
          description?: string | null
          event_date: string
          emoji?: string | null
          created_at?: string
        }
        Update: { title?: string; description?: string | null; event_date?: string; emoji?: string | null }
      }
    }
  }
}
