# Firebase Tasks Setup Guide

## Step 1: Create Tasks Collection Structure

### Manual Setup in Firebase Console

1. **Go to Firebase Console** → Your Project → Firestore Database

2. **Create a new collection called `tasks`**
   - Click "Start collection"
   - Collection ID: `tasks`

3. **Add sample tasks for user Conrad Hauck (uid: 5DGAkIhWM8R1jhA0J01O9b6nUoB2)**

#### Task 1:
- Document ID: `task_001_5DGAkIhWM8R1jhA0J01O9b6nUoB2` (or auto-generate)
- Fields:
  ```
  taskId: "Task-001" (string)
  title: "Fix login authentication bug" (string)
  label: "Bug" (string)
  isFavorite: false (boolean)
  priority: "High" (string)
  status: "In Progress" (string)
  userId: "5DGAkIhWM8R1jhA0J01O9b6nUoB2" (string)
  createdAt: [current timestamp]
  updatedAt: [current timestamp]
  ```

#### Task 2:
- Document ID: `task_002_5DGAkIhWM8R1jhA0J01O9b6nUoB2` (or auto-generate)
- Fields:
  ```
  taskId: "Task-002" (string)
  title: "Implement dark mode feature" (string)
  label: "Feature" (string)
  isFavorite: true (boolean)
  priority: "Medium" (string)
  status: "Todo" (string)
  userId: "5DGAkIhWM8R1jhA0J01O9b6nUoB2" (string)
  createdAt: [current timestamp]
  updatedAt: [current timestamp]
  ```

#### Task 3:
- Document ID: `task_003_5DGAkIhWM8R1jhA0J01O9b6nUoB2` (or auto-generate)
- Fields:
  ```
  taskId: "Task-003" (string)
  title: "Update API documentation" (string)
  label: "Documentation" (string)
  isFavorite: false (boolean)
  priority: "Low" (string)
  status: "Backlog" (string)
  userId: "5DGAkIhWM8R1jhA0J01O9b6nUoB2" (string)
  createdAt: [current timestamp]
  updatedAt: [current timestamp]
  ```

## Step 2: Update Firestore Security Rules

Go to Firestore Database → Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own tasks
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Step 3: Test the Setup

After implementing the code changes, you should be able to:
1. Login as Conrad Hauck
2. See the 3 tasks you created
3. Add new tasks
4. Edit existing tasks
5. Delete tasks

The tasks will be automatically filtered to show only the current user's tasks.