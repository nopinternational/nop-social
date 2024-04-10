import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";

export const MessageHeaderCard = () => {
  return (
    <Card
      header={
        <>
          Skicka <HighlightText>meddelande</HighlightText> till andra{" "}
          <HighlightText>profiler</HighlightText>
        </>
      }
    >
      <div className="text-lg">
        Tjoho! Vi har precis släppt möjligheten att skicka meddelanden till
        varandra 😃
      </div>
      <div className="text-lg">
        Det kan vara lite kantigt, se konstigt ut eller tom finnas buggar 🙈 Vi
        uppskattar all form av feedback eller kommentarer hur ni tycker det
        funkar. Sånt kan ni berätta för oss genom att maila till{" "}
        <a
          className="text-[hsl(280,100%,70%)]"
          href="mailto:feedback@nightofpassion.se"
        >
          feedback@nightofpassion.se
        </a>
        .
      </div>
      <div className="text-lg">Tack så mycket 🙇</div>
    </Card>
  );
};
