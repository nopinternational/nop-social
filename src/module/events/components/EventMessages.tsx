
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
                        
                        <div className="italic text-lg whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                            Här kommer ni snart att kunna skriva meddelenaden till andra som kommer på träffen.
                        </div>
                    </div>



                </div>
            </div>
        </div>

    )
}