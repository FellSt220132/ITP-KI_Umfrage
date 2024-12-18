document.addEventListener("DOMContentLoaded", function () {
    const jsonFilePath = "data.json";

    function loadData() {
        fetch(jsonFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const rankings = processData(data);
                displayRankings(rankings);
            })
            .catch(error => {
                console.error('Error loading the JSON file:', error);
                document.getElementById('ranking').innerHTML = `<p class="no-data">No data available.</p>`;
            });
    }

    function processData(data) {
        const categories = {
            "In welcher Klasse sind sie zur Zeit?": {},
            "Wie oft benutzen sie ChatGPT / andere KI Tools?": {},
            "Wie wahrscheinlich ist es, dass sie eine KI im Unterricht verwenden?": {},
            "Welches dieser KI - Tools nutzen sie am häufigsten?": {}
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
                .slice(0, 3);
            rankings[category] = sortedAnswers.map(([answer, count]) => ({
                answer,
                count,
                percentage: ((count / totalResponses) * 100).toFixed(1)
            }));
        });

        return rankings;
    }

    function displayRankings(rankings) {
        let output = '';
        Object.keys(rankings).forEach(category => {
            const categoryRanking = rankings[category];
            output += `<div class="category">
                <h2>${category}</h2>
                <div class="rank-item-container">
                    ${categoryRanking.map((rank, index) => `
                        <div class="rank-item">
                            <h3>Rank ${index + 1}</h3>
                            <p class="rank-number"><strong>${rank.answer}</strong></p>
                            <p>Count: ${rank.count}</p>
                            <p>Percentage: ${rank.percentage}%</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        });
        document.getElementById('ranking').innerHTML = output;
    }

    loadData();
});
