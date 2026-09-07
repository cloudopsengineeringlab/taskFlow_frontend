import React, { useEffect, useState } from "react";
import { Button, Grid, MenuItem, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function TodoForm({ addTodo, projects = [], users = [], initialTask = null, onCancel }) {
  const [form, setForm] = useState({ title: "", description: "", status: "todo", priority: "medium", dueDate: "", projectId: projects[0]?.id || "", assigneeId: "" });
  useEffect(() => {
    if (initialTask) {
      setForm({ title: initialTask.title || "", description: initialTask.description || "", status: initialTask.status || (initialTask.completed ? "done" : "todo"), priority: initialTask.priority || "medium", dueDate: initialTask.dueDate || "", projectId: initialTask.projectId || projects[0]?.id || "", assigneeId: initialTask.assigneeId || "" });
    } else {
      setForm(v => ({ ...v, title: "", description: "", status: "todo", priority: "medium", dueDate: "", projectId: projects[0]?.id || "", assigneeId: "" }));
    }
  }, [initialTask, projects]);
  const set = (key, value) => setForm(v => ({ ...v, [key]: value }));
  const submit = e => { e.preventDefault(); if (!form.title.trim()) return; addTodo({ ...form, title: form.title.trim(), description: form.description.trim(), completed: form.status === "done" }); if (!initialTask) setForm(v => ({ ...v, title: "", description: "", status: "todo", priority: "medium", dueDate: "", assigneeId: "" })); };
  return <form onSubmit={submit}><Grid container spacing={2}>
    <Grid item xs={12} md={6}><TextField fullWidth required label="Titre" value={form.title} onChange={e => set("title", e.target.value)} /></Grid>
    <Grid item xs={12} md={6}><TextField fullWidth label="Description" value={form.description} onChange={e => set("description", e.target.value)} /></Grid>
    <Grid item xs={12} sm={6} md={3}><TextField select fullWidth label="Statut" value={form.status} onChange={e => set("status", e.target.value)}><MenuItem value="todo">À faire</MenuItem><MenuItem value="in_progress">En cours</MenuItem><MenuItem value="done">Terminée</MenuItem></TextField></Grid>
    <Grid item xs={12} sm={6} md={3}><TextField select fullWidth label="Priorité" value={form.priority} onChange={e => set("priority", e.target.value)}><MenuItem value="low">Basse</MenuItem><MenuItem value="medium">Moyenne</MenuItem><MenuItem value="high">Haute</MenuItem></TextField></Grid>
    <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="date" label="Date d’échéance" InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={e => set("dueDate", e.target.value)} /></Grid>
    <Grid item xs={12} sm={6} md={3}><TextField select fullWidth label="Projet" value={form.projectId} onChange={e => set("projectId", e.target.value)}>{projects.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}</TextField></Grid>
    <Grid item xs={12} md={6}><TextField select fullWidth label="Responsable" value={form.assigneeId} onChange={e => set("assigneeId", e.target.value)}><MenuItem value="">Non assignée</MenuItem>{users.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}</TextField></Grid>
    <Grid item xs={12}><Button type="submit" variant="contained" startIcon={<AddIcon />}>{initialTask ? "Enregistrer les modifications" : "Créer la tâche"}</Button>{initialTask && <Button sx={{ ml: 1 }} onClick={onCancel}>Annuler</Button>}</Grid>
  </Grid></form>;
}
