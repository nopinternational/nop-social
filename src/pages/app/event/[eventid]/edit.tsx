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
import { EventAttendes } from "~/module/events/components/EventAttendes";
import { getEventAttendes } from "~/module/events/eventsFirebase";

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

          <AttendesCard eventId={eventid}> </AttendesCard>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

const AttendesCard = ({ eventId }: { eventId: string }) => {
  const attendes = api.event.getEventSignupsAndAttendes.useQuery({
    eventId: eventId,
  });

  if (attendes.isLoading || false) {
    return <p>laddar deltagare...</p>;
  }

  if (!attendes.data) {
    return <p>hittar ingen deltagare...</p>;
  }

  if (attendes.data.length == 0) {
    return (
      <div>
        <p>Ni måste vara deltagare på träffen för att s vilka som kommer.</p>
        <p>
          Har ni betalat nyligen så kommer vi strax lägga till er som deltagare,
          ha tålamod 😉
        </p>
      </div>
    );
  }
  console.log("attendes", attendes.data);
  const eventAttendes = attendes.data;
  const allowed = eventAttendes.allowed;
  const confirmed = eventAttendes.confirmed;

  return (
    <Card header="Deltagare">
      <p>Deltar i event {eventId}</p>
      <Participants allowed={allowed}></Participants>

      <p>
        confirmed:
        {confirmed
          .map((confirmedAttende) => {
            return (
              "[" +
              confirmedAttende.id +
              " " +
              confirmedAttende.name +
              " username:" +
              (confirmedAttende.username || "foo") +
              "]"
            );
          })
          .join(", ")}
      </p>
    </Card>
  );
};

const Participants = ({ allowed }: { allowed: string[] }) => {
  const renderParticipants = (participants: string[]) => {
    return (
      <>
        {participants.map((userId) => (
          <p key={userId}>{userId}</p>
        ))}
      </>
    );
  };
  return (
    <>
      <p>Participants: {allowed.join("-")}</p>
      {renderParticipants(allowed)}
    </>
  );
};
