import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { colors, statusStyles } from "../theme/colors";
import { getDefaulters } from "../api/feesApi";
import { shareFeeReceipt } from "../utils/feeReceipt";
const DEPARTMENTS=["All","Computer Science (CSE)","Mechanical","Electronics (ECE)","Information Science (ISE)","Civil"];
const formatInr=(v)=>`₹${Math.round(Number(v||0)).toLocaleString("en-IN")}`;
const formatDate=(v)=>v?new Date(v).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—";
export default function DefaultersScreen() {
  const [selectedDept,setSelectedDept]=useState("All"); const [rows,setRows]=useState([]); const [totalDue,setTotalDue]=useState(0);
  const [isLoading,setIsLoading]=useState(true); const [isRefreshing,setIsRefreshing]=useState(false); const [error,setError]=useState(null);
  const fetchDefaulters=useCallback(async()=>{try{setError(null); const params={}; if(selectedDept!=="All")params.department=selectedDept;
      const r=await getDefaulters(params); setRows(r.data); setTotalDue(r.totalDue);}catch(e){setError(e.message||"Failed to load fee defaulters.");}finally{setIsLoading(false);setIsRefreshing(false);}},[selectedDept]);
  useEffect(()=>{setIsLoading(true);fetchDefaulters();},[fetchDefaulters]);
  const onRefresh=()=>{setIsRefreshing(true);fetchDefaulters();};
  return (<SafeAreaView style={s.safe} edges={["bottom"]}><Header title="Fee Defaulters" showSearch={false}/>
    <View style={s.filterWrap}><Text style={s.filterLabel}>Filter by Department</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
        {DEPARTMENTS.map(dept=>{const sel=selectedDept===dept; return (<TouchableOpacity key={dept} style={[s.chip,sel&&s.chipSelected]} onPress={()=>setSelectedDept(dept)}>
          <Text style={[s.chipText,sel&&s.chipTextSelected]}>{dept}</Text></TouchableOpacity>);})}
      </ScrollView></View>
    {isLoading?(<View style={s.center}><ActivityIndicator size="large" color={colors.primary}/><Text style={s.stateText}>Loading defaulters...</Text></View>)
    :error?(<View style={s.center}><Ionicons name="alert-circle-outline" size={48} color={colors.danger}/><Text style={s.errorTitle}>Could not load defaulters</Text><Text style={s.stateText}>{error}</Text>
        <TouchableOpacity style={s.retryBtn} onPress={fetchDefaulters}><Text style={s.retryText}>Try Again</Text></TouchableOpacity></View>)
    :(<ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary}/>}>
        <View style={s.summary}><View style={s.summaryCol}><Text style={s.summaryLabel}>Defaulters</Text><Text style={s.summaryValue}>{rows.length}</Text></View>
          <View style={s.summaryDivider}/><View style={s.summaryCol}><Text style={s.summaryLabel}>Total Outstanding</Text><Text style={[s.summaryValue,{color:colors.danger}]}>{formatInr(totalDue)}</Text></View></View>
        {rows.length===0?(<View style={s.emptyCard}><Ionicons name="checkmark-circle-outline" size={40} color={colors.success}/><Text style={s.emptyTitle}>No defaulters</Text>
            <Text style={s.stateText}>No overdue fee balances{selectedDept!=="All"?" in this department":""}.</Text></View>)
        :rows.map(row=>{const badge=statusStyles[row.status]||{color:colors.textSecondary,bg:colors.inactiveBg}; const hasPaid=parseFloat(row.paid_amount)>0; return (
            <View key={row.id} style={s.card}><View style={s.cardTop}><View style={{flex:1}}><Text style={s.name}>{row.first_name} {row.last_name}</Text>
                <Text style={s.meta}>{row.library_id} • {row.department} • Sem {row.semester}</Text></View>
              <View style={[s.badge,{backgroundColor:badge.bg}]}><Text style={[s.badgeText,{color:badge.color}]}>{row.status}</Text></View></View>
            <View style={s.amounts}><View style={s.amountCol}><Text style={s.amountLabel}>Balance Due</Text><Text style={[s.amountValue,{color:colors.danger}]}>{formatInr(row.due_amount)}</Text></View>
              <View style={s.amountCol}><Text style={s.amountLabel}>Paid</Text><Text style={s.amountValue}>{formatInr(row.paid_amount)}</Text></View>
              <View style={s.amountCol}><Text style={s.amountLabel}>Due Date</Text><Text style={s.amountValue}>{formatDate(row.due_date)}</Text></View></View>
            {hasPaid&&(<TouchableOpacity style={s.receiptBtn} onPress={()=>shareFeeReceipt({student:{first_name:row.first_name,last_name:row.last_name,library_id:row.library_id,department:row.department},fee:row})}>
                <Ionicons name="document-text-outline" size={16} color={colors.primary}/><Text style={s.receiptText}>Share receipt for payments made</Text></TouchableOpacity>)}
            </View>);})}
      </ScrollView>)}</SafeAreaView>);
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},filterWrap:{paddingTop:12,paddingBottom:8,backgroundColor:colors.background},
  filterLabel:{fontSize:12,fontWeight:"600",color:colors.labelBlue,marginLeft:16,marginBottom:8},filterRow:{paddingHorizontal:16},
  chip:{borderWidth:1,borderColor:colors.border,borderRadius:16,paddingVertical:7,paddingHorizontal:14,marginRight:8},chipSelected:{backgroundColor:colors.primaryLight,borderColor:colors.primary},
  chipText:{fontSize:12,fontWeight:"600",color:colors.textSecondary},chipTextSelected:{color:colors.primary},scroll:{flex:1,backgroundColor:colors.sidebarBg},scrollContent:{padding:16,paddingBottom:40},
  center:{flex:1,alignItems:"center",justifyContent:"center",padding:24},stateText:{color:colors.textSecondary,marginTop:10,textAlign:"center",fontSize:13},errorTitle:{fontSize:16,fontWeight:"700",color:colors.textPrimary,marginTop:8},
  retryBtn:{marginTop:14,paddingHorizontal:22,paddingVertical:10,borderRadius:8,backgroundColor:colors.primary},retryText:{color:"#FFFFFF",fontWeight:"600"},
  summary:{flexDirection:"row",alignItems:"center",backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:12,padding:16,marginBottom:16},
  summaryCol:{flex:1,alignItems:"center"},summaryDivider:{width:1,height:32,backgroundColor:colors.borderLight},summaryLabel:{fontSize:11,color:colors.textSecondary},summaryValue:{fontSize:18,fontWeight:"700",color:colors.textPrimary,marginTop:3},
  emptyCard:{alignItems:"center",backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:12,padding:30},emptyTitle:{fontSize:15,fontWeight:"700",color:colors.textPrimary,marginTop:8},
  card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:12,padding:14,marginBottom:12},cardTop:{flexDirection:"row",alignItems:"flex-start"},
  name:{fontSize:15,fontWeight:"700",color:colors.textPrimary},meta:{fontSize:12,color:colors.textSecondary,marginTop:2},badge:{borderRadius:10,paddingHorizontal:10,paddingVertical:4,marginLeft:8},badgeText:{fontSize:11,fontWeight:"700"},
  amounts:{flexDirection:"row",marginTop:12,paddingTop:12,borderTopWidth:1,borderTopColor:colors.borderLight},amountCol:{flex:1},amountLabel:{fontSize:11,color:colors.textSecondary},amountValue:{fontSize:13,fontWeight:"700",color:colors.textPrimary,marginTop:3},
  receiptBtn:{flexDirection:"row",alignItems:"center",marginTop:12,alignSelf:"flex-start"},receiptText:{fontSize:12,fontWeight:"600",color:colors.primary,marginLeft:6}});
