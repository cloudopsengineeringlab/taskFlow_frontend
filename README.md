# TaskFlow — Frontend autonome

TaskFlow est une interface SaaS de gestion de tâches et de projets construite avec **React 18** et **Material UI**.

Cette édition est volontairement **100 % autonome** : elle ne nécessite ni Laravel, ni API REST, ni base de données, ni service externe pour fonctionner.

Toutes les données métier sont simulées et persistées dans le **localStorage du navigateur**. Cela permet de présenter, tester ou développer le frontend indépendamment du backend.

## ✨ Fonctionnalités

- Tableau de bord SaaS
- Gestion des tâches
- Tableau Kanban
- Liste des tâches et filtres avancés
- Projets et espaces projet
- Vue d'ensemble, tableau, liste, chronologie, membres et activité
- Analyses et indicateurs
- Boîte de réception
- Notifications
- Journal d'activité / audit
- Gestion des utilisateurs et rôles
- Paramètres du profil
- Mode clair / sombre
- Recherche globale et palette de commandes `Ctrl + K` / `⌘ + K`
- Vues de tâches enregistrées
- Commentaires sur les tâches
- Affectation des tâches
- Persistance locale après actualisation du navigateur
- Données de démonstration prêtes à l'emploi

## 🧱 Architecture

```text
src/
├── components/
│   ├── Dashboard.js
│   ├── Analytics.js
│   ├── ProjectWorkspace.js
│   ├── KanbanBoard.js
│   ├── TodoList.js
│   ├── TodoForm.js
│   ├── TaskFilters.js
│   ├── TaskDetailDialog.js
│   ├── ProjectMembers.js
│   ├── Inbox.js
│   ├── NotificationsPopover.js
│   ├── AuditLog.js
│   ├── Users.js
│   ├── Settings.js
│   └── ...
├── api.js          # Couche de données locale
├── auth.js         # Authentification locale et rôles
├── App.js          # Navigation et état global de l'espace
├── theme.js        # Thèmes Material UI
└── index.css       # Styles globaux
```

### Couche de données locale

`src/api.js` conserve volontairement les mêmes noms de fonctions que l'ancienne couche API (`getTodos`, `createTodo`, `getProjectsApi`, etc.).

La différence est qu'elles ne font **aucun appel HTTP** : elles lisent et écrivent directement dans `localStorage`.

Cette approche permet de conserver les composants métier presque inchangés tout en ayant une version totalement indépendante du backend.

React recommande de traiter les APIs du navigateur comme `localStorage` côté client lorsqu'une application en dépend ; cette version est précisément conçue comme une SPA exécutée dans le navigateur. citeturn0search3turn0search6

## 🚀 Installation

Prérequis :

- Node.js 18+ recommandé
- npm

Installation :

```bash
npm install
```

Démarrage :

```bash
npm start
```

L'application sera disponible sur :

```text
http://localhost:3000
```

Aucun backend n'est nécessaire.

## 🔐 Comptes de démonstration

### Administrateur

```text
Email : admin@taskflow.local
Mot de passe : admin123
```

### Manager

```text
Email : sophie@taskflow.local
Mot de passe : password123
```

### Membre

```text
Email : thomas@taskflow.local
Mot de passe : password123
```

Un quatrième utilisateur de démonstration est également fourni :

```text
Email : julie@taskflow.local
Mot de passe : password123
```

> Ces comptes sont uniquement destinés à la démonstration. Ils ne constituent pas un mécanisme d'authentification sécurisé pour la production.

## 💾 Persistance des données

Les données sont enregistrées dans le navigateur :

- tâches
- projets
- utilisateurs
- activités
- commentaires
- notifications
- vues enregistrées
- session utilisateur
- préférences d'interface

Pour repartir avec une démonstration vierge, ouvrez les outils développeur du navigateur et supprimez les données de stockage du site.

Vous pouvez également exécuter dans la console :

```js
Object.keys(localStorage)
  .filter(key => key.startsWith('taskflow-'))
  .forEach(key => localStorage.removeItem(key));
location.reload();
```

## 🧪 Tests et build

Lancer les tests :

```bash
npm test
```

Créer une version de production :

```bash
npm run build
```

## 🐳 Docker

Le projet conserve les fichiers Docker du frontend pour permettre une exécution conteneurisée du build ou du serveur de développement.

Dans cette édition autonome, aucune configuration d'URL d'API n'est nécessaire.

## 🔄 Passage futur vers Laravel / API

Cette version est volontairement séparée du backend, mais l'architecture facilite un retour ultérieur vers une API.

Le point d'isolation est principalement :

```text
Composants React
       ↓
   src/api.js
       ↓
localStorage
```

Pour reconnecter l'application à Laravel, il suffit de remplacer progressivement cette couche locale par une couche HTTP sans réécrire les écrans métier.

L'écosystème React recommande également de séparer les responsabilités liées au routage et à la récupération des données lorsque l'application grandit ; cette séparation par couche de données prépare donc une future évolution vers une architecture plus complète. citeturn0search3

## 🎯 Objectif pédagogique

Cette version peut être utilisée comme **version frontend de démonstration** pour :

1. découvrir React ;
2. comprendre les composants et l'état ;
3. construire une interface SaaS ;
4. travailler sur les formulaires ;
5. manipuler `localStorage` ;
6. implémenter un CRUD côté frontend ;
7. comprendre les rôles et permissions côté interface ;
8. préparer ensuite l'intégration avec Laravel ou une autre API.

## ⚠️ Limites

Cette version n'est pas destinée à la production telle quelle.

Le localStorage :

- n'est pas une base de données ;
- n'assure pas la sécurité des comptes ;
- ne permet pas la collaboration temps réel entre utilisateurs ;
- ne fournit pas d'isolation serveur entre organisations ;
- ne remplace pas les contrôles d'autorisation backend.

Elle est conçue pour **le développement frontend, les démonstrations, les prototypes et l'apprentissage**.

## 📌 Stack

- React 18
- Material UI 7
- React Scripts / Create React App
- JavaScript / JSX
- localStorage
- CSS

## 📄 Licence

Projet frontend TaskFlow destiné au développement et à la démonstration.
