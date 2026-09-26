import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { colors } from "../theme/colors";
import { getAdminAnnouncements, createAnnouncement, deleteAnnouncement } from "../api/announcementsApi";
const formatDate = (v) => !v ? "" : new Date(v).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
export default function AdminAnnouncementsScreen() {
  const [items,setItems]=useState([]); const [title,setTitle]=useState(""); const [body,setBody]=useState("");
  const [isLoading,setIsLoading]=useState(true); const [isRefreshing,setIsRefreshing]=useState(false); const [isPosting,setIsPosting]=useState(false); const [error,setError]=useState(null);
  const fetchItems = useCallback(async () => { try{setError(null); setItems((await getAdminAnnouncements())||[]);}catch(e){setError(e.message||"Failed to load announcements.");}finally{setIsLoading(false);setIsRefreshing(false);} },[]);
  useEffect(()=>{fetchItems();},[fetchItems]);
  const onRefresh=()=>{setIsRefreshing(true);fetchItems();};
  const handlePost=async()=>{ if(!title.trim()||!body.trim()){Alert.alert("Missing details","Please enter both a title and a message.");return;}
    try{setIsPosting(true); await createAnnouncement({title:title.trim(),body:body.trim()}); setTitle("");setBody(""); await fetchItems(); Alert.alert("Published","Announcement posted.");}
    catch(e){Alert.alert("Could not post",e.message||"Please try again.");} finally{setIsPosting(false);} };
  const handleDelete=(item)=>{ Alert.alert("Delete announcement",`Delete "${item.title}"?`,[{text:"Cancel",style:"cancel"},{text:"Delete",style:"destructive",onPress:async()=>{
      try{await deleteAnnouncement(item.id); setItems(p=>p.filter(a=>a.id!==item.id));}catch(e){Alert.alert("Could not delete",e.message||"Please try again.");} }}]); };
  return (<SafeAreaView style={s.safe} edges={["bottom"]}><Header title="Announcements" showSearch={false} />
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":undefined}>
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary}/>}>
        <View style={s.card}><Text style={s.cardTitle}>New Announcement</Text>
          <Text style={s.label}>Title</Text><TextInput style={s.input} placeholder="e.g. Internal exam schedule" placeholderTextColor={colors.placeholder} value={title} onChangeText={setTitle} maxLength={150}/>
          <Text style={s.label}>Message</Text><TextInput style={[s.input,s.textArea]} placeholder="Write the announcement..." placeholderTextColor={colors.placeholder} value={body} onChangeText={setBody} multiline maxLength={2000} textAlignVertical="top"/>
          <TouchableOpacity style={[s.postBtn,isPosting&&s.postBtnDisabled]} onPress={handlePost} disabled={isPosting} activeOpacity={0.8}>
            {isPosting?<ActivityIndicator color="#FFFFFF"/>:(<><Ionicons name="megaphone-outline" size={18} color="#FFFFFF"/><Text style={s.postBtnText}>Publish to Students</Text></>)}
          </TouchableOpacity></View>
        <Text style={s.sectionTitle}>Posted ({items.length})</Text>
        {isLoading?(<View style={s.center}><ActivityIndicator size="large" color={colors.primary}/></View>)
        :error?(<View style={s.center}><Ionicons name="alert-circle-outline" size={40} color={colors.danger}/><Text style={s.errorText}>{error}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={fetchItems}><Text style={s.retryText}>Try Again</Text></TouchableOpacity></View>)
        :items.length===0?(<View style={s.center}><Ionicons name="megaphone-outline" size={40} color={colors.textMuted}/><Text style={s.emptyText}>No announcements yet.</Text></View>)
        :items.map(item=>(<View key={item.id} style={s.itemCard}><View style={s.itemHeader}><Text style={s.itemTitle} numberOfLines={2}>{item.title}</Text>
              <TouchableOpacity onPress={()=>handleDelete(item)} hitSlop={{top:10,bottom:10,left:10,right:10}}><Ionicons name="trash-outline" size={20} color={colors.danger}/></TouchableOpacity></View>
            <Text style={s.itemBody}>{item.body}</Text><Text style={s.itemMeta}>{item.created_by_name?`${item.created_by_name} · `:""}{formatDate(item.created_at)}</Text></View>))}
      </ScrollView></KeyboardAvoidingView></SafeAreaView>);
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},scroll:{flex:1,backgroundColor:colors.sidebarBg},scrollContent:{padding:16,paddingBottom:40},
  card:{backgroundColor:colors.surface,borderRadius:12,borderWidth:1,borderColor:colors.border,padding:16,marginBottom:20},cardTitle:{fontSize:16,fontWeight:"700",color:colors.textPrimary,marginBottom:12},
  label:{fontSize:12,fontWeight:"600",color:colors.labelBlue,marginBottom:6,marginTop:8},
  input:{borderWidth:1,borderColor:colors.border,borderRadius:8,paddingHorizontal:12,paddingVertical:10,fontSize:14,color:colors.textPrimary,backgroundColor:colors.background},
  textArea:{minHeight:100},postBtn:{marginTop:16,height:46,borderRadius:10,backgroundColor:colors.primary,flexDirection:"row",alignItems:"center",justifyContent:"center"},
  postBtnDisabled:{opacity:0.6},postBtnText:{color:"#FFFFFF",fontSize:15,fontWeight:"700",marginLeft:8},sectionTitle:{fontSize:15,fontWeight:"700",color:colors.textPrimary,marginBottom:10},
  center:{alignItems:"center",paddingVertical:30},errorText:{color:colors.danger,marginTop:8,textAlign:"center"},
  retryBtn:{marginTop:12,paddingHorizontal:20,paddingVertical:9,borderRadius:8,backgroundColor:colors.primary},retryText:{color:"#FFFFFF",fontWeight:"600"},emptyText:{color:colors.textSecondary,marginTop:8},
  itemCard:{backgroundColor:colors.surface,borderRadius:12,borderWidth:1,borderColor:colors.border,padding:14,marginBottom:10},itemHeader:{flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between"},
  itemTitle:{flex:1,fontSize:15,fontWeight:"700",color:colors.textPrimary,marginRight:10},itemBody:{fontSize:14,color:colors.textPrimary,marginTop:6,lineHeight:20},itemMeta:{fontSize:11,color:colors.textSecondary,marginTop:8}});
