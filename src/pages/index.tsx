import { type NextPage } from "next";
import Link from "next/link";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";

const Home: NextPage = () => {
    //const hello = api.example.hello.useQuery({ text: "from tRPC" });

    return (
        <Layout
            includeSigninSignoutButton={false}
            headingText={<HighlightText>Night of Passion</HighlightText>}
        >
            <div className="grid grid-cols-2 gap-4  sm:grid-cols-2 md:gap-8">
                <div className="col-span-2">
                    <Link
                        className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                        href="signin"
                    >
                        <h3 className="text-2xl font-bold">Logga in →</h3>
                        <div className="text-lg">Logga in för att börja med det roliga</div>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
