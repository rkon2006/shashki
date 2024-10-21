import styles from "./Cell.module.css";
import { Piece } from "@/components";

type CellConfigType = {
  row: number;
  col: number;
  color: "white" | "black";
  piece: "white" | "black" | null;
  hasWhitePiece: boolean;
  hasBlackPiece: boolean;
};
type Props = {
  id: string;
  row: number;
  col: number;
  color: "white" | "black";
  piece: "white" | "black" | null;
  hasBlackPiece: boolean;
  hasWhitePiece: boolean;
  onClick: (cellConfig: CellConfigType) => void;
};
export const Cell = (props: Props) => {
  const { id, onClick, color, row, col, piece, hasBlackPiece, hasWhitePiece } =
    props;
  const isWhite = color === "white";

  return (
    <div
      id={id}
      className={[styles.cell, isWhite ? styles.white : styles.black].join(" ")}
      onClick={() =>
        onClick({
          row,
          col,
          color,
          piece,
          hasWhitePiece,
          hasBlackPiece,
        })
      }
    >
      {piece && <Piece color={piece} />}
    </div>
  );
};
