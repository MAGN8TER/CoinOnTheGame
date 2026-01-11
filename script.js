let allGames = [];

window.onload = function() {
    generateDayButtons();
    loadAllData();
};

function loadAllData() {
    // 1. Find the element that says NBA or NFL or NHL
    const sportElement = document.querySelector(".sportPageText");
    
    // 2. Default to 'nba' if the element isn't found, otherwise grab the text
    // .trim() removes extra spaces, .toLowerCase() makes "NBA" -> "nba"
    const currentSport = sportElement ? sportElement.innerText.trim().toLowerCase() : "nba";

    // 3. Build the URL dynamically using the sport name
    // If you are on the NBA page, it fetches nba_data.json
    // If you are on the NFL page, it fetches nfl_data.json
    fetch(`./${currentSport}_data.json`) 
        .then(res => {
            if (!res.ok) throw new Error("File not found");
            return res.json();
        })
        .then(data => {
            allGames = data.games;
            displayGamesForDate(new Date()); 
        })
        .catch(err => {
            console.error("Error loading data:", err);
            document.querySelector(".gamesFormat").innerHTML = `<p style='color:white;'>Could not load ${currentSport} data.</p>`;
        });
}

function displayGamesForDate(selectedDate) {
    const container = document.querySelector(".gamesFormat");
    if (!container) return;
    container.innerHTML = ""; 

    // FIX: Format date manually to avoid UTC/ISO timezone shifts
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const targetDateStr = `${y}-${m}-${d}`;

    const filteredGames = allGames.filter(game => {
        // This ensures we only compare the YYYY-MM-DD part
        return game.date.split('T')[0] === targetDateStr;
    });

    if (filteredGames.length === 0) {
        container.innerHTML = "<p style='color:white; text-align:center;'>No games scheduled for this day.</p>";
        return;
    }

    filteredGames.forEach(game => {
        const card = document.createElement("div");
        card.className = "gameCardUI";
        
        // 1. Label Date (e.g., Jan 10)
        const d = new Date(game.date + "T12:00:00"); // Force midday to avoid timezone shifts
        const cleanDateLabel = d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });

        // 2. Display Time (Converted to EST)
        // Works for both because both now use ISO strings!
        const displayTime = new Date(game.time).toLocaleTimeString("en-US", {
            timeZone: "America/New_York",
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        card.innerHTML = `
            <div style="text-align: left; padding-right: 10px;">${game.visitor}</div>
            
            <div style="text-align: center; min-width: 100px;">
                <div style="font-weight: bold;">${displayTime}</div>
                <div style="font-size: 0.8em; color: #aaa;">${cleanDateLabel}</div>
            </div>
            
            <div style="text-align: right; padding-left: 10px;">${game.home}</div>
        `;
        container.appendChild(card);
    });
}

function generateDayButtons() {
    const container = document.getElementById("dayButtonID");
    if (!container) return;
    
    container.innerHTML = ""; 
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        // FIX: Use 'let' inside the loop so each button gets its own unique date
        let buttonDate = new Date();
        buttonDate.setDate(today.getDate() + i);

        const btn = document.createElement("button");
        btn.className = "dayButton";
        if (i === 0) btn.classList.add("active");

        const dayName = days[buttonDate.getDay()];
        const dayNum = buttonDate.getDate();

        btn.innerHTML = `<div>${dayName}</div><div style="font-size: 0.8em;">${dayNum}</div>`;

        btn.onclick = function() {
            // FIX: Selector must be .dayButton to clear the blue color
            const allButtons = document.querySelectorAll(".dayButton");
            allButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Pass the unique date for this specific button
            displayGamesForDate(buttonDate); 
        };

        container.appendChild(btn);
    }
}