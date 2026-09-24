import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import StudentHeader from "../../components/StudentHeader";
import { getStudentFees } from "../../api/studentPortalApi";

export default function StudentFeesScreen() {
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchFees = useCallback(async () => {
    try {
      setError(null);
      const res = await getStudentFees();
      setFees(res || []);
    } catch (err) {
      console.error("Failed to fetch fees:", err);
      setError(err.message || "Failed to load fee records");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchFees();
  };

  const totalAmount = fees.reduce(
    (sum, f) => sum + parseFloat(f.total_amount || 0),
    0
  );
  const totalPaid = fees.reduce(
    (sum, f) => sum + parseFloat(f.paid_amount || 0),
    0
  );
  const totalDue = fees.reduce(
    (sum, f) => sum + parseFloat(f.due_amount || 0),
    0
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return { color: colors.success, bg: colors.successBg, label: "Paid" };
      case "Partially Paid":
        return { color: colors.warning, bg: colors.warningBg, label: "Partially Paid" };
      case "Overdue":
        return { color: colors.danger, bg: colors.dangerBg, label: "Overdue" };
      case "Pending":
      default:
        return { color: colors.info, bg: colors.infoBg, label: "Pending" };
    }
  };

  return (
    <View style={styles.container}>
      <StudentHeader
        title="Fee Statements"
        subtitle="Semester breakdown & dues"
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.stateText}>Loading fee records...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorTitle}>Could not load fee records</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchFees}>
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
          {/* Summary Banner */}
          <View style={styles.summaryBanner}>
            <Text style={styles.bannerTitle}>Account Balance Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Total Invoiced</Text>
                <Text style={styles.summaryValue}>
                  ₹{totalAmount.toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Total Paid</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  ₹{totalPaid.toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Balance Due</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: totalDue > 0 ? colors.danger : colors.textPrimary },
                  ]}
                >
                  ₹{totalDue.toLocaleString()}
                </Text>
              </View>
            </View>

            {totalDue > 0 && (
              <View style={styles.dueAlert}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.dueAlertText}>
                  You have an outstanding balance of ₹{totalDue.toLocaleString()}.
                  Please clear dues at the accounts office.
                </Text>
              </View>
            )}
          </View>

          {/* Fee Records List */}
          <Text style={styles.listSectionTitle}>
            Semester Records ({fees.length})
          </Text>

          {fees.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No fee records found</Text>
              <Text style={styles.emptySub}>
                Fee invoices will appear here when generated by the finance office.
              </Text>
            </View>
          ) : (
            fees.map((fee) => {
              const badge = getStatusBadge(fee.status);
              const dueAmt = parseFloat(fee.due_amount || 0);
              const paidAmt = parseFloat(fee.paid_amount || 0);
              const totalAmt = parseFloat(fee.total_amount || 0);
              const pct = totalAmt > 0 ? Math.round((paidAmt / totalAmt) * 100) : 0;
              const dueDateFormatted = fee.due_date
                ? new Date(fee.due_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—";

              return (
                <View key={fee.id} style={styles.feeCard}>
                  <View style={styles.feeCardHeader}>
                    <View>
                      <Text style={styles.feeSemTitle}>
                        Semester {fee.semester}
                      </Text>
                      <Text style={styles.feeAcadYear}>
                        Academic Year {fee.academic_year || "—"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: badge.bg },
                      ]}
                    >
                      <Text style={[styles.statusBadgeText, { color: badge.color }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  {/* Amounts breakdown */}
                  <View style={styles.amountsGrid}>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountItemLabel}>Total</Text>
                      <Text style={styles.amountItemVal}>
                        ₹{totalAmt.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountItemLabel}>Paid</Text>
                      <Text style={[styles.amountItemVal, { color: colors.success }]}>
                        ₹{paidAmt.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountItemLabel}>Due Amount</Text>
                      <Text
                        style={[
                          styles.amountItemVal,
                          { color: dueAmt > 0 ? colors.danger : colors.textPrimary },
                        ]}
                      >
                        ₹{dueAmt.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Payment progress */}
                  <View style={styles.progressWrap}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${pct}%`,
                            backgroundColor:
                              dueAmt === 0 ? colors.success : colors.warning,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressPercent}>{pct}% paid</Text>
                  </View>

                  {/* Due Date Row */}
                  <View style={styles.dueDateRow}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.dueDateText}>Due Date: {dueDateFormatted}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
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
  summaryBanner: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryCol: { flex: 1, alignItems: "center" },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.borderLight },
  summaryLabel: { fontSize: 11, color: colors.textSecondary },
  summaryValue: { fontSize: 16, fontWeight: "700", marginTop: 3 },
  dueAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dangerBg,
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
    gap: 8,
  },
  dueAlertText: {
    flex: 1,
    fontSize: 11,
    color: colors.danger,
    lineHeight: 16,
  },
  listSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  feeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  feeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  feeSemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  feeAcadYear: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  amountsGrid: {
    flexDirection: "row",
    backgroundColor: colors.sidebarBg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  amountItem: { flex: 1, alignItems: "center" },
  amountItemLabel: { fontSize: 11, color: colors.textSecondary },
  amountItemVal: { fontSize: 14, fontWeight: "700", marginTop: 2 },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
  progressPercent: { fontSize: 11, fontWeight: "600", color: colors.textSecondary },
  dueDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  dueDateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: colors.sidebarBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 28,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});
