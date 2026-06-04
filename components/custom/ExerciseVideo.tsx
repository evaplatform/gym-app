import { StyleSheet } from "react-native";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { Skeleton } from "@/components/custom/Skeleton";
import { IVideoImagesTempProps } from "@/shared/interfaces/IVideoImagesTempProps";
import CustomImage from "./CustomImage";
import { fixFirebaseStorageUrl } from "@/shared/utils/fixFirebaseStorageUrl";
import useCustomStyle from "@/hooks/useCustomStyle";
import { IVideoProp } from "@/shared/interfaces/IVideoProp";
import { hasProperty } from "@/shared/utils/hasProperty";
import { useEffect, useMemo, useCallback } from "react";

export function ExerciseVideo<T extends IVideoImagesTempProps | IVideoProp>({
  isLoading,
  object,
  newRegister,
  playVideo = false,
}: {
  isLoading: boolean;
  object: T | undefined;
  newRegister: boolean;
  playVideo?: boolean;
}) {
  const { colors } = useCustomStyle();

  // ✅ Memoiza o videoPath para evitar recriações
  const videoPath = useMemo(() => {
    const rawVideoPath = hasProperty<IVideoImagesTempProps>(
      object,
      "currentVideoPath"
    )
      ? object.currentVideoPath
      : hasProperty<IVideoProp>(object, "videoPath")
      ? object.videoPath
      : "";

    const path = typeof rawVideoPath === "string" 
      ? fixFirebaseStorageUrl(rawVideoPath) 
      : "";

    console.log("Video path memoizado:", path);
    return path;
  }, [object]);

  // ✅ Separa a lógica de inicialização
  const shouldLoadVideo = useMemo(() => {
    if (!videoPath) return false;
    if (newRegister) return false;
    
    if (hasProperty<IVideoImagesTempProps>(object, "currentVideoPath")) {
      return !!object.currentVideoPath;
    }
    
    if (hasProperty<IVideoProp>(object, "videoPath")) {
      return !!object.videoPath;
    }
    
    return false;
  }, [videoPath, newRegister, object]);

  // ✅ Usa o player apenas se deve carregar vídeo
  const player = useVideoPlayer(
    shouldLoadVideo ? videoPath : null,
    useCallback((player) => {
      console.log("Inicializando player com URL:", videoPath);
      player.loop = true;
      player.muted = false; // Garante que não está mudo
      
      // Não tenta reproduzir imediatamente
      // Deixa o usuário controlar
    }, [videoPath])
  );

  // ✅ Controla reprodução separadamente
  useEffect(() => {
    if (!shouldLoadVideo || !player) return;

    const timer = setTimeout(() => {
      try {
        if (playVideo) {
          console.log("Tentando reproduzir vídeo");
          player.play();
        } else {
          player.pause();
        }
      } catch (error) {
        console.error("Erro ao controlar reprodução:", error);
      }
    }, 100); // Pequeno delay para garantir que o player está pronto

    return () => clearTimeout(timer);
  }, [playVideo, shouldLoadVideo, player]);

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

  // ✅ Log para debug
  useEffect(() => {
    console.log("Status do player:", status);
    if (status === "error") {
      console.error("Erro no player:");
    }
  }, [status]);

  const customStyles = {
    border: {
      borderColor: colors.gray300,
      borderWidth: 1,
    },
  };

  const checkFallbackImageCase = () => {
    if (!videoPath) return true;
    if (status === "error") return true;
    if (object === undefined) return true;
    if (!shouldLoadVideo) return true;

    if (
      !newRegister &&
      hasProperty<IVideoImagesTempProps>(object, "currentVideoPath")
    ) {
      return !object.currentVideoPath;
    }
    
    return false;
  };

  // video loading
  if (isLoading || (shouldLoadVideo && status === "loading")) {
    return <Skeleton style={[styles.imageVideoWrapper, customStyles.border]} />;
  }

  // fallback image case
  if (checkFallbackImageCase()) {
    return (
      <CustomImage
        source={require("@/assets/images/default-video-image.png")}
        style={[styles.imageVideoWrapper, customStyles.border]}
      />
    );
  }

  // Renderiza vídeo
  if (shouldLoadVideo && videoPath && status !== "error") {
    return (
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls // ✅ Adiciona controles nativos
      />
    );
  }

  // Fallback final
  return (
    <CustomImage
      source={require("@/assets/images/default-video-image.png")}
      style={[styles.imageVideoWrapper, customStyles.border]}
    />
  );
}

const styles = StyleSheet.create({
  imageVideoWrapper: {
    width: 350,
    height: 275,
    resizeMode: "cover",
  },
  video: {
    width: 350,
    height: 275,
  },
});