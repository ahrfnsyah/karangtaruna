import {
  ArrowRightIcon,
  CalendarIcon,
  CameraIcon,
  HeartIcon,
  LeafIcon,
  LightbulbIcon,
  MapPinIcon,
  QuoteIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ThumbsUpIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/ui/icons";

export const iconMap = {
  users: UsersIcon,
  heart: HeartIcon,
  trophy: TrophyIcon,
  lightbulb: LightbulbIcon,
  calendar: CalendarIcon,
  "map-pin": MapPinIcon,
  "arrow-right": ArrowRightIcon,
  camera: CameraIcon,
  sparkles: SparklesIcon,
  "thumbs-up": ThumbsUpIcon,
  "shield-check": ShieldCheckIcon,
  quote: QuoteIcon,
  leaf: LeafIcon,
} as const;

export type IconName = keyof typeof iconMap;