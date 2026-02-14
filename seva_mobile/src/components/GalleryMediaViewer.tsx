import React, { useEffect, useRef } from "react";
import { Modal, View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { Video, ResizeMode } from "expo-av";
import type { MediaItem } from "../services/galleryApi";

export default function GalleryMediaViewer({
  visible,
  onClose,
  item,
}: {
  visible: boolean;
  onClose: () => void;
  item: MediaItem | null;
}) {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
        if (!visible) {
      videoRef.current?.stopAsync?.().catch(() => {});
    }
  }, [visible, item?.id]);

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.92)" }}>
        {/* Header */}
        <View
          style={{
            paddingTop: 50,
            paddingHorizontal: 16,
            paddingBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "900", flex: 1 }} numberOfLines={1}>
            {item.title || (item.type === "VIDEO" ? "Video" : "Image")}
          </Text>

          <Pressable
            onPress={onClose}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.14)",
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>Close</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={{ flex: 1, padding: 16 }}>
          {item.type === "IMAGE" ? (
            <Image
              source={{ uri: item.url }}
              style={{ width: "100%", height: "100%", borderRadius: 14 }}
              resizeMode="contain"
            />
          ) : (
            <View style={{ flex: 1, borderRadius: 14, overflow: "hidden" }}>
              <Video
                ref={videoRef}
                source={{ uri: item.url }}
                style={{ width: "100%", height: "100%" }}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay
                isLooping={false}
                onError={(e) => {
                  console.log("Video error:", e);
                }}
              />

              {/* Small helper text overlay */}
              <View
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  right: 12,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  backgroundColor: "rgba(0,0,0,0.45)",
                }}
              >
                {/* <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>
                  Tip: If video doesn’t load, check Firebase Storage rules / URL access.
                </Text> */}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
