import { type NextPage } from "next";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";

const Home: NextPage = () => {

    return (
        <Layout headingText={<><HighlightText>Meddelanden</HighlightText></>}>
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">
                    <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                        <h3 className="text-2xl font-bold">Skicka <HighlightText>meddelande</HighlightText> till andra <HighlightText>profiler</HighlightText></h3>
                        <div className="text-lg">
                            Tjoho! Just nu arbetar vi med att göra det möjligt att skicka meddelande till varandra. Bra va 😃
                        </div>
                        <div className="text-lg">
                            Som ni märker är vi inte riktigt klara...
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
};

export default Home;