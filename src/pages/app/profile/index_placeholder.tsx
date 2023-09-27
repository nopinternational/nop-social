/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import HighlightText from "~/components/HighlightText";

import Layout from "~/components/Layout";

const Home: NextPage = () => {
  return (
    <Layout headingText={<>Våra <HighlightText>härliga</HighlightText> par</>}>
      <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
        <div className="col-span-2">
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">Par, par, par ❤️❤️❤️</h3>
            <div className="text-lg">
              Night of Passion är fullt av trevliga par. Här kommer ni kunna se er själva och alla andra par som är medlemmar i Night of Passion. Vi kommer att släppa denna sida efter vår cocktailträff 9/9.
            </div>
            <div className="text-lg">
              Vi ses då 😀
            </div>
          </div>
        </div >
      </div>

    </Layout>
  )
};

export default Home;

