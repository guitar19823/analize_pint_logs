import { ITree, RowType, Node } from "./types";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateCells = (
  id: number,
  depth: number,
  rowType: RowType
): string[] => {
  return [
    `Type: ${rowType}`,
    `ID: ${id}`,
    `Depth: ${depth}`,
    `Expanded: ${depth < 5}`,
    `Parent ID: ${Math.floor(id / 10)}`,
    `Level ${depth} Item 1`,
    `Level ${depth} Item 2`,
    `Data A (id=${id})`,
    `Data B (depth=${depth})`,
    `Meta: ${rowType}_${id}`,
  ];
};

const createNode = (depth: number, id: number, rowType: RowType): Node => {
  let children: Node[] | undefined = undefined;

  if (rowType === RowType.BODY && depth < 6) {
    const childCount = randomInt(1, 4);

    children = Array.from({ length: childCount }, (_, idx) =>
      createNode(depth + 1, id * 10 + idx + 1, RowType.BODY)
    );
  }

  return {
    cells: generateCells(id, depth, rowType),
    param: {
      type: rowType,
      id,
      isExpanded: depth < 5,
    },
    children,
  };
};

export const randomTree: ITree = {
  root: [
    createNode(0, 1000, RowType.HEADER),
    ...Array.from({ length: 8 }, (_, idx) =>
      createNode(0, idx + 1, RowType.BODY)
    ),
    createNode(0, 2000, RowType.FOOTER),
  ],
};
