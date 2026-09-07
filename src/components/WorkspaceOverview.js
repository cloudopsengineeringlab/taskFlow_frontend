import React, { useMemo } from "react";
import { Avatar, Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

const statusOf = t => t.status || (t.completed ? "done" : "todo");
export default function WorkspaceOverview({ projects=[], todos=[], users=[], user, onNavigate, onOpenTask }) {
  const done = todos.filter(t=>statusOf(t)==="done").length;
  const active = todos.filter(t=>statusOf(t)!=="done").length;
  const overdue = todos.filter(t=>statusOf(t)!=="done" && t.dueDate && new Date(`${t.dueDate}T23:59:59`)<new Date()).length;
  const completion = todos.length ? Math.round(done/todos.length*100) : 0;
  const topProjects = useMemo(()=>projects.map(p=>{const ts=todos.filter(t=>String(t.projectId)===String(p.id));const d=ts.filter(t=>statusOf(t)==="done").length;return {...p,total:ts.length,progress:ts.length?Math.round(d/ts.length*100):0};}).sort((a,b)=>b.total-a.total).slice(0,5),[projects,todos]);
  const myTasks = todos.filter(t=>String(t.assigneeId)===String(user?.id)&&statusOf(t)!=="done").sort((a,b)=>new Date(a.dueDate||"2999")-new Date(b.dueDate||"2999")).slice(0,5);
  return <Stack spacing={3}>
    <Stack direction={{xs:"column",md:"row"}} justifyContent="space-between" gap={2}><Box><Typography variant="h4" fontWeight={900}>Espace de travail</Typography><Typography color="text.secondary">A high-level view of delivery, people and attention areas.</Typography></Box><Button variant="contained" endIcon={<ArrowForwardIcon/>} onClick={()=>onNavigate("projects")}>Ouvrir les projets</Button></Stack>
    <Stack direction={{xs:"column",md:"row"}} spacing={2}>{[["Travail en cours",active,TaskAltOutlinedIcon], ["Achèvement",`${completion}%`,RocketLaunchOutlinedIcon], ["Personnes",users.length,GroupsOutlinedIcon]].map(([label,value,Icon])=><Card key={label} sx={{flex:1}}><CardContent><Stack direction="row" justifyContent="space-between"><Box><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h3" fontWeight={900} sx={{mt:.5}}>{value}</Typography></Box><Avatar variant="rounded"><Icon/></Avatar></Stack></CardContent></Card>)}<Card sx={{flex:1,borderColor:overdue?"error.main":"divider"}}><CardContent><Typography variant="body2" color="text.secondary">Attention</Typography><Typography variant="h3" fontWeight={900} sx={{mt:.5}}>{overdue}</Typography><Typography variant="body2" color={overdue?"error.main":"text.secondary"}>tâches en retard</Typography></CardContent></Card></Stack>
    <Stack direction={{xs:"column",lg:"row"}} spacing={2}>
      <Card sx={{flex:1}}><CardContent><Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6" fontWeight={850}>Projets</Typography><Button size="small" onClick={()=>onNavigate("projects")}>Voir tout</Button></Stack><Stack spacing={2}>{topProjects.length?topProjects.map(p=><Box key={p.id}><Stack direction="row" justifyContent="space-between" mb={.6}><Typography fontWeight={700}>{p.name}</Typography><Typography variant="caption">{p.progress}%</Typography></Stack><LinearProgress variant="determinate" value={p.progress} sx={{height:7,borderRadius:99}}/><Typography variant="caption" color="text.secondary">{p.total} tasks</Typography></Box>):<Typography color="text.secondary">Créez votre premier projet.</Typography>}</Stack></CardContent></Card>
      <Card sx={{flex:1}}><CardContent><Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6" fontWeight={850}>Mon travail</Typography><Chip size="small" label={`${myTasks.length} ouvertes`} /></Stack><Stack spacing={1}>{myTasks.length?myTasks.map(t=><Stack key={t.id} direction="row" spacing={1.5} alignItems="center" sx={{p:1,borderRadius:2,"&:hover":{bgcolor:"action.hover"},cursor:"pointer"}} onClick={()=>onOpenTask(t)}><Avatar variant="rounded" sx={{width:34,height:34}}><TaskAltOutlinedIcon fontSize="small"/></Avatar><Box sx={{flex:1,minWidth:0}}><Typography noWrap fontWeight={700}>{t.title}</Typography><Typography variant="caption" color={t.dueDate&&new Date(`${t.dueDate}T23:59:59`)<new Date()?"error":"text.secondary"}>{t.dueDate?`Échéance : ${t.dueDate}`:"Sans échéance"}</Typography></Box></Stack>):<Typography color="text.secondary">Aucune tâche ne vous est assignée.</Typography>}</Stack></CardContent></Card>
    </Stack>
  </Stack>;
}
