import React, { useState } from "react";
import { Alert, Button, Card, CardContent, Stack, Switch, TextField, Typography, FormControlLabel } from "@mui/material";
import { useAuth } from "../auth";
import { updatePasswordApi } from "../api";

export default function Settings({ darkMode, toggleTheme }) {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", newPassword_confirmation: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const saveProfile = async e => {
    e.preventDefault(); setError(""); setMessage("");
    try { await updateProfile(profile); setMessage("Profil mis à jour."); }
    catch (e) { setError(e?.response?.data?.errors?.email?.[0] || e?.response?.data?.message || "Impossible de mettre à jour le profil."); }
  };

  const savePassword = async e => {
    e.preventDefault(); setError(""); setMessage("");
    try {
      await updatePasswordApi(password);
      setPassword({ currentPassword: "", newPassword: "", newPassword_confirmation: "" });
      setMessage("Mot de passe mis à jour. Reconnectez-vous pour continuer.");
    } catch (e) { setError(e?.response?.data?.errors?.currentPassword?.[0] || e?.response?.data?.message || "Impossible de changer le mot de passe."); }
  };

  return <Stack spacing={3}>
    <div><Typography variant="h4" fontWeight={900}>Paramètres</Typography><Typography color="text.secondary">Préférences et sécurité de votre compte.</Typography></div>
    {message && <Alert severity="success">{message}</Alert>}
    {error && <Alert severity="error">{error}</Alert>}
    <Card><CardContent><FormControlLabel control={<Switch checked={darkMode} onChange={toggleTheme}/>} label="Mode sombre"/><Typography variant="body2" color="text.secondary">Cette préférence reste locale à cet appareil.</Typography></CardContent></Card>
    <Card><CardContent><Typography variant="h6" fontWeight={800} sx={{mb:2}}>Mon profil</Typography><form onSubmit={saveProfile}><Stack spacing={2}><TextField label="Nom" value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} required/><TextField label="Email" type="email" value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})} required/><Button type="submit" variant="contained" sx={{alignSelf:"flex-start"}}>Enregistrer</Button></Stack></form></CardContent></Card>
    <Card><CardContent><Typography variant="h6" fontWeight={800} sx={{mb:2}}>Sécurité</Typography><form onSubmit={savePassword}><Stack spacing={2}><TextField label="Mot de passe actuel" type="password" value={password.currentPassword} onChange={e=>setPassword({...password,currentPassword:e.target.value})} required/><TextField label="Nouveau mot de passe" type="password" value={password.newPassword} onChange={e=>setPassword({...password,newPassword:e.target.value})} required/><TextField label="Confirmer le nouveau mot de passe" type="password" value={password.newPassword_confirmation} onChange={e=>setPassword({...password,newPassword_confirmation:e.target.value})} required/><Button type="submit" variant="outlined" sx={{alignSelf:"flex-start"}}>Changer le mot de passe</Button></Stack></form></CardContent></Card>
  </Stack>;
}
