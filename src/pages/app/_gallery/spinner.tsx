import { type NextPage } from "next"
import HighlightText from "~/components/HighlightText"
import Layout from "~/components/Layout"
import { Spinner } from "~/components/Spinner"

const Home: NextPage = () => {
    return (
        <Layout headingText={<>Laddar <HighlightText>någonting</HighlightText></>}>
            <Spinner />
        </Layout>
    )
}

export default Home