
function drawBarChart(element, value) {
    var ctx = document.getElementById(element).getContext('2d');

    ctx.fillStyle = "#005a71";
    ctx.fillRect(0, 0, 250, 30);

    ctx.fillStyle = "#002d3e";
    ctx.fillRect(0, 0, Number((250/100*value).toFixed(0)), 30);

    ctx.font = "14pt Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText(Number((value).toFixed(1)) + "%", 1, 20);

}

var stats;
let mem = document.getElementById("mem");
let cpu = document.getElementById("cpu");

const socket = new WebSocket("ws://localhost:8080/stats");

socket.addEventListener("open", function (event) {
    socket.send("");
});

socket.addEventListener("message", function (event) {

    stats = JSON.parse(event.data);

    mem.innerHTML = "<canvas id=\"canvas_mem\" height=\"30px\"></canvas><br>";

    drawBarChart("canvas_mem", stats.memory);

    cpu.innerHTML = stats.cpu.reduce(function (allCPUs, currentCPU, currentIndex) {
        return allCPUs + 
        "<span>CPU" +(currentIndex+1) +"</span><br>" + 
        "<canvas id=\"canvas_cpu_" + (currentIndex+1) + "\" height=\"30px\"></canvas><br>"
    }, "");

    
    stats.cpu.forEach(function(value, index) {
        drawBarChart('canvas_cpu_' + (index+1), value);
    });

});
