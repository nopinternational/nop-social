import { type NextPage } from "next";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";


const Home: NextPage = () => {


    const createEvent = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        console.log("create Event", e.target)
    }

    return (
        <Layout headingText={<>Ordna en <HighlightText>träff</HighlightText></>}>
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">
                    <Card header={<>Ordna <HighlightText>träff</HighlightText></>}>
                        Skapa en träff och samla alla sexiga par i <HighlightText>Night of Passion</HighlightText>
                    </Card>

                    <Card header="Detaljer">
                        <form className="p-2" >
                            <div className="m-2">Titel</div>
                            <input
                                className="w-full px-3 py-3 rounded-lg text-black"
                                name="title" value="titel..." /><br />

                            <div className="m-2">När</div>
                            <input className="w-full px-3 py-3 rounded-lg text-black"
                                name="when" value="när..." /><br />

                            <div className="m-2">Kort beskrivning</div>
                            <textarea className="w-full px-3 py-3 rounded-lg text-black"
                                name="shortDesc" >kort beskrivning</textarea>

                            <div className="m-2">Lång beskrivning</div>
                            <textarea className="w-full px-3 py-3 rounded-lg text-black"
                                name="longDesc" >lång beskrivning</textarea>

                            <div className="m-2">Options...</div>

                            <button
                                className="mt-4 mb-3 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => createEvent(event)}>Ändra</button>
                        </form>
                    </Card>


                </div>
            </div>
        </Layout>
    );
};


export default Home;

