// GitHub raw link to the Excel file
const EXCEL_FILE_URL = 'https://github.com/FellSt220132/ITP-KI_Umfrage/blob/Test-Build1/src/forms-data.xlsx';

async function fetchAndDisplayExcelData() {
try {
    const response = await fetch(EXCEL_FILE_URL);
    if (!response.ok) throw new Error('Could not fetch Excel file');

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Assuming the data is in the first sheet
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

    renderTable(data);
} catch (error) {
    console.error('Error fetching or processing Excel file:', error);
    document.getElementById('table-container').innerHTML = '<p>Failed to load data.</p>';
}
}

function renderTable(data) {
if (data.length === 0) {
    document.getElementById('table-container').innerHTML = '<p>No data available.</p>';
    return;
}

const table = document.createElement('table');

data.forEach((row, index) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
    const td = document.createElement(index === 0 ? 'th' : 'td');
    td.textContent = cell || ''; // Handle empty cells
    tr.appendChild(td);
    });
    table.appendChild(tr);
});

document.getElementById('table-container').innerHTML = '';
document.getElementById('table-container').appendChild(table);
}

// Load the XLSX library and fetch data
(async function loadAndRun() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js';
    script.onload = fetchAndDisplayExcelData;
    document.head.appendChild(script);
})();
