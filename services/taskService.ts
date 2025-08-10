import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Task } from '@/data/types';

const TASKS_COLLECTION = 'tasks';
const COUNTERS_COLLECTION = 'counters';

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Convert Task to Firestore document
const taskToFirestore = (task: Task) => ({
  ...task,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

// Convert Firestore document to Task
const firestoreToTask = (doc: any): Task => ({
  ...doc.data(),
  id: doc.id,
  createdAt: convertTimestamp(doc.data().createdAt),
});

// Generate incremental task ID
const generateTaskId = async (): Promise<string> => {
  const counterRef = doc(db, COUNTERS_COLLECTION, 'taskCounter');

  return runTransaction(db, async transaction => {
    const counterDoc = await transaction.get(counterRef);

    let newCount = 1;
    if (counterDoc.exists()) {
      newCount = (counterDoc.data().count || 0) + 1;
    }

    // Update the counter
    transaction.set(counterRef, { count: newCount }, { merge: true });

    // Format as Task-0001, Task-0002, etc.
    return `Task-${newCount.toString().padStart(4, '0')}`;
  });
};

export const taskService = {
  // Get all tasks for a specific user
  async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const tasksRef = collection(db, TASKS_COLLECTION);
      const q = query(tasksRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(firestoreToTask);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },

  // Add a new task (original method)
  async addTask(task: Omit<Task, 'createdAt'>): Promise<string> {
    try {
      const taskData = {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Failed to add task');
    }
  },

  // Add a new task with custom incremental ID
  async createTaskWithId(task: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
    try {
      const taskId = await generateTaskId();

      const taskData = {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Use the generated taskId as the document ID
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await runTransaction(db, async transaction => {
        transaction.set(taskRef, taskData);
      });

      return taskId;
    } catch (error) {
      console.error('Error creating task with ID:', error);
      throw new Error('Failed to create task');
    }
  },

  // Update an existing task
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  },

  // Delete a task
  async deleteTask(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  },

  // Toggle task favorite status
  async toggleFavorite(taskId: string, isFavorite: boolean): Promise<void> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        isFavorite,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Failed to update favorite status');
    }
  },
};
