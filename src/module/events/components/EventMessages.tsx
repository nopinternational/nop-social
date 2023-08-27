
import HighlightText from "~/components/HighlightText";
export const EventMessages = () => {

    return (
        <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
            <div className="col-span-2">
                <div
                    className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white"
                >
                    <h3 className="text-2xl font-bold">
                        Har ni något på <HighlightText>hjärtat</HighlightText>?
                    </h3>
                    <div className="text-lg whitespace-pre-wrap">
                        Lämna ett meddelande till dom andra som kommer på träffen.
                    </div>

                    <div>
                        <div><HighlightText>Skicka ett eget meddelande:</HighlightText></div>
                        <div className="text-black text-lg whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                            <input placeholder="lämna ert medelenade här"></input>
                            <button className="rounded-full bg-white/10 bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[hsl(280,100%,70%)]">
                                Skicka
                            </button>
                        </div>
                    </div>
                    <div>
                        <div><HighlightText>sthlmpar08</HighlightText> säger:</div>
                        <div className="text-lg whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                            Vi har så mycket kul att berätta om sommmarens äventyr
                        </div>
                    </div>
                    <div>
                        <div><HighlightText>foppi76</HighlightText> säger:</div>
                        <div className="text-lg whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                            Äntligen är ni igång gång, längtar! Har ni haft det bra i sommar?
                        </div>
                    </div>
                    <div>
                        <div><HighlightText>sthlmpar08</HighlightText> säger:</div>
                        <div className="text-lg whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                            Vi är så glada att få träffa alla igen
                        </div>
                    </div>



                </div>
            </div>
        </div>

    )
}