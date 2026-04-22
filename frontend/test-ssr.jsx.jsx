import { renderToString } from 'react-dom/server';
import React from 'react';
import Landing from './src/pages/Landing';
import { MemoryRouter } from 'react-router-dom';

try {
  console.log(renderToString(React.createElement(MemoryRouter, null, React.createElement(Landing))));
} catch (err) {
  console.error(err);
}