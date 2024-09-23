import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import HighlightText from "~/components/HighlightText";
import { Spinner } from "~/components/Spinner";
import { Card } from "~/components/Card";
import {
  type EventFormType,
  NoPEventForm,
} from "~/module/events/components/NoPEventForm";
import { type EventParticipant } from "~/module/events/components/types";

const Home: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { eventid } = router.query;
  const queryInput = { eventId: eventid as string };

  const { mutateAsync: updateEvent } = api.event.updateEvent.useMutation();

  const event = api.event.getEvent.useQuery(queryInput, {
    enabled: sessionData?.user !== undefined,
  });

  const saveNewEvent = (nopEvent: EventFormType): void => {
    // console.log(nopEvent)
    // persistEvent(nopEvent).then((id: string) => {
    //     router.push(`/app/event/${id}`)
    // }).catch((error) => {
    //     console.error("saveNewEvent ended with an error", error)
    // });
    updateEvent({ nopEvent, eventId: eventid as string })
      .then(() => {
        return;
      })
      .catch((error) => {
        console.error("error while updating event", error);
      });

    //setSavedId((old) => { return id })
  };
  if (event.isLoading || false) {
    return (
      <Layout
        headingText={
          <>
            Laddar <HighlightText>träff</HighlightText>...
          </>
        }
      >
        <Spinner />
      </Layout>
    );
  }

  if (!event.data) {
    return (
      <Layout
        headingText={
          <>
            Ingen <span className="text-[hsl(280,100%,70%)]">träff</span> här
          </>
        }
      >
        <div className="grid grid-cols-2  gap-4   sm:grid-cols-2 md:gap-8">
          <div className="col-span-2 p-2">
            <Card header="Det finns ingen träff här...">
              Vi är ledsna men vi hittar inte träffen du söker 😔
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const e = event.data;

  return (
    <Layout
      headingText={
        <>
          Ändra en <HighlightText>träff</HighlightText>
        </>
      }
    >
      <div className="grid grid-cols-2  gap-4   sm:grid-cols-2 md:gap-8">
        <div className="col-span-2">
          <Card
            header={
              <>
                Ändra <HighlightText>träff</HighlightText>
              </>
            }
          >
            Nedan kan ni ändra er träff. Ändringarna slår igenom på en gång.
            Glöm inte trycka spara 😀
          </Card>

          <Card header="Detaljer">
            <NoPEventForm
              event={e}
              onCreateHandler={saveNewEvent}
            ></NoPEventForm>
          </Card>
          <ParticipantsListCard eventId={e.id} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
// export const EventMessa = ({ eventid }: { eventid: string }) => {

const ParticipantsListCard = ({ eventId }: { eventId: string }) => {
  console.log("eventId", eventId);
  const { data: sessionData } = useSession();
  const queryInput = { eventId: eventId };

  const eventParticipants = api.event.getEventParticipants.useQuery(
    queryInput,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const participants = eventParticipants.data;
  if (!participants) {
    return (
      <Card header="Anmälda par">
        <p>Eventid: </p>
        <p>finns inga anmälda par</p>
      </Card>
    );
  }
  console.log("participants: ", participants);

  const foo = (participants: EventParticipant[]) => {
    console.log("foo.participants: ", participants);

    return (
      <ul>
        {participants.map((p) => {
          console.log("render", p);
          return (
            <li key={p.id}>
              {p.id} -- {p.when}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Card header="Anmälda par">
      <p>Eventid: {eventId}</p>
      <p>Lista över anmälda par:</p>
      {foo(participants)}
    </Card>
  );
};
