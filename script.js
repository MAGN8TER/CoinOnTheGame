let allGames = [];

window.onload = function() {
    generateDayButtons();
    loadAllData();
};

function loadAllData() {
    // Make sure this points to your raw github link or local file
    fetch("./nba_data.json")
        .then(res => res.json())
        .then(data => {
            allGames = data.games;
            displayGamesForDate(new Date()); 
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
        
        const dateParts = game.date.split('T')[0].split('-');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const cleanDate = `${months[parseInt(dateParts[1]) - 1]} ${dateParts[2]}`;

        const estTime = new Date(game.time).toLocaleString("en-US", {
            timeZone: "America/New_York",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        card.innerHTML = `
            <div style="justify-self: center;">${game.visitor}</div>
            <div style="text-align: center; align-self: center;">
                <div style="font-weight: bold;">${estTime}</div>
                <div style="font-size: 0.8em; color: #aaa;">${cleanDate}</div>
            </div>
            <div style="justify-self: center;">${game.home}</div>
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
