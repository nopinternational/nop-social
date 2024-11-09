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
import { useState } from "react";
import { type Profile } from "~/module/profile/profileRouter";
import { Toggle } from "~/components/Toogle";

const Home: NextPage = () => {
    const router = useRouter();
    const { data: sessionData } = useSession();
    const { eventid } = router.query;
    const queryInput = { eventId: eventid as string };

    const { mutateAsync: updateEvent } = api.event.updateEvent.useMutation();

    const event = api.event.getEvent.useQuery(queryInput, {
        enabled: sessionData?.user !== undefined &&  !!eventid,
    });

    const attendes = api.event.getEventAttendes.useQuery({
        eventId: eventid as string,
    }, {
        enabled: !!eventid
    });

    const saveNewEvent = (nopEvent: EventFormType): void => {
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

    const renderParticipants = (participants: EventParticipant[]) => {
        participants.sort((a, b) => Date.parse(a.when) - Date.parse(b.when));
        return (
            <ul>
                {participants.map((p) => {
                    return (
                        <li key={p.id}>
                            <Participant
                                eventId={eventId}
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
  eventId: string;
  eventParticipant: EventParticipant;
  isAttending: boolean;
};

const Participant = ({
    eventId,
    eventParticipant,
    isAttending,
}: ParticipantType) => {
    const [showForm, setShowForm] = useState(false);

    const profileApi = api.profile.getProfileById.useQuery({
        id: eventParticipant.id,
    });

    if (profileApi.isLoading) {
        return <>Laddar profil {eventParticipant.id}</>;
    }

    const toggleForm = () => {
        setShowForm((showForm) => !showForm);
    };

    const profileAdded = () => {
        setShowForm(false);
    };

    const profile = profileApi.data;

    const dateString = eventParticipant.when
        ? new Date(eventParticipant.when).toLocaleString()
        : "";
    if (profile) {
        return (
            <>
                <div>
                    {isAttending ? <OkIcon /> : <NokIcon onclick={toggleForm} />}{" "}
                    {profile.person1.name} & {profile.person2.name} (
                    <HighlightText>{profile.username}</HighlightText>) - anmälda{" "}
                    {dateString}
                </div>
                {showForm ? (
                    <AddAsAttendeForm
                        eventId={eventId}
                        profile={profile}
                        addedListener={profileAdded}
                    ></AddAsAttendeForm>
                ) : null}
            </>
        );
    }

    return (
        <>
      Kan inte ladda <HighlightText>{eventParticipant.id}</HighlightText>
        </>
    );
};

const AddAsAttendeForm = ({
    eventId,
    profile,
    addedListener,
}: {
  eventId: string;
  profile: Profile;
  addedListener: () => void;
}) => {
    const [profileNames, setProfileName] = useState(
        `${profile.person1.name} & ${profile.person2.name}`
    );

    const [toggleAllowedChecked, setToggleAllowedChecked] = useState(true);
    //const profileNames = `${profile.person1.name} & ${profile.person2.name}`;
    const utils = api.useContext();

    const { mutateAsync: addAttendesToEvent } =
    api.event.addAttendeToEvent.useMutation({
        onSuccess: () => {
            void utils.event.getEventAttendes.invalidate();
        },
    });

    const toggleAllowedClick = () => {
        setToggleAllowedChecked((oldState) => {return !oldState})
    }
    const addAsAttendes = () => {
        addAttendesToEvent({
            eventId: eventId,
            name: profileNames,
            id: profile.id,
            username: profile.username,
            addAsAllowed: toggleAllowedChecked,
        })
            .then(() => {
                //do nothing
            })
            .catch((error) => {
                console.error("error while addAttendesToEvent", error);
            });
    };

    return (
        <div className="rounded-md bg-white/10 p-2">
            <p>Lägg till par till träff. Ange deras namn</p>
            <form>
                <input
                    className="w-full rounded-lg px-3 py-3 text-black"
                    type="text"
                    value={profileNames}
                    onChange={(e) => setProfileName(e.target.value)}
                ></input>
                <div
                    className="my-3">
                    <Toggle
                        name="allowed"
                        optionText="Lägg till som Allowed"
                        checked={toggleAllowedChecked}
                        onClick={toggleAllowedClick}
                    />
                </div>
                {/* 
      <input type="submit">Skicka</input> */}
                <button
                    className="block mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                    onClick={(event) => {
                        addAsAttendes();
                        event.preventDefault();
                        addedListener && addedListener();
                        return null;
                    }}
                >
          Lägg till
                </button>
            </form>
        </div>
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
