document.addEventListener("DOMContentLoaded", function () {
    // Path to the JSON file
    const jsonFilePath = "./data.json";

    // Fetch the JSON file and load its data
    function loadData() {
        fetch(jsonFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not fetch data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Process the data and display rankings
                const rankings = processData(data);
                displayRankings(rankings);
            })
            .catch(error => {
                console.error('Error loading data:', error);
                document.getElementById('ranking').innerHTML = `<p class="no-data">No data available.</p>`;
            });
    }

    // Analyze the data to calculate rankings
    function processData(data) {
        const categories = {
            "In welcher Klasse sind sie zur Zeit?": {},
            "Wie oft benutzen sie ChatGPT / andere KI Tools?": {},
            "Wie wahrscheinlich ist es, dass sie eine KI im Unterricht verwenden?": {},
            "Welches dieser KI - Tools nutzen sie am häufigsten?": {}
        };

        // Count answers for each category
        data.forEach(response => {
            Object.keys(categories).forEach(category => {
                const answer = response[category];
                if (answer) {
                    categories[category][answer] = (categories[category][answer] || 0) + 1;
                }
            });
        });

        // Prepare rankings with top 3 answers per category
        const rankings = {};
        Object.keys(categories).forEach(category => {
            const answers = categories[category];
            const totalResponses = data.length;
            const sortedAnswers = Object.entries(answers)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3); // Take the top 3 answers
            rankings[category] = sortedAnswers.map(([answer, count]) => ({
                answer,
                count,
                percentage: ((count / totalResponses) * 100).toFixed(1)
            }));
        });

        return rankings;
    }

    // Update the page with the rankings
    function displayRankings(rankings) {
        let output = '';
        Object.keys(rankings).forEach(category => {
            const categoryRanking = rankings[category];
            output += `<div class="category"><h2>${category}</h2>`;
            output += `<div class="podium">`;
            categoryRanking.forEach((rank, index) => {
                output += `
                    <div class="rank-item rank-${index + 1}">
                        <h3>${index + 1}</h3>
                        <p><strong>${rank.answer}</strong></p>
                        <p>${rank.percentage}%</p>
                    </div>
                `;
            });
            output += `</div></div>`;
        });

        document.getElementById('ranking').innerHTML = output;
    }

    // Load data when the page is ready
    loadData();
});
