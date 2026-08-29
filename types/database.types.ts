export type Database = {
  public: {
    Tables: {
      birthday_events: {
        Row: {
          id: string;
          name: string;
          birthday_date: string;
          description: string | null;
          cover_image: string | null;
          friend_token: string;
          surprise_token: string;
          status: "active" | "archived";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          birthday_date: string;
          description?: string | null;
          cover_image?: string | null;
          friend_token?: string;
          surprise_token?: string;
          status?: "active" | "archived";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["birthday_events"]["Insert"]>;
      };
      wishes: {
        Row: {
          id: string;
          event_id: string;
          sender_name: string;
          message: string | null;
          voice_url: string | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          sender_name: string;
          message?: string | null;
          voice_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wishes"]["Insert"]>;
      };
      admins: {
        Row: {
          id: string;
          event_id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          email: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admins"]["Insert"]>;
      };
    };
  };
};