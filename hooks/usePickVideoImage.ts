import { uploadToFirebase } from "@/firebase/uploadToFirebase";
import * as ImagePicker from "expo-image-picker";
import { useApi } from "./useApi";


export default function usePickVideoImage() {
    const { call } = useApi();

    const pickImage = async () => {
        call({
            try: async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images', 'livePhotos'],
                    quality: 1,
                });

                if (!result.canceled) {
                    const fileName = result.assets[0].fileName || `image-${Date.now()}.jpg`
                    const url = await uploadToFirebase(result.assets[0].uri, `uploads/images/${fileName}`);
                    console.log("Download URL:", url);
                }
            }
        })
    };

    const pickVideo = async () => {
        call({
            try: async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['videos'],
                    quality: 1,
                });

                if (!result.canceled) {
                    const fileName = result.assets[0].fileName || `video-${Date.now()}.mp4`
                    const url = await uploadToFirebase(result.assets[0].uri, `uploads/videos/${fileName}`);
                    console.log("Download URL:", url);
                }
            }
        })
    }

    return { pickImage, pickVideo };
}