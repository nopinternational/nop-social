import Head from "next/head";
import { type PropsWithChildren, type ReactNode } from "react";
import HighlightText from "./HighlightText";
import Footer from "./Footer";

type LayoutProps = {
  headingText?: string | ReactNode;
  includeSigninSignoutButton?: boolean;
};

const Layout = ({
    children,
    headingText,
    includeSigninSignoutButton,
}: PropsWithChildren<LayoutProps>) => {
    return (
        <>
            <Head>
                <title>Night of Passion</title>
                <meta
                    name="description"
                    content="Night of Passion - Socialt Passion Sex"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        {headingText || <HighlightText>Night of Passion</HighlightText>}
                    </h1>
                    {children}
                    <div className="flex flex-col items-center gap-2">
                        <Footer includeSigninSignoutButton={includeSigninSignoutButton} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Layout;
