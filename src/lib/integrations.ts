const STORAGE_KEY = "postcraft_integrations";

export interface SlackConfig {
  connected: boolean;
  channelName: string;
  botName: string;
  autoPost: boolean;
}

export interface DiscordConfig {
  connected: boolean;
  webhookUrl: string;
  channelName: string;
  autoPost: boolean;
}

export interface ZapierConfig {
  waitlistEmail: string;
  joined: boolean;
}

export interface IntegrationsConfig {
  slack: SlackConfig;
  discord: DiscordConfig;
  zapier: ZapierConfig;
}

const defaultConfig: IntegrationsConfig = {
  slack: {
    connected: false,
    channelName: "",
    botName: "PostCraft Bot",
    autoPost: false,
  },
  discord: {
    connected: false,
    webhookUrl: "",
    channelName: "",
    autoPost: false,
  },
  zapier: {
    waitlistEmail: "",
    joined: false,
  },
};

export function getIntegrationsConfig(): IntegrationsConfig {
  if (typeof window === "undefined") return defaultConfig;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultConfig;
    return { ...defaultConfig, ...JSON.parse(stored) };
  } catch {
    return defaultConfig;
  }
}

export function saveIntegrationsConfig(config: IntegrationsConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent("integrations-changed"));
}

export function updateSlackConfig(updates: Partial<SlackConfig>): IntegrationsConfig {
  const config = getIntegrationsConfig();
  config.slack = { ...config.slack, ...updates };
  saveIntegrationsConfig(config);
  return config;
}

export function updateDiscordConfig(updates: Partial<DiscordConfig>): IntegrationsConfig {
  const config = getIntegrationsConfig();
  config.discord = { ...config.discord, ...updates };
  saveIntegrationsConfig(config);
  return config;
}

export function updateZapierConfig(updates: Partial<ZapierConfig>): IntegrationsConfig {
  const config = getIntegrationsConfig();
  config.zapier = { ...config.zapier, ...updates };
  saveIntegrationsConfig(config);
  return config;
}
