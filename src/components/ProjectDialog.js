import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

export default function ProjectDialog({ open, project, onClose, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => { setName(project?.name || ""); setDescription(project?.description || ""); }, [project, open]);
  const submit = e => { e.preventDefault(); if (!name.trim()) return; onSave({ ...(project || {}), name: name.trim(), description: description.trim() }); };
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"><form onSubmit={submit}><DialogTitle>{project ? "Modifier le projet" : "Nouveau projet"}</DialogTitle><DialogContent><Stack spacing={2} sx={{ mt: 1 }}><TextField autoFocus required label="Nom" value={name} onChange={e => setName(e.target.value)} /><TextField label="Description" multiline minRows={4} value={description} onChange={e => setDescription(e.target.value)} /></Stack></DialogContent><DialogActions><Button onClick={onClose}>Annuler</Button><Button type="submit" variant="contained">{project ? "Enregistrer les modifications" : "Créer le projet"}</Button></DialogActions></form></Dialog>;
}
