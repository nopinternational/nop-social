import { useFlag, useUnleashContext } from "@unleash/nextjs/client";
import { type ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

export const useFeature = (featureName: string): boolean => {
    const session = useSession()

    const featureIsEnabled = useFlag(featureName)
    const updateContext = useUnleashContext();

    useEffect(() => {
        const userId = session.data?.user.id
        void updateContext({ userId });
    });
    return featureIsEnabled
}

export const ToggledByFeatureFlag = ({ featureName, children }: { featureName: string, children: ReactNode }): React.JSX.Element | null => {
    const featureFlagToggle = useFeature(featureName)

    return featureFlagToggle ? <>{children}</> : null
}
