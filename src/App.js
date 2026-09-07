import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, Container, Drawer, IconButton, Snackbar, Stack, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TodoForm from "./components/TodoForm";
import Stats from "./components/Stats";
import TodoList from "./components/TodoList";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Settings from "./components/Settings";
import Login from "./components/Login";
import ProjectDialog from "./components/ProjectDialog";
import TaskDetailDialog from "./components/TaskDetailDialog";
import ActivityLog from "./components/ActivityLog";
import ProjectWorkspace from "./components/ProjectWorkspace";
import Analytics from "./components/Analytics";
import Inbox from "./components/Inbox";
import AuditLog from "./components/AuditLog";

import TaskFilters from "./components/TaskFilters";

import WorkspaceOverview from "./components/WorkspaceOverview";
import CommandPalette from "./components/CommandPalette";
import { AuthProvider, useAuth } from "./auth";
import { lightTheme, darkTheme } from "./theme";
import { getTodos, createTodo, updateTodo, deleteTodo, normalizeTodos, createProject, updateProject, deleteProjectApi, addProjectMember, removeProjectMember, createTaskComment, getUsersApi, getProjectsApi, getActivityLog, getTaskComments, normalizeList } from "./api";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const statusOf = t => t.status || (t.completed ? "done" : "todo");
const activityText = (action, item) => ({ create: `created ${item}`, update: `updated ${item}`, delete: `deleted ${item}`, assign: `assigned ${item}`, comment: `commented on ${item}`, move: `moved ${item}` }[action] || `${action} ${item}`);

