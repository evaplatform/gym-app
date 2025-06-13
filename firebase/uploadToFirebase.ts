import { ref, uploadBytes, getDownloadURL, deleteObject, } from "firebase/storage";
import { storage } from ".";

export const uploadToFirebase = async (uri: string, path: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, blob);

    return await getDownloadURL(fileRef); // URL pública
};

export const deleteFromFirebase = async (path: string) => {
    const fileRef = ref(storage, path);

    try {
        await deleteObject(fileRef);
        console.log("Arquivo removido com sucesso!");
    } catch (error) {
        console.error("Erro ao remover arquivo do Firebase:", error);
    }
};