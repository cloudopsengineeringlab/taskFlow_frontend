import React, { useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const columns = [
  { key: "todo", title: "À faire" },
  { key: "in_progress", title: "En cours" },
  { key: "done", title: "Terminée" },
];

const priorityColor = {
  high: "error",
  medium: "warning",
  low: "success",
};

const normalizeStatus = (task) =>
  task.status || (task.completed ? "done" : "todo");

export default function KanbanBoard({
  project,
  todos = [],
  users = [],
  onMove,
  onEdit,
  onDelete,
  onOpen,
}) {
  const [dragged, setDragged] = useState(null);

  const projectTasks = todos.filter(
    (t) => String(t.projectId) === String(project.id)
  );

  return (
    <Box sx={{ overflowX: "auto", pb: 1 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ minWidth: { md: 900 } }}
      >
        {columns.map((column) => {
          const tasks = projectTasks.filter(
            (t) => normalizeStatus(t) === column.key
          );

          return (
            <Box
              key={column.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();

                if (
                  dragged &&
                  normalizeStatus(dragged) !== column.key
                ) {
                  onMove(dragged, column.key);
                }

                setDragged(null);
              }}
              sx={{
                flex: 1,
                minWidth: {
                  xs: "100%",
                  md: 280,
                },
                bgcolor: dragged
                  ? "action.selected"
                  : "action.hover",
                borderRadius: 3,
                p: 1.5,
                transition: "background .15s",
              }}
            >
              {/* En-tête de colonne */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Typography fontWeight={900}>
                    {column.title}
                  </Typography>

                  <Chip
                    size="small"
                    label={tasks.length}
                  />
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {column.key === "in_progress" ? "WIP" : ""}
                </Typography>
              </Stack>

              {/* Tâches */}
              <Stack spacing={1.5}>
                {tasks.map((task) => {
                  const index = columns.findIndex(
                    (c) => c.key === column.key
                  );

                  const assignee = users.find(
                    (u) =>
                      String(u.id) ===
                      String(task.assigneeId)
                  );

                  return (
                    <Card
                      key={task.id}
                      draggable
                      onDragStart={() =>
                        setDragged(task)
                      }
                      onDragEnd={() =>
                        setDragged(null)
                      }
                      variant="outlined"
                      sx={{
                        cursor: "grab",
                        opacity:
                          dragged?.id === task.id
                            ? 0.5
                            : 1,
                        "&:active": {
                          cursor: "grabbing",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          "&:last-child": {
                            pb: 2,
                          },
                        }}
                      >
                        <Stack spacing={1.1}>
                          {/* Titre de la tâche + actions */}
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            gap={1}
                          >
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="flex-start"
                              sx={{ minWidth: 0 }}
                            >
                              <DragIndicatorIcon
                                fontSize="small"
                                color="disabled"
                              />

                              <Typography
                                fontWeight={800}
                                onClick={() =>
                                  onOpen?.(task)
                                }
                                sx={{
                                  cursor: onOpen
                                    ? "pointer"
                                    : "default",
                                }}
                              >
                                {task.title}
                              </Typography>
                            </Stack>

                            <Stack direction="row">
                              <Tooltip title="Détails / commentaires">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    onOpen?.(task)
                                  }
                                >
                                  <CommentIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Modifier">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    onEdit(task)
                                  }
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Supprimer">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    onDelete(task.id)
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>

                          {/* Description */}
                          {task.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient:
                                  "vertical",
                                overflow: "hidden",
                                ml: 3,
                              }}
                            >
                              {task.description}
                            </Typography>
                          )}

                          {/* Metadata */}
                          <Stack
                            direction="row"
                            spacing={0.75}
                            flexWrap="wrap"
                            sx={{ ml: 3 }}
                          >
                            <Chip
                              size="small"
                              label={
                                task.priority ||
                                "medium"
                              }
                              color={
                                priorityColor[
                                  task.priority
                                ] || "default"
                              }
                            />

                            {task.dueDate && (
                              <Chip
                                size="small"
                                variant="outlined"
                                label={task.dueDate}
                              />
                            )}

                            {assignee && (
                              <Chip
                                size="small"
                                avatar={
                                  <Avatar>
                                    {assignee.name?.[0]}
                                  </Avatar>
                                }
                                label={assignee.name}
                              />
                            )}
                          </Stack>

                          {/* Status navigation */}
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ ml: 2.5 }}
                          >
                            <Tooltip title="Statut précédent">
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={index === 0}
                                  onClick={() =>
                                    onMove(
                                      task,
                                      columns[index - 1]
                                        .key
                                    )
                                  }
                                >
                                  <ArrowBackIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>

                            <Tooltip title="Statut suivant">
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={
                                    index ===
                                    columns.length - 1
                                  }
                                  color="primary"
                                  onClick={() =>
                                    onMove(
                                      task,
                                      columns[index + 1]
                                        .key
                                    )
                                  }
                                >
                                  <ArrowForwardIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}

                {!tasks.length && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      py: 4,
                      textAlign: "center",
                    }}
                  >
                    Drop tasks here
                  </Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}