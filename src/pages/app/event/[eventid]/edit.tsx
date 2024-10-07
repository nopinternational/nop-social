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
import {
  type ConfirmedUser,
  type EventParticipant,
} from "~/module/events/components/types";
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
  console.log("events/{eventid}/edit");
  const attendes = api.event.getEventAttendes.useQuery({
    eventId: eventid as string,
  });

  // useEffect(() => {
  //   console.log("useEffect");

  //   setAttendes(attendes.data || null);
  //   console.log("attendes.data", attendes.data);
  // }, []);

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
          <ParticipantsListCard
            eventId={e.id}
            attendesList={attendes.data || []}
          />
          {/* <KorvCard
            ids={["123", "abc"]}
            attendesList={attendes.data || []}
          ></KorvCard> */}
          <AttendesListCard eventid={e.id} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
// export const EventMessa = ({ eventid }: { eventid: string }) => {

const ParticipantsListCard = ({
  eventId,
  attendesList,
}: {
  eventId: string;
  attendesList: ConfirmedUser[];
}) => {
  console.log("eventId", eventId);
  const { data: sessionData } = useSession();
  const queryInput = { eventId: eventId };
  const attendesListId = new Set(attendesList.map((user) => user.id));

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
          // console.log("render", p);
          return (
            <li key={p.id}>
              <Participant
                eventParticipant={p}
                isAttending={attendesListId.has(p.id)}
              ></Participant>
              {/* {p.id} -- {p.when} */}
            </li>
          );
        })}
      </ul>
    );
  };
  const cardHeader = `Anmälda par - ${participants.length}st`;
  return <Card header={cardHeader}>{renderParticipants(participants)}</Card>;
};

type ParticipantType = {
  eventParticipant: EventParticipant;
  isAttending: boolean;
};

const Participant = ({ eventParticipant, isAttending }: ParticipantType) => {
  const profileApi = api.profile.getProfileById.useQuery({
    id: eventParticipant.id,
  });

  // console.log("loading profile", eventParticipant.id);
  if (profileApi.isLoading) {
    return <>Laddar profil {eventParticipant.id}</>;
  }

  const korv = () => {
    alert("klickat!");
  };
  const profile = profileApi.data;
  // console.log("laddad profil: ", profile);

  const dateString = eventParticipant.when
    ? new Date(eventParticipant.when).toLocaleString()
    : "";
  if (profile) {
    return (
      <>
        {isAttending ? <OkIcon /> : <NokIcon onclick={korv} />}{" "}
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

const OkIcon = () => {
  return (
    <svg
      className="inline"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      color={"#32b65c"}
      fill={"none"}
    >
      <path
        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 12.75C8 12.75 9.6 13.6625 10.4 15C10.4 15 12.8 9.75 16 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const NokIcon = ({ onclick }: { onclick?: () => void }) => {
  return (
    <svg
      onClick={onclick || undefined}
      className="inline"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      color="#b63234"
      fill="none"
    >
      <path
        d="M14.9994 15L9 9M9.00064 15L15 9"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
        stroke="currentColor"
        stroke-width="1.5"
      />
    </svg>
  );
};
