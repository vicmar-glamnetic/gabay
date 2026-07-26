import React from "react";
import { Pressable, StyleSheet, Switch, TextInput, View } from "react-native";

import { useTheme } from "../lib/theme/ThemeProvider";
import { HIT } from "../lib/theme/tokens";
import { Txt } from "./ui";

/**
 * Every peso and hours field opens `decimal-pad`. A user who has to switch
 * keyboards to type their salary will not finish.
 */
export function AmountField({
  label,
  hint,
  value,
  onChange,
  prefix = "₱",
  suffix,
  placeholder = "0",
  optional,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string | null;
  suffix?: string;
  placeholder?: string;
  optional?: boolean;
}) {
  const th = useTheme();
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={{ gap: th.space.xs }}>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: th.space.sm }}>
        <Txt variant="label" style={{ flex: 1 }}>
          {label}
        </Txt>
        {optional ? <Txt variant="micro">Optional</Txt> : null}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          minHeight: HIT,
          borderWidth: focused ? 1.5 : StyleSheet.hairlineWidth,
          borderColor: focused ? th.c.accent : th.c.ruleStrong,
          borderRadius: th.radius.md,
          backgroundColor: th.c.card,
          paddingHorizontal: th.space.md,
          gap: th.space.xs,
        }}
      >
        {prefix ? (
          <Txt variant="amount" color={th.c.muted}>
            {prefix}
          </Txt>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="decimal-pad"
          inputMode="decimal"
          placeholder={placeholder}
          placeholderTextColor={th.c.ruleStrong}
          accessibilityLabel={label}
          selectTextOnFocus
          style={{
            flex: 1,
            paddingVertical: th.space.sm,
            fontFamily: th.font.monoMedium,
            fontSize: th.fs(18),
            color: th.c.ink,
          }}
        />
        {suffix ? (
          <Txt variant="small" color={th.c.muted}>
            {suffix}
          </Txt>
        ) : null}
      </View>
      {hint ? <Txt variant="rule">{hint}</Txt> : null}
    </View>
  );
}

/** A field that opens a picker sheet rather than a dropdown. */
export function PickerField({
  label,
  value,
  hint,
  onPress,
}: {
  label: string;
  value: string;
  hint?: string;
  onPress: () => void;
}) {
  const th = useTheme();
  return (
    <View style={{ gap: th.space.xs }}>
      <Txt variant="label">{label}</Txt>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}, currently ${value}`}
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: HIT,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: th.space.sm,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: th.c.ruleStrong,
          borderRadius: th.radius.md,
          backgroundColor: pressed ? th.c.cardSunken : th.c.card,
          paddingHorizontal: th.space.md,
          paddingVertical: th.space.sm,
        })}
      >
        <Txt variant="body" style={{ flex: 1 }}>
          {value}
        </Txt>
        <Txt variant="small" color={th.c.muted} style={{ fontFamily: th.font.mono }}>
          ▾
        </Txt>
      </Pressable>
      {hint ? <Txt variant="rule">{hint}</Txt> : null}
    </View>
  );
}

export function ToggleField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const th = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      onPress={() => onChange(!value)}
      style={{
        minHeight: HIT,
        flexDirection: "row",
        alignItems: "center",
        gap: th.space.md,
        paddingVertical: th.space.xs,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Txt variant="label">{label}</Txt>
        {hint ? <Txt variant="rule">{hint}</Txt> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: th.c.accent, false: th.c.rule }}
        thumbColor={th.c.card}
      />
    </Pressable>
  );
}

/** Two-to-four option inline switch, for choices too small to warrant a sheet. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const th = useTheme();
  return (
    <View style={{ gap: th.space.xs }}>
      {label ? <Txt variant="label">{label}</Txt> : null}
      <View
        style={{
          flexDirection: "row",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: th.c.ruleStrong,
          borderRadius: th.radius.md,
          backgroundColor: th.c.card,
          overflow: "hidden",
        }}
      >
        {options.map((o, i) => {
          const selected = o.value === value;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(o.value)}
              style={{
                flex: 1,
                minHeight: HIT,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: th.space.sm,
                paddingVertical: th.space.sm,
                backgroundColor: selected ? th.c.accent : "transparent",
                borderLeftWidth: i === 0 ? 0 : StyleSheet.hairlineWidth,
                borderLeftColor: th.c.rule,
              }}
            >
              <Txt
                variant="small"
                color={selected ? th.c.accentInk : th.c.ink}
                style={{ fontFamily: th.font.sansMedium, textAlign: "center" }}
              >
                {o.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
