import React from "react";
import { Avatar, Box, Chip, IconButton, MenuItem, Select, Stack, Typography } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

export default function ProjectMembers({ project, users, onAdd, onRemove }) {
  const members = project?.memberIds || [];
  const available = users.filter(u => !members.includes(u.id));
  return <Stack spacing={1.5}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="subtitle1" fontWeight={800}>Membres du projet</Typography><Select size="small" displayEmpty value="" onChange={e => onAdd(e.target.value)} sx={{ minWidth: 180 }}><MenuItem value="">Ajouter un membre…</MenuItem>{available.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}</Select></Stack>{members.length ? members.map(id => { const u = users.find(x => x.id === id); if (!u) return null; return <Stack key={id} direction="row" alignItems="center" spacing={1}><Avatar sx={{ width: 30, height: 30 }}>{u.name?.[0]}</Avatar><Box sx={{ flex: 1 }}><Typography variant="body2" fontWeight={700}>{u.name}</Typography><Typography variant="caption" color="text.secondary">{u.email}</Typography></Box><Chip size="small" label={u.role} variant="outlined"/><IconButton size="small" color="error" onClick={() => onRemove(id)}><PersonRemoveIcon fontSize="small"/></IconButton></Stack>}) : <Typography variant="body2" color="text.secondary">Aucun membre pour le moment.</Typography>}</Stack>;
}
