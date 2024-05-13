import { type NextPage } from "next";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { PasswordCard } from "~/module/profile/components/PasswordCard";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const code = "code";

  function onPasswordChange(password: string): void {
    alert("set new password: " + password);
  }

  return (
    <Layout headingText={<HighlightText>Night of Passion</HighlightText>}>
      <PasswordCard
        code={code || ""}
        onPasswordChange={onPasswordChange}
      ></PasswordCard>
    </Layout>
  );
};

export default Home;
