import Link from "next/link";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";

const ErrorPage = () => {
    return (
        <Layout headingText={<></>}>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        Logga in till <HighlightText>Night of Passion</HighlightText>
                    </h1>
                    <div className="grid w-full xl:w-1/2 grid-cols-1 sm:grid-cols-1 gap-4 md:gap-8">
                        <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">

                            <h3 className="text-2xl font-bold">Bummer </h3>
                            <div className="text-lg">
                                Ni har inte fått tillgång till vår site ännu. Detta kan bero på att ni ännu inte är verifierade eller att fel har inträffat. Om ni tror det är ett fel vänligen kontakta oss på <a href="mailto:fest@nightofpassion.se">fest@nightofpassion.se</a> så ska vi hjälpa er.
                            </div>

                        </div>
                    </div>
                    <div>
                        <Link
                            href="/">
                            <button
                                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                            >
                                Back
                            </button></Link>
                    </div>

                </div>
            </main>
        </Layout>
    );
};

export default ErrorPage;