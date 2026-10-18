// Outil des tests de hooks : monte un hook dans un vrai composant React (jsdom) et expose sa dernière valeur.
// Utilisé seulement par les fichiers *.test.tsx de ce dossier.
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mounted: { root: Root; div: HTMLDivElement }[] = [];

export interface HookHandle<T> {
  /** Valeur renvoyée par le hook au dernier rendu */
  readonly current: T;
  /** Nombre de rendus du composant hôte */
  readonly renders: number;
}

export const renderHook = <T,>(hook: () => T): HookHandle<T> => {
  const state = { current: undefined as T, renders: 0 };
  const Host = () => {
    state.current = hook();
    state.renders += 1;
    return null;
  };
  const div = document.createElement("div");
  document.body.appendChild(div);
  const root = createRoot(div);
  act(() => root.render(<Host />));
  mounted.push({ root, div });
  return state;
};

/** Démonte tous les composants montés par renderHook (à appeler dans afterEach) */
export const cleanupHooks = () => {
  for (const { root, div } of mounted.splice(0)) {
    act(() => root.unmount());
    div.remove();
  }
};

export { act };
