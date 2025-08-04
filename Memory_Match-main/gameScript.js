// Image array
var em = [
    "images/pokemon1.png", "images/pokemon2.png", "images/pokemon3.png", "images/pokemon4.png",
    "images/pokemon5.png", "images/pokemon6.png", "images/pokemon7.png", "images/pokemon8.png",
    "images/pokemon9.png", "images/pokemon10.png", "images/pokemon11.png", "images/pokemon12.png",
    "images/pokemon13.png", "images/pokemon14.png", "images/pokemon15.png", "images/pokemon16.png",
    "images/pokemon17.png", "images/pokemon18.png", "images/pokemon19.png", "images/pokemon20.png",
    "images/pokemon21.png", "images/pokemon22.png", "images/pokemon23.png", "images/pokemon24.png",
    "images/pokemon25.png"
];

(function shuffleEmojis() {
    let tmp, c, p = em.length;
    while (--p) {
        c = Math.floor(Math.random() * (p + 1));
        tmp = em[c];
        em[c] = em[p];
        em[p] = tmp;
    }
})();

var levels = [
    {r: 3, l: 4},
    {r: 4, l: 4},
    {r: 4, l: 5},
    {r: 5, l: 6},
    {r: 6, l: 6}
];
var currentLevel = 0;
var stepsLeft = 0;
var baseSteps = 10;

var pre = "", pID, ppID = 0, turn = 0, t = "transform", flip = "rotateY(180deg)", flipBack = "rotateY(0deg)", time;
var min = 0, sec = 0, moves = 0, rem = 0, noItems = 0, paused = false;

window.onload = function () {
    showInstructions();
};

function showInstructions() {
    let quitBtn = currentLevel > 0 ? `<button onclick="quitGame()">Quit</button>` : "";
    $("#ol").html(`
    <center>
        <div id="iol">
            <h3>Welcome!</h3>
            <div>Level ${currentLevel + 1} / ${levels.length} (${levels[currentLevel].r} x ${levels[currentLevel].l})</div>
            <ul style="text-align:left;">
                <li>Match pairs of Pokémon cards.</li>
                <li>You start with 10 steps. Each level gives +5 more.</li>
                <li>Only wrong attempts reduce steps.</li>
            </ul>
            <button onclick="startLevel()">Start Level ${currentLevel + 1}</button>
            ${quitBtn}
        </div>
    </center>`);
    $("#ol").fadeIn(300);
    paused = false;
}

function startLevel() {
    let {r, l} = levels[currentLevel];
    start(r, l);
}

function start(r, l) {
    min = 0, sec = 0, moves = 0;
    stepsLeft = baseSteps + currentLevel * 6;
    $("#time").html("Time: 00:00");
    $("#moves").html("Moves: 0");
    $("#steps").html("Steps Left: " + stepsLeft);
    $("#levelDisplay").html(`Level ${currentLevel + 1} / ${levels.length}`);

    clearInterval(time);
    time = setInterval(() => {
        if (!paused) {
            sec++;
            if (sec == 60) { min++; sec = 0; }
            $("#time").html(`Time: ${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`);
        }
    }, 1000);

    rem = (r * l) / 2;
    noItems = rem;

    let items = [];
    for (let i = 0; i < noItems; i++) items.push(em[i], em[i]);

    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    $("table").html("");
    let n = 1;
    for (let i = 1; i <= r; i++) {
        $("table").append("<tr>");
        for (let j = 1; j <= l; j++) {
            $("table").append(`
                <td id='${n}' onclick="change(${n})">
                    <div class='inner'>
                        <div class='front'></div>
                        <div class='back'><img src="${items[n - 1]}" /></div>
                    </div>
                </td>`);
            n++;
        }
        $("table").append("</tr>");
    }

    pre = "", pID = "", ppID = 0, turn = 0;
    paused = false;
    $("#ol").fadeOut(300);
}

