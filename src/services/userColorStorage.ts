import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ColorWheelVal } from '../utils/cinematographyGradingMath';

export interface SavedUserGrade {
  id: string;
  userId: string;
  name: string;
  category: string;
  sceneType: string;
  kelvin: number;
  tint: number;
  contrast: number;
  saturation: number;
  lift: ColorWheelVal;
  gamma: ColorWheelVal;
  gain: ColorWheelVal;
  offsetLum?: number;
  swatches?: {
    shadows: string;
    midtones: string;
    highlights: string;
    accent: string;
  };
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface SavedUserPalette {
  id: string;
  userId: string;
  title: string;
  tagline: string;
  genre: string;
  mood: string;
  swatches: Array<{ hex: string; name?: string; role?: string }>;
  filmReferences?: string[];
  createdAt?: any;
}

export async function saveUserGrade(userId: string, grade: Omit<SavedUserGrade, 'userId'>): Promise<void> {
  const gradeRef = doc(db, 'users', userId, 'savedGrades', grade.id);
  await setDoc(
    gradeRef,
    {
      ...grade,
      userId,
      updatedAt: serverTimestamp(),
      createdAt: grade.createdAt || serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserGrades(userId: string): Promise<SavedUserGrade[]> {
  const gradesRef = collection(db, 'users', userId, 'savedGrades');
  const q = query(gradesRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as SavedUserGrade);
}

export async function deleteUserGrade(userId: string, gradeId: string): Promise<void> {
  const gradeRef = doc(db, 'users', userId, 'savedGrades', gradeId);
  await deleteDoc(gradeRef);
}

export async function saveUserPalette(userId: string, palette: Omit<SavedUserPalette, 'userId'>): Promise<void> {
  const paletteRef = doc(db, 'users', userId, 'savedPalettes', palette.id);
  await setDoc(
    paletteRef,
    {
      ...palette,
      userId,
      createdAt: palette.createdAt || serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserPalettes(userId: string): Promise<SavedUserPalette[]> {
  const palettesRef = collection(db, 'users', userId, 'savedPalettes');
  const q = query(palettesRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as SavedUserPalette);
}

export async function deleteUserPalette(userId: string, paletteId: string): Promise<void> {
  const paletteRef = doc(db, 'users', userId, 'savedPalettes', paletteId);
  await deleteDoc(paletteRef);
}
