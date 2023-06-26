export type Event = {
    id: string;
    name: string;
    title: string;

    description: string;
}

export const EVENTS: Event[] = [
    {
        id: "1234",
        name: "Cocktailträff",
        title: "Cocktailträff efter sommaren",
        description: "Vi planerar för en ny cocktail träff i slutet av sommaren, håll utkik efter det 😘",
    },
    {
        id: "4567",
        name: "Cocktailträff",
        title: "Cocktailträff hösten",
        description: "Vi planerar för en ny cocktail träff under hösten, håll utkik efter det 😘",
    },

]
