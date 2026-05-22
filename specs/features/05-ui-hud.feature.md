# Feature: UI & HUD

## Background
The boxing game needs a real-time HUD displaying player and opponent health/stamina, plus end-game screens with restart functionality.

## Acceptance Scenarios (Gherkin)

### Scenario: Health bars display correctly
Given the game is running
When I view the screen
Then I should see the player health bar at the top left
And I should see the opponent health bar at the top right
And both health bars should show 100% fill

### Scenario: Stamina bar displays for player
Given the game is running
When I view the screen
Then I should see the player stamina bar below the health bar
And the stamina bar should show 100% fill

### Scenario: Health decreases when player takes damage
Given the game is running
When the opponent hits the player
Then the player health bar should decrease proportionally
And the health bar color should remain visible

### Scenario: Stamina decreases when player attacks
Given the game is running
When the player performs an attack
Then the player stamina bar should decrease
And the stamina bar should regenerate over time

### Scenario: Win screen displays on victory
Given the game is running
When the opponent health reaches 0
Then I should see a "YOU WIN!" message
And I should see a restart button

### Scenario: Lose screen displays on defeat
Given the game is running
When the player health reaches 0
Then I should see a "YOU LOSE!" message
And I should see a restart button

### Scenario: Restart button resets the game
Given the game has ended with a win or loss
When I click the restart button
Then the game should reset to initial state
And both health bars should show 100%
And both stamina bars should show 100%
And the game should be playable again
