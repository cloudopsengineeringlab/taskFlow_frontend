import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Chip, Grid, MenuItem, Select, Stack, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { getAnalyticsApi } from "../api";

function Metric({ title, value, hint, icon }) { return <Card><CardContent><Stack direction="row" justifyContent="space-between"><Box><Typography color="text.secondary" variant="body2">{title}</Typography><Typography variant="h4" fontWeight={900} sx={{ mt: .5 }}>{value}</Typography><Typography variant="caption" color="text.secondary">{hint}</Typography></Box>{icon}</Stack></CardContent></Card>; }

export default function Analytics({ todos = [], projects = [] }) {
  const [period, setPeriod] = useState("30");
  const [projectId, setProjectId] = useState("");
  const [data, setData] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAnalyticsApi({ days: period, ...(projectId ? { projectId } : {}) })
      .then(r => { if (!cancelled) { setData(r.data); setOffline(false); } })
      .catch(() => { if (!cancelled) setOffline(true); });
    return () => { cancelled = true; };
  }, [period, projectId]);

  const summary = data?.summary || { total: todos.length, completed: todos.filter(t => (t.status || (t.completed ? "done" : "todo")) === "done").length, active: todos.length, overdue: 0, completionRate: 0 };
  const priorityLabels = { high: "Haute", medium: "Moyenne", low: "Basse" };
  const priorities = Object.entries(data?.priority || {}).map(([p, n]) => ({ p: priorityLabels[p] || p, n }));
  const max = Math.max(1, ...priorities.map(x => x.n));
  const projectStats = data?.projects || projects.map(p => ({ ...p, total: 0, completed: 0, progress: 0 }));

  return <Stack spacing={3}>
    <Stack direction={{xs:"column",md:"row"}} justifyContent="space-between" gap={2}>
      <Box><Typography variant="h4" fontWeight={900}>Analyses</Typography><Typography color="text.secondary">État des livraisons, charge de travail et performance des projets.</Typography></Box>
      <Stack direction="row" spacing={1}>
        <Select size="small" value={projectId} displayEmpty onChange={e=>setProjectId(e.target.value)} sx={{minWidth:180}}><MenuItem value="">Tous les projets</MenuItem>{projects.map(p=><MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}</Select>
        <Select size="small" value={period} onChange={e=>setPeriod(e.target.value)}><MenuItem value="7">7 derniers jours</MenuItem><MenuItem value="30">30 derniers jours</MenuItem><MenuItem value="90">90 derniers jours</MenuItem></Select>
      </Stack>
    </Stack>
    {offline && <Chip color="warning" label="Analyse locale" variant="outlined" sx={{alignSelf:"flex-start"}}/>}
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}><Metric title="Total des tâches" value={summary.total} hint={`Vue sur ${period} jours`} icon={<TaskAltIcon color="primary"/>}/></Grid>
      <Grid item xs={12} sm={6} md={3}><Metric title="Terminées" value={summary.completed} hint={`${summary.completionRate}% d’achèvement`} icon={<TrendingUpIcon color="success"/>}/></Grid>
      <Grid item xs={12} sm={6} md={3}><Metric title="Travail en cours" value={summary.active} hint="À surveiller" icon={<FolderOutlinedIcon color="primary"/>}/></Grid>
      <Grid item xs={12} sm={6} md={3}><Metric title="En retard" value={summary.overdue} hint="Échéances ouvertes" icon={<WarningAmberIcon color="error"/>}/></Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}><Card><CardContent><Typography fontWeight={900}>Performance des projets</Typography><Typography color="text.secondary" variant="body2" sx={{mb:2}}>Taux d’achèvement et charge de travail par projet.</Typography><Stack spacing={2}>{projectStats.map(p=><Box key={p.id}><Stack direction="row" justifyContent="space-between"><Typography fontWeight={700}>{p.name}</Typography><Typography variant="body2">{p.completed}/{p.total} · {p.progress}%</Typography></Stack><Box sx={{mt:.7,height:10,borderRadius:99,bgcolor:"action.hover",overflow:"hidden"}}><Box sx={{width:`${p.progress}%`,height:"100%",bgcolor:"primary.main"}}/></Box></Box>)}{!projectStats.length&&<Typography color="text.secondary">Aucun projet pour le moment.</Typography>}</Stack></CardContent></Card></Grid>
      <Grid item xs={12} md={5}><Card><CardContent><Typography fontWeight={900}>Répartition des priorités</Typography><Stack spacing={2} sx={{mt:2}}>{priorities.map(x=><Stack key={x.p} direction="row" alignItems="center" spacing={1}><Chip size="small" label={x.p}/><Box sx={{flex:1,height:10,borderRadius:99,bgcolor:"action.hover",overflow:"hidden"}}><Box sx={{width:`${x.n/max*100}%`,height:"100%",bgcolor:"primary.main"}}/></Box><Typography variant="body2" fontWeight={800}>{x.n}</Typography></Stack>)}</Stack></CardContent></Card></Grid>
    </Grid>
  </Stack>;
}
