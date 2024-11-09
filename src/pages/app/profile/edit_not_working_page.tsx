/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import HighlightText from "~/components/HighlightText";

import Layout from "~/components/Layout";

const Home: NextPage = () => {
    return (
        <Layout headingText={<>Ändra <HighlightText>er</HighlightText> profil</>}>
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">
                    <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                        <h3 className="text-2xl font-bold">Problem 👷👷‍♀️</h3>
                        <div className="text-lg">
              Just nu har vi problem med att ändra er profil. Vi jobbar på det och återkommer!
                        </div>

                    </div>
                </div >
            </div>

        </Layout>
    )
};

export default Home;

