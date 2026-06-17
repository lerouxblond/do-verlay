/** Helpers de résolution d'assets via import.meta.glob (partagés par catégorie). */

/** filename sans dossier ni extension : '.../dof-vulbis.png' → 'dof-vulbis'. */
export function baseName(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.png$/i, '');
}

export function buildMap(
  glob: Record<string, string>,
  key: (p: string) => string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [path, url] of Object.entries(glob)) out[key(path)] = url;
  return out;
}
