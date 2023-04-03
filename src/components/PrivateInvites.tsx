import type { PrivateConversation } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";

export function PrivateUnawnseredInvites() {
    const { data: sessionData } = useSession();
    const utils = api.useContext();
    const invitesQuery = api.privateConversation.getMyInvitationsToPrivateConversations.useQuery();
    const acceptInviteMutation = api.privateConversation.acceptPrivateConversation.useMutation({
        onSuccess() {
            void utils.privateConversation.getMyOpenPrivateConversations.invalidate();
            void utils.privateConversation.getMyAcceptedPrivateConversations.invalidate();
        }
    });
    
    const currentUsername = sessionData?.user.name;

    if (invitesQuery.isLoading) return <div>loading...</div>;
    if (!invitesQuery.data) return <div>No invites found</div>;
    if (!currentUsername) return <div>Not logged in</div>;

  return (
    <div className="rounded-sm bg-white p-3 shadow-sm">
      <span className="tracking-wide">UNANSWERED INVITES</span>
      {invitesQuery.data.map((privateConversation) => (<PrivateConversationCard key={privateConversation.id} 
      onAcceptClick={() => acceptInviteMutation.mutate({privateConversaionId: privateConversation.id})}
      privateConversation={privateConversation} currentUsername={currentUsername} />)
      )}
    </div>
  );
}

export function PrivateOpenInvites() {
    const { data: sessionData } = useSession();
    const invitesQuery = api.privateConversation.getMyOpenPrivateConversations.useQuery();
    const currentUsername = sessionData?.user.name;

    if (invitesQuery.isLoading) return <div>loading...</div>;
    if (!invitesQuery.data) return <div>No invites found</div>;
    if (!currentUsername) return <div>Not logged in</div>;

  return (
    <div className="rounded-sm bg-white p-3 shadow-sm">
      <span className="tracking-wide">OPEN INVITES</span>
      {invitesQuery.data.map((privateConversation) => (<PrivateConversationCard key={privateConversation.id} privateConversation={privateConversation} currentUsername={currentUsername} />)
      )}
    </div>
  );
}

export function PrivateAcceptedInvites() {
    const { data: sessionData } = useSession();
    const invitesQuery = api.privateConversation.getMyAcceptedPrivateConversations.useQuery();
    const currentUsername = sessionData?.user.name;

    if (invitesQuery.isLoading) return <div>loading...</div>;
    if (!invitesQuery.data) return <div>No invites found</div>;
    if (!currentUsername) return <div>Not logged in</div>;

  return (
    <div className="rounded-sm bg-white p-3 shadow-sm">
      <span className="tracking-wide">ACCEPTED INVITES</span>
      {invitesQuery.data.map((privateConversation) => (<PrivateConversationCard key={privateConversation.id} privateConversation={privateConversation} currentUsername={currentUsername} />)
      )}
    </div>
  );
}

export function PrivateConversationCard({
  privateConversation: privateConversations,
  currentUsername,
  onAcceptClick
}: {
  privateConversation: PrivateConversation;
  currentUsername: string;
  onAcceptClick?: () => void;
}) {
  if (privateConversations.initiatorId === currentUsername) {
    return (
      <div className="rounded-sm bg-white p-3 shadow-sm">
        <span className="tracking-wide">
          {privateConversations.recipientId}
        </span>
        {privateConversations.conversationId && (
          <div>
            <Link href={`/conversation/` + privateConversations.conversationId}>
              Go to conversation
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-sm bg-white p-3 shadow-sm">
      <span className="tracking-wide">{privateConversations.initiatorId}</span>
      {privateConversations.conversationId && (
        <div>
          <Link href={`/conversation/` + privateConversations.conversationId}>
            Go to conversation
          </Link>
        </div>
      )}
      {onAcceptClick && (<div>
        <button onClick={onAcceptClick}>Accept</button>
      </div>)}
    </div>
  );
}
