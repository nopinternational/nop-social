import { ChangeEvent, useState } from "react";
import Resizer from "react-image-file-resizer";
import { api } from "~/utils/api";
import { SignedImage } from "./SignedImage";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const resizeFile = (file: Blob): Promise<string | Blob | File | ProgressEvent<FileReader>> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1280,
      1920,
      "JPEG",
      96,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64",
      680,
      680
    );
  });

const resizeFileToUpload = (file: File): Promise<string | Blob | File | ProgressEvent<FileReader>> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1280,
      1920,
      "JPEG",
      96,
      0,
      (uri) => {
        resolve(uri);
      },
      "file",
      680,
      680
    );
  });


export function ImageUpload() {
  const [newImages, setNewImages] = useState<(Blob)[]>();
  const [newImagesToUpload, setNewImagesToUpload] = useState<File[]>();
  const urlMutation = api.image.getUploadPresignedUrl.useMutation();
  const uploadedMutation = api.image.setImageAsUploaded.useMutation();
  const listImagesQuery = api.image.listAllUploadedImages.useQuery();
  const utils = api.useContext();

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      maxFiles: 1,
      maxSize: 200000000, // roughly 5GB
      multiple: true,
      onDropAccepted: (files, _event) => {

        void Promise.all(Array.from(files).map((file) => {
          return resizeFile(file);
        })).then((images) => {
          setNewImages(images as Blob[]);
        });

        void Promise.all(Array.from(files).map((file) => {
          return resizeFileToUpload(file);
        })).then((images) => {
          setNewImagesToUpload(images as File[]);
        });
      },
    });

  function fileChangedHandler(event: ChangeEvent<HTMLInputElement>) {

    if (event.currentTarget.files) {
      void Promise.all(Array.from(event.currentTarget.files).map((file) => {
        return resizeFile(file);
      })).then((images) => {
        setNewImages(images as Blob[]);
      });

      void Promise.all(Array.from(event.currentTarget.files).map((file) => {
        return resizeFileToUpload(file);
      })).then((images) => {
        setNewImagesToUpload(images as File[]);
      });
    }
  }

  function UploadImages() {
    if (!newImagesToUpload) {
      return;
    }

    const allUploads = newImagesToUpload.map(async (imageFile, index) => {
      console.log(imageFile);
      const uploadUrl = await urlMutation.mutateAsync({ key: index.toString(), contentLength: imageFile.size });

      await axios
        .put(uploadUrl.signedUrl, imageFile.slice(), {
          headers: { "Content-Type": 'image/jpeg' },
        })
        .then((response) => {
          console.log(response);
          console.log("Successfully uploaded ", imageFile.name);
        });

      await uploadedMutation.mutateAsync({ imageId: uploadUrl.imageId });

      console.log('File uploaded' + uploadUrl.imageId);
    });

    void Promise.all(allUploads).then(async () => {
      await utils.image.listAllUploadedImages.invalidate();
      setNewImages(undefined);
      setNewImagesToUpload(undefined);
    });
  }

  if (listImagesQuery.isLoading) {
    return <div>Loading images...</div>
  }

  return (
    <div className="App">

      <div {...getRootProps()} className="bg-white w-400 h-100">
        <input {...getInputProps()} accept="image/jpeg" />
        {isDragActive ? (
          <div className="flex h-full items-center justify-center font-semibold">
            <p>Drop the file here...</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center font-semibold">
            <p>Drag n drop file here, or click to select files</p>
          </div>
        )}
      </div>


      <input type="file" accept="image/jpeg" onChange={fileChangedHandler} multiple />

      <div>
        {newImages?.map((image, index) => {
          return <Image key={index} style={{ width: 150 }} src={String(image)} alt="" />
        })};
      </div>
      <button className="bg-white" onClick={UploadImages}>Upload</button>

      <div>
        <h3>Uploaded images</h3>
        {listImagesQuery.data?.map((image) => {
          return <SignedImage key={image.id} imageId={image.id} />
        })}
      </div>

    </div>
  );
}