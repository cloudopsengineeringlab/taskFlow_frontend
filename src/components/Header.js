import React from "react";
import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, Typography, Tooltip, Stack } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../auth";
import GlobalSearch from "./GlobalSearch";
import NotificationsPopover from "./NotificationsPopover";

function Header({ toggleTheme, darkMode, onSearch, onOpenTask }) {
  const { user, logout } = useAuth();
  const [anchor, setAnchor] = React.useState(null);
  return <AppBar position="sticky" top={0} elevation={0} sx={{ zIndex: theme => theme.zIndex.drawer + 1, borderBottom: "1px solid", borderColor: "divider" }}><Toolbar sx={{ gap: 2 }}>
    <Box sx={{ width: { xs: 100, md: 180 }, flexShrink: 0 }}><Typography variant="h6" fontWeight={900} letterSpacing="-.03em">TaskFlow</Typography><Typography variant="caption" sx={{ opacity: .65, display: { xs: "none", sm: "block" } }}>Projets et productivité</Typography></Box>
    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}><GlobalSearch onOpen={onSearch}/></Box>
    <Stack direction="row" alignItems="center" spacing={.5}>
      <NotificationsPopover onOpenTask={onOpenTask}/>
      <Tooltip title={darkMode ? "Mode clair" : "Mode sombre"}><IconButton color="inherit" onClick={toggleTheme}>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</IconButton></Tooltip>
      <Tooltip title="Compte"><IconButton color="inherit" onClick={e => setAnchor(e.currentTarget)}><Avatar sx={{ width: 34, height: 34 }}>{user?.name?.[0]?.toUpperCase() || "U"}</Avatar></IconButton></Tooltip>
    </Stack>
    <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
      <MenuItem disabled><Box><b>{user?.name}</b><Typography variant="caption" display="block">{user?.email}</Typography></Box></MenuItem>
      <MenuItem onClick={logout}><LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Se déconnecter</MenuItem>
    </Menu>
  </Toolbar></AppBar>;
}
export default Header;
