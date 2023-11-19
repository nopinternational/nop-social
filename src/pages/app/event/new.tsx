import { type NextPage } from "next";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { type EventFormType, NoPEventForm } from "~/components/event/NoPEventForm";


const Home: NextPage = () => {

    const saveNewEvent = (nopEvent: EventFormType) => {
        console.log("lets save new event", nopEvent, nopEvent.title)
        
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

