import Main from "./pages/Main";
import { Routes, Route } from 'react-router-dom'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
        </Routes>
    );
};

export default App;