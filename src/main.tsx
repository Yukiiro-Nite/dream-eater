import React from 'react';
import { App } from './App';
import { createRoot } from 'react-dom/client';
import { game } from './Game';

// Setup React UI
const root = createRoot(document.getElementById('ui-container')!)
root.render((
    <React.StrictMode>
        <App />
    </React.StrictMode>
))

export default game