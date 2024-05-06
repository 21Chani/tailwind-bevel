const directions = ["top", "top right", "right", "bottom right", "bottom", "bottom left", "left", "top left"] as const;

function getDirectName(direction: (typeof directions)[number]) {
  return direction.split(" ").reduce((acc, curr) => `${acc}${curr.charAt(0)}`, "");
}

export function createBackgroundGradientDirections(label: string) {
  return directions.map((direction) => {
    return {
      [`.${label}-gradient-to-${getDirectName(direction)}`]: {
        [`--${label}-background-image`]: `linear-gradient(to ${direction}, var(--tw-${label}-gradient-stops))`,
      },
    };
  });
}

export function createFromGradientComponent(color: string) {
  return {
    [`--tw-gradient-stops`]: `var(--tw-gradient-from, ${color}), var(--tw-gradient-to, ${color})`,
  };
}

export function createToGradientComponent(label: string) {
  return {
    [`.tw-${label}-gradient-to`]: {
      [`--tw-${label}-gradient-to`]: "var(--tw-gradient-color)",
    },
  };
}
