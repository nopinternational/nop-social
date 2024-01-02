import { useFlag, useUnleashContext } from "@unleash/nextjs/client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export const useFeaure = (featureName: string): boolean => {
    const session = useSession()

    const featureIsEnabled = useFlag(featureName)
    const updateContext = useUnleashContext();

    useEffect(() => {
        const userId = session.data?.user.id
        void updateContext({ userId });
    });
    return featureIsEnabled
}
