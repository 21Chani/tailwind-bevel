import twPlugin from "tailwindcss/plugin";

// @ts-ignore
import flattenPallete from "tailwindcss/lib/util/flattenColorPalette";

import { createBackgroundGradientDirections } from "./utils/gradient";

const plugin = twPlugin(function ({ matchUtilities, matchComponents, addUtilities, theme }) {
  matchComponents(
    {
      bevel: (val) => {
        return {
          "&::before": {
            content: '""',

            "--bevel-border": val ? val : "1px",
            "--sum-offset-inset": "calc(var(--bevel-offset, 4px) + var(--bevel-border) / 2)",
            "--sub-offset-inset": "calc(100% - var(--bevel-offset, 4px) - var(--bevel-border) / 2)",

            backgroundColor: "var(--bevel-background, none)",
            backgroundImage: "var(--bevel-background-image, none)",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.1)",
            zIndex: "-1",
            borderRadius: "inherit",
            "clip-path": `polygon(
                var(--bevel-offset, 4px) 0,
                calc(100% - var(--bevel-offset, 4px)) 0,
                100% var(--bevel-offset, 4px),
                100% calc(100% - var(--bevel-offset, 4px)),
                calc(100% - var(--bevel-offset, 4px)) 100%,
                var(--bevel-offset, 4px) 100%,
                0 calc(100% - var(--bevel-offset, 4px)),
                0 var(--bevel-offset, 4px),
                var(--bevel-border) var(--sum-offset-inset),
                var(--bevel-border) var(--sub-offset-inset),
                var(--sum-offset-inset) calc(100% - var(--bevel-border)),
                var(--sub-offset-inset) calc(100% - var(--bevel-border)),
                calc(100% - var(--bevel-border)) var(--sub-offset-inset),
                calc(100% - var(--bevel-border)) calc(var(--bevel-border) / 2 + var(--bevel-offset, 4px)),
                var(--sub-offset-inset) var(--bevel-border),
                var(--sum-offset-inset) var(--bevel-border),
                var(--bevel-border) var(--sum-offset-inset),
                0 var(--bevel-offset, 4px)
              )`,
          },
          position: "relative",
        };
      },
    },
    { values: theme("borderWidth") }
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
