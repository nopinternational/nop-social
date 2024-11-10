
/*

    reading env variables using dynamic keys i.e. process.env["variable"] 
    cannot be done due to webpack issues. Therefor a non-straight loading 
    of featureflags :/
*/
const featureValusRaw: { [key: string]: string } = { messageNotification: process.env.NEXT_PUBLIC_FEATURE_MESSAGENOTIFICATION || "" }


export const featureFlags: { [key: string]: string[] } = {
    "feature": ["allowedUserId_1", "allowedUserId_2"],

} 

const load = () => {
    for (const key in featureValusRaw) {
        featureFlags[key] = parseEnvValue(featureValusRaw[key] as string)
    }
}
const parseEnvValue = (value: string): string[] => {
    return value?.split(',') || []
}

load()
