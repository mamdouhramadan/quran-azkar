import { createJSONStorage, type StateStorage } from 'zustand/middleware';

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

// persistStorage provides a safe shared storage adapter for persisted Zustand stores.
export const persistStorage = createJSONStorage(() =>
  typeof window === 'undefined' ? noopStorage : window.localStorage
);
