type BevelShapeField = "offset" | "shift" | `${number}%` | `${number}`;
type HollowBevelShapeField = "offsetInset" | "shiftInset" | `${number}%` | `${number}`;

const hollowNamesMap = {
  offset: "offsetInset",
  shift: "shiftInset",
} as Record<string, string>;

export class BevelFactory {
  public static BEVEL_SHAPE: Array<[BevelShapeField, BevelShapeField]> = [
    ["offset", "0"],
    ["shift", "0"],
    ["100%", "offset"],
    ["100%", "shift"],
  ];

  private _variable: string = "bevel";

  private currentShape: Array<Array<string>> = [];

  constructor(offsetVar: string, private defaultOffset = "4px") {
    this._variable = offsetVar;
  }

  public generateShape(hollow = false) {
    const fullShape = BevelFactory.getFullBevelShape();
    const normalShape = fullShape.map((shape) => this.mapBevelShape(shape));
    this.currentShape = Array.from(normalShape);

    if (hollow) {
      const rawShape = BevelFactory.newHorizontalShapeReverse().map((e) => e.map((e) => hollowNamesMap[e] ?? e));
      const hollowShape = this.mapHollowShape(rawShape as Array<[HollowBevelShapeField, HollowBevelShapeField]>);

      {
        this.currentShape.push(...hollowShape);

        // Closing the path, for the hollow shape, we need to close calling the first point we init
        // and the last point of normal shape
        this.currentShape.push(hollowShape[0]);
        this.currentShape.push(normalShape[normalShape.length - 1]);
      }
    }

    return this;
  }

  public toClipPath() {
    return `polygon(${this.currentShape.map((shape) => shape.join(" ")).join(", ")})`;
  }

  public static newShape() {
    return Array.from(BevelFactory.BEVEL_SHAPE);
  }

  private getCssVariables() {
    const offset = `var(--${this.offsetVar}-offset, ${this.defaultOffset})`;
    const shift = `calc(100% - ${offset})`;

    const border = `var(--${this.offsetVar}-border)`;

    const shiftInset = `calc(${shift} - ${border} / 2)`;
    const offsetInset = `calc(${offset} + ${border} / 2)`;

    return {
      offset,
      shift,
      border,
      shiftInset,
      offsetInset,
    };
  }

  private mapHollowShape(shape: Array<[HollowBevelShapeField, HollowBevelShapeField]>) {
    const variables = this.getCssVariables();
    const first_half = shape.map((r) =>
      r.map((e) => {
        const fromVar = (variables as Record<string, string>)[e];
        if (fromVar) return fromVar;

        if (e == "100%") return `calc(100% - ${variables.border})`;

        return variables.border;
      })
    );

    const second_half = first_half.map((e) => Array.from(e).reverse()).reverse();

    return first_half.concat(second_half as Array<[HollowBevelShapeField, HollowBevelShapeField]>);
  }

  private mapBevelShape(shape: [BevelShapeField, BevelShapeField]) {
    const variables = this.getCssVariables() as Record<string, string>;
    return shape.map((e) => variables[e] ?? e);
  }

  /**
   * Getters and Setters
   */
  get offsetVar(): string {
    return this._variable;
  }

  set offsetVar(offsetVar: string) {
    if (!offsetVar.startsWith("--")) throw new Error("Invalid variable name, must start with '--'");
    this._variable = offsetVar;
  }

  /**
   * Static Utilities
   */
  public static getFullBevelShape() {
    const first_half = this.newShape();

    const second_half = this.newShape()
      .map((e) => Array.from(e).reverse())
      .reverse();

    return first_half.concat(second_half as Array<[BevelShapeField, BevelShapeField]>);
  }

  public static newHorizontalShapeReverse() {
    const shape = this.newShape();
    return shape.map((e) => Array.from(e).reverse());
  }
}
