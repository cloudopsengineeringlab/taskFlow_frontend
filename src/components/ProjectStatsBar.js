import React from "react";
import { Box, Chip, LinearProgress, Stack, Typography } from "@mui/material";

const statusOf = t => t.status || (t.completed ? "done" : "todo");

export default function ProjectStatsBar({ todos }) {
  const total = todos.length;
  const done = todos.filter(t => statusOf(t) === "done").length;
  const inProgress = todos.filter(t => statusOf(t) === "in_progress").length;
  const todo = total - done - inProgress;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return (
    <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ sm: "center" }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip size="small" label={`${total} au total`} />
          <Chip size="small" label={`${todo} à faire`} />
          <Chip size="small" label={`${inProgress} en cours`} />
          <Chip size="small" label={`${done} terminées`} color="success" />
        </Stack>
        <Typography fontWeight={800}>{progress}% complete</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={progress} sx={{ mt: 1.5, height: 8, borderRadius: 8 }} />
    </Box>
  );
}
