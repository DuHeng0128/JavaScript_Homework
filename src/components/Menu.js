import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div>
      <h1>Chinese Chess</h1>
      <ul>
        <li><Link to="/singleplayer">Single Player</Link></li>
        <li><Link to="/roomselection">Two Player</Link></li>
        <li><Link to="/skills">Skills Mode</Link></li>
      </ul>
    </div>
  );
}

export default Menu;
