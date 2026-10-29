import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// Only the product name is visible in the Storybook interface.
addons.setConfig({ theme: create({ base: "light", brandTitle: "Fleet Platform" }) });
