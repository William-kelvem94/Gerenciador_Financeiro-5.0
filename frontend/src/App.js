import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// ...existing code from App.tsx moved to src/App.tsx...
import AiChatPopup from './AiChatPopup.js';
import './AiChatPopup.css';
function App() {
    // ...existing code...
    return (_jsx(_Fragment, { children: _jsx(AiChatPopup, {}) }));
}
export default App;
