import { BryntumGrid } from '@bryntum/grid-react';
import { gridProps } from './GridConfig';
import './App.scss';

function App() {

    return (
        <BryntumGrid
            {...gridProps}
        />
    );
}

export default App;
