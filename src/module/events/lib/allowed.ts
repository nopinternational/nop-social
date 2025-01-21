export type AllowedUser = {
    id: string,
    when: Date
};

export const isAllowedUser = (iam_userid: string, allowedUsers: AllowedUser[]): boolean => {
    const isAllowed = allowedUsers.some((user) => {
        return user.id === iam_userid;
            
    });
    return isAllowed;
};