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
import { AttendesListCard } from "~/module/events/components/edit/AttendesListCard";

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
          <AttendesListCard eventid={e.id} />
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

  const renderParticipants = (participants: EventParticipant[]) => {
    participants.sort((a, b) => Date.parse(a.when) - Date.parse(b.when));
    return (
      <ul>
        {participants.map((p) => {
          console.log("render", p);
          return (
            <>
              <li key={p.id}>
                <Participant eventParticipant={p}></Participant>
                {/* {p.id} -- {p.when} */}
              </li>
            </>
          );
        })}
      </ul>
    );
  };
  const cardHeader = `Anmälda par - ${participants.length}st`;
  return <Card header={cardHeader}>{renderParticipants(participants)}</Card>;
};

type ParticipantType = { eventParticipant: EventParticipant };

const Participant = ({ eventParticipant }: ParticipantType) => {
  const profileApi = api.profile.getProfileById.useQuery({
    id: eventParticipant.id,
  });

  console.log("loading profile", eventParticipant.id);
  if (profileApi.isLoading) {
    return <>Laddar profil {eventParticipant.id}</>;
  }

  const profile = profileApi.data;
  console.log("laddad profil: ", profile);

  const dateString = eventParticipant.when
    ? new Date(eventParticipant.when).toLocaleString()
    : "";
  if (profile) {
    return (
      <>
        {profile.person1.name} & {profile.person2.name} (
        <HighlightText>{profile.username}</HighlightText>) - anmälda{" "}
        {dateString}
      </>
    );
  }

  return (
    <>
      Kan inte ladda <HighlightText>{eventParticipant.id}</HighlightText>
    </>
  );
};
