import React from "react";
import { Box, Button, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import InsightsIcon from "@mui/icons-material/Insights";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { useAuth } from "../auth";

const items = [["dashboard", "Tableau de bord", DashboardIcon], ["tâches", "Tâches", TaskAltIcon], ["projects", "Projets", FolderIcon], ["inbox", "Boîte de réception", InboxOutlinedIcon], ["analytics", "Analyses", InsightsIcon], ["users", "Utilisateurs", PeopleIcon], ["audit", "Journal d’audit", SecurityOutlinedIcon], ["settings", "Paramètres", SettingsIcon]];
export default function Sidebar({ page, setPage, mobile = false, closeMobile }) {
  const { can } = useAuth();
  return <Box sx={{ width: 250, p: 2, height: "100%", bgcolor: "background.paper" }}>
    <Typography variant="h6" fontWeight={900} sx={{ px: 1, py: 1.5 }}>Espace de travail</Typography><Divider />
    <List>{items.filter(([permission]) => can(permission)).map(([permission, label, Icon]) => <ListItemButton key={permission} selected={page === permission} onClick={() => { setPage(permission); closeMobile?.(); }} sx={{ borderRadius: 2, my: .5 }}><ListItemIcon><Icon /></ListItemIcon><ListItemText primary={label} /></ListItemButton>)}</List>
    <Box sx={{ mt: 3, p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}><Typography variant="caption" color="text.secondary">Espace sécurisé</Typography><Typography variant="body2" fontWeight={700}>Gestion des rôles & droits</Typography></Box>
  </Box>;
}
