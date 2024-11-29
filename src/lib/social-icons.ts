import { SocialPlatform } from "@prisma/client";

export const socialPlatformData: Record<SocialPlatform, { name: string; icon: string }> = {
  GITHUB: {
    name: "GitHub",
    icon: "github",
  },
  LINKEDIN: {
    name: "LinkedIn",
    icon: "linkedin",
  },
  TWITTER: {
    name: "Twitter",
    icon: "twitter",
  },
  INSTAGRAM: {
    name: "Instagram",
    icon: "instagram",
  },
  FACEBOOK: {
    name: "Facebook",
    icon: "facebook",
  },
  YOUTUBE: {
    name: "YouTube",
    icon: "youtube",
  },
  DRIBBBLE: {
    name: "Dribbble",
    icon: "dribbble",
  },
  BEHANCE: {
    name: "Behance",
    icon: "behance",
  },
  MEDIUM: {
    name: "Medium",
    icon: "medium",
  },
  DEVTO: {
    name: "Dev.to",
    icon: "devto",
  },
  WEBSITE: {
    name: "Website",
    icon: "globe",
  },
  OTHER: {
    name: "Other",
    icon: "link",
  },
};
