import { jsonData } from "./data.js";
const gameData = {
  toss: {
    completed: false, // Whether the toss has been completed
    winner: null, // The name of the team that won the toss
    loser: null, // The name of the team that lost the toss
  },
  teams: {
    player1: {
      name: "", // Name of Player 1's team
      players: [], // Array of selected players with full player data
      batsmenCount: 0, // Count of batsmen selected
      bowlersCount: 0, // Count of bowlers selected
      keeperCount: 0, // Count of wicketkeepers selected
      totalCredits: 100, // Remaining credits for Player 1
      captain: null, // Player selected as captain
      viceCaptain: null, // Player selected as vice-captain
      totalRuns: 0, // Total Runs
      turn: false, // check team turn
      fanPointScores: 0, // Total fantasy points
      wickets: 0, // Total wicket
    },
    player2: {
      name: "", // Name of Player 2's team
      players: [], // Array of selected players with full player data
      batsmenCount: 0, // Count of batsmen selected
      bowlersCount: 0, // Count of bowlers selected
      keeperCount: 0, // Count of wicketkeepers selected
      totalCredits: 100, // Remaining credits for Player 2
      captain: null, // Player selected as captain
      viceCaptain: null, // Player selected as vice-captain
      totalRuns: 0, // Total Runs
      turn: false, // check team turn
      fanPointScores: 0, // Total fantasy points
      wickets: 0, // Total wicket
    },
  },
  match: {
    overs: 5, // Number of overs per team
    ballsPerOver: 6, // Number of balls per over
    currentOver: 0, // Track the current over
    currentBall: 1, // Track the current ball in an over
    battingTeam: "", // Which team is currently batting
    bowlingTeam: "", // Which team is currently bowling
    currentBatsman: null, // The current batsman on strike
    currentBowler: null, // The current bowler
    shotTypes: ["1", "2", "3", "4", "6", ".", "w"], // Possible shot types
    fantasyPoints: [
      { run: 1, fanPoint: 1 },
      { run: 2, fanPoint: 2 },
      { run: 3, fanPoint: 3 },
      { run: 4, fanPoint: 5 },
      { run: 6, fanPoint: 8 },
      { run: ".", fanPoint: 1 },
      { run: "w", fanPoint: 10 },
    ],
    duck: -2,
    captainMultiplier: 2,
    viceCaptainMultiplier: 1.5,
    completed: false, // Is the match completed?
    winner: null, // The team that won the match
  },
  playerSelection: {
    maxBatsmen: 5, // Max number of batsmen allowed per team
    maxBowlers: 5, // Max number of bowlers allowed per team
    maxKeepers: 1, // Max number of wicketkeepers allowed per team
    maxPlayers: 11, // Max number of players per team
    creditLimit: 100, // Credit cap per team
  },
};
// document.getElementById("startMatch").style.display = "none";
// document.getElementById("container").style.display = "none";
// document.getElementById("resultButton").style.display = "none";
resultButton.disabled = true;
startMatch.disabled = true;
hitButton.disabled = true;
//////////////////// Toss functionality //////////////////////
function toss() {
  if (gameData.toss.completed) {
    alert("Please Finish Current Game Or Refresh For New Game !");
    return;
  }
  const player1 = document.getElementById("team1Name").value.trim();
  const player2 = document.getElementById("team2Name").value.trim();

  if (!/^[a-zA-Z\s'-]+$/.test(player1) || !/^[a-zA-Z\s'-]+$/.test(player2)) {
    alert("Both teams must have a name before tossing.");
    return;
  }

  if (player1 === player2) {
    alert("Please Choose Unique Name for Both Team !");
    return;
  }

  // Randomly select the winner
  const winner = Math.random() < 0.5 ? player1 : player2;
  const loser = winner === player1 ? player2 : player1;

  // Display toss result
  const winnerName = document.querySelector(".winnerName h2");
  winnerName.textContent = `${winner} has won the toss!`;

  // Update team headings
  const team1Heading = document.querySelector(".team1 h3");
  const team2Heading = document.querySelector(".team2 h3");

  // Set winner on the left and loser on the right
  team1Heading.textContent = `${winner}'s Team`;
  team2Heading.textContent = `${loser}'s Team`;

  gameData.toss.completed = true;
  gameData.toss.winner = winner;
  gameData.toss.loser = loser;
  gameData.teams.player1.name = winner;
  gameData.teams.player2.name = loser;
  gameData.match.battingTeam = winner;
  gameData.match.bowlingTeam = loser;

  // Ensure the toss winner gets the first turn
  gameData.teams.player1.turn = true;
  gameData.teams.player2.turn = false;

  // Call this at the start to show the initial turn
  updateTurnDisplay();

  document.querySelector(
    ".team1 .display-credit h3"
  ).textContent = `Credits : ${gameData.playerSelection.creditLimit}`;
  document.querySelector(
    ".team2 .display-credit h3"
  ).textContent = `Credits : ${gameData.playerSelection.creditLimit}`;
  // console.log(`${winner} will choose players first.`);
  // console.log(gameData);
}
// Attach toss function to the toss button using event listener
document.getElementById("toss").addEventListener("click", toss);
/////////////////// Show All players in middle Box ///////////
const availablePlayers = document.getElementById("available-players");
jsonData.forEach((player) => {
  const li = document.createElement("li");
  li.textContent = `${player.name} [${player.playingRole}, Credit: ${player.credit}]`;
  li.dataset.name = player.name;
  li.dataset.role = player.playingRole;
  li.dataset.credit = player.credit;
  //   console.log(li);
  availablePlayers.appendChild(li);
});
/////////////////// Update players for each team and manage Credits //////////////////
const team1Players = document.getElementById("team1-players");
const team2Players = document.getElementById("team2-players");
// Display Credits
function updateCreditDisplay(team) {
  const creditDisplay =
    team === gameData.teams.player1
      ? document.querySelector(".team1 .display-credit h3")
      : document.querySelector(".team2 .display-credit h3");
  creditDisplay.textContent = `Credits : ${team.totalCredits}`;
}
// Filter by role for maximum players
function updateRoleCount(player, team, action) {
  switch (player.role) {
    case "Batsman":
      if (
        action === "add" &&
        team.batsmenCount >= gameData.playerSelection.maxBatsmen
      ) {
        alert("You can select only 5 Batsmen.");
        return false;
      }
      team.batsmenCount += action === "add" ? 1 : -1;
      break;
    case "Bowler":
      if (
        action === "add" &&
        team.bowlersCount >= gameData.playerSelection.maxBowlers
      ) {
        alert("You can select only 5 Bowlers.");
        return false;
      }
      team.bowlersCount += action === "add" ? 1 : -1;
      break;
    case "Wicketkeeper":
      if (
        action === "add" &&
        team.keeperCount >= gameData.playerSelection.maxKeepers
      ) {
        alert("You can select only 1 Wicketkeeper.");
        return false;
      }
      team.keeperCount += action === "add" ? 1 : -1;
      break;
  }
  return true;
}
// Select Player from main players list
function selectPlayer(event) {
  // console.log(event.target);
  if (!gameData.toss.completed) {
    alert("You need to complete the toss first!");
    return;
  }
  if (event.target.closest("li")) {
    const player = event.target.dataset;
    const playerName = player.name;
    const playerRole = player.role;
    const playerCredit = parseInt(player.credit);

    // Determine which team is picking players
    let currentTeam = gameData.teams.player1.turn
      ? gameData.teams.player1
      : gameData.teams.player2;

    // Check if the team has enough space and credits
    if (currentTeam.players.length >= gameData.playerSelection.maxPlayers) {
      alert("You cannot select more than 11 players!");
      return;
    }
    if (currentTeam.totalCredits - playerCredit < 0) {
      alert("Not enough credits to select this player!");
      return;
    }

    // Validate player role count before adding
    if (!updateRoleCount(player, currentTeam, "add")) {
      return; // If the role count is invalid, don't add the player
    }

    // Add player to the team and remove from available list
    currentTeam.players.push({
      name: playerName,
      role: playerRole,
      credit: playerCredit,
      played: false,
      playedBalls: 0,
      runs: 0,
      fanPoints: 0,
    });
    currentTeam.totalCredits -= playerCredit;

    // Remove the player from the available list
    event.target.remove();

    // Display the player in the team section
    const teamList =
      currentTeam === gameData.teams.player1 ? team1Players : team2Players;
    const li = document.createElement("li");
    li.textContent = `${playerName} [${playerRole}, Credit: ${playerCredit}]`;
    li.dataset.name = playerName;
    li.dataset.role = playerRole;
    li.dataset.credit = playerCredit;
    teamList.appendChild(li);

    // Update the credit display in the UI
    updateCreditDisplay(currentTeam);

    // Populate the Captain and Vice-Captain dropdowns after player is added
    populateCaptainViceCaptainDropdown(currentTeam);
    // console.log(gameData);
  }
}
// Deselect player from teams list
function deselectPlayer(event) {
  if (event.target.closest("li")) {
    const player = event.target.dataset;
    const playerName = player.name;
    const playerRole = player.role;
    const playerCredit = parseInt(player.credit);

    // Determine which team the player belongs to
    let currentTeam = gameData.teams.player1.players.some(
      (p) => p.name === playerName
    )
      ? gameData.teams.player1
      : gameData.teams.player2;

    // Remove the player from the team
    currentTeam.players = currentTeam.players.filter(
      (p) => p.name !== playerName
    );
    currentTeam.totalCredits += playerCredit;

    // Update role count when deselecting
    updateRoleCount(player, currentTeam, "remove");

    // Remove the player from the team's UI list
    event.target.remove();

    // Add the player back to the available players list
    const li = document.createElement("li");
    li.textContent = `${playerName} [${playerRole}, Credit: ${playerCredit}]`;
    li.dataset.name = playerName;
    li.dataset.role = playerRole;
    li.dataset.credit = playerCredit;
    availablePlayers.appendChild(li);

    // Update the credit display in the UI
    updateCreditDisplay(currentTeam);
    // console.log(gameData);
  }
}
// Function to populate the Captain and Vice-Captain dropdowns
function populateCaptainViceCaptainDropdown(team) {
  const captainSelect =
    team === gameData.teams.player1
      ? document.getElementById("team1-captain")
      : document.getElementById("team2-captain");

  const viceCaptainSelect =
    team === gameData.teams.player1
      ? document.getElementById("team1-vice-captain")
      : document.getElementById("team2-vice-captain");

  // Clear existing options
  captainSelect.innerHTML = '<option value="">Choose Captain</option>';
  viceCaptainSelect.innerHTML = '<option value="">Choose Vice-Captain</option>';

  // Add players to the dropdown
  team.players.forEach((player) => {
    const option = document.createElement("option");
    option.value = player.name;
    option.textContent = player.name;
    captainSelect.appendChild(option.cloneNode(true)); // Clone to reuse option
    viceCaptainSelect.appendChild(option);
  });
}
// Validation to ensure Captain and Vice-Captain are not the same
function validateCaptainViceCaptain(team) {
  const captainSelect =
    team === gameData.teams.player1
      ? document.getElementById("team1-captain")
      : document.getElementById("team2-captain");

  const viceCaptainSelect =
    team === gameData.teams.player1
      ? document.getElementById("team1-vice-captain")
      : document.getElementById("team2-vice-captain");

  if (captainSelect.value === viceCaptainSelect.value) {
    alert("Captain and Vice-Captain cannot be the same!");
    viceCaptainSelect.value = ""; // Reset Vice-Captain selection
  }
}
// Event listener for Player 1 Captain and Vice-Captain selection
document
  .getElementById("team1-captain")
  .addEventListener("change", function () {
    gameData.teams.player1.captain = this.value;
    validateCaptainViceCaptain(gameData.teams.player1);
  });
