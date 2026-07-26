export const colors = {
  primary: "#2F5FCF",
  primaryDark: "#1E3FA0",
  primaryLight: "#EAF0FE",

  background: "#FFFFFF",
  surface: "#FFFFFF",
  sidebarBg: "#F8F9FB",

  border: "#E5E7EB",
  borderLight: "#EEF0F3",

  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  placeholder: "#9CA3AF",

  labelBlue: "#3B5FCE",

  success: "#16A34A",
  successBg: "#DCFCE7",

  danger: "#DC2626",
  dangerBg: "#FEE2E2",

  warning: "#D97706",
  warningBg: "#FEF3C7",

  info: "#2563EB",
  infoBg: "#DBEAFE",

  inactive: "#6B7280",
  inactiveBg: "#F3F4F6",

  graduated: "#7C3AED",
  graduatedBg: "#EDE9FE",

  noticeBg: "#F3F4F6",
  noticeBorder: "#3B5FCE",
};

export const statusStyles = {
  Active: { color: colors.success, bg: colors.successBg },
  Enrolled: { color: colors.success, bg: colors.successBg },
  Suspended: { color: colors.danger, bg: colors.dangerBg },
  "On Leave": { color: colors.warning, bg: colors.warningBg },
  Transferred: { color: colors.warning, bg: colors.warningBg },
  "Pending USN": { color: colors.info, bg: colors.infoBg },
  Inactive: { color: colors.inactive, bg: colors.inactiveBg },
  Graduated: { color: colors.graduated, bg: colors.graduatedBg },
};
