import { FC } from "react";
import { InlineMath, BlockMath } from "react-katex";

interface TeXProps {
  math: string;
  block?: boolean;
}

export const TeX: FC<TeXProps> = ({ math, block = false }) => {
  try {
    return block ? <BlockMath math={math} /> : <InlineMath math={math} />;
  } catch (error) {
    console.error("LaTeX parsing error:", error);
    return <span className="text-red-500">LaTeX Error: {math}</span>;
  }
};
