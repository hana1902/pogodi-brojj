<script src="/socket.io/socket.io.js"></script>
<script>
const socket = io();

// DARK / LIGHT MODE
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode"); 
});

const attempts = document.getElementById("attempts");

// Kreiranje 6 redova po 5 polja
const totalRows = 6;
const totalCells = 5;

// Čuvamo reference na sva polja da lakše menjamo boje
let cells = [];

for (let r = 0; r < totalRows; r++) {
    let row = document.createElement("div");
    row.classList.add("guess-input");

    let rowCells = [];

    for (let i = 0; i < totalCells; i++) {
        let cell = document.createElement("input");
        cell.type = "text";
        cell.maxLength = 1;
        cell.classList.add("cell");

        // Klik za menjanje boja (lokalno)
        cell.addEventListener("click", function () {
            if (cell.classList.contains("green")) {
                cell.classList.remove("green");
            } else if (cell.classList.contains("yellow")) {
                cell.classList.remove("yellow");
                cell.classList.add("green");
            } else {
                cell.classList.add("yellow");
            }

            // Pošalji serveru promenu boje
            const cellIndex = rowCells.indexOf(cell);
            socket.emit("colorChange", { row: r, cell: cellIndex, color: cell.className });
        });

        // Dozvoli unos samo cifara i pošalji serveru
        cell.addEventListener("input", function () {
            cell.value = cell.value.replace(/[^0-9]/g, "");
            const cellIndex = rowCells.indexOf(cell);
            socket.emit("inputChange", { row: r, cell: cellIndex, value: cell.value });
        });

        row.appendChild(cell);
        rowCells.push(cell);
    }

    cells.push(rowCells);
    attempts.appendChild(row);
}

// Dugme za brisanje
const deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click", () => {
    resetCells();
    socket.emit("reset"); // Obavesti drugog igrača
});

// Funkcija za reset svih polja
function resetCells() {
    cells.forEach(row => {
        row.forEach(cell => {
            cell.value = "";
            cell.classList.remove("green", "yellow");
        });
    });
}

// Prijem događaja sa servera

// Kada drugi igrač menja boju
socket.on("colorChange", data => {
    const { row, cell, color } = data;
    const targetCell = cells[row][cell];
    targetCell.className = "cell"; // prvo ukloni sve boje
    if(color.includes("green")) targetCell.classList.add("green");
    else if(color.includes("yellow")) targetCell.classList.add("yellow");
});

// Kada drugi igrač menja unos
socket.on("inputChange", data => {
    const { row, cell, value } = data;
    const targetCell = cells[row][cell];
    targetCell.value = value;
});

// Kada drugi igrač resetuje polja
socket.on("reset", () => {
    resetCells();
});

</script>
