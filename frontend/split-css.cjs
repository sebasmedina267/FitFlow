const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
const stylesDir = path.join(__dirname, 'src', 'styles');
const componentsDir = path.join(stylesDir, 'components');

if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir, {recursive: true});
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, {recursive: true});

const content = fs.readFileSync(cssPath, 'utf-8');

const separator = '/* =========================================';
const blocks = content.split(separator);

let imports = new Set();
const filesToCreate = [
    'variables.css', 'layout.css', 'components/sidebar.css', 'components/header.css',
    'components/buttons.css', 'components/forms.css', 'components/cards.css', 'components/tables.css',
    'components/modal.css', 'components/badges.css', 'components/stats.css', 'components/tabs.css',
    'components/states.css', 'components/auth.css', 'components/filters.css', 'responsive.css', 'utilities.css', 'misc.css'
];

filesToCreate.forEach(f => {
    const fp = path.join(stylesDir, f);
    if(fs.existsSync(fp)) fs.writeFileSync(fp, '');
});

blocks.forEach((block, index) => {
    if (!block.trim()) return;
    
    const lines = block.split(/\r?\n/);
    const titleLine = lines[1] || '';
    
    let filename = 'misc.css';
    
    if (index === 0 || titleLine.includes('FitFlow') || titleLine.includes('Variables')) {
        filename = 'variables.css';
    } else if (titleLine.includes('Layout')) {
        filename = 'layout.css';
    } else if (titleLine.includes('Sidebar')) {
        filename = 'components/sidebar.css';
    } else if (titleLine.includes('Header')) {
        filename = 'components/header.css';
    } else if (titleLine.includes('Buttons') || titleLine.includes('Icon Button')) {
        filename = 'components/buttons.css';
    } else if (titleLine.includes('Form Elements')) {
        filename = 'components/forms.css';
    } else if (titleLine.includes('Cards')) {
        filename = 'components/cards.css';
    } else if (titleLine.includes('Tables')) {
        filename = 'components/tables.css';
    } else if (titleLine.includes('Modal') || titleLine.includes('Confirmation Dialog')) {
        filename = 'components/modal.css';
    } else if (titleLine.includes('Badges')) {
        filename = 'components/badges.css';
    } else if (titleLine.includes('Stats Cards') || titleLine.includes('Charts')) {
        filename = 'components/stats.css';
    } else if (titleLine.includes('Tabs')) {
        filename = 'components/tabs.css';
    } else if (titleLine.includes('Empty States') || titleLine.includes('Loading States')) {
        filename = 'components/states.css';
    } else if (titleLine.includes('Auth Pages')) {
        filename = 'components/auth.css';
    } else if (titleLine.includes('Filters & Search')) {
        filename = 'components/filters.css';
    } else if (titleLine.includes('Responsive')) {
        filename = 'responsive.css';
    } else if (titleLine.includes('Utilities')) {
        filename = 'utilities.css';
    }
    
    const fullBlock = (index > 0 ? separator : '') + block;
    const filePath = path.join(stylesDir, filename);
    
    fs.appendFileSync(filePath, fullBlock);
    imports.add(`@import './styles/${filename}';`);
});

const indexContent = Array.from(imports).join('\n') + '\n';
fs.writeFileSync(cssPath, indexContent);
console.log('CSS split successfully');
