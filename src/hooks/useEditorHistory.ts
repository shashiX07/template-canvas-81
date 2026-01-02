import { useState, useCallback, useRef } from "react";

interface HistoryState {
  html: string;
  timestamp: number;
}

interface UseEditorHistoryOptions {
  maxHistoryLength?: number;
}

export const useEditorHistory = (options: UseEditorHistoryOptions = {}) => {
  const { maxHistoryLength = 50 } = options;
  
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  const pushState = useCallback((html: string) => {
    // Don't push state if this was triggered by undo/redo
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    setHistory(prev => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Don't add duplicate states
      if (newHistory.length > 0 && newHistory[newHistory.length - 1].html === html) {
        return newHistory;
      }
      
      // Add new state
      const updatedHistory = [...newHistory, { html, timestamp: Date.now() }];
      
      // Limit history length
      if (updatedHistory.length > maxHistoryLength) {
        return updatedHistory.slice(-maxHistoryLength);
      }
      
      return updatedHistory;
    });
    
    setCurrentIndex(prev => {
      const newIndex = Math.min(prev + 1, maxHistoryLength - 1);
      return newIndex;
    });
  }, [currentIndex, maxHistoryLength]);

  const undo = useCallback((): string | null => {
    if (currentIndex <= 0) return null;
    
    isUndoRedoAction.current = true;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex]?.html || null;
  }, [currentIndex, history]);

  const redo = useCallback((): string | null => {
    if (currentIndex >= history.length - 1) return null;
    
    isUndoRedoAction.current = true;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex]?.html || null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    historyLength: history.length,
    currentIndex,
  };
};