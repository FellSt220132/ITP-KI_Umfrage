document.addEventListener("DOMContentLoaded", function() {
    // Path to the JSON file that will be created by Python script
    const jsonFilePath = "data.json";  // Adjusted to the root level

    // Function to fetch and process the JSON file
    function loadData() {
        fetch(jsonFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Data loaded successfully:", data);
                // Process the data and display rankings
                const rankings = processData(data);
                displayRankings(rankings);
            })
            .catch(error => {
                console.error('Error loading the JSON file:', error);
                document.getElementById('ranking').innerHTML = `<p class="no-data">No data available.</p>`;
            });
    }

    // Function to process the data and create rankings
    function processData(data) {
        const categories = {
            "In welcher Klasse sind sie zur Zeit?": {},
            "Wie oft benutzen sie ChatGPT / andere KI Tools?": {},
            "Wie wahrscheinlich ist es, dass sie eine KI im Unterricht verwenden?": {},
            "Welches dieser KI - Tools nutzen sie am häufigsten?": {}
        };

        // Process each category in the data
        data.forEach(response => {
            Object.keys(categories).forEach(category => {
                const answer = response[category];
                if (answer) {
                    categories[category][answer] = (categories[category][answer] || 0) + 1;
                }
            });
        });

        // Create rankings for each category
        const rankings = {};
        Object.keys(categories).forEach(category => {
            const answers = categories[category];
            const totalResponses = data.length;
            const sortedAnswers = Object.entries(answers)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10); // Top 10 answers
            rankings[category] = sortedAnswers.map(([answer, count]) => ({
                answer,
                count,
                percentage: ((count / totalResponses) * 100).toFixed(1)
            }));
        });

        return rankings;
    }

    // Function to display the rankings on the page
    function displayRankings(rankings) {
        let output = '';
        Object.keys(rankings).forEach(category => {
            const categoryRanking = rankings[category];
            output += `<div class="category"><h2>${category}</h2>`;
            categoryRanking.forEach((rank, index) => {
                output += `
                    <div class="rank-item">
                        <h3>Rank ${index + 1}</h3>
                        <p class="rank-number"><strong>${rank.answer}</strong></p>
                        <p>Count: ${rank.count}</p>
                        <p>Percentage: ${rank.percentage}%</p>
                    </div>
                `;
            });
            output += `</div>`;
        });

        // Add the rankings to the page
        document.getElementById('ranking').innerHTML = output;
    }

    // Load the data when the page is ready
    loadData();
});
