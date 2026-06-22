/**
 * Client IRC Twitch via WebSocket — écoute anonyme du chat pour déclencher les modules overlay.
 *
 * Connexion anonyme (justinfan) : aucun token requis, lecture seule.
 * Reconnexion automatique avec back-off exponentiel (cap 30 s).
 */

const IRC_URL = 'wss://irc-ws.chat.twitch.tv:443';
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;

export type CommandCallback = (command: string) => void;

interface IRCHandle {
  /** Déconnecte proprement et stoppe les reconnexions. */
  disconnect: () => void;
}

/**
 * Connecte au chat Twitch et appelle `onCommand` à chaque message commençant par `!`.
 *
 * @param channel  Nom de la chaîne (sans `#`, insensible à la casse).
 * @param onCommand  Callback appelé avec la commande brute (ex. `"!dofus"`).
 * @returns  Handle de déconnexion.
 */
export function connectTwitchIRC(channel: string, onCommand: CommandCallback): IRCHandle {
  const chan = `#${channel.toLowerCase().trim()}`;
  let ws: WebSocket | null = null;
  let stopped = false;
  let retryDelay = RECONNECT_BASE_MS;
  let retryTimer: number | undefined;

  function connect() {
    if (stopped) return;
    ws = new WebSocket(IRC_URL);

    ws.onopen = () => {
      retryDelay = RECONNECT_BASE_MS; // reset backoff
      ws!.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
      ws!.send(`PASS oauth:justinfan${Math.floor(Math.random() * 999_999 + 1)}`);
      ws!.send(`NICK justinfan${Math.floor(Math.random() * 999_999 + 1)}`);
      ws!.send(`JOIN ${chan}`);
    };

    ws.onmessage = ({ data }: MessageEvent<string>) => {
      for (const line of data.split('\r\n')) {
        handleLine(line.trim(), onCommand, ws!);
      }
    };

    ws.onclose = () => {
      ws = null;
      if (stopped) return;
      retryTimer = window.setTimeout(() => {
        retryDelay = Math.min(retryDelay * 2, RECONNECT_MAX_MS);
        connect();
      }, retryDelay);
    };

    ws.onerror = () => ws?.close();
  }

  connect();

  return {
    disconnect() {
      stopped = true;
      window.clearTimeout(retryTimer);
      ws?.close();
      ws = null;
    },
  };
}

/** Parse une ligne IRC et dispatche les commandes chat ou répond aux PING. */
function handleLine(line: string, onCommand: CommandCallback, ws: WebSocket) {
  if (!line) return;

  // Heartbeat Twitch — répondre immédiatement pour rester connecté.
  if (line.startsWith('PING')) {
    ws.send(`PONG ${line.slice(5)}`);
    return;
  }

  // PRIVMSG — extrait le contenu du message.
  // Format (avec tags) : @tags :user!user@user.tmi.twitch.tv PRIVMSG #channel :message
  // Format (sans tags) :       :user!user@user.tmi.twitch.tv PRIVMSG #channel :message
  const privmsgIdx = line.indexOf('PRIVMSG');
  if (privmsgIdx === -1) return;

  const colonIdx = line.indexOf(':', privmsgIdx);
  if (colonIdx === -1) return;

  const text = line.slice(colonIdx + 1).trim();
  if (text.startsWith('!')) {
    // Extrait la commande (premier mot) : "!dofus stats" → "!dofus"
    const command = text.split(/\s+/)[0].toLowerCase();
    onCommand(command);
  }
}
