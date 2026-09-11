import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AppCore.jsx';
const SceneLab=React.lazy(()=>import('./SceneLab.jsx'));
class ErrorBoundary extends React.Component {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<main className="ending"><h1>The harbour paused unexpectedly.</h1><p>Your last saved visit is kept in this browser.</p><button onClick={()=>location.reload()}>Reopen the harbour</button></main>:this.props.children}
}
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><ErrorBoundary>{import.meta.env.DEV&&new URLSearchParams(location.search).has('sceneLab')?<React.Suspense fallback="Opening…"><SceneLab/></React.Suspense>:<App/>}</ErrorBoundary></React.StrictMode>);
