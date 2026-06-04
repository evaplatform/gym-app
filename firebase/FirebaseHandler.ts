import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { VideoSource } from "expo-video";
import { storage } from "@/firebase";
import { FileSizeHandler } from "@/shared/utils/FileSizeHandler";
import { log } from "@/shared/utils/log";
import { i18n } from "@/i18n";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

interface FirebaseHandlerProps {
    assets: ImagePicker.ImagePickerAsset[] | null | undefined
    oldPath?: string
}

export class FirebaseHandler {

    static async storeImage({ assets, oldPath }: FirebaseHandlerProps) {
        if (!assets || assets?.length === 0) return null;

        if (oldPath) {
            await this.deleteFile(oldPath);
        }

        const fileName = assets[0].fileName || `image-${Date.now()}.jpg`;
        const url = await this.uploadFile(
            assets[0].uri,
            `uploads/images/${fileName}`
        );

        return { url };
    }

    static async storeVideo({ assets, oldPath }: FirebaseHandlerProps) {
        if (!assets || assets?.length === 0) return null;
        const asset = assets[0];

        const fileSize = asset.fileSize || 0;
        const MB = 100;
        const maxSize = FileSizeHandler.calculateBytesFromMB(MB);
        const fileSizeInMB = FileSizeHandler.getSizeInMB(fileSize, 2);
        const maxSizeInMB = FileSizeHandler.getSizeInMB(maxSize, 2);

        if (fileSizeInMB > maxSizeInMB) {
            let errorMessage = i18n.translate(AppMessagesEnum.FIREBASE_BIG_FILE);
            errorMessage = errorMessage.replace("{{fileSize}}", fileSizeInMB.toString());
            errorMessage = errorMessage.replace("{{maxSize}}", maxSizeInMB.toString());

            throw new Error(errorMessage);
        }

        if (oldPath) {
            await this.deleteFile(oldPath);
        }

        // Gerar nome de arquivo único
        const fileName = `video-${Date.now()}.mp4`;
        const path = `uploads/videos/${fileName}`;

        // ✅ Usar vídeo original (sem compressão por enquanto)
        // Ou comprimir usando método alternativo
        let videoUri = asset.uri;
        
        // ✅ Se o vídeo for muito grande, tente reduzir qualidade no picker
        if (fileSizeInMB > 50) {
            log("⚠️ Vídeo grande detectado. Considere reduzir qualidade no ImagePicker.");
        }

        // Fazer upload do vídeo
        const url = await this.uploadFile(videoUri, path);

        return { url, path };
    }

    static async uploadFile(uri: string, path: string) {
        const response = await fetch(uri);
        const blob = await response.blob();

        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, blob);

        return await getDownloadURL(fileRef); // URL pública
    }

    static async deleteFile(path: string | VideoSource) {
        try {
            const fileRef = ref(storage, path as string);
            await deleteObject(fileRef);
        } catch (error) {
            log("Erro ao deletar arquivo:", error);
        }
    }

    // ✅ MÉTODO ALTERNATIVO: Compressão básica usando expo-av
    static async compressVideo(uri: string) {
        try {
            // Por enquanto, retorna o URI original
            // Você pode implementar compressão usando expo-av ou ffmpeg
            log("⚠️ Compressão de vídeo desabilitada temporariamente");
            return { uri };
        } catch (error) {
            console.error("Erro ao processar vídeo:", error);
            throw error;
        }
    }
}