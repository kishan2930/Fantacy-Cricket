# Fantasy Cricket Game [Click Here](https://fantacy-cricket.vercel.app/)

This project is a web-based Fantasy Cricket game between two players. Each player selects a team of 11 players within a 100-credit cap, follows the team selection rules, and simulates a match between the teams. The game calculates fantasy points based on player performance and determines the winner.

## Features Implemented

### Team Creation

- **11 Players per Team**: Each player must select exactly 11 players.
- **100 Credit Cap**: Each team must stay within the 100-credit limit.
- **Role Constraints**:
  - 5 Batsmen
  - 5 Bowlers
  - 1 Wicketkeeper
- **Captain and Vice-Captain**:
  - Each player selects a captain who earns 2x fantasy points.
  - Each player selects a vice-captain who earns 1.5x fantasy points.

### Toss Functionality

- **Coin Toss**: The system randomly selects a toss winner.
- **Toss Winner Advantage**: The player who wins the toss gets the first chance to build their team.

### Player Selection

- **Dynamic Selection**: Players select from a pool of available players. Once selected, they are removed from the available list.
- **Credit Management**: The system ensures that teams stay within the 100-credit limit.
- **Role Validation**: The system ensures that each team follows the role constraints (5 batsmen, 5 bowlers, and 1 wicketkeeper).

### Match Simulation

- **Match Format**: Each team plays 5 overs (30 balls) in total, with each over consisting of 6 balls.
- **Shot Types**:
  - Single (1 run)
  - Double (2 runs)
  - Three (3 runs)
  - Boundary (4 runs)
  - Six (6 runs)
  - Dot Ball (no runs)
  - Wicket (player out)
- **Bowler Rotation**: After each over, a new bowler from the bowling team is selected who hasn't bowled yet.
- **5-Second Delay Between Balls**: Each ball action (HIT button) is delayed by 5 seconds to simulate real-time play.

### Fantasy Points System

- **Batting Points**:
  - Each Run: Run point
  - Four: 5 points
  - Six: 8 points
  - Duck (dismissed for 0): -2 points
- **Bowling Points**:
  - Wicket: 10 points
  - Dot Ball: 1 point
- **Captain/Vice-Captain Multiplier**:
  - Captain: 2x points
  - Vice-Captain: 1.5x points

### Game Flow

1. **Team Name Entry**: Both players enter their team names.
2. **Toss**: The system randomly selects a toss winner.
3. **Team Creation**: The toss winner selects their team first, followed by the other player.
4. **Match Start**: After team selection, the match begins with the toss-winning team batting first.
5. **Player Actions**: Each player can hit the ball, and the system randomly selects a shot type.
6. **Score Update**: The scoreboard and fantasy points are updated after every ball.
7. **Match Completion**: After 5 overs per team, the match ends, and the system declares the winner based on total fantasy points.

### Scoreboard and Fantasy Points

- **Real-Time Updates**: The scoreboard and fantasy points are updated after each ball, and players can view the match summary at any point.
- **Winner Declaration**: At the end of the match, the team with the highest fantasy points is declared the winner.

## How to Play

1. **Enter Team Names**: Each player must enter their team name.
2. **Toss**: Click the "Toss" button to determine which team builds their team first.
3. **Team Selection**: The toss-winning player selects 11 players, followed by the other player.
4. **Start Match**: Click "Start Match" to begin the game.
5. **Play Shots**: Use the "HIT" button to play shots, and watch the scoreboard and fantasy points update.
6. **View Results**: After the match ends, view the final scoreboard and fantasy points to see the winner.

## Technologies Used

- **HTML**: For structuring the web interface.
- **CSS**: For styling and layout of the UI.
- **JavaScript**: For match logic, team selection, and fantasy points calculation.

## Future Enhancements

- **Multiplayer Mode**: Adding a feature for online multiplayer.
- **Detailed Player Statistics**: Track individual player stats across multiple games.
- **Save and Load Games**: Enable saving game progress and resuming later.

## Installation

1. Clone the repository.
   ```bash
   git clone https://github.com/kishan2930/Fantacy-Cricket.git
   ```
2. Open `index.html` in a web browser to start the game.

## Credits

- Developed by **Kishan Ambaliya.**
