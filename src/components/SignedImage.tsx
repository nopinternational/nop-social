import Image from "next/image";
import { api } from "~/utils/api";

export function SignedImage({imageId}: {imageId: string}) {
    const signedImageQuery = api.image.getSignedUrl.useQuery({imageId});
    if(signedImageQuery.isLoading) {
        return <div>loading image</div>;
    }
    if(!signedImageQuery || !signedImageQuery.data) {
        return <div>No image found</div>;
    }

    return <img src={signedImageQuery.data.signedUrl} alt={imageId}  />;
    
}