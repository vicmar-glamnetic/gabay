import { usePathname } from "expo-router";

/**
 * Whether the current screen sits inside the bottom tab navigator.
 *
 * The tab bar takes layout space rather than floating, so a screen's `bottom: 0`
 * already sits above it. What callers need to know is only whether the bar is
 * there — if it is, it has already absorbed the bottom safe-area inset, and
 * anything pinned to the bottom must not add that inset a second time.
 *
 * This is derived from the route rather than from React Navigation's
 * `BottomTabBarHeightContext`, because as of SDK 56 expo-router refuses direct
 * `@react-navigation/*` imports. Onboarding is the only screen outside the tabs.
 */
export function useInsideTabs(): boolean {
  const pathname = usePathname();
  return pathname !== "/onboarding";
}
