import { Link, Route, Routes } from 'react-router';
import './styles.css';
import { routes } from './routes';
import { Suspense } from 'react';

function Home() {
    return (
        <ul>
            {routes.map((example) => (
                <li key={example.path}>
                    <Link to={example.path}>{example.title}</Link>
                </li>
            ))}
        </ul>
    );
}

export default function App() {
    return (
        <div className="App">
            <Suspense>
                <Routes>
                    <Route path="/" Component={Home} />
                    {routes.map((route) => (
                        <Route key={route.path} path={route.path} Component={route.Component} />
                    ))}
                </Routes>
            </Suspense>
        </div>
    );
}
