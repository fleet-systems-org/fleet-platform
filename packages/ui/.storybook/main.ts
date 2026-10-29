// Storybook for the Fleet Platform design system. Base: shadcn/ui (new-york) on Radix; see stories/design-system/contributing.mdx.
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const source = (path: string) => fileURLToPath(new URL(`../src/${path}`, import.meta.url));

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    { name: "@storybook/addon-docs", options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  features: { sidebarOnboardingChecklist: false, menuOnboardingChecklist: false },
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    // Resolve the package's own export paths to its sources, as the application does.
    config.resolve = {
      ...config.resolve,
      alias: [
        ...(Array.isArray(config.resolve?.alias) ? config.resolve.alias : []),
        { find: /^@fleet-platform\/ui\/components\/(.*)$/, replacement: `${source("components")}/$1` },
        { find: /^@fleet-platform\/ui\/lib\/(.*)$/, replacement: `${source("lib")}/$1` },
      ],
    };
    return config;
  },
};

export default config;
