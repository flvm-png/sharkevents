export type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: string;
  slug: string | null;
  capacity: number;
  organizer_id: string | null;
  created_at: string;
};