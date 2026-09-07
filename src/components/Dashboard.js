import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Chip, Grid, LinearProgress, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FolderIcon from "@mui/icons-material/Folder";
import WarningIcon from "@mui/icons-material/Warning";
import { getDashboardApi } from "../api";

export default function Dashboard({ todos=[], projects=[], users=[] }) {
  const [days,setDays]=useState(30); const [data,setData]=useState(null); const [offline,setOffline]=useState(false);
  useEffect(()=>{getDashboardApi({days}).then(r=>{setData(r.data);setOffline(false)}).catch(()=>setOffline(true));},[days]);
  const k=data?.kpis||{totalTasks:todos.length,completed:todos.filter(t=>(t.status||"")==="done").length,overdue:0,completionRate:0,active:0};
  const progress=k.completionRate||0;
  const recent=(data?.upcoming||[]).slice(0,5);
  return <Stack spacing={3}>
    <Stack direction={{xs:"column",md:"row"}} justifyContent="space-between" alignItems={{md:"center"}} gap={2}><Box><Typography variant="h4" fontWeight={900}>Tableau de bord</Typography><Typography color="text.secondary">État de l’espace, livraisons et travaux à venir.</Typography></Box><Stack direction="row" spacing={1}><Chip label={`${days} derniers jours`} onClick={()=>setDays(days===30?90:30)} variant="outlined"/><Chip label={offline?"Mode hors ligne":"Stockage local"} color={offline?"warning":"success"} variant="outlined"/></Stack></Stack>
    <Grid container spacing={2}>{[["Tâches",k.totalTasks,<TaskAltIcon/>],["Terminées",k.completed,<CheckCircleIcon/>],["Projets",data?.projects?.length??projects.length,<FolderIcon/>],["En retard",k.overdue,<WarningIcon/>]].map(([l,v,i])=><Grid item xs={6} md={3} key={l}><Card><CardContent><Stack direction="row" justifyContent="space-between"><Box><Typography color="text.secondary">{l}</Typography><Typography variant="h4" fontWeight={900}>{v}</Typography></Box>{i}</Stack></CardContent></Card></Grid>)}</Grid>
    <Grid container spacing={2}><Grid item xs={12} md={7}><Card><CardContent><Typography variant="h6" fontWeight={800}>Taux d’achèvement</Typography><Typography variant="h3" fontWeight={900} sx={{my:1}}>{progress}%</Typography><LinearProgress variant="determinate" value={progress} sx={{height:10,borderRadius:10}}/></CardContent></Card></Grid><Grid item xs={12} md={5}><Card><CardContent><Typography variant="h6" fontWeight={800}>Espace de travail</Typography><Stack direction="row" spacing={1} flexWrap="wrap" sx={{mt:2}}><Chip label={`${data?.people??users.length} personnes`}/><Chip label={`${data?.kpis?.active??0} tâches actives`}/><Chip label={`${data?.kpis?.recentChanges??0} changements récents`}/></Stack></CardContent></Card></Grid></Grid>
    <Card><CardContent><Typography variant="h6" fontWeight={800}>Échéances à venir</Typography><List>{recent.length?recent.map(t=><ListItem key={t.id} divider><ListItemText primary={t.title} secondary={`${t.projectName||"Aucun projet"} · échéance ${t.dueDate}`}/></ListItem>):<Typography color="text.secondary" sx={{py:2}}>Aucune échéance à venir.</Typography>}</List></CardContent></Card>
  </Stack>;
}
