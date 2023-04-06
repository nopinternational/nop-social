import Link from "next/link";
import { api } from "~/utils/api";

export function ListOfOpenRooms() {
  const openCirclesQuery = api.circle.getAllOpenCircles.useQuery();
  if (openCirclesQuery.isLoading) return <div>loading...</div>;
  if (!openCirclesQuery.data) return <div>No open circles found</div>;
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-sm bg-white p-3 shadow-sm">
            <h1>List of open circles</h1>
          {openCirclesQuery.data.map((circle) => (
            <div key={circle.id}>
              <Link href={`/conversation/${circle.conversationId as string}`}>
                {circle.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
