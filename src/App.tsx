import React from 'react';
import LeafletMap from './components/LeafletMap';

const App: React.FC = () => {
  return (
    <div>
      <LeafletMap center={[51.505, -0.09]} zoom={5} />
    </div>
  );
};

export default App;
