import React, { useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Chip, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { ROLES, useAuth } from "../auth";
import { createUserApi, deleteUserApi, getUsersApi, updateUserApi, normalizeList } from "../api";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({name:"",email:"",password:"",role:"member"});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(true);

  const load = async () => {
    try { setUsers(normalizeList((await getUsersApi()).data)); }
    catch (e) { setError(e?.response?.data?.message || "Impossible de charger les utilisateurs."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    setError("");
    if(!form.name||!form.email||!form.password) return setError("Tous les champs sont obligatoires.");
    try {
      const res = await createUserApi(form);
      setUsers(prev => [...prev, res.data]);
      setOpen(false);
      setForm({name:"",email:"",password:"",role:"member"});
    } catch (e) { setError(e?.response?.data?.errors?.email?.[0] || e?.response?.data?.message || "Création impossible."); }
  };

  const remove = async id => {
    if(id===user.id) return;
    try { await deleteUserApi(id); setUsers(prev => prev.filter(u=>String(u.id)!==String(id))); }
    catch (e) { setError(e?.response?.data?.message || "Suppression impossible."); }
  };

  const changeRole = async (id, role) => {
    try {
      const res = await updateUserApi(id, { role });
      setUsers(prev => prev.map(u => String(u.id)===String(id) ? res.data : u));
    } catch (e) { setError(e?.response?.data?.message || "Modification impossible."); }
  };

  const toggleStatus = async id => {
    const current = users.find(u=>String(u.id)===String(id));
    if (!current) return;
    try {
      const res = await updateUserApi(id, { status: current.status === "active" ? "disabled" : "active" });
      setUsers(prev => prev.map(u => String(u.id)===String(id) ? res.data : u));
    } catch (e) { setError(e?.response?.data?.message || "Modification impossible."); }
  };

  const roleCount = useMemo(()=>users.reduce((a,u)=>(a[u.role]=(a[u.role]||0)+1,a),{}),[users]);

  return <Stack spacing={3}>
    <Box><Typography variant="h4" fontWeight={900}>Utilisateurs & droits</Typography><Typography color="text.secondary">Gérez les comptes et leurs niveaux d’accès.</Typography></Box>
    {error && <Alert severity="error">{error}</Alert>}
    <Stack direction="row" spacing={1} flexWrap="wrap">{Object.entries(ROLES).map(([r,v])=><Chip key={r} label={`${v.label}: ${roleCount[r]||0}`} />)}</Stack>
    <Card><CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6" fontWeight={800}>Membres de l'espace</Typography><Button variant="contained" startIcon={<AddIcon/>} onClick={()=>setOpen(true)}>Ajouter</Button></Stack>
      {loading ? <Typography color="text.secondary">Chargement…</Typography> :
      <Table><TableHead><TableRow><TableCell>Utilisateur</TableCell><TableCell>Rôle</TableCell><TableCell>Statut</TableCell><TableCell>Modifier</TableCell><TableCell align="right">Action</TableCell></TableRow></TableHead><TableBody>
        {users.map(u=><TableRow key={u.id}><TableCell><Stack direction="row" spacing={1.5} alignItems="center"><Avatar>{u.name?.[0]}</Avatar><Box><Typography fontWeight={700}>{u.name}</Typography><Typography variant="caption" color="text.secondary">{u.email}</Typography></Box></Stack></TableCell>
        <TableCell><Chip size="small" label={ROLES[u.role]?.label||u.role}/></TableCell>
        <TableCell><Chip size="small" color={u.status==="active"?"success":"default"} label={u.status==="active"?"Actif":"Désactivé"} onClick={()=>u.id!==user.id&&toggleStatus(u.id)}/></TableCell>
        <TableCell><Select size="small" value={u.role} onChange={e=>changeRole(u.id,e.target.value)} disabled={u.id===user.id}>{Object.entries(ROLES).map(([r,v])=><MenuItem key={r} value={r}>{v.label}</MenuItem>)}</Select></TableCell>
        <TableCell align="right"><IconButton color="error" disabled={u.id===user.id} onClick={()=>remove(u.id)}><DeleteIcon/></IconButton></TableCell></TableRow>)}
      </TableBody></Table>}
    </CardContent></Card>
    <Card><CardContent><Typography variant="h6" fontWeight={800}>Matrice des droits</Typography><Typography color="text.secondary" sx={{mb:2}}>Les permissions sont appliquées dans l’interface locale. </Typography>{Object.entries(ROLES).map(([r,v])=><Box key={r} sx={{mb:1.5}}><Typography fontWeight={700}>{v.label}</Typography><Stack direction="row" spacing={.75} flexWrap="wrap">{v.permissions.map(p=><Chip key={p} size="small" variant="outlined" label={p}/>)}</Stack></Box>)}</CardContent></Card>
    <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm"><DialogTitle>Nouvel utilisateur</DialogTitle><DialogContent><Stack spacing={2} sx={{mt:1}}>{error&&<Alert severity="error">{error}</Alert>}<TextField label="Nom" fullWidth value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><TextField label="Email" type="email" fullWidth value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><TextField label="Mot de passe" type="password" fullWidth value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><Select fullWidth value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>{Object.entries(ROLES).map(([r,v])=><MenuItem key={r} value={r}>{v.label}</MenuItem>)}</Select></Stack></DialogContent><DialogActions><Button onClick={()=>setOpen(false)}>Annuler</Button><Button variant="contained" onClick={create}>Créer</Button></DialogActions></Dialog>
  </Stack>;
}
