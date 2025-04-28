// Global variables
let process = 1;
let selectedAlgorithm = "rr";

// Initialize input fields
function inputOnChange() {
    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        if (input.type == 'number') {
            input.onchange = () => {
                let inputVal = Number(input.value);
                let isInt = Number.isInteger(inputVal);
                if (input.parentNode.classList.contains('arrival-time')) {
                    if (!isInt || (isInt && inputVal < 0)) {
                        input.value = 0;
                    } else {
                        input.value = inputVal;
                    }
                } else {
                    if (!isInt || (isInt && inputVal < 1)) {
                        input.value = 1;
                    } else {
                        input.value = inputVal;
                    }
                }
            }
        }
    });
}
inputOnChange();

// Process management functions
function addProcess() {
    process++;
    let rowHTML1 = `
        <td class="process-id" rowspan="2">P${process}</td>
        <td class="arrival-time" rowspan="2"><input type="number" min="0" step="1" value="0"></td>
        <td class="process-time cpu process-heading" colspan="">CPU</td>
        <td class="process-btn"><button type="button" class="add-process-btn">+</button></td>
        <td class="process-btn"><button type="button" class="remove-process-btn">-</button></td>
    `;
    let rowHTML2 = `
        <td class="process-time cpu process-input"><input type="number" min="1" step="1" value="1"></td>
    `;
    let table = document.querySelector(".main-table tbody");
    table.insertRow(table.rows.length).innerHTML = rowHTML1;
    table.insertRow(table.rows.length).innerHTML = rowHTML2;
    inputOnChange();
}

function deleteProcess() {
    let table = document.querySelector(".main-table");
    if (process > 1) {
        table.deleteRow(table.rows.length - 1);
        table.deleteRow(table.rows.length - 1);
        process--;
    }
}

// Event listeners
document.querySelector(".add-btn").onclick = addProcess;
document.querySelector(".remove-btn").onclick = deleteProcess;

// Data structures for scheduling
class Input {
    constructor() {
        this.processId = [];
        this.arrivalTime = [];
        this.burstTime = [];
        this.algorithm = "rr";
        this.timeQuantum = 0;
        this.contextSwitch = 0;
    }
}

class Output {
    constructor() {
        this.completionTime = [];
        this.turnAroundTime = [];
        this.waitingTime = [];
        this.responseTime = [];
        this.schedule = [];
        this.timeLog = [];
        this.contextSwitches = 0;
        this.averageTimes = [];
    }
}

class TimeLog {
    constructor() {
        this.time = -1;
        this.ready = [];
        this.running = [];
        this.terminate = [];
    }
}

// Core scheduling algorithm
function roundRobinScheduler(input, output) {
    let remainingTime = [...input.burstTime];
    let currentTime = 0;
    let queue = [];
    let arrived = new Array(input.processId.length).fill(false);
    let started = new Array(input.processId.length).fill(false);
    
    // Initialize time log
    let initialLog = new TimeLog();
    initialLog.time = 0;
    initialLog.ready = [];
    output.timeLog.push(initialLog);
    
    while (true) {
        // Check for new arrivals
        for (let i = 0; i < input.processId.length; i++) {
            if (!arrived[i] && input.arrivalTime[i] <= currentTime) {
                arrived[i] = true;
                queue.push(i);
                
                let log = new TimeLog();
                log.time = currentTime;
                log.ready = [...queue];
                output.timeLog.push(log);
            }
        }
        
        if (queue.length === 0) {
            // No processes ready
            if (remainingTime.some(t => t > 0)) {
                // Some processes haven't arrived yet
                currentTime++;
                output.schedule.push([-1, 1]); // Idle time
                continue;
            } else {
                break; // All processes completed
            }
        }
        
        // Get next process from queue
        let currentProcess = queue.shift();
        let timeSlice = Math.min(input.timeQuantum, remainingTime[currentProcess]);
        
        // Record response time if this is first run
        if (!started[currentProcess]) {
            output.responseTime[currentProcess] = currentTime - input.arrivalTime[currentProcess];
            started[currentProcess] = true;
        }
        
        // Execute the process
        output.schedule.push([currentProcess + 1, timeSlice]);
        remainingTime[currentProcess] -= timeSlice;
        currentTime += timeSlice;
        
        // Check for new arrivals during execution
        for (let i = 0; i < input.processId.length; i++) {
            if (!arrived[i] && input.arrivalTime[i] <= currentTime) {
                arrived[i] = true;
                queue.push(i);
            }
        }
        
        // Re-add to queue if not finished
        if (remainingTime[currentProcess] > 0) {
            queue.push(currentProcess);
        } else {
            output.completionTime[currentProcess] = currentTime;
        }
        
        // Add context switch time if needed
        if (input.contextSwitch > 0 && queue.length > 0) {
            output.schedule.push([-2, input.contextSwitch]);
            currentTime += input.contextSwitch;
            output.contextSwitches++;
        }
        
        // Update time log
        let log = new TimeLog();
        log.time = currentTime;
        log.ready = [...queue];
        if (remainingTime[currentProcess] > 0) {
            log.running = [currentProcess];
        } else {
            log.terminate = [currentProcess];
        }
        output.timeLog.push(log);
    }
    
    // Calculate turnaround and waiting times
    for (let i = 0; i < input.processId.length; i++) {
        output.turnAroundTime[i] = output.completionTime[i] - input.arrivalTime[i];
        output.waitingTime[i] = output.turnAroundTime[i] - input.burstTime[i];
    }
    
    // Calculate averages
    let avgCT = output.completionTime.reduce((a, b) => a + b, 0) / output.completionTime.length;
    let avgTAT = output.turnAroundTime.reduce((a, b) => a + b, 0) / output.turnAroundTime.length;
    let avgWT = output.waitingTime.reduce((a, b) => a + b, 0) / output.waitingTime.length;
    let avgRT = output.responseTime.reduce((a, b) => a + b, 0) / output.responseTime.length;
    output.averageTimes = [avgCT, avgTAT, avgWT, avgRT];
}

