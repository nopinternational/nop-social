export type Event = {
    id: number;
    name: string;
    title: string;

    description: string;
}

export const EVENTS: Event[] = [
    {
        id: 1234,
        name: "Mingelträff",
        title: "Mingelträff efter sommaren",
        description: "Vi planerar för en ny cocktail träff i slutet av sommaren, håll utkik efter det 😘",
    },
    {
        id: 4567,
        name: "Skärgårdsfest",
        title: "Skärgårdsfest hösten",
        description: "Vi planerar för en ny Skärgårdsfest under hösten, håll utkik efter det 😘",
    },

]
