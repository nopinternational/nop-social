import { type NextPage } from "next";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";


const Home: NextPage = () => {

    return (
        <Layout headingText={<>Ordna en <HighlightText>träff</HighlightText></>}>
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">
                    <Card header={<>Ordna <HighlightText>träff</HighlightText></>}>
                        Skapa en träff och samla alla sexiga par i <HighlightText>Night of Passion</HighlightText>
                    </Card>

                </div>
            </div>
        </Layout>
    );
};


export default Home;

