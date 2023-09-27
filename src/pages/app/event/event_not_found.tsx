import { type NextPage } from "next";
import Footer from "~/components/Footer";
import Layout from "~/components/Layout";


const Home: NextPage = () => {

    return (
        <Layout>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center">
                        Träff med <span className="text-[hsl(280,100%,70%)]">Night of Passion</span>
                    </h1>

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
                    <div className="flex flex-col items-center gap-2">
                        <Footer />
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Home;

