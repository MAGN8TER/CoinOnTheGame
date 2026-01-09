let allGames = []; // Global variable to hold all 7 days of data

window.onload = function() {
    generateDayButtons();
    loadAllData(); // Fetch the big JSON file
};

function loadAllData() {
    fetch("./nba_data.json")
        .then(res => res.json())
        .then(data => {
            allGames = data.games; // Save the games to our variable
            // Display "Today" by default (day index 0)
            displayGamesForDate(new Date()); 
        });
}

function displayGamesForDate(selectedDate) {
    const container = document.querySelector(".gamesFormat");
    container.innerHTML = ""; // Clear current cards

    // Format the selected date to YYYY-MM-DD for comparison
    const targetDateStr = selectedDate.toISOString().split('T')[0];

    // Filter the big list for only games matching the clicked day
    const filteredGames = allGames.filter(game => {
        return game.date.split('T')[0] === targetDateStr;
    });

    if (filteredGames.length === 0) {
        container.innerHTML = "<p style='color:white;'>No games scheduled for this day.</p>";
        return;
    }

    filteredGames.forEach(game => {
        const card = document.createElement("div");
        card.className = "gameCardUI";
        
        // Use your manual split logic from earlier to keep the date stable
        const dateParts = game.date.split('T')[0].split('-');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const cleanDate = `${months[parseInt(dateParts[1]) - 1]} ${dateParts[2]}`;

        card.innerHTML = `
            <div style="justify-self: center;">${game.visitor}</div>
            <div style="text-align: center; align-self: center;">
                <div style="font-weight: bold;">${game.time}</div>
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
    
    container.innerHTML = ""; // Clear any old buttons
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        // Create a new date object for each day (+0, +1, +2, etc.)
        const date = new Date();
        date.setDate(today.getDate() + i);

        const btn = document.createElement("button");
        btn.className = "dayButton";
        if (i === 0) btn.classList.add("active"); // Highlight 'Today'

        // Get the shorthand name (e.g., "MON") and the day number (e.g., "8")
        const dayName = days[date.getDay()];
        const dayNum = date.getDate();

        btn.innerHTML = `<div>${dayName}</div><div style="font-size: 0.8em;">${dayNum}</div>`;

        // When clicked, make it active and (optionally) reload games for that date
        btn.onclick = function() {
            // 1. Handle the blue "active" color
            const allButtons = document.querySelectorAll(".dayButton");
            allButtons.forEach(b => b.classList.remove("active"));

            // 2. Now add 'active' only to the button we just clicked
            btn.classList.add("active");

            // 2. Call the display function with the date assigned to THIS button
            displayGamesForDate(date); 
        };

        container.appendChild(btn);
    }

}

