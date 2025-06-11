import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from ".";

export const uploadToFirebase = async (uri: string, path: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, blob);

    return await getDownloadURL(fileRef); // URL pública
};
