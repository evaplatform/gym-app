import { deleteFromFirebase, uploadToFirebase } from "@/firebase/uploadToFirebase";
import * as ImagePicker from "expo-image-picker";
import { useApi } from "./useApi";


export default function usePickVideoImage() {
    const { call } = useApi();

    const pickImage = async (oldImagePath?: string) => {
        const res = await call<ImagePicker.ImagePickerAsset[] | undefined>({
            // loading: true,
            try: async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images', 'livePhotos'],
                    quality: 1,
                });

                if (!result.canceled) {
                    return result.assets;
                }
            }
        })

        return res;
    };

    const pickVideo = async () => {
        const res = await call<string | undefined>({
            loading: true,
            try: async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['videos'],
                    quality: 1,
                });

                if (!result.canceled) {
                    const fileName = result.assets[0].fileName || `video-${Date.now()}.mp4`
                    const url = await uploadToFirebase(result.assets[0].uri, `uploads/videos/${fileName}`);
                    return url;
                }
            }
        })

        return res;
    }

    return { pickImage, pickVideo };
}