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
            Ändra en träff och samla alla sexiga par i{" "}
            <HighlightText>Night of Passion</HighlightText>
          </Card>

          <Card header="Detaljer">
            <NoPEventForm
              event={e}
              onCreateHandler={saveNewEvent}
            ></NoPEventForm>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
