export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      course_materials: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          file_path: string
          id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          file_path: string
          id?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          file_path?: string
          id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          cover_image_url: string | null
          created_at: string
          description: string
          highlights: string[] | null
          id: string
          semester: string
          status: string
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          code: string
          cover_image_url?: string | null
          created_at?: string
          description: string
          highlights?: string[] | null
          id?: string
          semester: string
          status?: string
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          code?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string
          highlights?: string[] | null
          id?: string
          semester?: string
          status?: string
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
          subject?: string | null
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: string
          created_at: string
          id: string
          page: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          page: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          page?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          first_name: string
          id: string
          is_admin: boolean
          last_name: string
          title: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          first_name: string
          id: string
          is_admin?: boolean
          last_name: string
          title: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          first_name?: string
          id?: string
          is_admin?: boolean
          last_name?: string
          title?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          abstract: string
          authors: string[]
          cover_image_url: string | null
          created_at: string
          date: string
          doi: string | null
          id: string
          pdf_url: string | null
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          abstract: string
          authors: string[]
          cover_image_url?: string | null
          created_at?: string
          date: string
          doi?: string | null
          id?: string
          pdf_url?: string | null
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          abstract?: string
          authors?: string[]
          cover_image_url?: string | null
          created_at?: string
          date?: string
          doi?: string | null
          id?: string
          pdf_url?: string | null
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      research_projects: {
        Row: {
          category: string
          cover_image_url: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          cover_image_url?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          footer_text: string
          id: string
          site_description: string
          site_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          footer_text?: string
          id?: string
          site_description?: string
          site_title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          footer_text?: string
          id?: string
          site_description?: string
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      users_management: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          role?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
