import { ReactFlowProvider } from 'reactflow';
import JourneyBuilder from './components/JourneyBuilder/JourneyBuilder';
import './App.css';

function App() {
  return (
    <ReactFlowProvider>
      <div className="app-container">
        <JourneyBuilder />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
