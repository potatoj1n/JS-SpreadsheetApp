// 스프레드시트 컨테이너와 내보내기 버튼 등을 선택
const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");

// 스프레드시트의 행과 열의 갯수를 상수로 지정
const ROWS = 10;
const COLS = 10;
// 스프레드시트 데이터를 저장할 배열 및 알파벳 배열을 정의
const spreadsheet = [];
const alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]

// 각 셀을 나타내는 클래스 정의
class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}
// 내보내기 버튼 클릭 시 CSV로 내보내기 기능
exportBtn.onclick = function (e) {
    let csv = "";
    for (let i = 0; i < spreadsheet.length; i++) {
        if (i === 0) continue;
        csv +=
            spreadsheet[i]
                .filter(item => !item.isHeader)
                .map(item => item.data)
                .join(',') + "\r\n";
    }

    const csvObj = new Blob([csv]);
    console.log('csvObj', csvObj);

    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvUrl', csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();
}

initSpreadsheet();
// 스프레드시트 초기화 함수
function initSpreadsheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++) {
            // 각 셀의 초기 데이터 설정
            // 첫 번째 열은 헤더로 숫자를 넣고 비활성화
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            // 모든 row 첫 번째 컬럼에 숫자 넣기
            if (j === 0) {
                 // 첫 번째 행은 알파벳으로 헤더를 만들고 비활성화
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            if (i === 0) {
                cellData = alphabets[j - 1];
                isHeader = true;
                disabled = true;
            }

            // 첫 번째 row의 컬럼은 "";
            if (!cellData) {
                // 데이터가 없으면 빈 문자열로 설정
                cellData = "";
            }

            const rowName = i;
            const columnName = alphabets[j - 1];
            // Cell 클래스를 이용하여 셀 객체 생성
            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    // console.log(spreadsheet);
}

// 각 셀을 나타내는 엘리먼트를 생성하는 함수
function createCellEl(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

    return cellEl;
}
// 셀 데이터가 변경될 때 호출되는 이벤트 핸들러
function handleOnChange(data, cell) {
    cell.data = data;
}
// 셀 클릭 시 활성화 및 상태 변경을 처리하는 이벤트 핸들러
function handleCellClick(cell) {
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');
    // console.log('clicked cell', columnHeaderEl, rowHeaderEl);
    document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName;
}
// 헤더의 활성화 상태를 모두 제거하는 함수
function clearHeaderActiveStates() {
    const headers = document.querySelectorAll('.header');

    headers.forEach((header) => {
        header.classList.remove('active');
    })
}

// 행과 열 정보를 이용하여 해당 셀의 엘리먼트를 가져오는 함수
function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
}

function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";

        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}