import tablesData from "./tables.js";
import { menuData } from './menuData.js';

// Initialize table status
function initializeTables() {
    for (let i = 1; i <= 6; i++) {
        const tableElement = document.getElementById(`table${i}`);
        const statusElement = document.getElementById(`para${i}`);
        const statusIndicator = tableElement.querySelector('.table-status');
        
        if (tablesData[i-1].bill > 0) {
            statusElement.textContent = `Rs.${tablesData[i-1].bill} | Items: ${tablesData[i-1].itemCount}`;
            statusIndicator.className = 'table-status status-occupied';
        } else {
            statusElement.textContent = 'Available';
            statusIndicator.className = 'table-status status-available';
        }
    }
}

// Initialize tables on load
initializeTables();

// Create menu items with categories
function createMenu() {
    const menuPane = document.querySelector('#menuItems');
    menuPane.innerHTML = ''; // Clear existing content
    
    // Create a container for all items
    const allItemsContainer = document.createElement('div');
    allItemsContainer.className = 'menu-category';
    allItemsContainer.dataset.category = 'all';
    allItemsContainer.style.display = 'block';
    
    // Add all items to the container
    menuData.forEach(data => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.draggable = true;
        menuItem.style.display = 'flex'; // Ensure all items are visible by default
        menuItem.ondragstart = function (event) {
            event.dataTransfer.setData("text", JSON.stringify(data));
        }

        menuItem.innerHTML = `
            <div class="menu-item-info">
                <div class="menu-item-name">${data.itemName}</div>
                <div class="menu-item-price">₹${data.price}</div>
            </div>
            <span class="menu-item-course">${data.course}</span>
        `;

        allItemsContainer.appendChild(menuItem);
    });
    
    menuPane.appendChild(allItemsContainer);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Create menu
    createMenu();
    
    // Set "All" category as active by default
    const allButton = document.querySelector('.category-btn[data-category="all"]');
    if (allButton) {
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === 'all') {
                btn.classList.add('active');
            }
        });
    }
    
    // Show all items by default
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.style.display = 'flex';
    });
    
    // Initialize tables
    initializeTables();
    
    // Initialize drag and drop
    initializeDragAndDrop();
    
    // Initialize category filters
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const selectedCategory = button.dataset.category;
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                const itemCategory = item.querySelector('.menu-item-course').textContent;
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// Search functionality for menu
const searchMenuInput = document.getElementById('searchMenu');
if (searchMenuInput) {
    searchMenuInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const categories = document.querySelectorAll('.menu-category');
        
        categories.forEach(category => {
            const items = category.querySelectorAll('.menu-item');
            let hasVisibleItems = false;
            
            items.forEach(item => {
                const itemName = item.querySelector('.menu-item-name').textContent.toLowerCase();
                const course = item.querySelector('.menu-item-course').textContent.toLowerCase();
                
                if (itemName.includes(searchTerm) || course.includes(searchTerm)) {
                    item.style.display = '';
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide category based on visible items
            category.style.display = hasVisibleItems ? 'block' : 'none';
        });
    });
}

// Table click handlers
for (let i = 1; i <= 6; i++) {
    const table = document.getElementById(`table${i}`);
    const tableName = `Table ${i}`;
    
    table.addEventListener("click", () => createModalVar(table, tableName));
    table.ondragover = (event) => event.preventDefault();
    table.ondrop = (event) => {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData("text"));
        const key = `Table-${i}`;
        
        if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, JSON.stringify([[data.itemName, data.price, 1]]));
        } else {
            const orders = JSON.parse(sessionStorage.getItem(key));
            const existingItem = orders.find(order => order[0] === data.itemName);
            
            if (existingItem) {
                existingItem[2]++;
            } else {
                orders.push([data.itemName, data.price, 1]);
            }
            
            sessionStorage.setItem(key, JSON.stringify(orders));
        }
        
        updateTableStatus(i);
    };
}

function updateTableStatus(tableNumber) {
    const key = `Table-${tableNumber}`;
    const statusElement = document.getElementById(`para${tableNumber}`);
    const statusIndicator = document.querySelector(`#table${tableNumber} .table-status`);
    
    if (sessionStorage.getItem(key)) {
        const orders = JSON.parse(sessionStorage.getItem(key));
        const total = orders.reduce((sum, order) => sum + (order[1] * order[2]), 0);
        const items = orders.reduce((sum, order) => sum + order[2], 0);
        
        statusElement.textContent = `Rs.${total} | Items: ${items}`;
        statusIndicator.className = 'table-status status-occupied';
    } else {
        statusElement.textContent = 'Available';
        statusIndicator.className = 'table-status status-available';
    }
}

// Modal functionality
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function createModalVar(element, table) {
    const tableNumber = table.split(' ')[1];
    const key = `Table-${tableNumber}`;
    const orders = sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : [];
    
    document.getElementById("tableHeader").textContent = `${table} - Order Details`;
    const tbody = document.querySelector('.modal-body tbody');
    tbody.innerHTML = '';
    
    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order[0]}</td>
            <td>₹${order[1]}</td>
            <td>${order[2]}</td>
            <td>₹${order[1] * order[2]}</td>
            <td>
                <button class="w3-button w3-red w3-round" onclick="deleteItem(${index}, '${key}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    const total = orders.reduce((sum, order) => sum + (order[1] * order[2]), 0);
    document.getElementById("bill").textContent = `Total: ₹${total}`;
    
    modal.style.display = "block";
}

