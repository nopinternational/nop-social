


export const featureFlags: { [key: string]: string[] } = {
    "feature": ["allowedUserId_1", "allowedUserId_2"],

} 

const loadFromEnv = () => {
    const flag1 = process.env.NEXT_PUBLIC_FEATURE_MESSAGENOTIFICATION

    console.log("FeatureFlag: FEATURE_MESSAGENOTIFICATION-2", flag1)
    // console.log("FeatureFlag: FEATURE_MESSAGENOTIFICATION", process.env)

    featureFlags.messageNotification =  flag1?.split(',') || []
}

loadFromEnv()  

