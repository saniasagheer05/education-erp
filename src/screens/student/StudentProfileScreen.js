import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, statusStyles } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import StudentHeader from "../../components/StudentHeader";
import { getStudentProfile } from "../../api/studentPortalApi";

export default function StudentProfileScreen() {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setError(null);
      const res = await getStudentProfile();
      setProfile(res);
    } catch (err) {
      console.error("Failed to fetch student profile:", err);
      setError(err.message || "Failed to load profile details");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProfile();
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of your student account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()
    : "ST";

  const statusInfo =
    (profile?.status && statusStyles[profile.status]) || statusStyles.Active;

  return (
    <View style={styles.container}>
      <StudentHeader
        title="Student Profile"
        subtitle="Identity & academic record"
        rightAction={
          <TouchableOpacity onPress={handleLogout} style={styles.logoutHeaderBtn}>
            <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.stateText}>Loading profile...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorTitle}>Could not load profile</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchProfile}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* Profile Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <Text style={styles.heroName}>
              {profile?.first_name} {profile?.middle_name ? `${profile.middle_name} ` : ""}{profile?.last_name}
            </Text>

            <View style={styles.heroMetaRow}>
              <View style={styles.metaBadge}>
                <Ionicons name="card-outline" size={13} color={colors.primary} />
                <Text style={styles.metaBadgeText}>{profile?.library_id}</Text>
              </View>

              {profile?.usn ? (
                <View style={styles.metaBadge}>
                  <Ionicons name="school-outline" size={13} color={colors.primary} />
                  <Text style={styles.metaBadgeText}>{profile.usn}</Text>
                </View>
              ) : null}

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusInfo.bg },
                ]}
              >
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {profile?.status || "Active"}
                </Text>
              </View>
            </View>
          </View>

          {/* Academic Details Section */}
          <Text style={styles.sectionTitle}>Academic Information</Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <View style={styles.infoLabelGroup}>
                <Ionicons name="business-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Department</Text>
              </View>
              <Text style={styles.infoValue}>{profile?.department || "—"}</Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabelGroup}>
                <Ionicons name="layers-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Semester & Section</Text>
              </View>
              <Text style={styles.infoValue}>
                Semester {profile?.semester} (Sec {profile?.section})
              </Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabelGroup}>
                <Ionicons name="ribbon-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Program</Text>
              </View>
              <Text style={styles.infoValue}>{profile?.program || "B.E."}</Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabelGroup}>
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Academic Year</Text>
              </View>
              <Text style={styles.infoValue}>{profile?.academic_year || "—"}</Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabelGroup}>
                <Ionicons name="enter-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Admission Type</Text>
              </View>
              <Text style={styles.infoValue}>{profile?.admission_type || "Regular"}</Text>
            </View>
          </View>

          {/* Contact Details Section */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Contact & Personal Details
          </Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <View style={styles.infoLabelGroup}>
                <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Email</Text>
              </View>
              <Text style={styles.infoValue}>{profile?.email || "—"}</Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabelGroup}>
                <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Phone</Text>
              </View>
              <Text style={styles.infoValue}>{profile?.phone || "—"}</Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabelGroup}>
                <Ionicons name="calendar-clear-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Date of Birth</Text>
              </View>
              <Text style={styles.infoValue}>
                {profile?.date_of_birth
                  ? new Date(profile.date_of_birth).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabelGroup}>
                <Ionicons name="transgender-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Gender</Text>
              </View>
              <Text style={styles.infoValue}>{profile?.gender || "—"}</Text>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.logoutBtnText}>Sign Out of Portal</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 36 },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  stateText: { marginTop: 12, fontSize: 14, color: colors.textSecondary },
  errorTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginTop: 12 },
  errorDesc: { fontSize: 13, color: colors.textSecondary, textAlign: "center", marginTop: 6, marginBottom: 16 },
  retryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  logoutHeaderBtn: { padding: 4 },
  heroCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.sidebarBg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  infoLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    maxWidth: "50%",
    textAlign: "right",
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    marginTop: 28,
  },
  logoutBtnText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "700",
  },
});
