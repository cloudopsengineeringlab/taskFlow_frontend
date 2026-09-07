/**
 * Couche de données locale de TaskFlow.
 *
 * Cette édition ne contacte aucun backend externe : toutes les données sont
 * conservées dans localStorage et les fonctions exposent la même forme
 * { data } que l'ancienne couche API afin de préserver les composants.
 */

const KEYS = {
  tasks: "taskflow-local-tasks",
  projects: "taskflow-local-projects",
  users: "taskflow-local-users",
  activities: "taskflow-local-activities",
  comments: "taskflow-local-comments",
  notifications: "taskflow-local-notifications",
  savedViews: "taskflow-local-saved-views",
};

const now = Date.now();
const iso = (offset = 0) => new Date(now + offset * 86400000).toISOString();
const dateOnly = (offset = 0) => new Date(now + offset * 86400000).toISOString().slice(0, 10);
const id = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const seedUsers = [
  { id: "u1", name: "Admin TaskFlow", email: "admin@taskflow.local", role: "admin", status: "active", password: "admin123" },
  { id: "u2", name: "Sophie Martin", email: "sophie@taskflow.local", role: "manager", status: "active", password: "password123" },
  { id: "u3", name: "Thomas Bernard", email: "thomas@taskflow.local", role: "member", status: "active", password: "password123" },
  { id: "u4", name: "Julie Morel", email: "julie@taskflow.local", role: "member", status: "active", password: "password123" },
];

const seedProjects = [
  { id: "p1", name: "Refonte du portail", description: "Modernisation du portail client et de son expérience utilisateur.", members: ["u1", "u2", "u3"], createdAt: iso(-18) },
  { id: "p2", name: "Application mobile", description: "Préparation de la prochaine version de l'application mobile.", members: ["u1", "u2", "u4"], createdAt: iso(-12) },
  { id: "p3", name: "Infrastructure Cloud", description: "Automatisation et amélioration de la plateforme technique.", members: ["u1", "u3", "u4"], createdAt: iso(-8) },
];

const seedTasks = [
  { id: "t1", title: "Préparer les maquettes de la page d'accueil", description: "Finaliser les écrans principaux avec l'équipe produit.", status: "done", completed: true, priority: "high", dueDate: dateOnly(-2), projectId: "p1", assigneeId: "u2", createdAt: iso(-14), updatedAt: iso(-2) },
  { id: "t2", title: "Mettre en place la navigation", description: "Structurer les routes et la navigation principale.", status: "in_progress", completed: false, priority: "high", dueDate: dateOnly(2), projectId: "p1", assigneeId: "u3", createdAt: iso(-9), updatedAt: iso(-1) },
  { id: "t3", title: "Créer le tableau de bord", description: "Construire les indicateurs et widgets principaux.", status: "in_progress", completed: false, priority: "medium", dueDate: dateOnly(5), projectId: "p1", assigneeId: "u1", createdAt: iso(-7), updatedAt: iso(-1) },
  { id: "t4", title: "Rédiger la documentation utilisateur", description: "Documenter les parcours essentiels.", status: "todo", completed: false, priority: "low", dueDate: dateOnly(10), projectId: "p1", assigneeId: "u4", createdAt: iso(-5), updatedAt: iso(-5) },
  { id: "t5", title: "Préparer le prototype mobile", description: "Créer le prototype interactif de la prochaine version.", status: "in_progress", completed: false, priority: "high", dueDate: dateOnly(4), projectId: "p2", assigneeId: "u4", createdAt: iso(-8), updatedAt: iso(-2) },
  { id: "t6", title: "Valider les parcours de connexion", description: "Tester les différents scénarios d'authentification.", status: "done", completed: true, priority: "medium", dueDate: dateOnly(-1), projectId: "p2", assigneeId: "u2", createdAt: iso(-10), updatedAt: iso(-1) },
  { id: "t7", title: "Automatiser le déploiement", description: "Préparer le pipeline de déploiement de l'environnement de test.", status: "todo", completed: false, priority: "high", dueDate: dateOnly(7), projectId: "p3", assigneeId: "u3", createdAt: iso(-4), updatedAt: iso(-3) },
  { id: "t8", title: "Documenter l'architecture Cloud", description: "Créer un schéma et documenter les composants.", status: "done", completed: true, priority: "low", dueDate: dateOnly(3), projectId: "p3", assigneeId: "u4", createdAt: iso(-6), updatedAt: iso(-2) },
];

