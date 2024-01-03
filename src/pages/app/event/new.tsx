import { type NextPage } from "next";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { type EventFormType, NoPEventForm } from "~/module/events/components/NoPEventForm";
import { api } from "~/utils/api";
import { useRouter } from 'next/navigation'

const Home: NextPage = () => {
    const router = useRouter()
    const { mutateAsync: persistEvent } = api.event.createEvent.useMutation()

    const saveNewEvent = (nopEvent: EventFormType): void => {

        persistEvent({ nopEvent })
            .then((id: string) => {
                router.push(`/app/event/${id}`)
            }).catch((error) => {
                console.error("saveNewEvent ended with an error", error)
            });
    }

    return (
        <Layout headingText={<>Ordna en <HighlightText>träff</HighlightText></>}>
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">
                    <Card header={<>Ordna <HighlightText>träff</HighlightText></>}>
                        Skapa en träff och samla alla sexiga par i <HighlightText>Night of Passion</HighlightText>
                    </Card>

                    <Card header="Detaljer">
                        <NoPEventForm onCreateHandler={saveNewEvent}></NoPEventForm>
                    </Card>

                </div>
            </div>
        </Layout>
    );
};


export default Home;

