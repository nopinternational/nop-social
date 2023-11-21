import { type NextPage } from "next";
import Layout from "~/components/Layout";

const Home: NextPage = () => {

    return (
        <Layout headingText={<>Träff med <span className="text-[hsl(280,100%,70%)]">Night of Passion</span></>}>
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">
                    <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                        <h3 className="text-2xl font-bold">Det finns ingen träff här...</h3>
                        <div className="text-lg">
                            Vi är ledsna men vi hittar inte träffen du söker 😔
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;

