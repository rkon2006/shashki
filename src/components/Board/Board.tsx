import { useCallback, useEffect, useState } from "react";
import { Cell, Piece } from "@/components";

import styles from "./Board.module.css";
import { useBoardControls } from "@/components/Board/useBoardControls";

export const Board = () => {
  const { initializeBoard, cellsMap, handleCellClick } = useBoardControls();

  useEffect(() => {
    if (!cellsMap.length) {
      initializeBoard();
    }
  }, [initializeBoard, cellsMap.length]);

  return (
    <div id="board" className={styles.board}>
      {cellsMap.map((cellsRow) => {
        return cellsRow.map((cellConfig) => (
          <Cell
            key={`${cellConfig.row}_${cellConfig.col}`}
            id={`${cellConfig.row}_${cellConfig.col}`}
            {...cellConfig}
            onClick={handleCellClick}
          />
        ));
      })}
    </div>
  );
};
