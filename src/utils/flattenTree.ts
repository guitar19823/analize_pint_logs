import { Node } from "../types";

export const flattenTree = (tree: Node[]): Node[] => {
  const result: Node[] = [];

  const traverse = (nodes: Node[], depth: number) => {
    for (const node of nodes) {
      node.depth = depth;
      result.push(node);

      if (node.isExpanded && node.children.length > 0) {
        traverse(node.children, depth + 1);
      }
    }
  };

  traverse(tree, 0);

  return result;
};
