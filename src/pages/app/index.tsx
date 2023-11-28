import { type NextPage } from "next";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout headingText={<>Välkommen till <HighlightText>Night of Passion</HighlightText></>}>

      <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
        <div className="col-span-2">
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">Par, par, par ❤️❤️❤️</h3>
            <div className="text-lg">
              Night of Passion är fullt av trevliga par. Njut av dom på våra träffar 😘
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
};

export default Home;