document
  .getElementById("team1-vice-captain")
  .addEventListener("change", function () {
    gameData.teams.player1.viceCaptain = this.value;
    validateCaptainViceCaptain(gameData.teams.player1);
  });
// Event listener for Player 2 Captain and Vice-Captain selection
document
  .getElementById("team2-captain")
  .addEventListener("change", function () {
    gameData.teams.player2.captain = this.value;
    validateCaptainViceCaptain(gameData.teams.player2);
  });
document
  .getElementById("team2-vice-captain")
  .addEventListener("change", function () {
    gameData.teams.player2.viceCaptain = this.value;
    validateCaptainViceCaptain(gameData.teams.player2);
  });
// Function to finalize the team selection and switch turns
function addTeam() {
  if (!gameData.toss.completed) {
    alert("Please complete the toss first!");
    return;
  }

  let currentTeam = gameData.teams.player1.turn
    ? gameData.teams.player1
    : gameData.teams.player2;

  // Check if the team has selected 11 players
  if (currentTeam.players.length !== gameData.playerSelection.maxPlayers) {
    alert("You must select exactly 11 players.");
    return;
  }

  // Check if captain and vice-captain are selected
  if (!currentTeam.captain || !currentTeam.viceCaptain) {
    alert("Please select both a Captain and a Vice-Captain.");
    return;
  }

  // Validate that Captain and Vice-Captain are not the same person
  if (currentTeam.captain === currentTeam.viceCaptain) {
    alert("Captain and Vice-Captain cannot be the same player.");
    return;
  }

  // Finalize the current team's selection and switch turns
  if (gameData.teams.player1.turn) {
    gameData.teams.player1.turn = false;
    gameData.teams.player2.turn = true;
    alert(
      "Player 1's team is complete. Player 2, it's your turn to select your team."
    );
    document.getElementById("team1-captain").disabled = true;
    document.getElementById("team1-vice-captain").disabled = true;
  } else {
    gameData.teams.player2.turn = false;
    alert("Player 2's team is also complete. Both teams are ready!");

    // Disable further player selection once both teams are finalized
    document.getElementById("team2-captain").disabled = true;
    document.getElementById("team2-vice-captain").disabled = true;
    document.getElementById("add-team-btn").disabled = true;
    availablePlayers.removeEventListener("click", selectPlayer);
  }

  // Update the turn-based UI to reflect the change
  updateTurnDisplay();
}
// Function to update the UI based on which player's turn it is
function updateTurnDisplay() {
  const turnDisplay = document.querySelector(".turn-info");
  if (gameData.teams.player1.turn) {
    turnDisplay.textContent = `${gameData.teams.player1.name}'s turn to select players.`;
  } else if (gameData.teams.player2.turn) {
    turnDisplay.textContent = `${gameData.teams.player2.name}'s turn to select players.`;
  } else {
    gameData.teams.player1.turn = true;
    gameData.teams.player2.turn = false;
    turnDisplay.textContent = "Both teams have completed their selection.";
    startMatch.disabled = false;
    // document.getElementById("startMatch").style.display = "block";
  }
}
document.getElementById("add-team-btn").addEventListener("click", addTeam);
availablePlayers.addEventListener("click", selectPlayer);
team1Players.addEventListener("click", deselectPlayer);
team2Players.addEventListener("click", deselectPlayer);
document.getElementById("startMatch").addEventListener("click", () => {
  // document.getElementById("startMatch").style.display = "none";
  // document.getElementById("container").style.display = "block";
  displayPlayersForMatch();
  hitButton.disabled = false;
  startMatch.disabled = true;
});
////////////////// show players of both team in match arena /////////////////////
function displayPlayersForMatch() {
  const {
    teams: { player1, player2 },
  } = gameData;
  // Update team headings
  const team1matchHeading = document.querySelector(".team1match h3");
  const team2matchHeading = document.querySelector(".team2match h3");

  // Set winner on the left and loser on the right
  team1matchHeading.textContent = `${gameData.toss.winner}'s Team`;
  team2matchHeading.textContent = `${gameData.toss.loser}'s Team`;

  player1.players.forEach((player) => {
    const li = document.createElement("li");
    if (player.name === player1.captain) {
      li.textContent = `${player.name} [${player.role}] [Captain]`;
      li.style.backgroundColor = "lightgreen";
    } else if (player.name === player1.viceCaptain) {
      li.textContent = `${player.name} [${player.role}] [Vice Captain]`;
      li.style.backgroundColor = "lightblue";
    } else {
      li.textContent = `${player.name} [${player.role}] `;
      li.style.backgroundColor = "#facec5";
    }
    li.dataset.name = player.name;
    li.dataset.role = player.role;
    document.getElementById("team1-player").appendChild(li);
  });
  player2.players.forEach((player) => {
    const li = document.createElement("li");
    if (player.name === player2.captain) {
      li.textContent = `${player.name} [${player.role}] [Captain]`;
      li.style.backgroundColor = "lightgreen";
    } else if (player.name === player2.viceCaptain) {
      li.textContent = `${player.name} [${player.role}] [Vice Captain]`;
      li.style.backgroundColor = "lightblue";
    } else {
      li.textContent = `${player.name} [${player.role}] `;
      li.style.backgroundColor = "#facec5";
    }
    li.dataset.name = player.name;
    li.dataset.role = player.role;
    document.getElementById("team2-player").appendChild(li);
  });
  console.log(gameData);
}
////////////////// Play match functionality start ////////////////////
let {
  teams: { player1, player2 },
  match,
} = gameData;
///////////////// Find first batsman who is not played in the match //////////////////////
function findBatsmanMethod(players) {
  return players.find((player) => player.played === false);
}
///////////////// Find first bolwer who is not thrown any over in the match ///////////////////
function findBowlerMethod(players) {
  return players.find(
    (player) => player.role === "Bowler" && player.played === false
  );
}
///////////////// calculate fantacy points accordin captain , wise captain and normal player /////////
function calculateFantacyPoints(players, curTeamName, fanpoint) {
  let fanpoints;
  if (players.name === curTeamName.captain) {
    fanpoints = fanpoint * match.captainMultiplier;
  } else if (players.name === curTeamName.viceCaptain) {
    fanpoints = fanpoint * match.viceCaptainMultiplier;
  } else {
    fanpoints = fanpoint;
  }
  return fanpoints;
}
///////////////// Update UI for Each boll and record it ////////////////////////
function updateBallLog(run) {
  const logElement = document.getElementById("ball-log");
  const logEntry = document.createElement("li");
  const currentTime = new Date().toLocaleString(); // Get current date and time
  logEntry.textContent = `Ball ${
    match.currentBall % match.ballsPerOver == 0
      ? 6
      : match.currentBall % match.ballsPerOver
  } - ${currentTime} - Run: ${
    run === "w" ? "wicket" : run === "." ? "dot ball" : run
  }`;
  logElement.appendChild(logEntry);
}
///////////////////////////////////////
let currentBatsmanTeam;
let currentBowlerTeam;
let BatsmanPlayer;
let BowlerPlayer;
/////////////////// Main HIT button function /////////////////////////////////////
function hitBall() {
  currentBatsmanTeam = player1.turn ? player1 : player2;
  currentBowlerTeam = player1.turn ? player2 : player1;
  if (currentBatsmanTeam.wickets > gameData.playerSelection.maxPlayers - 1) {
    return;
  }
  BatsmanPlayer = findBatsmanMethod(currentBatsmanTeam.players);
  BatsmanPlayer.playedBalls += 1;
  match.currentBatsman = BatsmanPlayer.name;
  document.getElementById("current-batsman-name").innerText =
    match.currentBatsman;

  BowlerPlayer = findBowlerMethod(currentBowlerTeam.players);
  match.currentBowler = BowlerPlayer.name;
  document.getElementById("current-bowler-name").innerText =
    match.currentBowler;

  match.currentOver = Math.floor(match.currentBall / match.ballsPerOver);
  document.getElementById("current-over").innerText = match.currentOver;
  document.getElementById("current-ball").innerText =
    match.currentBall % match.ballsPerOver;

  const randomIndex = Math.floor(Math.random() * match.fantasyPoints.length);
  const { run, fanPoint } = match.fantasyPoints[randomIndex];

  if (run === ".") {
    let temptempbowl = calculateFantacyPoints(
      BowlerPlayer,
      currentBowlerTeam,
      fanPoint
    );
    BowlerPlayer.fanPoints += temptempbowl;
    currentBowlerTeam.fanPointScores += temptempbowl;
  } else if (run === "w") {
    let temptempbowl = calculateFantacyPoints(
      BowlerPlayer,
      currentBowlerTeam,
      fanPoint
    );
    BowlerPlayer.fanPoints += temptempbowl;
    currentBowlerTeam.fanPointScores += temptempbowl;

    currentBatsmanTeam.wickets += 1;

    if (BatsmanPlayer.runs === 0) {
      let temptempbats = calculateFantacyPoints(
        BatsmanPlayer,
        currentBatsmanTeam,
        match.duck
      );
      BatsmanPlayer.fanPoints += temptempbats;
      currentBatsmanTeam.fanPointScores += temptempbats;
    }
    BatsmanPlayer.played = true;
  } else {
    BatsmanPlayer.runs += +run;
    currentBatsmanTeam.totalRuns += +run;
    let temptempbats = calculateFantacyPoints(
      BatsmanPlayer,
      currentBatsmanTeam,
      fanPoint
    );
    BatsmanPlayer.fanPoints += temptempbats;
    currentBatsmanTeam.fanPointScores += temptempbats;
  }
  document.getElementById("current-batsman-runs").innerText =
    BatsmanPlayer.runs;
  document.getElementById("current-batsman-points").innerText =
    BatsmanPlayer.fanPoints;
  document.getElementById("current-bowler-points").innerText =
    BowlerPlayer.fanPoints;

  updateBallLog(run);
}
document.getElementById("hitButton").addEventListener("click", () => {
  hitBall();
  hitButton.disabled = true;
  if (match.currentBall % match.ballsPerOver == 0) {
    BowlerPlayer.played = true;
  }
  setTimeout(() => {
    hitButton.disabled = false;
    if (match.currentBall % match.ballsPerOver == 0) {
      document.getElementById("ball-log").innerHTML = "";
    }

    match.currentBall++;
    if (
      match.currentBall > match.overs * match.ballsPerOver ||
      currentBatsmanTeam.wickets > gameData.playerSelection.maxPlayers - 1
    ) {
      if (gameData.toss.loser === currentBatsmanTeam.name) {
        match.completed = true;
        match.winner =
          player1.fanPointScores > player2.fanPointScores
            ? player1.name
            : player2.name;
        alert(`Congratulations to winner ${match.winner}.`);
        resultButton.disabled = false;
        hitButton.disabled = true;
        // document.getElementById("container").style.display = "none";
        // document.getElementById("resultButton").style.display = "block";
      } else {
        alert(`${match.battingTeam}'s Team Completed Batting 
Now ${match.bowlingTeam}'s Team turn for Batting !!!`);
        player1.players.forEach((player) => (player.played = false));
        player2.players.forEach((player) => (player.played = false));
        [currentBatsmanTeam.turn, currentBowlerTeam.turn] = [
          currentBowlerTeam.turn,
          currentBatsmanTeam.turn,
        ];
        [match.battingTeam, match.bowlingTeam] = [
          match.bowlingTeam,
          match.battingTeam,
        ];
      }
      match.currentBall = 1;
      match.currentOver = 0;

      document.getElementById("ball-log").innerHTML = "";
      document.getElementById("current-batsman-name").innerText = "Batsman";
      document.getElementById("current-bowler-name").innerText = "Bowler";
      document.getElementById("current-over").innerText = 0;
      document.getElementById("current-ball").innerText = 0;
      document.getElementById("current-batsman-runs").innerText = 0;
      document.getElementById("current-batsman-points").innerText = 0;
      document.getElementById("current-bowler-points").innerText = 0;
    } else {
      BatsmanPlayer = findBatsmanMethod(currentBatsmanTeam.players);
      match.currentBatsman = BatsmanPlayer.name;
      document.getElementById("current-batsman-name").innerText =
        match.currentBatsman;

      BowlerPlayer = findBowlerMethod(currentBowlerTeam.players);
      match.currentBowler = BowlerPlayer.name;
      document.getElementById("current-bowler-name").innerText =
        match.currentBowler;

      document.getElementById("current-batsman-runs").innerText =
        BatsmanPlayer.runs;
      document.getElementById("current-batsman-points").innerText =
        BatsmanPlayer.fanPoints;
      document.getElementById("current-bowler-points").innerText =
        BowlerPlayer.fanPoints;
    }
  }, 1000);

  console.log(gameData);
});
// Function to display team details
function displayTeamDetails(team, teamElementId) {
  const teamNameElement = document.getElementById(`${teamElementId}-name`);
  const teamRunsElement = document.getElementById(`${teamElementId}-runs`);
  const teamFanPointsElement = document.getElementById(
    `${teamElementId}-fanpoints`
  );
  const teamWicketsElement = document.getElementById(
    `${teamElementId}-wickets`
  );
  const teamPlayersElement = document.getElementById(
    `${teamElementId}-players-res`
  );
  // Set team name, runs, fantasy points, and wickets
  teamNameElement.textContent = team.name;
  teamRunsElement.textContent = team.totalRuns;
  teamFanPointsElement.textContent = team.fanPointScores;
  teamWicketsElement.textContent = team.wickets;
  // Create rows for each player
  team.players.forEach((player) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${player.name}</td>
          <td>${player.role}</td>
          <td>${player.runs}</td>
          <td>${player.playedBalls}</td>
          <td>${player.fanPoints}</td>
      `;
    teamPlayersElement.appendChild(row);
  });
}
// Function to initialize and display match details
function initMatchDetails() {
  if (!gameData.toss.completed) {
    alert("You need to complete the toss first!");
    return;
  }
  // Display toss and match winner details
  document.getElementById("toss-winner").textContent = gameData.toss.winner;
  document.getElementById("match-winner").textContent = gameData.match.winner;

  // Display details for both teams
  displayTeamDetails(gameData.teams.player1, "team1");
  displayTeamDetails(gameData.teams.player2, "team2");
}
document
  .getElementById("resultButton")
  .addEventListener("click", initMatchDetails);
