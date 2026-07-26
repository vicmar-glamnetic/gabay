import React from "react";
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../lib/theme/ThemeProvider";
import { HIT } from "../lib/theme/tokens";
import { Rule, Txt } from "./ui";

/**
 * Bottom sheet, not a modal. Day type pickers, category filters and region
 * pickers all open here so the option list stays inside thumb reach.
 */

const SPRING = { damping: 22, stiffness: 240, mass: 0.7 };

export function Sheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  /** Fraction of screen height the sheet opens to. */
  snap = 0.6,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  snap?: number;
}) {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const sheetHeight = Math.min(height * snap, height - insets.top - 24);

  const translateY = useSharedValue(sheetHeight);
  const backdrop = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateY.value = th.reduceMotion
        ? withTiming(0, { duration: 120 })
        : withSpring(0, SPRING);
      backdrop.value = withTiming(1, { duration: 160 });
    } else {
      translateY.value = withTiming(sheetHeight, { duration: 160 });
      backdrop.value = withTiming(0, { duration: 140 });
    }
  }, [visible, sheetHeight, th.reduceMotion, translateY, backdrop]);

  const pan = Gesture.Pan()
    .onChange((e) => {
      translateY.value = Math.max(0, translateY.value + e.changeY);
    })
    .onEnd((e) => {
      if (translateY.value > sheetHeight * 0.3 || e.velocityY > 900) {
        translateY.value = withTiming(sheetHeight, { duration: 160 });
        runOnJS(onClose)();
      } else {
        translateY.value = th.reduceMotion ? withTiming(0) : withSpring(0, SPRING);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: th.c.overlay }]}
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: sheetHeight,
              backgroundColor: th.c.card,
              borderTopLeftRadius: th.radius.xl,
              borderTopRightRadius: th.radius.xl,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: th.c.rule,
              paddingBottom: insets.bottom + th.space.md,
            },
            sheetStyle,
          ]}
        >
          <GestureDetector gesture={pan}>
            <View style={{ paddingTop: th.space.sm, paddingBottom: th.space.sm }}>
              <View
                style={{
                  alignSelf: "center",
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: th.c.ruleStrong,
                }}
              />
              {title ? (
                <View style={{ paddingHorizontal: th.space.lg, paddingTop: th.space.md }}>
                  <Txt variant="title">{title}</Txt>
                  {subtitle ? (
                    <Txt variant="small" style={{ marginTop: 2 }}>
                      {subtitle}
                    </Txt>
                  ) : null}
                </View>
              ) : null}
            </View>
          </GestureDetector>
          <Rule />
          <View style={{ flex: 1 }}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/** A single option row inside a picker sheet. */
export function SheetOption({
  label,
  hint,
  selected,
  onPress,
  trailing,
}: {
  label: string;
  hint?: string;
  selected?: boolean;
  onPress: () => void;
  trailing?: React.ReactNode;
}) {
  const th = useTheme();
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: HIT + 6,
          flexDirection: "row",
          alignItems: "center",
          gap: th.space.md,
          paddingHorizontal: th.space.lg,
          paddingVertical: th.space.md,
          backgroundColor: pressed ? th.c.cardSunken : "transparent",
        })}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="label" color={selected ? th.c.accent : th.c.ink}>
            {label}
          </Txt>
          {hint ? <Txt variant="small">{hint}</Txt> : null}
        </View>
        {trailing}
        {selected ? (
          <Txt variant="body" color={th.c.accent} style={{ fontFamily: th.font.monoBold }}>
            ✓
          </Txt>
        ) : null}
      </Pressable>
      <Rule style={{ marginLeft: th.space.lg }} />
    </>
  );
}
