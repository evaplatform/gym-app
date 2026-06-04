import { IUser } from "@/shared/models/IUser";
import { Skeleton } from "./Skeleton";
import { useState } from "react";
import CustomImage from "./CustomImage";
import { StyleSheet, View } from "react-native";

export default function UserImage({
  user,
  isLoading,
  width = 200,
  height = 200,
}: {
  isLoading: boolean;
  user?: IUser;
  width?: number;
  height?: number;
}) {
  const [fallbackImage, setFallbackImage] = useState<boolean>(false);

  const customStyles = {
    width,
    height,
    borderRadius: width / 2,
  };

  // Always show skeleton when loading
  if (isLoading) {
    return <Skeleton style={[customStyles]} />;
  }

  // Show fallback image if:
  // 1. No user object exists
  // 2. User exists but doesn't have a profilePhoto property
  // 3. User has profilePhoto but it failed to load (fallbackImage is true)
  if (!user || fallbackImage || typeof user !== 'object' || !('profilePhoto' in user) || !user.profilePhoto) {
    return (
      <CustomImage
        source={require("@/assets/images/default-profile-photo.png")}
        style={[customStyles]}
        resizeMode="cover"
      />
    );
  }

  // If we reach here, we have a valid user with a profilePhoto
  return (
    <CustomImage
      source={{ uri: user.profilePhoto }}
      style={[customStyles]}
      resizeMode="cover"
      onError={() => setFallbackImage(true)}
    />
  );
}