function change(x) {
    if (paused) return;
    let i = "#" + x + " .inner";
    let b = "#" + x + " .inner .back img";
    if (turn == 2 || $(i).attr("flip") == "block" || ppID == x) return;
    $(i).css("transform", flip);

    if (turn == 1) {
        turn = 2;
        if (pre != $(b).attr("src")) {
            setTimeout(() => {
                $(pID).css("transform", flipBack);
                $(i).css("transform", flipBack);
                ppID = 0;
            }, 800);

            // wrong step huda matra decrease garne
            stepsLeft--;
            $("#steps").html("Steps Left: " + stepsLeft);

            // game sakine steps dsakiyo bhane
            if (stepsLeft <= 0 && rem > 0) {
                clearInterval(time);
                paused = true;
                $("#ol").html(`
                    <center>
                        <div id="iol">
                            <h2>Out of Steps!</h2>
                            <p>You ran out of steps before matching all pairs.</p>
                            <button onclick="restartGame()">Restart</button>
                            <button onclick="quitGame()">Quit</button>
                        </div>
                    </center>`).fadeIn(500);
            }

        } else {
            rem--;
            $(i).attr("flip", "block");
            $(pID).attr("flip", "block");
        }

        setTimeout(() => {
            turn = 0;
            moves++;
            $("#moves").html("Moves: " + moves);
        }, 1000);
    } else {
        pre = $(b).attr("src");
        ppID = x;
        pID = i;
        turn = 1;
    }

    if (rem === 0) {
        clearInterval(time);
        setTimeout(() => {
            let btn = currentLevel < levels.length - 1
                ? `<button onclick="nextLevel()">Next Level</button>`
                : `<button onclick="restartGame()">Restart Game</button>`;
            $("#ol").html(`
                <center>
                    <div id="iol">
                        <h2>Congrats!</h2>
                        <p>You completed Level ${currentLevel + 1} in ${moves} moves and ${min}m ${sec}s.</p>
                        ${btn}
                        <button onclick="quitGame()">Quit</button>
                    </div>
                </center>`).fadeIn(700);
        }, 1200);
    }
}

function restartGame() {
    currentLevel = 0;
    showInstructions();
}
function nextLevel() {
    currentLevel++;
    showInstructions();
}
function quitGame() {
    currentLevel = 0;
    showInstructions();
}
function showInstructions() {
    let quitBtn = currentLevel > 0 ? `<button onclick="quitGame()">Quit</button>` : "";
    let resumeBtn = paused ? `<button onclick="resumeGame()">Resume</button>` : "";
    let backBtn = `<button onclick="backToMenu()">Back</button>`;
    $("#ol").html(`
    <center>
        <div id="iol">
            <h3>Welcome!</h3>
            <div>Level ${currentLevel + 1} / ${levels.length} (${levels[currentLevel].r} x ${levels[currentLevel].l})</div>
            <ul style="text-align:left;">
                <li>Match pairs of Pokémon cards.</li>
                <li>You start with 10 steps. Each level gives +5 more.</li>
                <li>Only wrong attempts reduce steps.</li>
            </ul>
            <button onclick="startLevel()">Start Level ${currentLevel + 1}</button>
            ${resumeBtn}
            ${backBtn}
            ${quitBtn}
        </div>
    </center>`);
    $("#ol").fadeIn(300);s
}

// back ra pause button ko lagi
$(document).ready(function () {
    if ($("#pauseBtn").length === 0) {
        $("#info").append(`
            <div style="margin-top:18px;">
                <button id="pauseBtn" onclick="pauseGame()">Pause</button>
                <button id="backBtn" onclick="backToMenu()">Back</button>
            </div>
        `);
    }
});

function pauseGame() {
    paused = true;
    showInstructions();
}

function resumeGame() {
    $("#ol").fadeOut(300);
    paused = false;
}
function backToMenu() {
    clearInterval(time);
    paused = false;
    currentLevel = 0;
    showInstructions();
}