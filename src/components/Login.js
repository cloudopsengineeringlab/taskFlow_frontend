import React, { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../auth";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("admin@taskflow.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault(); setError("");
    try { await login(email, password); } catch (err) { setError(err.message || "Connexion impossible"); }
  };

  return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2, background: "linear-gradient(135deg,#071a33 0%,#0f6fff 100%)" }}>
    <Container maxWidth="sm"><Card elevation={12} sx={{ borderRadius: 4 }}><CardContent sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3} alignItems="center">
        <Box sx={{ width: 58, height: 58, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "primary.main", color: "white" }}><LockOutlinedIcon /></Box>
        <Box textAlign="center"><Typography variant="h4" fontWeight={900}>TaskFlow</Typography><Typography color="text.secondary">Connectez-vous à votre espace de travail</Typography></Box>
        {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}
        <Box component="form" onSubmit={submit} sx={{ width: "100%" }}><Stack spacing={2}>
          <TextField label="Adresse email" type="email" fullWidth value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Mot de passe" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</Button>
        </Stack></Box>
        <Typography variant="caption" color="text.secondary" textAlign="center">Mode démo : admin@taskflow.local / admin123</Typography>
      </Stack>
    </CardContent></Card></Container>
  </Box>;
}
