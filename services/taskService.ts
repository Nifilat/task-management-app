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
import { auth, db } from '@/config/firebase';
import type { Task } from '@/data/types';

const TASKS_COLLECTION = 'tasks';
const COUNTERS_COLLECTION = 'counters';

const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) return timestamp.toDate();
  if (timestamp?.toDate) return timestamp.toDate();
  return new Date(timestamp);
};

const firestoreToTask = (docSnap: any): Task => ({
  ...docSnap.data(),
  id: docSnap.id,
  createdAt: convertTimestamp(docSnap.data().createdAt),
});

const generateTaskId = async (): Promise<string> => {
  if (!auth.currentUser) throw new Error('Not authenticated');

  const counterRef = doc(db, COUNTERS_COLLECTION, auth.currentUser.uid);

  return runTransaction(db, async transaction => {
    const counterDoc = await transaction.get(counterRef);

    let newCount = 1;
    if (counterDoc.exists()) {
      newCount = (counterDoc.data().count || 0) + 1;
    }

    transaction.set(
      counterRef,
      {
        count: newCount,
        userId: auth.currentUser?.uid,
      },
      { merge: true }
    );

    return `Task-${newCount.toString().padStart(4, '0')}`;
  });
};

export const taskService = {
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

  async addTask(task: Omit<Task, 'id' | 'taskId' | 'createdAt'>): Promise<string> {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
      const taskId = await generateTaskId();
      const taskData = {
        ...task,
        taskId,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, TASKS_COLLECTION), taskData);
      return taskId;
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Failed to add task');
    }
  },

  async updateTask(taskId: string, updates: Partial<Task>, userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, TASKS_COLLECTION),
        where('taskId', '==', taskId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) throw new Error(`Task with taskId ${taskId} not found`);

      await updateDoc(snapshot.docs[0].ref, { ...updates, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  },

  async deleteTask(taskId: string, userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, TASKS_COLLECTION),
        where('taskId', '==', taskId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) throw new Error(`Task with taskId ${taskId} not found`);

      await deleteDoc(snapshot.docs[0].ref);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  },

  async toggleFavorite(taskId: string, isFavorite: boolean, userId: string): Promise<void> {
    console.log('toggleFavorite args:', { taskId, isFavorite, userId });

    if (!taskId || !userId) {
      throw new Error(
        `toggleFavorite called without required data: taskId=${taskId}, userId=${userId}`
      );
    }

    try {
      const q = query(
        collection(db, TASKS_COLLECTION),
        where('taskId', '==', taskId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) throw new Error(`Task with taskId ${taskId} not found`);

      await updateDoc(snapshot.docs[0].ref, {
        isFavorite,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Failed to update favorite status');
    }
  },
};

export default taskService;
