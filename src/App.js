import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import SinglePlayer from './components/SinglePlayer';
import TwoPlayer from './components/TwoPlayer';
import SkillMode from './components/SkillMode';
import RoomSelection from './components/RoomSelection'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/singleplayer" element={<SinglePlayer />} />
        <Route path="/roomselection" element={<RoomSelection />} />
        <Route path="/skills" element={<SkillMode />} />
        <Route path="/twoplayer" element={<TwoPlayer/>}/>
      </Routes>
    </Router>
  );
}

export default App;

