import React, { useEffect } from "react";
import {
  getTwoDimensionalGrid,
  formGrid,
  randomSign,
  randomFloat,
} from "@fdoflorenzano/flowers";

const getRandomPath = (width, height, rowR, colR) => {
  console.log({ rowR });
  // const sweep = () =>
  //   randomFloat(0, 1) > Math.hypot(rowR - 0.5, colR - 0.5) * 2 ? 1 : 0;
  const sweep = () => (randomFloat(0, 1) > 0.5 ? 1 : 0);
  return `M  ${width / 2} ${0}
  A ${width / 2} ${height / 2} ${0}, ${0}, ${sweep()}, ${width} ${height / 2}
  A ${width / 2} ${height / 2} ${0}, ${0}, ${sweep()},  ${width / 2} ${height}
  A ${width / 2} ${height / 2} ${0}, ${0}, ${sweep()}, ${0} ${height / 2}
  A ${width / 2} ${height / 2} ${0}, ${0}, ${sweep()}, ${width / 2} ${0}
  `;
};

const PIXELS_PER_MM = 3.78;

const baseWidth = 100;
const baseHeight = 100;

const [width, height] = [baseWidth, baseHeight].map((d) => d * PIXELS_PER_MM);

export const handler = ({ inputs, mechanic }) => {
  const { marginTransform, getGridPosition, sketchDimensions } = formGrid({
    ...inputs,
    width,
    height,
  });

  const paths = getTwoDimensionalGrid(inputs).map((row) =>
    row.map((o) => ({
      ...o,
      group: randomFloat(0, 1) > 0.3 ? "1" : "2",
      path: getRandomPath(
        sketchDimensions[0],
        sketchDimensions[1],
        o.row / inputs.rows,
        o.col / inputs.cols
      ),
    }))
  );

  const svgDimension = !inputs.turn
    ? { width: `${baseWidth}mm`, height: `${baseHeight}mm` }
    : { width: `${baseHeight}mm`, height: `${baseWidth}mm` };

  useEffect(() => {
    mechanic.done();
  }, []);

  return (
    <svg {...svgDimension}>
      <g transform={inputs.turn ? `translate(${height} 0) rotate(90)` : ""}>
        <g {...marginTransform}>
          <g id="group1">
            {paths.map((row) =>
              row
                .filter((o) => o.group === "1")
                .map((o) => (
                  <g {...getGridPosition(o.col, o.row)}>
                    <path d={o.path} fill="black" stroke="black" />
                  </g>
                ))
            )}
          </g>
          <g id="group2">
            {paths.map((row) =>
              row
                .filter((o) => o.group === "2")
                .map((o) => (
                  <g {...getGridPosition(o.col, o.row)}>
                    <path d={o.path} fill="red" stroke="red" />
                  </g>
                ))
            )}
          </g>
        </g>
      </g>
    </svg>
  );
};

export const inputs = {
  turn: {
    type: "boolean",
    default: false,
  },
  marginVertical: {
    type: "number",
    default: 0.2,
    min: 0,
    max: 0.4,
    step: 0.01,
  },
  marginHorizontal: {
    type: "number",
    default: 0.2,
    min: 0,
    max: 0.4,
    step: 0.01,
  },
  gapVertical: {
    type: "number",
    default: 0.2,
    min: 0,
    max: 1,
    step: 0.01,
  },
  gapHorizontal: {
    type: "number",
    default: 0.2,
    min: 0,
    max: 1,
    step: 0.01,
  },
  showGrid: {
    type: "boolean",
    default: true,
  },
  cols: {
    type: "number",
    default: 3,
    min: 1,
    step: 1,
  },
  rows: {
    type: "number",
    default: 3,
    min: 1,
    step: 1,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
  optimize: false,
};
