import styles from './Piece.module.css';

type Props = {
    color: 'white' | 'black';
}
export const Piece = ({ color, onClick }: Props) => {
    return <div className={[styles.piece, styles[color]].join(' ')} onClick={onClick} />
}