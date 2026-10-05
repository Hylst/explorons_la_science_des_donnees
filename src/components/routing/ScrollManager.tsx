import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Les pages sont chargées à la demande : le contenu (ancre, hauteur) peut apparaître après coup
const RETRY_DELAY_MS = 100;
const MAX_WAIT_MS = 3000;
const STORAGE_KEY = "scroll-positions";

const loadPositions = (): Record<string, number> => {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    if (typeof parsed !== "object" || parsed === null) return {};
    // Seules les positions numériques valides sont conservées
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, number] => typeof entry[1] === "number" && Number.isFinite(entry[1]) && entry[1] >= 0
      )
    );
  } catch {
    return {};
  }
};

const MAX_SAVED_POSITIONS = 50;

const savePositions = (positions: Record<string, number>) => {
  try {
    // Seules les entrées d'historique récentes sont utiles
    const recent = Object.entries(positions).slice(-MAX_SAVED_POSITIONS);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(recent)));
  } catch {
    // Stockage indisponible : les positions restent en mémoire
  }
};

/** Hauteur de la barre de navigation collante, qui masquerait le haut de la section visée */
const stickyHeaderOffset = () =>
  document.querySelector<HTMLElement>("nav.sticky")?.offsetHeight ?? 0;

/** Répète `attempt` jusqu'à ce qu'elle réussisse ; appelle `onGiveUp` si le délai est écoulé */
const retryUntil = (attempt: () => boolean, onGiveUp?: () => void) => {
  const startedAt = Date.now();
  let timer: number | undefined;
  const run = () => {
    if (attempt()) return;
    if (Date.now() - startedAt < MAX_WAIT_MS) {
      timer = window.setTimeout(run, RETRY_DELAY_MS);
    } else {
      onGiveUp?.();
    }
  };
  run();
  return () => window.clearTimeout(timer);
};

/**
 * Gère le défilement lors des navigations :
 * - nouvelle page : retour en haut ;
 * - URL avec ancre (#section) : défilement jusqu'à l'élément, sous la barre de navigation ;
 * - précédent/suivant ou rechargement : restauration de la position mémorisée.
 */
const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef<Record<string, number>>(loadPositions());
  const currentKey = useRef(location.key);

  // Restauration gérée ici : celle du navigateur s'applique avant l'affichage des pages chargées à la demande
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  // Mis à jour avant tout événement de défilement, pour ne jamais attribuer
  // la position de la nouvelle page à l'ancienne entrée d'historique
  useLayoutEffect(() => {
    currentKey.current = location.key;
  }, [location.key]);

  useEffect(() => {
    let frame = 0;
    const record = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        positions.current[currentKey.current] = window.scrollY;
      });
    };
    const persist = () => savePositions(positions.current);
    window.addEventListener("scroll", record, { passive: true });
    window.addEventListener("pagehide", persist);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", record);
      window.removeEventListener("pagehide", persist);
      persist();
    };
  }, []);

  useEffect(() => {
    const { hash, key } = location;

    if (navigationType === "POP" && positions.current[key] !== undefined) {
      const saved = positions.current[key];
      // Attendre que la page soit assez haute pour atteindre la position mémorisée
      return retryUntil(
        () => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (maxScroll < saved) return false;
          window.scrollTo(0, saved);
          return true;
        },
        // Page devenue plus courte entre-temps : on va au plus près
        () => window.scrollTo(0, saved)
      );
    }

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      return retryUntil(() => {
        const element = document.getElementById(id);
        if (!element) return false;
        // Un élément qui définit déjà sa marge (classes scroll-mt-*) la gère lui-même
        const ownMargin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
        const offset = ownMargin > 0 ? ownMargin : stickyHeaderOffset();
        window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - offset);
        return true;
      });
    }

    // Premier chargement sans position mémorisée : le navigateur est déjà en haut
    if (navigationType === "POP") return;

    window.scrollTo(0, 0);
  }, [location, navigationType]);

  return null;
};

export default ScrollManager;
