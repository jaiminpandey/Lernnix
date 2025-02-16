export interface Database {
  public: {
    Tables: {
      classes: {
        Row: {
          id: string;
          name: string;
          subject: string;
          description: string;
          teacher_id: string;
          code: string;
          students: number;
          status: 'active' | 'inactive';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['classes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['classes']['Row']>;
      };
      live_classes: {
        Row: {
          id: string;
          title: string;
          description?: string;
          teacher_id: string;
          class_code: string;
          status: 'scheduled' | 'live' | 'ended';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['live_classes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['live_classes']['Row']>;
      };
      resources: {
        Row: {
          id: string;
          title: string;
          category: 'notes' | 'syllabus' | 'other';
          url: string;
          teacher_id: string;
          file_type: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['resources']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['resources']['Row']>;
      };
    };
  };
}

type Tables = Database['public']['Tables']

export type DbSchema = Database & {
  public: {
    Tables: Tables;
  };
};