import React, { useState } from "react";
import { Button, Chip, Collapse, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const statusLabel = { todo: "À faire", in_progress: "En cours", done: "Terminée" };
const priorityLabel = { high: "Haute", medium: "Moyenne", low: "Basse" };
const priorityColor = { high: "error", medium: "warning", low: "success" };
const statusOf = t => t.status || (t.completed ? "done" : "todo");

export default function TodoList({ todos = [], projects = [], removeTodo, editTodo, onOpen }) {
  const [expanded, setExpanded] = useState(null);
  const safe = Array.isArray(todos) ? todos : [];
  if (!safe.length) return <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>Aucune tâche à afficher.</Typography>;
  return <List disablePadding>{safe.map(t => { const p = projects.find(x => String(x.id) === String(t.projectId)); const open = expanded === t.id; return <ListItem key={t.id} divider alignItems="flex-start" sx={{ py: 1.5 }}>
    <Stack sx={{ flex: 1 }} spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}><Typography fontWeight={800} onClick={() => onOpen?.(t)} sx={{ cursor: onOpen ? "pointer" : "default", textDecoration: statusOf(t) === "done" ? "line-through" : "none" }}>{t.title}</Typography><Stack direction="row"><IconButton onClick={() => setExpanded(open ? null : t.id)}><ExpandMoreIcon /></IconButton><IconButton color="primary" onClick={() => editTodo(t)}><EditIcon /></IconButton><IconButton color="error" onClick={() => removeTodo(t.id)}><DeleteIcon /></IconButton></Stack></Stack>
      <Stack direction="row" spacing={.75} flexWrap="wrap"><Chip size="small" label={statusLabel[statusOf(t)]} /><Chip size="small" label={priorityLabel[t.priority] || "Moyenne"} color={priorityColor[t.priority] || "default"} />{p && <Chip size="small" variant="outlined" label={p.name} />}{t.dueDate && <Chip size="small" variant="outlined" label={`Échéance : ${t.dueDate}`} />}</Stack>
      <Collapse in={open}>{t.description && <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>{t.description}</Typography>}</Collapse>
    </Stack>
  </ListItem>})}</List>;
}
