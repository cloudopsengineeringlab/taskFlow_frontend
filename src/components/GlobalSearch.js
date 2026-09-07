import React from "react";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
export default function GlobalSearch({ onOpen }) { return <Button onClick={onOpen} startIcon={<SearchIcon/>} variant="outlined" color="inherit" sx={{ justifyContent: "flex-start", textTransform: "none", opacity: .9, minWidth: { xs: 42, sm: 260 }, px: 1.5, borderColor: "divider" }}><span style={{ flex: 1, textAlign: "left" }}>Rechercher…</span><kbd style={{ opacity: .6 }}>⌘K</kbd></Button>; }
