import { type NextApiRequest, type NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { ref, getDownloadURL, getMetadata } from "firebase/storage";
import { firebaseStorage } from "~/lib/firebase/firebase";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
   
    // eslint-disable-next-line no-console
    console.log("----req.url", req);
    const r = req.url?.replace(/^\/api/, '') as string; // TODO handle no match

    const session = await getSession({ req });

    if (!session) {
        return res.send({ error: 'You must sign in to view the protected content on this page...', status: 401 });
    }
    
    const image = await getImage(r);
    
    if (!image) {
        const errMsg = "Path does not exist: " + r;
        return res.send({ error: errMsg, status: 404 });
    }

    const fileBlob = await fetch(new URL(image.url), {
        headers: {
            // set your secret headers here
        },
    }).then((res) => res.blob());

    const resBufferArray = await fileBlob.arrayBuffer();
    const resBuffer = Buffer.from(resBufferArray);
    res.setHeader("X-image-service-url", req.headers.host || "");
    if (image.contentType){
        res.setHeader("Content-Type", image.contentType);
    }
    if (image.size) {
        res.setHeader("Content-Length", image.size);

    }
    res.write(resBuffer, 'binary');
    res.end();
    
    
}

type ImageUrlResponse = {
    url: string
    contentType?: string
    size?: number
}

const getImage = async (path: string): Promise<ImageUrlResponse | null> => {
    return await getFromFirebaseStorage(path);
};

const getFromFirebaseStorage = async (path: string): Promise<ImageUrlResponse | null> => {
    const storage = firebaseStorage;
    //console.log("storage", storage);
    try {
        const pathRef = ref(storage, path);
        const meta = await getMetadata(pathRef);
        // console.log("meta", meta);
        const url = await getDownloadURL(pathRef);
        return { url, contentType: meta.contentType, size: meta.size };
    } catch (error) {
        console.error("getFromFirebaseStorage.error", error);
        return null;
    }
};


