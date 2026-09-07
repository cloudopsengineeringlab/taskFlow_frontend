import React, { useEffect, useState } from "react";
import { Badge, Box, Divider, IconButton, List, ListItemButton, ListItemText, Menu, Typography, Button } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { getNotificationsApi, getUnreadNotificationCountApi, markAllNotificationsReadApi, markNotificationReadApi } from "../api";

export default function NotificationsPopover({ onOpenTask }) {
  const [anchor, setAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const load = async () => {
    try { const [list, count] = await Promise.all([getNotificationsApi({ limit: 12 }), getUnreadNotificationCountApi()]); setNotifications(list.data || []); setUnread(count.data?.count || 0); } catch (_) {}
  };
  useEffect(() => { load(); const id = setInterval(load, 30000); return () => clearInterval(id); }, []);
  const read = async n => { try { await markNotificationReadApi(n.id); setNotifications(x=>x.map(v=>v.id===n.id?{...v,read:true}:v)); setUnread(x=>Math.max(0,x-1)); } catch (_) {} if(n.taskId){ const task=n.task||{id:n.taskId,title:n.message}; onOpenTask?.(task); } setAnchor(null); };
  const readAll = async () => { try { await markAllNotificationsReadApi(); setNotifications(x=>x.map(n=>({...n,read:true}))); setUnread(0); } catch (_) {} };
  return <><IconButton color="inherit" onClick={e=>{setAnchor(e.currentTarget);load();}} aria-label="Notifications"><Badge badgeContent={unread} color="error" max={99}><NotificationsNoneIcon/></Badge></IconButton><Menu anchorEl={anchor} open={Boolean(anchor)} onClose={()=>setAnchor(null)} PaperProps={{sx:{width:400,maxWidth:"calc(100vw - 24px)",borderRadius:3}}}>
    <Box sx={{px:2,py:1.5,display:"flex",alignItems:"center",justifyContent:"space-between"}}><Box><Typography fontWeight={900}>Notifications</Typography><Typography variant="caption" color="text.secondary">Notifications stockées localement</Typography></Box><Button size="small" onClick={readAll} disabled={!unread}>Tout marquer comme lu</Button></Box><Divider/>
    <List dense sx={{py:0,maxHeight:480,overflow:"auto"}}>{notifications.map(n=><ListItemButton key={n.id} onClick={()=>read(n)} sx={{alignItems:"flex-start",opacity:n.read?.62:1}}><ListItemText primary={<Typography fontWeight={n.read?600:850}>{n.title}</Typography>} secondary={n.message || n.task?.title || n.project?.name || "Activité de l’espace de travail"}/></ListItemButton>)}{!notifications.length&&<Box sx={{p:3,textAlign:"center"}}><Typography fontWeight={800}>Vous êtes à jour</Typography><Typography variant="body2" color="text.secondary">Aucune notification pour le moment.</Typography></Box>}</List>
  </Menu></>;
}
