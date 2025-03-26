import { Route, Routes } from 'react-router';
import './styles.css';
import WithRegister from './routes/with-register/with-register';
import { RouteList } from './RouteList';

export default function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" Component={RouteList} />
                <Route path="/with-register" Component={WithRegister} />
            </Routes>
        </div>
    );
}
