import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { Event } from "@/types/events";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.slug ?? event.id}`}>
      <Card>
        <h2 className="font-bold text-lg">{event.title}</h2>

        <div className="flex gap-2 mt-2">
          <Badge text={event.location ?? "Sem local"} />
          <Badge text={new Date(event.date).toLocaleDateString()} />
        </div>
      </Card>
    </Link>
  );
}