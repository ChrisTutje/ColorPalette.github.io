import { saturatedColors } from './colors.js';

const filterContainer = document.getElementById('color-filters');
const fieldset = filterContainer.querySelector('fieldset');

const colorSize = 50;
const colorArcLength = colorSize * 1.0;

const [validColors, invalidColors] = saturatedColors.reduce((acc, color) => {
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
  el.innerHTML = `<span class="color-name">${color.name || 'Unnamed'}</span> <span class="color-hex">${color.hexcode}</span>`;
  el.style.backgroundColor = color.hexcode || '#444';
  el.style.color = `hsl(${(parseFloat(color.degrees) + 180) % 360}, 100%, 70%)` || '#F0F0F0';
  el.style.width = `${colorSize}px`;
  el.style.height = `${colorSize}px`;
  el.style.position = 'absolute';
  el.style.display = 'flex';
  el.style.flexDirection = 'column'; 
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.textAlign = 'center';
  
  return el;
}

const allCategories = [...new Set(saturatedColors.flatMap(color => color.categories || []))];
let selectedCategories = [...allCategories]; 

allCategories.forEach(category => {
  const div = document.createElement('div');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = `filter-${category}`;
  input.checked = true;
  input.addEventListener('change', updateFilters);

  const label = document.createElement('label');
  label.htmlFor = input.id;
  label.textContent = category;

  div.appendChild(input);
  div.appendChild(label);
  fieldset.appendChild(div);
});

function updateFilters() {
  selectedCategories = allCategories.filter(cat => 
    document.getElementById(`filter-${cat}`).checked
  );
  renderColorWheel();
}

function renderColorWheel() {
  circleGraph.innerHTML = '';
  
  const [validColors, invalidColors] = saturatedColors.reduce((acc, color) => {
    const hasValidDegree = !isNaN(parseFloat(color.degrees)) && color.degrees !== '';
    const hasValidCategory = color.categories?.some(cat => selectedCategories.includes(cat));
    
    if (hasValidDegree && (selectedCategories.length === 0 || hasValidCategory)) {
      acc[0].push(color);
    } else if (!hasValidDegree && (selectedCategories.length === 0 || hasValidCategory)) {
      acc[1].push(color);
    }
    return acc;
  }, [[], []]);

  const currentRadius = validColors.length > 0 
    ? (colorArcLength * validColors.length) / (2 * Math.PI)
    : 0;

  const currentCenter = currentRadius + colorSize;
  circleGraph.style.width = `${2 * (currentRadius + colorSize)}px`;
  circleGraph.style.height = `${2 * (currentRadius + colorSize)}px`;

  validColors.forEach(color => {
    const el = createColorElement(color);
    const radians = (parseFloat(color.degrees) - 90) * (Math.PI / 180);
    el.style.left = `${currentCenter + currentRadius * Math.cos(radians)}px`;
    el.style.top = `${currentCenter + currentRadius * Math.sin(radians)}px`;
    circleGraph.appendChild(el);
  });

  invalidColors.forEach(color => {
    const el = createColorElement(color);
    el.style.left = `${currentCenter}px`;
    el.style.top = `${currentCenter}px`;
    el.style.transform = 'translate(-50%, -50%)';
    el.style.zIndex = '10';
    circleGraph.appendChild(el);
  });
}

renderColorWheel();




