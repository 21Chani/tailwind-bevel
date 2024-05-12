import twPlugin from "tailwindcss/plugin";

// @ts-ignore
import flattenPallete from "tailwindcss/lib/util/flattenColorPalette";

import { createBackgroundGradientDirections } from "./utils/gradient";
import { BevelFactory } from "./utils/factory/BevelFactory";

const plugin = twPlugin(function ({ matchUtilities, matchComponents, addUtilities, theme }) {
  matchComponents(
    {
      "b-border": (val) => {
        const fac = new BevelFactory("bevel", "4px");
        const path = fac.generateShape(true).toClipPath();

        return {
          "&::before": {
            content: '""',
            "--bevel-border": val ? val : "1px",

            backgroundColor: "var(--bevel-background, none)",
            backgroundImage: "var(--bevel-background-image, none)",
            position: "absolute",
            inset: "0",
            zIndex: "-1",
            transition: "inherit",
            borderRadius: "inherit",
            "clip-path": path,
          },
          position: "relative",
        };
      },
    },
    { values: theme("borderWidth") }
  );

  matchComponents(
    {
      bevel: (val) => {
        const fac = new BevelFactory("bevel", "4px");
        const path = fac.generateShape().toClipPath();

        return {
          "--bevel-offset": val,
          "clip-path": path,
        };
      },
    },
    {
      values: theme("width"),
    }
  );

  matchUtilities(
    { "bevel-color": (value) => ({ "--bevel-background": value }) },
    { values: flattenPallete(theme("colors")) }
  );
  matchUtilities({ "bevel-offset": (value) => ({ "--bevel-offset": value }) }, { values: theme("width") });

  //   Beven gradients
  const bevelGradientDirections = createBackgroundGradientDirections("bevel");
  addUtilities(bevelGradientDirections);

  matchUtilities(
    {
      "bevel-to": (value) => {
        return {
          "--tw-bevel-gradient-to": `${value} 100%`,
        };
      },
    },
    { values: flattenPallete(theme("colors")) }
  );

  matchUtilities(
    {
      "bevel-from": (value) => {
        return {
          "--tw-bevel-gradient-from": `${value} 0%`,
          "--tw-bevel-gradient-stops": "var(--tw-bevel-gradient-from), var(--tw-bevel-gradient-to)",
        };
      },
    },
    { values: flattenPallete(theme("colors")) }
  );
});

export default plugin;
