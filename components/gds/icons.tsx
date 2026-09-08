import Svg, { Path, Circle, Ellipse, Rect, Polyline, Line } from "react-native-svg"

type IcoProps = { s?: number; c?: string }

export const Ico = {
  Cup: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M6 4h12l-2 10H8L6 4Z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 14v4m6-4v4" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M7 18h10" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M10 8.5c.5-1 2.5-1 3 0" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  ),
  Coin: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" />
      <Path d="M12 7v10M9.5 9h5a1.5 1.5 0 0 1 0 3h-4" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  Sheriff: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3l2.5 5.5L21 9.5l-4.5 4.5 1 6.5L12 17l-5.5 3.5 1-6.5L3 9.5l6.5-1L12 3Z"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  Lasso: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="10" cy="11" rx="7" ry="5" stroke={c} strokeWidth="2" />
      <Path d="M17 11c0 3.5 2 6 3 7" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="10" cy="11" r="2.5" stroke={c} strokeWidth="2" />
    </Svg>
  ),
  Saloon: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5" width="7.5" height="15" rx="1" stroke={c} strokeWidth="2" />
      <Rect x="13.5" y="5" width="7.5" height="15" rx="1" stroke={c} strokeWidth="2" />
      <Path d="M10.5 12.5V5M13.5 12.5V5" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M3 5h18" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  Poster: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="2" width="16" height="20" rx="2" stroke={c} strokeWidth="2" />
      <Circle cx="12" cy="10" r="3.5" stroke={c} strokeWidth="2" />
      <Path d="M6 19c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  Dynamite: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="7" width="8" height="12" rx="4" stroke={c} strokeWidth="2" />
      <Path d="M12 7V4" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 3C13.5 3 15 4 15 4" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M10 11h4M10 14h4" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  Bell: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 10.5a6 6 0 0 1 12 0v3.5l2 3H4l2-3v-3.5Z"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M10 20a2 2 0 0 0 4 0" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  Back: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Share: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="16 6 12 2 8 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="2" x2="12" y2="15" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  Flag: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M4 21V4" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M4 4h14l-4 5.5 4 5.5H4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Cactus: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21V9M12 9C12 6 10 4 8 4S4 6 4 9v2h4" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 9c0-3 2-5 4-5s4 2 4 5v2h-4" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <Path d="M9 21h6" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  Search: ({ s = 24, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={c} strokeWidth="2" />
      <Path d="M21 21l-4.35-4.35" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  Star: ({ s = 16, c = "currentColor", filled = false }: IcoProps & { filled?: boolean }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? c : "none"}>
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  Check: ({ s = 16, c = "currentColor" }: IcoProps) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
}
