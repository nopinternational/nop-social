import { type NextPage } from "next";
import Link from "next/link";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout headingText={<HighlightText>Night of Passion</HighlightText>}>

      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div> */}
      <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
        <div className="col-span-2">
          <Link
            className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="signin"
          >
            <h3 className="text-2xl font-bold">Logga in →</h3>
            <div className="text-lg">
              Logga in för att börja med det roliga
            </div>
          </Link>
        </div>
      </div>

    </Layout>
  )
};

export default Home;

