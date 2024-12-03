document.addEventListener("DOMContentLoaded", function () {
    const jsonFilePath = "data.json";

    // Load rankings
    function loadData() {
        fetch(jsonFilePath)
            .then((response) => response.json())
            .then((data) => {
                const rankings = processData(data);
                displayRankings(rankings);
            })
            .catch((error) => {
                console.error("Error loading the JSON file:", error);
                document.getElementById("ranking").innerHTML = `<p class="no-data">No data available.</p>`;
            });
    }

    function processData(data) {
        const categories = {
            "In welcher Klasse sind sie zur Zeit?": {},
            "Wie oft benutzen sie ChatGPT / andere KI Tools?": {},
            "Wie wahrscheinlich ist es, dass sie eine KI im Unterricht verwenden?": {},
            "Welches dieser KI - Tools nutzen sie am häufigsten?": {},
        };

        data.forEach((response) => {
            Object.keys(categories).forEach((category) => {
                const answer = response[category];
                if (answer) {
                    categories[category][answer] = (categories[category][answer] || 0) + 1;
                }
            });
        });

        const rankings = {};
        Object.keys(categories).forEach((category) => {
            const answers = categories[category];
            const totalResponses = data.length;
            const sortedAnswers = Object.entries(answers)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
            rankings[category] = sortedAnswers.map(([answer, count]) => ({
                answer,
                count,
                percentage: ((count / totalResponses) * 100).toFixed(1),
            }));
        });

        return rankings;
    }

    function displayRankings(rankings) {
        let output = "";
        Object.keys(rankings).forEach((category) => {
            const categoryRanking = rankings[category];
            output += `<div class="category"><h2>${category}</h2><div class="rank-item-container">`;
            categoryRanking.forEach((rank) => {
                output += `
                    <div class="rank-item">
                        <p class="rank-number">${rank.answer}</p>
                        <p>Count: ${rank.count}</p>
                        <p>Percentage: ${rank.percentage}%</p>
                    </div>
                `;
            });
            output += `</div></div>`;
        });

        document.getElementById("ranking").innerHTML = output;
    }

    // Voting functionality
    function initializeVoting() {
        const voteButtons = document.querySelectorAll(".vote-choice");
        const voteStatus = document.getElementById("vote-status");

        // Check if user has already voted
        const voted = localStorage.getItem("voted");
        if (voted) {
            voteStatus.textContent = `You voted: ${voted.toUpperCase()}`;
            disableVoteButtons();
        } else {
            voteButtons.forEach((button) => {
                button.addEventListener("click", function () {
                    const choice = this.getAttribute("data-choice");
                    submitVote(choice);
                });
            });
        }
    }

    function submitVote(choice) {
        fetch("/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ choice }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    localStorage.setItem("voted", choice);
                    document.getElementById("vote-status").textContent = `You voted: ${choice.toUpperCase()}`;
                    disableVoteButtons();
                } else {
                    alert("You have already voted!");
                }
            })
            .catch((error) => console.error("Error submitting vote:", error));
    }

    function disableVoteButtons() {
        document.querySelectorAll(".vote-choice").forEach((button) => {
            button.disabled = true;
        });
    }

    // Initialize page
    loadData();
    initializeVoting();
});
