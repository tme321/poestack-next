import { memo } from "react";

/**
 * Props for {@link SkillTreeNode}
 */
export type SkillTreeNodeProps = {
  fillColor: string,
  x: number,
  y: number,
  size: number,
  hash: string,
  tooltip: string
}

/**
 * Draw a skill tree node. 
 */
export default function SkillTreeNode({
  fillColor,
  x,
  y,
  size,
  hash,
  tooltip
}: SkillTreeNodeProps) {
  return (
    <circle
      fill={fillColor}
      cx={x}
      cy={y}
      r={size}
      data-id={hash}>
        <title>{tooltip}</title>
    </circle>
  );
}

//fill={selectedNodes && selectedNodes.has(node.hash) ? "red" : "black"}

export const MemoisedSkillTreeNode = memo(SkillTreeNode);
