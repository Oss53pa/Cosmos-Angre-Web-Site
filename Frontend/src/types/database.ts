// ============================================================
// Cosmos Angre — Supabase Database Types
// ============================================================

// Enums
export type UserRole =
  | 'SUPER_ADMIN'
  | 'MALL_ADMIN'
  | 'MALL_MODERATOR'
  | 'STORE_ADMIN'
  | 'STORE_EMPLOYEE'
  | 'VISITOR';
export type StorePlan = 'Free' | 'Gold' | 'Platinum';
export type StoreStatus = 'active' | 'pending' | 'suspended' | 'rejected';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventVisibility = 'public' | 'private';
export type BlogStatus = 'published' | 'draft' | 'scheduled';
export type NewsletterStatus = 'active' | 'unsubscribed';
export type MediaType = 'logo' | 'banner' | 'favicon' | 'partner' | 'other';
export type PublicationStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type AuditLogStatus = 'success' | 'warning' | 'error';
export type DiscountType = 'percentage' | 'fixed';

// ============================================================
// Database schema type (for createClient<Database>)
// ============================================================
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          role: UserRole;
          avatar: string | null;
          store_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar?: string | null;
          store_id?: string | null;
        };
        Update: {
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar?: string | null;
          store_id?: string | null;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo: string | null;
          cover_image: string | null;
          zone: string | null;
          zone_key: string | null;
          location_code: string | null;
          category: string | null;
          category_key: string | null;
          hours: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          social_media: Record<string, string>;
          plan: StorePlan;
          status: StoreStatus;
          owner_id: string | null;
          rating: number;
          view_count: number;
          is_open: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          logo?: string | null;
          cover_image?: string | null;
          zone?: string | null;
          zone_key?: string | null;
          location_code?: string | null;
          category?: string | null;
          category_key?: string | null;
          hours?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          social_media?: Record<string, string>;
          plan?: StorePlan;
          status?: StoreStatus;
          owner_id?: string | null;
          rating?: number;
          is_open?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          logo?: string | null;
          cover_image?: string | null;
          zone?: string | null;
          zone_key?: string | null;
          location_code?: string | null;
          category?: string | null;
          category_key?: string | null;
          hours?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          social_media?: Record<string, string>;
          plan?: StorePlan;
          status?: StoreStatus;
          owner_id?: string | null;
          rating?: number;
          is_open?: boolean;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          image: string | null;
          start_date: string | null;
          end_date: string | null;
          start_time: string | null;
          end_time: string | null;
          location: string | null;
          category: string | null;
          organizer: string | null;
          max_participants: number | null;
          registered_participants: number;
          status: EventStatus;
          visibility: EventVisibility;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          slug: string;
          description?: string | null;
          image?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location?: string | null;
          category?: string | null;
          organizer?: string | null;
          max_participants?: number | null;
          status?: EventStatus;
          visibility?: EventVisibility;
          is_featured?: boolean;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string | null;
          image?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location?: string | null;
          category?: string | null;
          organizer?: string | null;
          max_participants?: number | null;
          status?: EventStatus;
          visibility?: EventVisibility;
          is_featured?: boolean;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          featured_image: string | null;
          author_id: string | null;
          author_name: string | null;
          category: string | null;
          tags: string[];
          status: BlogStatus;
          publish_date: string | null;
          views: number;
          likes: number;
          comments: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          category?: string | null;
          tags?: string[];
          status?: BlogStatus;
          publish_date?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          category?: string | null;
          tags?: string[];
          status?: BlogStatus;
          publish_date?: string | null;
          views?: number;
          likes?: number;
          comments?: number;
        };
      };
      contacts: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          full_name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
        };
        Update: {
          is_read?: boolean;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          status: NewsletterStatus;
          source: string;
          subscribed_date: string;
        };
        Insert: {
          email: string;
          name?: string | null;
          status?: NewsletterStatus;
          source?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          status?: NewsletterStatus;
        };
      };
      media: {
        Row: {
          id: string;
          filename: string;
          original_name: string | null;
          url: string;
          type: MediaType;
          mime_type: string | null;
          size: number | null;
          uploaded_by: string | null;
          is_active_logo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          filename: string;
          original_name?: string | null;
          url: string;
          type?: MediaType;
          mime_type?: string | null;
          size?: number | null;
          uploaded_by?: string | null;
          is_active_logo?: boolean;
        };
        Update: {
          filename?: string;
          original_name?: string | null;
          url?: string;
          type?: MediaType;
          mime_type?: string | null;
          is_active_logo?: boolean;
        };
      };
      promotions: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          discount_type: DiscountType;
          discount_value: number;
          code: string | null;
          store_id: string | null;
          start_date: string | null;
          end_date: string | null;
          is_active: boolean;
          uses: number;
          max_uses: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          discount_type: DiscountType;
          discount_value: number;
          code?: string | null;
          store_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          max_uses?: number | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          discount_type?: DiscountType;
          discount_value?: number;
          code?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          max_uses?: number | null;
        };
      };
      publications: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          image: string | null;
          status: PublicationStatus;
          store_id: string | null;
          views: number;
          likes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content?: string | null;
          image?: string | null;
          status?: PublicationStatus;
          store_id?: string | null;
        };
        Update: {
          title?: string;
          content?: string | null;
          image?: string | null;
          status?: PublicationStatus;
          views?: number;
          likes?: number;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          user_name: string | null;
          user_role: UserRole | null;
          action: string;
          resource: string | null;
          details: string | null;
          ip: string | null;
          status: AuditLogStatus;
          changes: { before?: string; after?: string } | null;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          user_name?: string | null;
          user_role?: UserRole | null;
          action: string;
          resource?: string | null;
          details?: string | null;
          ip?: string | null;
          status?: AuditLogStatus;
          changes?: { before?: string; after?: string } | null;
        };
        Update: Record<string, never>;
      };
    };
    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      increment_store_views: {
        Args: { store_id: string };
        Returns: void;
      };
    };
    Enums: {
      user_role: UserRole;
      store_plan: StorePlan;
      store_status: StoreStatus;
      event_status: EventStatus;
      event_visibility: EventVisibility;
      blog_status: BlogStatus;
      newsletter_status: NewsletterStatus;
      media_type: MediaType;
      publication_status: PublicationStatus;
      audit_status: AuditLogStatus;
      discount_type: DiscountType;
    };
  };
}

// ============================================================
// Convenience aliases
// ============================================================
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Store = Database['public']['Tables']['stores']['Row'];
export type StoreInsert = Database['public']['Tables']['stores']['Insert'];
export type StoreUpdate = Database['public']['Tables']['stores']['Update'];

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export type Contact = Database['public']['Tables']['contacts']['Row'];
export type ContactInsert = Database['public']['Tables']['contacts']['Insert'];

export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row'];
export type NewsletterSubscriberInsert =
  Database['public']['Tables']['newsletter_subscribers']['Insert'];

export type MediaFile = Database['public']['Tables']['media']['Row'];
export type MediaFileInsert = Database['public']['Tables']['media']['Insert'];
export type MediaFileUpdate = Database['public']['Tables']['media']['Update'];

export type Promotion = Database['public']['Tables']['promotions']['Row'];
export type PromotionInsert = Database['public']['Tables']['promotions']['Insert'];
export type PromotionUpdate = Database['public']['Tables']['promotions']['Update'];

export type Publication = Database['public']['Tables']['publications']['Row'];
export type PublicationInsert = Database['public']['Tables']['publications']['Insert'];
export type PublicationUpdate = Database['public']['Tables']['publications']['Update'];

export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];
