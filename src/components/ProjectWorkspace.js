import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import HistoryIcon from "@mui/icons-material/History";

import TaskFilters from "./TaskFilters";
import KanbanBoard from "./KanbanBoard";
import TodoList from "./TodoList";
import ProjectStatsBar from "./ProjectStatsBar";
import ProjectMembers from "./ProjectMembers";
import ActivityLog from "./ActivityLog";

const statusOf = (t) => t.status || (t.completed ? "done" : "todo");

const isWithinDays = (date, days) => {
  if (!date) return false;

  const d = new Date(`${date}T23:59:59`);
  const now = new Date();

  const max = new Date();
  max.setDate(max.getDate() + days);

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return d >= startOfToday && d <= max;
};

const isOverdue = (date) =>
  date && new Date(`${date}T23:59:59`) < new Date();

export default function ProjectWorkspace({
  project,
  projects,
  todos,
  users,
  activities,
  onSelectProject,
  onEditProject,
  onDeleteProject,
  onNewTask,
  onMove,
  onEditTask,
  onDeleteTask,
  onOpenTask,
  onAddMember,
  onRemoveMember,
}) {
  const hashParts = () =>
    window.location.hash.replace(/^#\/?/, "").split("/");

  const [tab, setTab] = useState(() => {
    const parts = hashParts();

    return parts[0] === "projects" && parts[2]
      ? parts[2]
      : "overview";
  });

  const [view, setView] = useState("board");

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    project: project?.id || "all",
    assignee: "all",
    due: "all",
  });

  useEffect(() => {
    const onHash = () => {
      const parts = hashParts();

      if (
        parts[0] === "projects" &&
        String(parts[1]) === String(project?.id) &&
        [
          "overview",
          "board",
          "list",
          "timeline",
          "members",
          "activity",
        ].includes(parts[2])
      ) {
        setTab(parts[2]);
      }
    };

    window.addEventListener("hashchange", onHash);
    onHash();

    return () => window.removeEventListener("hashchange", onHash);
  }, [project?.id]);

  const changeTab = (next) => {
    setTab(next);
    window.location.hash = `/projects/${project.id}/${next}`;
  };

  const projectTasks = useMemo(
    () =>
      todos.filter(
        (t) => String(t.projectId) === String(project?.id)
      ),
    [todos, project]
  );

  const filtered = useMemo(
    () =>
      projectTasks.filter((t) => {
        const s = statusOf(t);
        const q = filters.search.toLowerCase();

        if (filters.status !== "all" && s !== filters.status) {
          return false;
        }

        if (
          filters.priority !== "all" &&
          (t.priority || "medium") !== filters.priority
        ) {
          return false;
        }

        if (
          filters.assignee !== "all" &&
          (filters.assignee === "unassigned"
            ? t.assigneeId
            : String(t.assigneeId) !== String(filters.assignee))
        ) {
          return false;
        }

        if (filters.due === "overdue" && !isOverdue(t.dueDate)) {
          return false;
        }

        if (filters.due === "today" && !isWithinDays(t.dueDate, 0)) {
          return false;
        }

        if (filters.due === "upcoming" && !isWithinDays(t.dueDate, 7)) {
          return false;
        }

        if (filters.due === "none" && t.dueDate) {
          return false;
        }

        return (
          !q ||
          `${t.title} ${t.description || ""}`
            .toLowerCase()
            .includes(q)
        );
      }),
    [projectTasks, filters]
  );

  if (!project) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Create a project to start.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const projectActivities = activities.filter(
    (a) => String(a.projectId || "") === String(project.id)
  );

  const counts = {
    total: projectTasks.length,
    active: projectTasks.filter(
      (t) => statusOf(t) !== "done"
    ).length,
    done: projectTasks.filter(
      (t) => statusOf(t) === "done"
    ).length,
    overdue: projectTasks.filter(
      (t) =>
        isOverdue(t.dueDate) &&
        statusOf(t) !== "done"
    ).length,
  };

  return (
    <Stack spacing={2.5}>
      {/* En-tête */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        gap={2}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Projects / Workspace
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="h4" fontWeight={900}>
              {project.name}
            </Typography>

            <Chip
              size="small"
              label={`${counts.total} tâches`}
            />
          </Stack>

          <Typography color="text.secondary">
            {project.description ||
              "Espace de travail et centre de pilotage du projet."}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onNewTask}
          >
            New task
          </Button>

          <IconButton
            onClick={() => onEditProject(project)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            disabled={projects.length <= 1}
            onClick={() => onDeleteProject(project.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Sélecteur de projet + compteurs */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
      >
        <Select
          size="small"
          value={project.id}
          onChange={(e) => {
            onSelectProject(e.target.value);
            window.location.hash = `/projects/${e.target.value}/overview`;
          }}
          sx={{ minWidth: 240 }}
        >
          {projects.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>

        <Chip
          variant="outlined"
          label={`${counts.active} actives`}
        />

        <Chip
          variant="outlined"
          color="success"
          label={`${counts.done} terminées`}
        />

        {counts.overdue > 0 && (
          <Chip
            color="error"
            variant="outlined"
            label={`${counts.overdue} en retard`}
          />
        )}
      </Stack>

      <ProjectStatsBar todos={projectTasks} />

      {/* Navigation */}
      <Card>
        <Tabs
          value={tab}
          onChange={(_, value) => changeTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="overview" label="Vue d’ensemble" />

          <Tab
            value="board"
            icon={<ViewKanbanOutlinedIcon />}
            iconPosition="start"
            label="Tableau"
          />

          <Tab
            value="list"
            icon={<ViewListOutlinedIcon />}
            iconPosition="start"
            label="Liste"
          />

          <Tab
            value="timeline"
            icon={<TimelineOutlinedIcon />}
            iconPosition="start"
            label="Chronologie"
          />

          <Tab
            value="members"
            icon={<PeopleOutlineIcon />}
            iconPosition="start"
            label="Membres"
          />

          <Tab
            value="activity"
            icon={<HistoryIcon />}
            iconPosition="start"
            label="Activité"
          />
        </Tabs>
      </Card>

      {/* Filtres */}
      {(tab === "overview" ||
        tab === "board" ||
        tab === "list") && (
        <TaskFilters
          projects={projects}
          users={users}
          value={filters}
          onChange={setFilters}
          storageKey={`taskflow-project-${project.id}-views`}
        />
      )}

      {/* Vue d’ensemble */}
      {tab === "overview" && (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
        >
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={900}
              >
                Delivery health
              </Typography>

              <Typography
                variant="h3"
                fontWeight={900}
                sx={{ mt: 1 }}
              >
                {counts.total
                  ? Math.round(
                      (counts.done / counts.total) * 100
                    )
                  : 0}
                %
              </Typography>

              <Typography color="text.secondary">
                completion rate across this project
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                {[
                  [
                    "À faire",
                    projectTasks.filter(
                      (t) => statusOf(t) === "todo"
                    ).length,
                  ],
                  [
                    "En cours",
                    projectTasks.filter(
                      (t) =>
                        statusOf(t) === "in_progress"
                    ).length,
                  ],
                  ["Terminée", counts.done],
                ].map(([label, n]) => (
                  <Stack
                    key={label}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography>{label}</Typography>

                    <Typography fontWeight={800}>
                      {n}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={900}
              >
                Upcoming work
              </Typography>

              <Stack
                spacing={1.2}
                sx={{ mt: 2 }}
              >
                {projectTasks
                  .filter(
                    (t) =>
                      statusOf(t) !== "done" &&
                      t.dueDate
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.dueDate) -
                      new Date(b.dueDate)
                  )
                  .slice(0, 5)
                  .map((t) => (
                    <Stack
                      key={t.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        noWrap
                        sx={{ maxWidth: "70%" }}
                      >
                        {t.title}
                      </Typography>

                      <Chip
                        size="small"
                        label={t.dueDate}
                        color={
                          isOverdue(t.dueDate)
                            ? "error"
                            : "default"
                        }
                      />
                    </Stack>
                  ))}

                {!projectTasks.some(
                  (t) =>
                    t.dueDate &&
                    statusOf(t) !== "done"
                ) && (
                  <Typography color="text.secondary">
                    No upcoming deadlines.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Tableau */}
      {tab === "board" && (
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={900}>
              {filtered.length} visible tasks
            </Typography>

            <Chip
              size="small"
              label="Faites glisser les cartes pour les déplacer"
              variant="outlined"
            />
          </Stack>

          <KanbanBoard
            project={project}
            todos={filtered}
            users={users}
            onMove={onMove}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onOpen={onOpenTask}
          />
        </Stack>
      )}

      {/* Liste */}
      {tab === "list" && (
        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography fontWeight={900}>
                {filtered.length} tasks
              </Typography>

              <Chip
                icon={<ViewListOutlinedIcon />}
                label="Vue en liste"
                size="small"
              />
            </Stack>

            <TodoList
              todos={filtered}
              projects={projects}
              removeTodo={onDeleteTask}
              editTodo={onEditTask}
              onOpen={onOpenTask}
            />
          </CardContent>
        </Card>
      )}

      {/* Chronologie */}
      {tab === "timeline" && (
        <Card>
          <CardContent>
            <Typography fontWeight={900}>
              Timeline
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              A lightweight delivery timeline based on task
              due dates.
            </Typography>

            <Stack spacing={1.2}>
              {[...filtered]
                .filter((t) => t.dueDate)
                .sort(
                  (a, b) =>
                    new Date(a.dueDate) -
                    new Date(b.dueDate)
                )
                .map((t) => (
                  <Stack
                    key={t.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Chip
                      size="small"
                      label={t.dueDate}
                    />

                    <Box
                      sx={{
                        flex: 1,
                        height: 10,
                        borderRadius: 99,
                        bgcolor: "action.hover",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width:
                            statusOf(t) === "done"
                              ? "100%"
                              : statusOf(t) ===
                                "in_progress"
                              ? "55%"
                              : "20%",
                          height: "100%",
                          bgcolor:
                            statusOf(t) === "done"
                              ? "success.main"
                              : "primary.main",
                        }}
                      />
                    </Box>

                    <Typography
                      noWrap
                      sx={{ width: 220 }}
                    >
                      {t.title}
                    </Typography>
                  </Stack>
                ))}

              {!filtered.some((t) => t.dueDate) && (
                <Typography color="text.secondary">
                  Add due dates to tasks to build the timeline.
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Membres */}
      {tab === "members" && (
        <Card>
          <CardContent>
            <ProjectMembers
              project={project}
              users={users}
              onAdd={onAddMember}
              onRemove={onRemoveMember}
            />
          </CardContent>
        </Card>
      )}

      {/* Activité */}
      {tab === "activity" && (
        <ActivityLog
          activities={
            projectActivities.length
              ? projectActivities
              : activities.slice(0, 20)
          }
          users={users}
        />
      )}
    </Stack>
  );
}