// Delete item function
window.deleteItem = function(index, tableKey) {
    const orders = JSON.parse(sessionStorage.getItem(tableKey));
    orders.splice(index, 1);
    
    if (orders.length === 0) {
        sessionStorage.removeItem(tableKey);
    } else {
        sessionStorage.setItem(tableKey, JSON.stringify(orders));
    }
    
    const tableNumber = tableKey.split('-')[1];
    updateTableStatus(tableNumber);
    createModalVar(document.getElementById(`table${tableNumber}`), `Table ${tableNumber}`);
}

// Generate bill function
document.getElementById("generateBill").onclick = function() {
    const tableHeader = document.getElementById("tableHeader").textContent;
    const tableNumber = tableHeader.split(' ')[1];
    const key = `Table-${tableNumber}`;
    const orders = JSON.parse(sessionStorage.getItem(key));
    const total = orders.reduce((sum, order) => sum + (order[1] * order[2]), 0);
    
    alert(`Bill for Table ${tableNumber}: ₹${total}`);
    sessionStorage.removeItem(key);
    updateTableStatus(tableNumber);
    modal.style.display = "none";
}

// Resizer functionality
const resizer = document.getElementById('resizer');
const tablePane = document.getElementById('table-pane');
const menuPane = document.getElementById('menu-pane');
const restaurantLayout = document.querySelector('.restaurant-layout');

let isResizing = false;
let startX;
let startWidth;

// Resizer event handlers
const mouseDownHandler = function(e) {
    if (window.innerWidth < 768) return;
    
    isResizing = true;
    startX = e.clientX;
    startWidth = tablePane.getBoundingClientRect().width;

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    
    resizer.classList.add('active');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
};

const mouseMoveHandler = function(e) {
    if (!isResizing) return;

    const dx = e.clientX - startX;
    const newWidth = startWidth + dx;

    if (newWidth >= 300 && newWidth <= 800) {
        tablePane.style.flex = `0 0 ${newWidth}px`;
    }
};

const mouseUpHandler = function() {
    isResizing = false;
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    resizer.classList.remove('active');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
};

// Initialize resizer
resizer.addEventListener('mousedown', mouseDownHandler);
resizer.addEventListener('selectstart', (e) => e.preventDefault());

// Drag and Drop functionality for tables
function initializeDragAndDrop() {
    const tables = document.querySelectorAll('.table-item');
    let draggedTable = null;

    tables.forEach(table => {
        // Make tables draggable
        table.setAttribute('draggable', 'true');

        // Drag start
        table.addEventListener('dragstart', (e) => {
            if (window.innerWidth < 768) {
                e.preventDefault();
                return;
            }
            draggedTable = table;
            table.classList.add('dragging');
            
            // Required for Edge compatibility
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', '');
            
            // Add semi-transparency
            setTimeout(() => {
                table.style.opacity = '0.5';
            }, 0);
        });

        // Drag end
        table.addEventListener('dragend', () => {
            draggedTable.style.opacity = '';
            draggedTable.classList.remove('dragging');
            draggedTable = null;
            
            // Remove all drag-over classes
            tables.forEach(t => t.classList.remove('drag-over'));
        });

        // Drag enter
        table.addEventListener('dragenter', (e) => {
            e.preventDefault();
            if (table !== draggedTable) {
                table.classList.add('drag-over');
            }
        });

        // Drag leave
        table.addEventListener('dragleave', () => {
            table.classList.remove('drag-over');
        });

        // Drag over
        table.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (!draggedTable || draggedTable === table) return;
        });

        // Drop
        table.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedTable || draggedTable === table) return;

            const allTables = [...restaurantLayout.querySelectorAll('.table-item')];
            const draggedIndex = allTables.indexOf(draggedTable);
            const droppedIndex = allTables.indexOf(table);

            if (draggedIndex < droppedIndex) {
                table.parentNode.insertBefore(draggedTable, table.nextSibling);
            } else {
                table.parentNode.insertBefore(draggedTable, table);
            }

            // Remove drag-over class
            table.classList.remove('drag-over');
        });
    });

    // Add drop zone functionality to restaurant layout
    restaurantLayout.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    restaurantLayout.addEventListener('drop', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(restaurantLayout, e.clientX, e.clientY);
        if (draggedTable) {
            if (!afterElement) {
                restaurantLayout.appendChild(draggedTable);
            } else {
                restaurantLayout.insertBefore(draggedTable, afterElement);
            }
            draggedTable.style.opacity = '';
            draggedTable.classList.remove('dragging');
            draggedTable = null;
        }
    });
}

function getDragAfterElement(container, x, y) {
    const draggableElements = [...container.querySelectorAll('.table-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Update draggable state on resize
window.addEventListener('resize', () => {
    const tables = document.querySelectorAll('.table-item');
    tables.forEach(table => {
        table.draggable = window.innerWidth >= 768;
    });
});
