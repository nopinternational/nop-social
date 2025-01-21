export type AllowedUser = {
    id: string,
    when: Date
};

export const isAllowedUser = (iam_userid: string, allowedUsers: AllowedUser[]): boolean => {
    console.log("isAllowedUser", iam_userid, allowedUsers);
    const isAllowed = allowedUsers.some((user) => {
        console.log("some", user.id, iam_userid, user.id === iam_userid);
        return user.id === iam_userid;
            
    });
    console.log("isAllowedUser", iam_userid, allowedUsers, isAllowed);
    return isAllowed;
};