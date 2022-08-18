export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export interface UserDetails {
  id: string /* primary key */;
  username?: string;
  avatar_url?: string;
}

export interface Transaction {
  id: string /* primary key */;
  amount: number;
  type: string;
  category_id: string;
  created_at: Date;
}
