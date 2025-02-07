document.addEventListener("DOMContentLoaded", function () {
    const jsonFilePath = "data.json"; // JSON File (Converted!)
    let allData = [];
    let filteredData = [];

    function loadData() {
        fetch(jsonFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                allData = data;
                filteredData = data; // Default to all data
                const rankings = processData(filteredData);
                displayRankings(rankings);
            })
            .catch(error => {
                console.error("Error loading the JSON file:", error);
                document.getElementById("ranking").innerHTML = `<p class="no-data">No data available.</p>`;
            });
    }

    const rankInfo = [
        { text: "Gold", class: "gold" },
        { text: "Silver", class: "silver" },
        { text: "Bronze", class: "bronze" },
    ];

    // Process the data for each question and return rankings
    function processData(data) {
        const categories = {
            "In welchen Zweig sind sie zur Zeit?": {},
            "In welcher Klasse sind sie zur Zeit?": {},
            "Wie oft benutzen sie ChatGPT / andere KI Tools?": {},
            "Wie wahrscheinlich ist es, dass sie eine KI im Unterricht verwenden?": {},
            "Welches dieser KI - Tools nutzen sie am häufigsten?": {},
        };

        data.forEach(response => {
            Object.keys(categories).forEach(category => {
                const answer = response[category];
                if (answer) {
                    categories[category][answer] = (categories[category][answer] || 0) + 1;
                }
            });
        });

        const rankings = {};
        Object.keys(categories).forEach(category => {
            const answers = categories[category];
            const totalResponses = data.length;
            const sortedAnswers = Object.entries(answers)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3); // Top 3 answers

            rankings[category] = rankInfo.map((rank, index) => {
                if (sortedAnswers[index]) {
                    const [answer, count] = sortedAnswers[index];
                    return {
                        answer,
                        count,
                        percentage: ((count / totalResponses) * 100).toFixed(1),
                        rankClass: rank.class,
                        rankText: rank.text,
                    };
                } else {
                    return {
                        answer: "The early Worm catches the Bird  - Sun Tzu",
                        count: 0,
                        percentage: "0.0",
                        rankClass: rank.class,
                        rankText: rank.text,
                    };
                }
            });
        });

        return rankings;
    }

    // Display the rankings
    function displayRankings(rankings) {
        let output = "";
        Object.keys(rankings).forEach(category => {
            const categoryRanking = rankings[category];
            output += `<div class="category">
                <h2>${category}</h2>
                <div class="rank-item-container">
                    ${categoryRanking
                        .map(rank => `
                            <div class="rank-item" tabindex="0">
                                <h3 class="${rank.rankClass}">${rank.rankText}</h3>
                                <p class="rank-number"><strong>${rank.answer}</strong></p>
                                <p>Count: ${rank.count}</p>
                                <p>Percentage: ${rank.percentage}%</p>
                            </div>
                        `)
                        .join("")}
                </div>
            </div>`;
        });

        document.getElementById("ranking").innerHTML = output;
    }

    const themeToggle = document.getElementById("themeToggle");

    // Dark / Light Mode
    const savedTheme = localStorage.getItem("theme") || "default";
    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", event => {
        const selectedTheme = event.target.checked ? "dark" : "default";
        document.documentElement.setAttribute("data-theme", selectedTheme);
        localStorage.setItem("theme", selectedTheme);
    });

    // Filter data
    const branchSelect = document.getElementById("branchSelect");
    branchSelect.addEventListener("change", () => {
        const selectedBranch = branchSelect.value;
        filteredData = selectedBranch === "all" ? allData : allData.filter(d => d["In welchen Zweig sind sie zur Zeit?"] === selectedBranch);
        const rankings = processData(filteredData);
        displayRankings(rankings);
    });

    // Load the data
    loadData();
});
