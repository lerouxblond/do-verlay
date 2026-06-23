/**
 * Image de référence de l'éditeur (capture de l'interface Dofus du streamer). Stockée en
 * localStorage SOUS UNE CLÉ DÉDIÉE par disposition — volontairement HORS de l'état synchronisé :
 * volumineuse, utile uniquement à l'édition, jamais diffusée à l'overlay ni via le WebSocket.
 */
import { useCallback, useEffect, useState } from 'react';
import { EDITOR_BG_PREFIX } from '@shared/constants';

const key = (layoutId: string) => `${EDITOR_BG_PREFIX}${layoutId}`;

const read = (layoutId: string): string | null => {
  try {
    return localStorage.getItem(key(layoutId));
  } catch {
    return null;
  }
};

export interface EditorBackground {
  /** Data-URL de l'image de fond, ou null. */
  src: string | null;
  /** Charge un fichier image en fond (renvoie une erreur si quota dépassé). */
  setFromFile: (file: File) => Promise<void>;
  clear: () => void;
}

export function useEditorBackground(layoutId: string): EditorBackground {
  const [src, setSrc] = useState<string | null>(() => read(layoutId));

  // Rebascule sur l'image de la disposition courante quand on change de disposition.
  useEffect(() => {
    setSrc(read(layoutId));
  }, [layoutId]);

  const setFromFile = useCallback(
    (file: File) =>
      new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
        reader.onload = () => {
          const dataUrl = String(reader.result);
          try {
            localStorage.setItem(key(layoutId), dataUrl);
            setSrc(dataUrl);
            resolve();
          } catch {
            reject(new Error('Image trop lourde pour le stockage local — réduis sa résolution.'));
          }
        };
        reader.readAsDataURL(file);
      }),
    [layoutId],
  );

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key(layoutId));
    } catch {
      /* ignore */
    }
    setSrc(null);
  }, [layoutId]);

  return { src, setFromFile, clear };
}