const seedActivities = [
  { id: "a1", userId: "u2", action: "create", message: "a créé la tâche « Préparer les maquettes de la page d'accueil »", createdAt: iso(-2) },
  { id: "a2", userId: "u3", action: "move", message: "a déplacé « Mettre en place la navigation » vers En cours", createdAt: iso(-1) },
  { id: "a3", userId: "u1", action: "update", message: "a mis à jour le tableau de bord", createdAt: iso(-1) },
  { id: "a4", userId: "u4", action: "comment", message: "a commenté une tâche du projet mobile", createdAt: iso(0) },
];

const seedNotifications = [
  { id: "n1", title: "Tâche assignée", message: "Thomas Bernard vous a assigné « Mettre en place la navigation ».", type: "task_assigned", taskId: "t2", projectId: "p1", read: false, createdAt: iso(-1) },
  { id: "n2", title: "Échéance proche", message: "« Préparer le prototype mobile » arrive à échéance dans 4 jours.", type: "task_due", taskId: "t5", projectId: "p2", read: false, createdAt: iso(0) },
  { id: "n3", title: "Nouveau commentaire", message: "Un commentaire a été ajouté au projet Application mobile.", type: "comment", projectId: "p2", read: true, createdAt: iso(-2) },
];

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (_) {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function ensureSeedData() {
  if (!localStorage.getItem(KEYS.tasks)) write(KEYS.tasks, seedTasks);
  if (!localStorage.getItem(KEYS.projects)) write(KEYS.projects, seedProjects);
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, seedUsers);
  if (!localStorage.getItem(KEYS.activities)) write(KEYS.activities, seedActivities);
  if (!localStorage.getItem(KEYS.notifications)) write(KEYS.notifications, seedNotifications);
  if (!localStorage.getItem(KEYS.comments)) write(KEYS.comments, {});
  if (!localStorage.getItem(KEYS.savedViews)) write(KEYS.savedViews, []);
}

ensureSeedData();

export const localMode = true;
export const API = { localOnly: true };

const response = data => Promise.resolve({ data });
const currentTasks = () => read(KEYS.tasks, []);
const currentProjects = () => read(KEYS.projects, []);
const currentUsers = () => read(KEYS.users, []);
const currentActivities = () => read(KEYS.activities, []);
const currentNotifications = () => read(KEYS.notifications, []);

const enrichTask = task => {
  const project = currentProjects().find(p => String(p.id) === String(task.projectId));
  const assignee = currentUsers().find(u => String(u.id) === String(task.assigneeId));
  return { ...task, projectName: project?.name || "Aucun projet", assigneeName: assignee?.name || "Non assignée" };
};

const enrichActivity = activity => ({ ...activity, user: currentUsers().find(u => String(u.id) === String(activity.userId)) || null });

export const loginApi = ({ email, password }) => {
  const user = currentUsers().find(u => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password && u.status !== "disabled");
  if (!user) return Promise.reject({ response: { data: { message: "Adresse email ou mot de passe incorrect." } } });
  const safeUser = { ...user };
  delete safeUser.password;
  return response({ user: safeUser, access_token: `local-${user.id}` });
};

export const meApi = () => {
  const session = read("taskflow-session", null);
  const user = session?.user ? currentUsers().find(u => String(u.id) === String(session.user.id)) : null;
  return user ? response({ user }) : Promise.reject(new Error("Session locale introuvable."));
};

export const logoutApi = () => response({ success: true });

export const updateProfileApi = data => {
  const session = read("taskflow-session", null);
  const users = currentUsers();
  const index = users.findIndex(u => String(u.id) === String(session?.user?.id));
  if (index < 0) return Promise.reject(new Error("Utilisateur introuvable."));
  const updated = { ...users[index], ...data };
  users[index] = updated;
  write(KEYS.users, users);
  const safe = { ...updated };
  delete safe.password;
  return response({ user: safe });
};

export const updatePasswordApi = data => {
  const session = read("taskflow-session", null);
  const users = currentUsers();
  const index = users.findIndex(u => String(u.id) === String(session?.user?.id));
  if (index < 0) return Promise.reject(new Error("Utilisateur introuvable."));
  if (users[index].password !== data.currentPassword) return Promise.reject(new Error("Le mot de passe actuel est incorrect."));
  if (!data.newPassword || data.newPassword !== data.newPassword_confirmation) return Promise.reject(new Error("Les nouveaux mots de passe ne correspondent pas."));
  users[index].password = data.newPassword;
  write(KEYS.users, users);
  return response({ success: true });
};

