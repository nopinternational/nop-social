/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type FC } from "react"
import { api } from "~/utils/api"

export const EventAttendes: FC<{ eventid: string }> = ({ eventid }) => {
    const attendes = api.event.getEventAttendes.useQuery(
        { eventId: eventid }
    )

    if (attendes.isLoading || false) {
        return <p>laddar deltagare...</p>
    }

    if (!attendes.data) {
        return <p>hittar ingen deltagare...</p>
    }


    if (attendes.data.length == 0)
        return (
            <div>
                <p>Ni måste vara deltagare på träffen för att se vilka som kommer.</p >
                <p>Har ni betalat nyligen så kommer vi strax lägga till er som deltagare, ha tålamod 😉</p >
            </div>
        )


    return (
        <div className="text-white">
            <p>Vi säger välkomna till:</p>
            <div className="p-2 bg-white/10 rounded-md">
                {attendes.data.map((attende) => { return (<Attende key={attende.id} profilename={attende.name}></Attende>) })}
            </div>
        </div>
    )
}

const Attende: FC<{ profilename: string }> = ({ profilename }) => {
    // console.log("Attende.profilename", profilename)
    return (<p >{profilename}</p>)
}