// Visualization functions
function showGanttChart(output, outputDiv) {
    let ganttChartHeading = document.createElement("h3");
    ganttChartHeading.innerHTML = "Gantt Chart";
    outputDiv.appendChild(ganttChartHeading);
    
    let ganttChartData = [];
    let startTime = 0;
    
    output.schedule.forEach(element => {
        let label, color;
        if (element[0] === -1) {
            label = "Idle";
            color = "black";
        } else if (element[0] === -2) {
            label = "CS";
            color = "grey";
        } else {
            label = "P" + element[0];
            color = "";
        }
        
        ganttChartData.push([
            "Time",
            label,
            color,
            new Date(0, 0, 0, 0, 0, startTime),
            new Date(0, 0, 0, 0, 0, startTime + element[1])
        ]);
        
        startTime += element[1];
    });
    
    let ganttChartDiv = document.createElement("div");
    ganttChartDiv.id = "gantt-chart";
    outputDiv.appendChild(ganttChartDiv);
    
    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawChart);
    
    function drawChart() {
        var container = document.getElementById("gantt-chart");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();
        
        dataTable.addColumn({ type: "string", id: "Position" });
        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: "string", id: "style", role: "style" });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(ganttChartData);
        
        var options = {
            width: "100%",
            timeline: { showRowLabels: false }
        };
        
        chart.draw(dataTable, options);
    }
}

function showFinalTable(input, output, outputDiv) {
    let tableHeading = document.createElement("h3");
    tableHeading.innerHTML = "Process Metrics";
    outputDiv.appendChild(tableHeading);
    
    let table = document.createElement("table");
    table.classList.add("final-table");
    
    // Create table header
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    ["Process", "Arrival", "Burst", "Completion", "Turnaround", "Waiting", "Response"].forEach(text => {
        let th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    
    // Create table body
    let tbody = table.createTBody();
    for (let i = 0; i < input.processId.length; i++) {
        let row = tbody.insertRow();
        [
            "P" + (i + 1),
            input.arrivalTime[i],
            input.burstTime[i],
            output.completionTime[i],
            output.turnAroundTime[i],
            output.waitingTime[i],
            output.responseTime[i]
        ].forEach(text => {
            let cell = row.insertCell();
            cell.textContent = text;
        });
    }
    
    outputDiv.appendChild(table);
    
    // Add summary metrics
    let summary = document.createElement("div");
    summary.classList.add("summary-metrics");
    
    let totalTime = output.completionTime.reduce((a, b) => Math.max(a, b), 0);
    let cpuUtilization = (input.burstTime.reduce((a, b) => a + b, 0) / totalTime * 100).toFixed(2);
    let throughput = (input.processId.length / totalTime).toFixed(4);
    
    summary.innerHTML = `
        <p>Average Turnaround Time: ${output.averageTimes[1].toFixed(2)}</p>
        <p>Average Waiting Time: ${output.averageTimes[2].toFixed(2)}</p>
        <p>Average Response Time: ${output.averageTimes[3].toFixed(2)}</p>
        <p>CPU Utilization: ${cpuUtilization}%</p>
        <p>Throughput: ${throughput} processes/unit time</p>
        <p>Total Context Switches: ${output.contextSwitches}</p>
    `;
    
    outputDiv.appendChild(summary);
}

// Main calculation function
function calculateOutput() {
    // Get input values
    let input = new Input();
    let output = new Output();
    
    // Set algorithm parameters
    input.timeQuantum = Number(document.getElementById("tq").value);
    input.contextSwitch = Number(document.getElementById("context-switch").value);
    
    // Process process data
    for (let i = 1; i <= process; i++) {
        let rowCells = document.querySelector(`.main-table tr:nth-child(${2*i})`).cells;
        input.processId.push(i - 1);
        input.arrivalTime.push(Number(rowCells[1].firstElementChild.value));
        input.burstTime.push(Number(rowCells[0].firstElementChild.value));
    }
    
    // Run scheduler
    roundRobinScheduler(input, output);
    
    // Display results
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    
    showGanttChart(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    showFinalTable(input, output, outputDiv);
}

// Event listener for calculate button
document.getElementById("calculate").onclick = calculateOutput;