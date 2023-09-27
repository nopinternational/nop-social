import Head from "next/head";
import {

    type PropsWithChildren
} from "react";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Head>
                <title>Night of Passion</title>
                <meta name="description" content="Night of Passion - Socialt Passion Sex" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {children}
        </>
    )
}

export default Layout