import { useContext } from 'react';
import { SessionContext } from '../../App';

export default function Header() {
    const session = useContext(SessionContext);
    return (
        <header>
            header
        </header>
    )
}