export const getTodos = () => response(currentTasks().map(enrichTask));
export const createTodo = todo => {
  const item = { ...todo, id: id("t"), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  write(KEYS.tasks, [item, ...currentTasks()]);
  return response(enrichTask(item));
};
export const updateTodo = (taskId, patch) => {
  const tasks = currentTasks();
  const index = tasks.findIndex(t => String(t.id) === String(taskId));
  if (index < 0) return Promise.reject(new Error("Tâche introuvable."));
  tasks[index] = { ...tasks[index], ...patch, updatedAt: new Date().toISOString() };
  if (patch.status) tasks[index].completed = patch.status === "done";
  write(KEYS.tasks, tasks);
  return response(enrichTask(tasks[index]));
};
export const deleteTodo = taskId => {
  write(KEYS.tasks, currentTasks().filter(t => String(t.id) !== String(taskId)));
  return response({ success: true });
};

export const getUsersApi = () => response(currentUsers().map(({ password, ...user }) => user));
export const createUserApi = user => {
  const item = { ...user, id: id("u"), status: user.status || "active", password: user.password || "password123" };
  write(KEYS.users, [...currentUsers(), item]);
  const safe = { ...item }; delete safe.password;
  return response(safe);
};
export const updateUserApi = (userId, patch) => {
  const users = currentUsers();
  const index = users.findIndex(u => String(u.id) === String(userId));
  if (index < 0) return Promise.reject(new Error("Utilisateur introuvable."));
  users[index] = { ...users[index], ...patch };
  write(KEYS.users, users);
  const safe = { ...users[index] }; delete safe.password;
  return response(safe);
};
export const deleteUserApi = userId => { write(KEYS.users, currentUsers().filter(u => String(u.id) !== String(userId))); return response({ success: true }); };

export const getProjectsApi = () => response(currentProjects().map(p => ({ ...p, members: p.members || [] })));
export const getProjectApi = projectId => {
  const project = currentProjects().find(p => String(p.id) === String(projectId));
  return project ? response(project) : Promise.reject(new Error("Projet introuvable."));
};
export const createProject = project => {
  const item = { ...project, id: id("p"), members: [read("taskflow-session", null)?.user?.id || "u1"], createdAt: new Date().toISOString() };
  write(KEYS.projects, [...currentProjects(), item]);
  return response(item);
};
export const updateProject = (projectId, patch) => {
  const projects = currentProjects();
  const index = projects.findIndex(p => String(p.id) === String(projectId));
  if (index < 0) return Promise.reject(new Error("Projet introuvable."));
  projects[index] = { ...projects[index], ...patch };
  write(KEYS.projects, projects);
  return response(projects[index]);
};
export const deleteProjectApi = projectId => {
  write(KEYS.projects, currentProjects().filter(p => String(p.id) !== String(projectId)));
  write(KEYS.tasks, currentTasks().filter(t => String(t.projectId) !== String(projectId)));
  return response({ success: true });
};
export const addProjectMember = (projectId, userId) => updateProject(projectId, { members: Array.from(new Set([...(currentProjects().find(p => String(p.id) === String(projectId))?.members || []), userId])) });
export const removeProjectMember = (projectId, userId) => updateProject(projectId, { members: (currentProjects().find(p => String(p.id) === String(projectId))?.members || []).filter(idValue => String(idValue) !== String(userId)) });

export const getTaskComments = taskId => response(read(KEYS.comments, {})[taskId] || []);
export const createTaskComment = (taskId, comment) => {
  const comments = read(KEYS.comments, {});
  const session = read("taskflow-session", null);
  const item = { ...comment, id: id("c"), taskId, user: session?.user || null, createdAt: new Date().toISOString() };
  comments[taskId] = [...(comments[taskId] || []), item];
  write(KEYS.comments, comments);
  return response(item);
};

export const getActivityLog = params => {
  let rows = currentActivities().map(enrichActivity);
  if (params?.action && params.action !== "all") rows = rows.filter(a => a.action === params.action);
  if (params?.q) rows = rows.filter(a => a.message.toLowerCase().includes(String(params.q).toLowerCase()));
  return response(rows);
};
export const getAuditLog = params => getActivityLog(params);

function analytics(days = 30, projectId = "") {
  const cutoff = Date.now() - Number(days) * 86400000;
  const tasks = currentTasks().filter(t => !projectId || String(t.projectId) === String(projectId));
  const recent = tasks.filter(t => new Date(t.updatedAt || t.createdAt || 0).getTime() >= cutoff);
  const completed = tasks.filter(t => (t.status || (t.completed ? "done" : "todo")) === "done");
  const overdue = tasks.filter(t => t.dueDate && t.dueDate < dateOnly(0) && (t.status || "todo") !== "done");
  const projectStats = currentProjects().filter(p => !projectId || String(p.id) === String(projectId)).map(p => {
    const projectTasks = tasks.filter(t => String(t.projectId) === String(p.id));
    const done = projectTasks.filter(t => (t.status || "todo") === "done").length;
    return { ...p, total: projectTasks.length, completed: done, progress: projectTasks.length ? Math.round(done / projectTasks.length * 100) : 0 };
  });
  const priority = tasks.reduce((acc, t) => { acc[t.priority || "medium"] = (acc[t.priority || "medium"] || 0) + 1; return acc; }, {});
  return { summary: { total: recent.length || tasks.length, completed: completed.length, active: tasks.filter(t => (t.status || "todo") !== "done").length, overdue: overdue.length, completionRate: tasks.length ? Math.round(completed.length / tasks.length * 100) : 0 }, priority, projects: projectStats };
}

export const getDashboardApi = ({ days = 30 } = {}) => {
  const data = analytics(days);
  const tasks = currentTasks().filter(t => t.dueDate && t.dueDate >= dateOnly(0)).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return response({ kpis: { totalTasks: currentTasks().length, completed: data.summary.completed, overdue: data.summary.overdue, completionRate: data.summary.completionRate, active: data.summary.active, recentChanges: currentActivities().length }, projects: currentProjects(), people: currentUsers().length, upcoming: tasks.map(enrichTask).slice(0, 8) });
};
export const getAnalyticsApi = ({ days = 30, projectId = "" } = {}) => response(analytics(days, projectId));

export const searchApi = query => {
  const q = String(query || "").toLowerCase();
  return response({
    tasks: currentTasks().filter(t => `${t.title} ${t.description || ""}`.toLowerCase().includes(q)).map(enrichTask).slice(0, 8),
    projects: currentProjects().filter(p => `${p.name} ${p.description || ""}`.toLowerCase().includes(q)).slice(0, 8),
    users: currentUsers().filter(u => `${u.name} ${u.email}`.toLowerCase().includes(q)).map(({ password, ...u }) => u).slice(0, 8),
  });
};

const notificationRows = () => currentNotifications().map(n => ({ ...n, task: currentTasks().find(t => String(t.id) === String(n.taskId)) || null, project: currentProjects().find(p => String(p.id) === String(n.projectId)) || null }));
export const getNotificationsApi = ({ limit = 100, unread, type } = {}) => {
  let rows = notificationRows();
  if (unread) rows = rows.filter(n => !n.read);
  if (type) rows = rows.filter(n => n.type === type);
  return response(rows.slice(0, limit));
};
export const getUnreadNotificationCountApi = () => response({ count: currentNotifications().filter(n => !n.read).length });
export const markNotificationReadApi = notificationId => { write(KEYS.notifications, currentNotifications().map(n => String(n.id) === String(notificationId) ? { ...n, read: true } : n)); return response({ success: true }); };
export const markAllNotificationsReadApi = () => { write(KEYS.notifications, currentNotifications().map(n => ({ ...n, read: true }))); return response({ success: true }); };

export const getSavedViewsApi = resource => response(read(KEYS.savedViews, []).filter(v => !resource || v.resource === resource));
export const createSavedViewApi = data => { const item = { ...data, id: id("view") }; write(KEYS.savedViews, [item, ...read(KEYS.savedViews, [])]); return response(item); };
export const updateSavedViewApi = (viewId, data) => { const views = read(KEYS.savedViews, []); const index = views.findIndex(v => String(v.id) === String(viewId)); if (index >= 0) views[index] = { ...views[index], ...data }; write(KEYS.savedViews, views); return response(views[index]); };
export const deleteSavedViewApi = viewId => { write(KEYS.savedViews, read(KEYS.savedViews, []).filter(v => String(v.id) !== String(viewId))); return response({ success: true }); };

export const normalizeList = payload => {
  const value = payload?.data ?? payload;
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  return [];
};
export const normalizeTodos = normalizeList;
export const apiError = error => error?.response?.data?.message || error?.message || "Une erreur est survenue.";
