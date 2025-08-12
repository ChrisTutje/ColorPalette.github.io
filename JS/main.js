import { colors } from './colors.js';

const colorSize = 50;
const colorArcLength = colorSize * 1.0;

const [validColors, invalidColors] = colors.reduce((acc, color) => {
  const degrees = parseInt(color.degrees);
  if (!isNaN(degrees) && color.degrees !== '') {
    acc[0].push(color);
  } else {
    acc[1].push(color);
  }
  return acc;
}, [[], []]);

const radius = validColors.length > 0 
  ? (colorArcLength * validColors.length) / (2 * Math.PI)
  : 0;

const circleGraph = document.getElementById('circleGraph');
const containerSize = 2 * (radius + colorSize);
circleGraph.style.width = `${containerSize}px`;
circleGraph.style.height = `${containerSize}px`;

const centerX = radius + colorSize;
const centerY = radius + colorSize;

validColors.forEach(color => {
  const el = createColorElement(color);
  const radians = (parseFloat(color.degrees) - 90) * (Math.PI / 180);
  el.style.left = `${centerX + radius * Math.cos(radians)}px`;
  el.style.top = `${centerY + radius * Math.sin(radians)}px`;
  circleGraph.appendChild(el);
});

invalidColors.forEach(color => {
  const el = createColorElement(color);
  el.style.left = `${centerX}px`;
  el.style.top = `${centerY}px`;
  el.style.transform = 'translate(-50%, -50%)'; 
  el.style.zIndex = '10'; 
  circleGraph.appendChild(el);
});

function createColorElement(color) {
  const el = document.createElement('div');
  el.className = 'color';
  el.textContent = color.name || color.label;
  el.style.backgroundColor = color.hexcode || '#444';
  el.style.color = color.complimentaryColor || '#ffffff';
  el.style.width = `${colorSize}px`;
  el.style.height = `${colorSize}px`;
  el.style.position = 'absolute';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.textAlign = 'center';
  
  return el;
}
