import React from "react";
import { Avatar, Box, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";

export default function ActivityLog({ activities = [], users = [], limit = 12 }) {
  const rows = activities.slice(0, limit);
  return <Card><CardContent><Typography variant="h6" fontWeight={800}>Journal d’activité</Typography><List>{rows.length ? rows.map(a => { const u = users.find(x => String(x.id) === String(a.userId)); return <ListItem key={a.id} divider><ListItemAvatar><Avatar>{u?.name?.[0] || "S"}</Avatar></ListItemAvatar><ListItemText primary={<><b>{u?.name || "Système"}</b> {a.message}</>} secondary={new Date(a.createdAt).toLocaleString()} /></ListItem>}) : <Typography color="text.secondary" sx={{ py: 2 }}>Aucune activité pour le moment.</Typography>}</List></CardContent></Card>;
}
