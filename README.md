# Task Tracker - Advanced State Management with Redux Toolkit

A modern task management application built with **Next.js**, **Redux Toolkit (RTK)**, and **Firebase**, demonstrating advanced state management patterns and real-time synchronization.

## 🚀 Features

### Core Functionality

- **Complete CRUD Operations**: Create, read, update, and delete tasks with ease
- **Rich Task Properties**: Each task includes title, description, status, priority, labels, and timestamps
- **Real-Time Synchronization**: Instant updates across all user sessions using Firebase Firestore
- **Advanced Filtering**: Filter tasks by status, priority, labels, and search queries
- **Smart Sorting**: Sort tasks by various criteria including date, priority, and status
- **Task Duplication**: Copy existing tasks with modified identifiers

### State Management

- **Redux Toolkit Integration**: Leverages RTK slices for efficient state management
- **Async Thunks**: Handles asynchronous operations with proper loading and error states
- **Optimistic Updates**: Immediate UI feedback with server synchronization
- **Serialization Handling**: Proper handling of complex data types like Date objects

### User Experience

- **Firebase Authentication**: Secure user authentication and authorization
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark/Light Theme**: Theme switching with system preference detection
- **Toast Notifications**: User feedback for all operations
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Advanced Features

- **Column Management**: Show/hide table columns dynamically
- **Pagination**: Efficient data pagination for large task lists
- **Favorites System**: Mark and filter favorite tasks
- **Label Management**: Organize tasks with custom labels
- **Bulk Operations**: Perform actions on multiple tasks

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **State Management**: Redux Toolkit (RTK)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS, shadcn/ui
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner (react-hot-toast)

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd task-tracker-rtk
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database and Authentication
   - Copy your Firebase configuration

4. **Environment Variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
.
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   ├── page.tsx
│   └── tasks
│   └── page.tsx
├── components
│   ├── auth
│   │   ├── AuthForm.tsx
│   │   ├── AuthPage.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── SessionWarningModal.tsx
│   │   └── types.ts
│   ├── dropdown
│   │   ├── constants.ts
│   │   ├── FilterDropdown.tsx
│   │   ├── MenuItems.tsx
│   │   ├── PriorityDropdown.tsx
│   │   ├── StatusDropdown.tsx
│   │   ├── SubLabelMenu.tsx
│   │   ├── TasksDropdown.tsx
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── ViewColumnsDropdown.tsx
│   ├── mode-toggle.tsx
│   ├── navbar
│   │   ├── Navbar.tsx
│   │   └── types.ts
│   ├── providers.tsx
│   ├── statsCard
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── task-dialog
│   │   ├── sub-components
│   │   ├── TaskDialog.tsx
│   │   └── TaskDialogSchema.ts
│   ├── taskarea
│   │   ├── pagination
│   │   ├── SearchInput.tsx
│   │   ├── TableSkeleton.tsx
│   │   ├── TaskColumns.tsx
│   │   ├── TasksArea.tsx
│   │   └── TasksTable.tsx
│   ├── theme-provider.tsx
│   └── ui
│   ├── alert-dialog.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── popover.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── skeleton.tsx
│   ├── sonner.tsx
│   ├── table.tsx
│   └── tabs.tsx
├── components.json
├── config
│   ├── firebase.ts
│   ├── formFields.ts
│   └── types.ts
├── constants
│   └── shared.ts
├── contexts
│   └── AuthContext.tsx
├── cors.json
├── data
│   └── types.ts
├── eslint.config.mjs
├── filetree.txt
├── hooks
│   ├── index.ts
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   ├── useAuth.ts
│   ├── useOpenDialogStore.ts
│   └── useSessionTimeout.ts
├── lib
│   ├── features
│   │   ├── filters
│   │   └── tasks
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── logo.png
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── services
│   └── taskService.ts
├── store
│   └── store.ts
├── tsconfig.json
├── types
│   ├── auth.ts
│   ├── forms.ts
│   ├── index.ts
│   ├── navbar.ts
│   └── session.ts
└── utils
├── auth.ts
├── date.ts
├── firestore-debug.ts
├── icons.ts
├── tableFilters.ts
└── validation
└── authSchema.ts

\`\`\`

## 🔧 Redux Toolkit Implementation

### Tasks Slice

\`\`\`typescript
// Async thunks for CRUD operations
export const fetchTasks = createAsyncThunk(...)
export const addTask = createAsyncThunk(...)
export const updateTask = createAsyncThunk(...)
export const deleteTask = createAsyncThunk(...)

// Slice with reducers and actions
const tasksSlice = createSlice({
name: 'tasks',
initialState,
reducers: {
setSelectedTask,
clearSelectedTask,
},
extraReducers: (builder) => {
// Handle async thunk states
}
})
\`\`\`

### Filters Slice

\`\`\`typescript
const filtersSlice = createSlice({
name: 'filters',
initialState,
reducers: {
setCheckedPriorities,
setCheckedStatuses,
setQuery,
resetFilters,
}
})
\`\`\`

## 🔐 Authentication Flow

1. **Login/Signup**: Firebase Authentication with email/password
2. **Protected Routes**: Authentication guards for task management
3. **User Context**: Global user state management
4. **Automatic Logout**: Session management and cleanup

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced experience on tablets
- **Desktop**: Full-featured desktop interface
- **Touch-Friendly**: Large touch targets and gestures

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic code splitting with Next.js
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo and useMemo for expensive operations
- **Optimistic Updates**: Immediate UI feedback
- **Efficient Queries**: Optimized Firestore queries with indexing

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

\`\`\`bash

# Build the application

npm run build

# Start production server

npm start
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Redux Toolkit](https://redux-toolkit.js.org/) for excellent state management
- [Firebase](https://firebase.google.com/) for backend services
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