function Workspace() {
  const { user } = useAuth();
  const routeFromHash = () => { const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0]; return raw || "dashboard"; };
  const [page,setPage]=useState(()=>routeFromHash());
  const [commandOpen,setCommandOpen]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [todos,setTodos]=useState([]);
  const [projects,setProjects]=useState([]);
  const [users,setUsers]=useState([]);
  const [comments,setComments]=useState({});
  const [activities,setActivities]=useState([]);
  const [darkMode,setDarkMode]=useState(()=>localStorage.getItem("todo-dark")==="true");
  const [loading,setLoading]=useState(true), [apiOnline,setApiOnline]=useState(true), [snack,setSnack]=useState("");
  const [filter,setFilter]=useState("all"), [search,setSearch]=useState(""), [projectFilter,setProjectFilter]=useState("all");
  const [advancedFilters,setAdvancedFilters]=useState({search:"",status:"all",priority:"all",project:"all",assignee:"all",due:"all"});
  const [selectedProject,setSelectedProject]=useState(()=>JSON.parse(localStorage.getItem("taskflow-selected-project")||"null") || "p1");
  const [projectEditor,setProjectEditor]=useState(null), [editingTask,setEditingTask]=useState(null), [detailTask,setDetailTask]=useState(null);
  const isMobile=useMediaQuery("(max-width:900px)");

  useEffect(()=>localStorage.setItem("todo-dark",String(darkMode)),[darkMode]);
  useEffect(()=>localStorage.setItem("taskflow-selected-project",JSON.stringify(selectedProject)),[selectedProject]);
  useEffect(()=>{ const onHash=()=>{ const route=routeFromHash(); const parts=route.split("/"); if(parts[0]==="projects"){ setPage("projects"); if(parts[1]) setSelectedProject(parts[1]); } else setPage(["dashboard","tâches","analytics","inbox","audit","users","settings","projects"].includes(parts[0])?parts[0]:"dashboard"); }; window.addEventListener("hashchange",onHash); onHash(); return ()=>window.removeEventListener("hashchange",onHash); },[]);
  useEffect(()=>{ const onKey=e=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setCommandOpen(true);} if(e.key==="Escape")setCommandOpen(false); }; window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey); },[]);
  const navigate=next=>{ window.location.hash=`/${next}`; setPage(next); };
  useEffect(()=>{ const load=async()=>{ 
    try {
      const [todoRes, projectRes, userRes, activityRes] = await Promise.all([
        getTodos(), getProjectsApi(), getUsersApi(), getActivityLog()
      ]);
      const remote = normalizeTodos(todoRes).map(t=>({...t,status:t.status||(t.completed?"done":"todo")}));
      const remoteProjects = normalizeList(projectRes.data);
      setTodos(remote); setProjects(remoteProjects); setUsers(normalizeList(userRes.data)); setActivities(normalizeList(activityRes.data));
      if (!selectedProject || !remoteProjects.some(p=>String(p.id)===String(selectedProject))) setSelectedProject(remoteProjects[0]?.id || null);
      localStorage.setItem("todo-cache",JSON.stringify(remote)); setApiOnline(true);
    } catch (e) {
      setApiOnline(false);
      setTodos(JSON.parse(localStorage.getItem("todo-cache")||"[]"));
    } finally { setLoading(false); }
  }; load(); },[]);

  const persist=next=>{const safe=Array.isArray(next)?next:[];setTodos(safe);localStorage.setItem("todo-cache",JSON.stringify(safe));};
  const log=(action,item,metadata={})=>setActivities(prev=>[{id:uid(),userId:user.id,action,message:activityText(action,item),createdAt:new Date().toISOString(),...metadata},...prev].slice(0,200));

  const saveTodo=async data=>{
    const todo={...data,id:data.id, title:data.title.trim(),description:data.description||"",status:data.status||"todo",completed:(data.status||"todo")==="done",priority:data.priority||"medium",dueDate:data.dueDate||null,projectId:data.projectId||projects[0]?.id||null,assigneeId:data.assigneeId||null};
    try {
      let saved;
      if(data.id) saved=(await updateTodo(data.id,todo)).data;
      else saved=(await createTodo(todo)).data;
      saved={...saved,status:saved.status||(saved.completed?"done":"todo")};
      persist(data.id?todos.map(t=>String(t.id)===String(data.id)?saved:t):[saved,...todos]);
      setApiOnline(true); setEditingTask(null); setSnack(data.id?"Tâche mise à jour":"Tâche créée");
      setActivities(prev=>[{id:uid(),userId:user.id,action:data.id?"update":"create",message:activityText(data.id?"update":"create",`task “${saved.title}”`),createdAt:new Date().toISOString()},...prev]);
    } catch(e) {
      setApiOnline(false); setSnack(e?.response?.data?.message || "Impossible d’enregistrer la tâche");
    }
  };
  const removeTodo=async id=>{
    const task=todos.find(t=>String(t.id)===String(id));
    try { await deleteTodo(id); persist(todos.filter(t=>String(t.id)!==String(id))); setApiOnline(true); log("delete", `task “${task?.title || id}”`); setSnack("Tâche supprimée"); }
    catch(e){ setApiOnline(false); setSnack(e?.response?.data?.message || "Impossible de supprimer la tâche"); }
  };
  const moveTask=async (task,status)=>{
    try {
      const updated=(await updateTodo(task.id,{status,completed:status==="done"})).data;
      persist(todos.map(t=>String(t.id)===String(task.id)?{...t, ...updated}:t)); setApiOnline(true); log("move", `task “${task.title}”`);
    } catch(e){ setApiOnline(false); setSnack(e?.response?.data?.message || "Impossible de déplacer la tâche"); }
  };
  const assignTask=async (id,assigneeId)=>{
    const task=todos.find(t=>String(t.id)===String(id)); if(!task) return;
    try {
      const updated=(await updateTodo(id,{assigneeId:assigneeId||null})).data;
      persist(todos.map(t=>String(t.id)===String(id)?{...t,...updated}:t)); setDetailTask({...task,...updated}); setApiOnline(true); log("assign", `task “${task.title}”`);
    } catch(e){ setApiOnline(false); setSnack(e?.response?.data?.message || "Impossible d’attribuer la tâche"); }
  };

  const saveProject=async project=>{
    const exists=projects.some(p=>String(p.id)===String(project.id));
    try {
      const saved=exists?(await updateProject(project.id,{name:project.name,description:project.description})).data:(await createProject({name:project.name,description:project.description})).data;
      setProjects(prev=>exists?prev.map(p=>String(p.id)===String(saved.id)?saved:p):[...prev,saved]);
      setSelectedProject(saved.id); setProjectEditor(null); setApiOnline(true); log(exists?"update":"create", `project “${saved.name}”`); setSnack(exists?"Projet mis à jour":"Projet créé");
    } catch(e){ setApiOnline(false); setSnack(e?.response?.data?.message || "Impossible d’enregistrer le projet"); }
  };
  const removeProject=async id=>{
    if(projects.length<=1)return setSnack("Conservez au moins un projet");
    try {
      await deleteProjectApi(id);
      const next=projects.filter(x=>String(x.id)!==String(id));
      setProjects(next); setSelectedProject(next[0]?.id||null); setApiOnline(true); log("delete", `project “${id}”`); setSnack("Projet supprimé");
    } catch(e){ setApiOnline(false); setSnack(e?.response?.data?.message || "Impossible de supprimer le projet"); }
  };
  const addMember=async(userId)=>{
    const p=projects.find(x=>String(x.id)===String(selectedProject)); if(!p) return;
    try { const saved=(await addProjectMember(p.id,userId)).data; setProjects(prev=>prev.map(x=>String(x.id)===String(p.id)?saved:x)); setApiOnline(true); log("update", `membre ajouté au projet “${p.name}”`); }
    catch(e){ setApiOnline(false); setSnack(e?.response?.data?.message || "Impossible d’ajouter le membre"); }
  };
  const removeMember=async(userId)=>{
    const p=projects.find(x=>String(x.id)===String(selectedProject)); if(!p) return;
    try { const saved=(await removeProjectMember(p.id,userId)).data; setProjects(prev=>prev.map(x=>String(x.id)===String(p.id)?saved:x)); setApiOnline(true); log("update", `membre retiré du projet “${p.name}”`); }
    catch(e){ setApiOnline(false); setSnack(e?.response?.data?.message || "Impossible de retirer le membre"); }
  };
  const addComment=async(taskId,text)=>{
    try {
      const saved=(await createTaskComment(taskId,{text})).data;
      setComments(prev=>({...prev,[taskId]:[...(prev[taskId]||[]),saved]})); setApiOnline(true); const task=todos.find(t=>String(t.id)===String(taskId)); log("comment", `task “${task?.title || taskId}”`);
    } catch(e){ setApiOnline(false); setSnack(e?.response?.data?.message || "Échec du commentaire"); }
  };
  const openTask=async task=>{
    setDetailTask(task);
    try { const list=normalizeList((await getTaskComments(task.id)).data); setComments(prev=>({...prev,[task.id]:list})); }
    catch(e){ setSnack("Impossible de charger les commentaires"); }
  };

  const visibleTodos=useMemo(()=>todos.filter(t=>{const f=advancedFilters;const q=(f.search||search).toLowerCase();const s=statusOf(t);if(f.status!=="all" && s!==f.status)return false;if(f.priority!=="all" && (t.priority||"medium")!==f.priority)return false;if(f.project!=="all" && String(t.projectId)!==String(f.project))return false;if(f.assignee!=="all" && (f.assignee==="unassigned" ? t.assigneeId : String(t.assigneeId)!==String(f.assignee)))return false;if(f.due==="none" && t.dueDate)return false;if(f.due==="overdue" && !(t.dueDate && new Date(`${t.dueDate}T23:59:59`)<new Date() && s!=="done"))return false;if(f.due==="today"){const d=t.dueDate&&new Date(`${t.dueDate}T23:59:59`);const n=new Date();if(!d||d.toDateString()!==n.toDateString())return false;}if(f.due==="upcoming"){const d=t.dueDate&&new Date(`${t.dueDate}T23:59:59`);const n=new Date();const max=new Date();max.setDate(max.getDate()+7);if(!d||d<n||d>max)return false;}return !q||`${t.title} ${t.description||""}`.toLowerCase().includes(q);}),[todos,advancedFilters,search]);
  const active=projects.find(p=>String(p.id)===String(selectedProject))||projects[0];
  const theme=createTheme(darkMode?darkTheme:lightTheme,{typography:{fontFamily:"Inter,system-ui,-apple-system,BlinkMacSystemFont,sans-serif"},shape:{borderRadius:14}});

  const projectsPage=()=> <ProjectWorkspace
    project={active}
    projects={projects}
    todos={todos}
    users={users}
    activities={activities}
    onSelectProject={setSelectedProject}
    onEditProject={setProjectEditor}
    onDeleteProject={removeProject}
    onNewTask={()=>setEditingTask({projectId: active?.id || projects[0]?.id || ""})}
    onMove={moveTask}
    onEditTask={setEditingTask}
    onDeleteTask={removeTodo}
    onOpenTask={openTask}
    onAddMember={addMember}
    onRemoveMember={removeMember}
  />;

  const taskFilterState=advancedFilters;
  const setTaskFilters=next=>{ setAdvancedFilters(next); setSearch(next.search); setFilter(next.status); setProjectFilter(next.project); };
  const tasksPage=()=> <Stack spacing={3}>
    <Stack direction={{xs:"column",md:"row"}} justifyContent="space-between" gap={2}>
      <Box><Typography variant="h4" fontWeight={900}>Tâches</Typography><Typography color="text.secondary">Un espace unique pour gérer vos tâches, filtres et workflows.</Typography></Box>
      <Stack direction="row" spacing={1} alignItems="center"><Chip icon={apiOnline?<CheckCircleIcon/>:<ScheduleIcon/>} label={apiOnline?"Stockage local":"Données locales"} color={apiOnline?"success":"warning"} variant="outlined"/><Button variant="contained" startIcon={<AddIcon/>} onClick={()=>setEditingTask({})}>Nouvelle tâche</Button></Stack>
    </Stack>
    <Stats todos={todos}/>
    <Card><CardContent><TodoForm addTodo={saveTodo} projects={projects} users={users} initialTask={editingTask} onCancel={()=>setEditingTask(null)}/></CardContent></Card>
    <TaskFilters projects={projects} users={users} value={taskFilterState} onChange={setTaskFilters} storageKey="taskflow-global-views" />
    <Card><CardContent>{loading?<Typography color="text.secondary">Chargement…</Typography>:<TodoList todos={visibleTodos} projects={projects} removeTodo={removeTodo} editTodo={setEditingTask} onOpen={openTask}/>}</CardContent></Card>
  </Stack>;

  const content=()=>page==="dashboard"?<Stack spacing={3}><Dashboard todos={todos} projects={projects} users={users}/><WorkspaceOverview todos={todos} projects={projects} users={users} user={user} onNavigate={navigate} onOpenTask={openTask}/><ActivityLog activities={activities} users={users}/></Stack>:page==="analytics"?<Analytics todos={todos} projects={projects}/>:page==="inbox"?<Inbox todos={todos} activities={activities} users={users} projects={projects} onOpenTask={openTask} onNavigate={navigate}/>:page==="audit"?<AuditLog activities={activities} users={users}/>:page==="users"?<Users/>:page==="settings"?<Settings darkMode={darkMode} toggleTheme={()=>setDarkMode(v=>!v)}/>:page==="projects"?projectsPage():tasksPage();
  return <ThemeProvider theme={theme}><Box sx={{minHeight:"100vh",bgcolor:"background.default"}}><Header toggleTheme={()=>setDarkMode(v=>!v)} darkMode={darkMode} onSearch={()=>setCommandOpen(true)} todos={todos} activities={activities} onOpenTask={openTask}/><Box sx={{display:"flex"}}>{isMobile?<Drawer open={mobileOpen} onClose={()=>setMobileOpen(false)}><Sidebar page={page} setPage={p=>{navigate(p);setMobileOpen(false)}}/></Drawer>:<Sidebar page={page} setPage={navigate}/>}<Box sx={{flex:1,minWidth:0}}><Container maxWidth="xl" sx={{py:4}}>{isMobile&&<IconButton onClick={()=>setMobileOpen(true)} sx={{mb:2}}><MenuIcon/></IconButton>}{content()}</Container></Box></Box>
    <CommandPalette open={commandOpen} onClose={()=>setCommandOpen(false)} todos={todos} projects={projects} users={users} onNavigate={navigate} onNewTask={()=>{setEditingTask({});navigate("tâches")}} onOpenTask={openTask} onSelectProject={setSelectedProject}/>
    <ProjectDialog open={projectEditor!==null} project={projectEditor?.id?projectEditor:null} onClose={()=>setProjectEditor(null)} onSave={saveProject}/>
    <TaskDetailDialog task={detailTask} open={Boolean(detailTask)} onClose={()=>setDetailTask(null)} users={users} comments={comments[detailTask?.id]||[]} currentUser={user} onAssign={assignTask} onComment={text=>addComment(detailTask.id,text)} onDelete={removeTodo}/>
    <Snackbar open={Boolean(snack)} autoHideDuration={2500} onClose={()=>setSnack("")}><Alert severity="success" variant="filled">{snack}</Alert></Snackbar>
  </Box></ThemeProvider>;
}
function App(){return <AuthProvider><AuthGate/></AuthProvider>}
function AuthGate(){const {user,loading}=useAuth(); if(loading) return <Box sx={{minHeight:"100vh",display:"grid",placeItems:"center"}}><Typography>Chargement…</Typography></Box>; return user?<Workspace/>:<Login/>}
export default App;
