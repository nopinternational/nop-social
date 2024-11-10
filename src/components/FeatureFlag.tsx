import { type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { featureFlags } from "~/lib/featureflag/featureConfig";

// FEATURE_MESSAGENOTIFICATION

export const useFeature = (featureName: string): boolean => {
    const session = useSession()
    const userId = session.data?.user.id ;
    const useIt =  !!featureFlags[featureName]?.includes(userId|| "")

    console.log("useFeature - featurename", featureName)
    console.log("useFeature - userid", userId)
    console.log("useFeature - flags", featureFlags)
    console.log("useFeature - <flag evaluation>", featureFlags[featureName]?.includes(userId|| ""))
    console.log("useFeature - useIt", useIt)

    return useIt
}

export const ToggledByFeatureFlag = ({ featureName, children }: { featureName: string, children: ReactNode }): React.JSX.Element | null => {
    const featureFlagToggle = useFeature(featureName)

    return featureFlagToggle ? <>{children}</> : null
}
