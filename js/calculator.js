document.addEventListener('DOMContentLoaded', function() {
    const goldenTeamPlayers = [
        { name: 'Kocsis Sándor', goals: 75, matches: 68 },
        { name: 'Puskás Ferenc', goals: 84, matches: 85 },
        { name: 'Czibor Zoltán', goals: 43, matches: 43 },
        { name: 'Hidegkuti Nándor', goals: 32, matches: 69 },
        { name: 'Budai II László', goals: 22, matches: 39 },
        { name: 'Tóth II Mihály', goals: 6, matches: 37 }
    ];

    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('results');
    const userGoalsInput = document.getElementById('userGoals');
    const userMatchesInput = document.getElementById('userMatches');
    const userNameInput = document.getElementById('userName');


    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateStats);
    }


    [userGoalsInput, userMatchesInput, userNameInput].forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateStats();
                }
            });
        }
    });

    function calculateStats() {
        const userGoals = parseInt(userGoalsInput.value) || 0;
        const userMatches = parseInt(userMatchesInput.value) || 1;
        const userName = userNameInput.value.trim() || 'Az Ön';

        if (userMatches <= 0) {
            alert('A mérkőzések száma legalább 1 kell legyen!');
            userMatchesInput.focus();
            return;
        }

        if (userGoals < 0) {
            alert('A gólok száma nem lehet negatív!');
            userGoalsInput.focus();
            return;
        }

        const userAverage = (userGoals / userMatches).toFixed(2);

        displayResults(userName, userGoals, userMatches, userAverage);

        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function displayResults(userName, userGoals, userMatches, userAverage) {

        resultsSection.style.display = 'block';

        document.getElementById('userStatsTitle').textContent = userName + ' statisztikái';
        document.getElementById('userAverage').textContent = userAverage + ' gól/meccs';
        document.getElementById('userGoalsDisplay').textContent = userGoals;
        document.getElementById('userMatchesDisplay').textContent = userMatches;


        const playersWithAverage = goldenTeamPlayers.map(player => ({
            ...player,
            average: (player.goals / player.matches).toFixed(2)
        }));


        const userPlayer = {
            name: userName,
            goals: userGoals,
            matches: userMatches,
            average: userAverage,
            isUser: true
        };

        const allPlayers = [...playersWithAverage, userPlayer];


        generateRanking(allPlayers);

    }

    function generateRanking(players) {
        const rankingContainer = document.getElementById('playersRankingList');
        

        const sortedPlayers = [...players].sort((a, b) => parseFloat(b.average) - parseFloat(a.average));
        
        let rankingHTML = '';
        
        sortedPlayers.forEach((player, index) => {
            const position = index + 1;
            const rowClass = player.isUser ? 'user-rank' : '';
            
            rankingHTML += `
                <div class="ranking-item ${rowClass}">
                    <div class="ranking-position">${position}</div>
                    <div class="ranking-info">
                        <div class="ranking-name">${player.name}</div>
                        <div class="ranking-stats">${player.goals} gól • ${player.matches} mérkőzés</div>
                    </div>
                    <div class="ranking-average">${player.average}</div>
                </div>
            `;
        });
        
        rankingContainer.innerHTML = rankingHTML;
    }


});