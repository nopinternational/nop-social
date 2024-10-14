/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type FC } from "react";
import HighlightText from "~/components/HighlightText";
import { ProfileLink } from "~/module/profile/components/ProfileLink";
import { api } from "~/utils/api";
import { VIPBadge } from "./VIPBadge";

export const EventAttendes: FC<{ eventid: string }> = ({ eventid }) => {
  const attendes = api.event.getEventAttendes.useQuery({ eventId: eventid });

  if (attendes.isLoading || false) {
    return <p>laddar deltagare...</p>;
  }

  if (!attendes.data) {
    return <p>hittar ingen deltagare...</p>;
  }

  if (attendes.data.length == 0)
    return (
      <div>
        <p>Ni måste vara deltagare på träffen för att se vilka som kommer.</p>
        <p>
          Har ni betalat nyligen så kommer vi strax lägga till er som deltagare,
          ha tålamod 😉
        </p>
      </div>
    );

  return (
    <div className="text-white">
      <p>Vi säger välkomna till:</p>
      <div className="rounded-md bg-white/10 p-2">
        {attendes.data.map((attende) => {
          return (
            <>
              <Attende
                key={attende.id}
                profilename={attende.name}
                username={attende.username}
                isVIP={attende.vip || false}
              ></Attende>
            </>
          );
        })}
      </div>
    </div>
  );
};

const Attende: FC<{
  profilename: string;
  username?: string;
  isVIP: boolean;
}> = ({ profilename, username, isVIP }) => {
  if (username) {
    return (
      <div>
        <p className="inline">
          {profilename} (
          <HighlightText>
            <ProfileLink username={username} />
          </HighlightText>
          )
        </p>
        <VIPBadge isVIP={isVIP} />
      </div>
    );
  }
  return (
    <div>
      <p className="inline">{profilename}</p>
      <VIPBadge isVIP={isVIP} />
    </div>
  );
};
