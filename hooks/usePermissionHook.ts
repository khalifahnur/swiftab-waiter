import { useEffect, useState } from "react";
import { Camera } from "react-native-vision-camera";

const useAppPermissions = () => {
  const [permissions, setPermissions] = useState({
    camera: false,
  });

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Camera permission
        let hasCameraPermission = false;
        const cameraStatus = await Camera.getCameraPermissionStatus();
        if (cameraStatus !== "granted") {
          hasCameraPermission = (await Camera.requestCameraPermission()) === "granted";
        } else {
          hasCameraPermission = true;
        }

      } catch (error) {
        console.error("Permission error:", error);
      }
    };

    requestPermissions();
  }, []);

  return permissions;
};

export default useAppPermissions;