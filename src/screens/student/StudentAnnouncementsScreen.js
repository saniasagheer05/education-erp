import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import StudentHeader from "../../components/StudentHeader";
import { getStudentAnnouncements } from "../../api/announcementsApi";
const formatDate=(v)=>!v?"":new Date(v).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
export default function StudentAnnouncementsScreen() {
  const [items,setItems]=useState([]); const [isLoading,setIsLoading]=useState(true); const [isRefreshing,setIsRefreshing]=useState(false); const [error,setError]=useState(null);
  const fetchItems=useCallback(async()=>{try{setError(null);setItems((await getStudentAnnouncements())||[]);}catch(e){setError(e.message||"Failed to load announcements");}finally{setIsLoading(false);setIsRefreshing(false);}},[]);
  useEffect(()=>{fetchItems();},[fetchItems]);
  const onRefresh=()=>{setIsRefreshing(true);fetchItems();};
  return (<View style={s.container}><StudentHeader title="Notices" subtitle="Announcements from the college"/>
    {isLoading?(<View style={s.center}><ActivityIndicator size="large" color={colors.primary}/><Text style={s.stateText}>Loading announcements...</Text></View>)
    :error?(<View style={s.center}><Ionicons name="alert-circle-outline" size={48} color={colors.danger}/><Text style={s.errorTitle}>Error Loading Notices</Text><Text style={s.stateText}>{error}</Text>
        <TouchableOpacity style={s.retryBtn} onPress={fetchItems}><Text style={s.retryText}>Try Again</Text></TouchableOpacity></View>)
    :(<ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary}/>}>
        {items.length===0?(<View style={s.center}><Ionicons name="megaphone-outline" size={48} color={colors.textMuted}/><Text style={s.stateText}>No announcements yet.</Text></View>)
        :items.map(item=>(<View key={item.id} style={s.card}><View style={s.cardHeader}><View style={s.iconWrap}><Ionicons name="megaphone" size={16} color={colors.primary}/></View><Text style={s.cardTitle}>{item.title}</Text></View>
              <Text style={s.cardBody}>{item.body}</Text><Text style={s.cardMeta}>{formatDate(item.created_at)}</Text></View>))}
      </ScrollView>)}</View>);
}
const s=StyleSheet.create({container:{flex:1,backgroundColor:colors.background},scroll:{flex:1,backgroundColor:colors.sidebarBg},scrollContent:{padding:16,paddingBottom:30},
  center:{flex:1,alignItems:"center",justifyContent:"center",padding:30},stateText:{color:colors.textSecondary,marginTop:10,textAlign:"center"},errorTitle:{fontSize:16,fontWeight:"700",color:colors.textPrimary,marginTop:8},
  retryBtn:{marginTop:14,paddingHorizontal:22,paddingVertical:10,borderRadius:8,backgroundColor:colors.primary},retryText:{color:"#FFFFFF",fontWeight:"600"},
  card:{backgroundColor:colors.surface,borderRadius:12,borderWidth:1,borderColor:colors.border,padding:14,marginBottom:12},cardHeader:{flexDirection:"row",alignItems:"center"},
  iconWrap:{width:30,height:30,borderRadius:15,backgroundColor:colors.primaryLight,alignItems:"center",justifyContent:"center",marginRight:10},
  cardTitle:{flex:1,fontSize:15,fontWeight:"700",color:colors.textPrimary},cardBody:{fontSize:14,color:colors.textPrimary,marginTop:10,lineHeight:20},cardMeta:{fontSize:11,color:colors.textSecondary,marginTop:10}});
