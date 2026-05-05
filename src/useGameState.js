import { useState, useEffect } from 'react';
import { SOLUTION, getFinder } from './gameData';

const STORAGE_KEY = 'verstoppertje_v1';

function emptyGrid() {
  return Array.from({ length: 6 }, () => Array(6).fill(null));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function checkWin(placements) {
  // All 5 characters placed in correct spots
  return Object.entries(SOLUTION).every(([id, [r, c]]) => {
    if (id === 'finn') return true;
    return placements[r][c] === id;
  });
}

export default function useGameState() {
  const [grid, setGrid] = useState(() => {
    const saved = loadState();
    return saved?.grid ?? emptyGrid();
  });
  const [selected, setSelected] = useState(null); // charId being placed
  const [won, setWon] = useState(false);
  const [finder, setFinder] = useState(null);

  useEffect(() => {
    saveState({ grid });
    if (checkWin(grid)) {
      setWon(true);
      setFinder(getFinder());
    }
  }, [grid]);

  function selectChar(charId) {
    setSelected(prev => prev === charId ? null : charId);
  }

  function toggleCell(row, col) {
    if (won) return;
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      const current = next[row][col];

      if (selected) {
        // Check if this char is already placed somewhere else — remove it first
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 6; c++) {
            if (next[r][c] === selected) next[r][c] = null;
          }
        }
        if (current === selected) {
          // clicking same cell: remove
          next[row][col] = null;
        } else {
          next[row][col] = selected;
          setSelected(null);
        }
      } else {
        // No character selected: toggle X marker
        next[row][col] = current === 'X' ? null : current ? null : 'X';
      }
      return next;
    });
  }

  function resetGame() {
    setGrid(emptyGrid());
    setSelected(null);
    setWon(false);
    setFinder(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return { grid, selected, selectChar, toggleCell, won, finder, resetGame };
}
