import { Cell } from "@/components";
import { useCallback, useState } from "react";

type CellState = {
  row: number;
  col: number;
  color: "white" | "black";
  king: boolean;
  piece: "white" | "black" | null;
  hasWhitePiece: boolean;
  hasBlackPiece: boolean;
};
export const useBoardControls = () => {
  const [turn, setTurn] = useState("white");
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
    color: "white" | "black"; // cell color
    piece: "white" | "black"; // piece color
    king: boolean;
  } | null>(null);
  const [cellsMap, setCellsMap] = useState<CellState[][]>([]);

  const handleCellClick = useCallback(
    (cell) => {
      const { row, col, piece, color } = cell;

      console.log("bbb handleCellClick 111", { cell, selectedPiece });

      if (selectedPiece) {
        console.log("bbb handleCellClick 222", cell);
        const isAllowed = canMove(cell);

        console.log("bbb handleCellClick 333", { cell, isAllowed });

        if (isAllowed) {
          console.log("bbb handleCellClick 444", cell);
          movePiece(cell);
          setSelectedPiece(null);
        }
      } else {
        console.log("bbb handleCellClick 555", { cell, color, turn });
        if (piece && piece === turn) {
          console.log("bbb handleCellClick 666", { cell, color, turn });
          setSelectedPiece({
            row,
            col,
            color,
            king: false,
            piece,
          });
        }
      }
    },
    [selectedPiece, setSelectedPiece, turn],
  );

  const initializeBoard = useCallback(() => {
    const rows = 8;
    const cols = 8;
    const result = [];

    for (let row = 0; row < rows; row++) {
      if (!result[row]) {
        result[row] = [];
      }

      for (let col = 0; col < cols; col++) {
        const isWhite = (row + col) % 2 === 0;
        const hasBlackPiece = row < 3 && !isWhite;
        const hasWhitePiece = row > 4 && !isWhite;

        result[row][col] = {
          row,
          col,
          color: isWhite ? "white" : "black",
          piece: hasBlackPiece ? "black" : hasWhitePiece ? "white" : null,
          hasWhitePiece,
          hasBlackPiece,
        };
      }
    }

    setCellsMap(result);

    return result;
  }, [setCellsMap]);

  const canMove = useCallback(
    // Проверка возможности хода на целевую клетку
    (targetCell) => {
      if (!selectedPiece) return;

      // Получаем координаты начальной клетки (где стоит выбранная шашка)
      const startRow = selectedPiece.row;
      const startCol = selectedPiece.col;

      // Получаем координаты целевой клетки (куда хотим переместить шашку)
      // Преобразуем строковое значение номера ряда в целое число
      const endRow = targetCell.row;
      // Преобразуем строковое значение номера колонки в целое число
      const endCol = targetCell.col;

      // Определяем направление хода (белые шашки идут вверх, чёрные — вниз)
      const direction = selectedPiece.piece === "white" ? -1 : 1;

      // Проверяем, является ли шашка дамкой
      const isKing = selectedPiece.king;

      // Если целевая клетка уже занята другой шашкой, ход невозможен
      if (targetCell.piece) {
        // Целевая клетка занята
        return false;
      }

      // Проверяем возможность хода для обычной шашки или дамки
      if (!isKing) {
        // Если шашка не дамка, проверяем возможность хода для обычной шашки
        return canMoveRegular({
          selectedPiece,
          startRow,
          startCol,
          endRow,
          endCol,
          direction,
        });
      } // else {
      //   // Если шашка дамка, проверяем возможность хода для дамки
      //   return canMoveKing(piece, startRow, startCol, endRow, endCol);
      // }
    },
    [selectedPiece],
  );

  const canMoveRegular = useCallback(
    ({ selectedPiece, startRow, startCol, endRow, endCol, direction }) => {
      // Проверка на обычный ход (одна клетка по диагонали)
      if (
        Math.abs(endRow - startRow) === 1 &&
        Math.abs(endCol - startCol) === 1 &&
        endRow - startRow === direction
      ) {
        // Если ход соответствует правилам обычного хода
        return true;
      }

      // Проверка на ход с захватом (две клетки по диагонали)
      if (
        Math.abs(endRow - startRow) === 2 &&
        Math.abs(endCol - startCol) === 2 &&
        endRow - startRow === 2 * direction
      ) {
        // Находим координаты средней клетки (между начальной и целевой)
        const middleRow = (startRow + endRow) / 2;
        const middleCol = (startCol + endCol) / 2;

        // Находим среднюю клетку по координатам
        const middleCell = cellsMap[middleRow][middleCol];

        // Проверяем, есть ли в средней клетке шашка и если есть, то принадлежит ли она противнику
        // Ищем шашку в средней клетке
        const middlePiece = middleCell.piece;
        const hasOpponentsPiece = selectedPiece.piece !== middlePiece;

        // Проверяем, занята ли средняя клетка противником
        if (middlePiece && hasOpponentsPiece) {
          // Если допустим ход с захватом
          return true;
        }
      }

      // Невозможный ход
      return false;
    },
    [cellsMap],
  );

  const movePiece = useCallback(
    (targetCell) => {
      if (!selectedPiece) return;

      // Получаем начальную строку, где находилась шашка
      const startRow = selectedPiece.row;

      // Получаем начальный столбец, где находилась шашка
      const startCol = selectedPiece.col;

      // Получаем конечную строку, куда шашка будет перемещена
      const endRow = targetCell.row;

      // Получаем конечный столбец, куда шашка будет перемещена
      const endCol = targetCell.col;

      const nextCellsMap = [...cellsMap];

      // Проверяем, осуществляется ли захват (перемещение на две клетки)
      if (
        Math.abs(endRow - startRow) === 2 &&
        Math.abs(endCol - startCol) === 2
      ) {
        // Вычисляем координаты серединной клетки между начальной и конечной
        const middleRow = (startRow + endRow) / 2;

        // Вычисляем координаты серединного столбца между начальным и конечным
        const middleCol = (startCol + endCol) / 2;

        // Получаем доступ к серединной клетке
        const middleCell = cellsMap[middleRow][middleCol];

        // Проверяем, есть ли шашка в серединной клетке
        const middlePiece = middleCell.piece;

        // Удаляем шашку, если она там есть
        if (middlePiece) {
          nextCellsMap[middleRow][middleCol].piece = null;
        }
      }

      // Перемещаем шашку в целевую клетку
      // targetCell.appendChild(piece);
      nextCellsMap[targetCell.row][targetCell.col].piece = selectedPiece.piece;
      nextCellsMap[selectedPiece.row][selectedPiece.col].piece = null;

      // Проверяем, достигла ли шашка последнего ряда для превращения в дамку
      if (
        (selectedPiece.piece === "white" && endRow === 0) ||
        (selectedPiece.piece === "black" && endRow === 7)
      ) {
        // Отмечаем шашку как дамку
        nextCellsMap[targetCell.row][targetCell.col].king = true;
      }

      //  Переход хода к следующему игроку
      setTurn((turn) => (turn === "white" ? "black" : "white"));

      // Сбрасываем выбор текущей шашки
      setSelectedPiece(null);
      setCellsMap(nextCellsMap);

      // Вызываем функцию для проверки состояния игры после хода
      checkGameState();
    },
    [selectedPiece, cellsMap, setSelectedPiece, setTurn, setCellsMap],
  );

  const checkGameState = () => {
    console.log("bbb checkGameState function");
  };

  return {
    cellsMap,
    initializeBoard,
    handleCellClick,
    turn,
    setTurn,
    selectedPiece,
    setSelectedPiece,
  };
};
