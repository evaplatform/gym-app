import * as ImagePicker from "expo-image-picker";
import { useApi } from "./useApi";
import { FileSizeHandler } from "@/shared/utils/FileSizeHandler";
import { useTranslation } from "./useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";


export default function usePickVideoImage() {
    const { t } = useTranslation();
    const { call } = useApi();

    const pickImage = async () => {
        const res = await call<ImagePicker.ImagePickerAsset[] | undefined>({
            loading: true,
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
        const res = await call<ImagePicker.ImagePickerAsset[] | undefined>({
            loading: true,
            try: async (toast) => {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['videos'],
                    aspect: [16, 9],
                    quality: 0.5,
                });

                if (result.canceled) return undefined;

                const asset = result.assets[0];
                const MIN = FileSizeHandler.getDurationInMinutes(1); // 1 minute in milliseconds

                if (asset.duration && asset.duration > MIN) {
                    throw new Error(t(AppMessagesEnum.VIDEO_TOO_LONG));
                }

                return result.assets;
            }
        })

        return res;
    }

    return { pickImage, pickVideo };
}