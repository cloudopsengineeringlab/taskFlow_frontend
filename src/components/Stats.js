import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";

function Stats({ todos = [] }) {
  const safeTodos = Array.isArray(todos) ? todos : [];
  const total = safeTodos.length;
  const completed = safeTodos.filter(t => Boolean(t.completed)).length;
  const active = total - completed;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const items = [
    ["Total", total, <TaskAltIcon />], ["En cours", active, <ScheduleIcon />],
    ["Terminées", completed, <CheckCircleIcon />], ["Progression", `${progress}%`, <CheckCircleIcon />]
  ];
  return <Grid container spacing={2} sx={{ mb: 3 }}>{items.map(([label, value, icon]) =>
    <Grid item xs={6} md={3} key={label}><Card><CardContent><Box sx={{ display: "flex", justifyContent: "space-between" }}><Box><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" fontWeight={800}>{value}</Typography></Box>{icon}</Box></CardContent></Card></Grid>
  )}</Grid>;
}
export default Stats;
