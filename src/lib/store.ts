import { create } from "zustand";
import { Language } from "./translations";

interface EditorState {
  selectedElement: HTMLElement | null;
  isEditing: boolean;
  zoom: number;
  showGrid: boolean;
  undoStack: string[];
  redoStack: string[];
  setSelectedElement: (el: HTMLElement | null) => void;
  setIsEditing: (editing: boolean) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  pushUndo: (html: string) => void;
  undo: () => string | null;
  redo: () => string | null;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  selectedElement: null,
  isEditing: false,
  zoom: 100,
  showGrid: false,
  undoStack: [],
  redoStack: [],
  setSelectedElement: (el) => set({ selectedElement: el }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setZoom: (zoom) => set({ zoom }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  pushUndo: (html) =>
    set((state) => ({
      undoStack: [...state.undoStack, html],
      redoStack: [],
    })),
  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return null;
    const current = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, current],
    });
    return undoStack.length > 1 ? undoStack[undoStack.length - 2] : null;
  },
  redo: () => {
    const { redoStack, undoStack } = get();
    if (redoStack.length === 0) return null;
    const next = redoStack[redoStack.length - 1];
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, next],
    });
    return next;
  },
}));

interface AppState {
  sidebarOpen: boolean;
  currentProject: any | null;
  notifications: Array<{ id: string; message: string; type: string }>;
  language: Language;
  toggleSidebar: () => void;
  setCurrentProject: (project: any) => void;
  addNotification: (message: string, type: string) => void;
  removeNotification: (id: string) => void;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  currentProject: null,
  notifications: [],
  language: "tr", // Varsayılan olarak Türkçe yaptık
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCurrentProject: (project) => set({ currentProject: project }),
  addNotification: (message, type) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now().toString(), message, type },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  setLanguage: (lang) => set({ language: lang }),
}));
