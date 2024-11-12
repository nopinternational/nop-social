import { type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { featureFlags } from "~/lib/featureflag/featureConfig";

// FEATURE_MESSAGENOTIFICATION

export const useFeature = (featureName: string): boolean => {
    
    const session = useSession();
    const userId = session.data?.user.id ;
    const useIt =  !!featureFlags[featureName]?.includes(userId|| "");

    return useIt;
};

export const ToggledByFeatureFlag = ({ featureName, children }: { featureName: string, children: ReactNode }): React.JSX.Element | null => {
    
    const featureFlagToggle = useFeature(featureName);

    return featureFlagToggle ? <>{children}</> : null;
};
