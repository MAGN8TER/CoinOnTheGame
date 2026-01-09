// This function runs automatically when the page loads
window.onload = function() {
    loadNBAGames();
};

function loadNBAGames() {
    // Fetch from your local JSON file
    fetch("./nba_data.json")
        .then(res => {
            if (!res.ok) throw new Error("Data not found");
            return res.json();
        })
        .then(data => {
            const container = document.querySelector(".gamesFormat");
            if (!container) return;

            container.innerHTML = ""; // Clear the empty container

            data.games.forEach(game => {
                // 1. Create the card container
                const card = document.createElement("div");
                card.className = "gameCardUI";

                const dateParts = game.date.split('T')[0].split('-'); 
                const year = dateParts[0];
                const monthIndex = parseInt(dateParts[1]) - 1;
                const day = dateParts[2];

                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const cleanDate = `${months[monthIndex]} ${day}`;

                // 2. Format the Time to your Local Zone
                let displayTime = game.time;
                if (game.time.includes('T') || !isNaN(Date.parse(game.time))) {
                    displayTime = new Date(game.time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                }

                card.innerHTML = `
                    <div style="justify-self: center; padding: 10px;">${game.visitor}</div>
                    <div style="text-align: center; align-self: center;">
                        <div style="font-weight: bold; font-size: 1.1em;">${displayTime}</div>
                        <div style="font-size: 0.8em; color: #aaa; margin-top: 4px;">${cleanDate}</div>
                    </div>
                    <div style="justify-self: center; padding: 10px;">${game.home}</div>
                `;

                // 3. Add the finished card to the page
                container.appendChild(card);
            });
        })
        .catch(err => console.error("Error loading games:", err));
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
            const allButtons = document.querySelectorAll(".dayButton");
            allButtons.forEach(b => b.classList.remove("active"));

            // 2. Now add 'active' only to the button we just clicked
            btn.classList.add("active");
            loadNBAGames();
        };

        container.appendChild(btn);
    }
}

window.onload = function() {
    generateDayButtons();
    loadNBAGames(); 
};