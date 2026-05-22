Feature: 2D Browser Boxing Game

  Scenario: Player launches game and sees initial state
    Given the player opens index.html in Chrome
    When the page loads
    Then a canvas element should be visible
    And two boxer characters should be rendered on screen
    And player health bar should show 100 HP
    And AI health bar should show 100 HP
    And player stamina bar should show 100 stamina

  Scenario: Player executes jab attack successfully
    Given the game is running
    And player has at least 15 stamina
    And AI opponent is within 40 pixels range
    When player presses "J" key
    Then player stamina should decrease by 15
    And jab animation should play for player
    And AI health should decrease by 10
    And AI should enter hit stun state

  Scenario: Player executes hook attack and staggers opponent
    Given the game is running
    And player has at least 30 stamina
    And AI opponent is within 35 pixels range
    When player presses "H" key
    Then player stamina should decrease by 30
    And hook animation should play for player
    And AI health should decrease by 25
    And AI should enter stagger state for 1 second

  Scenario: Player performs footwork with dodge i-frames
    Given the game is running
    And player has at least 20 stamina
    When player presses "D" key
    Then player stamina should decrease by 20
    And player should move 100 pixels laterally
    And player should be invulnerable for 200 milliseconds
    And AI attacks during i-frame window should deal 0 damage

  Scenario: Actions are blocked when stamina is depleted
    Given the game is running
    And player stamina is at 10
    When player presses "J" key
    Then no jab animation should play
    And player stamina should remain at 10
    And no damage should be dealt

  Scenario: Stamina regenerates over time
    Given the game is running
    And player stamina is at 50
    And player is in idle state
    When 2 seconds elapse
    Then player stamina should be at 70

  Scenario: AI opponent performs autonomous actions
    Given the game is running
    And AI opponent has stamina
    When 500 milliseconds elapse
    Then AI should execute either jab, hook, or footwork
    And AI stamina should decrease appropriately

  Scenario: Player wins when AI health reaches zero
    Given the game is running
    And AI health is at 10
    When player executes successful jab dealing 10 damage
    Then AI health should be at 0
    And game should transition to end screen
    And "Victory" message should be displayed
    And restart button should be visible

  Scenario: Player loses when player health reaches zero
    Given the game is running
    And player health is at 10
    When AI executes successful jab dealing 10 damage
    Then player health should be at 0
    And game should transition to end screen
    And "Defeat" message should be displayed
    And restart button should be visible

  Scenario: Player restarts match from end screen
    Given game has ended with defeat screen visible
    When player clicks restart button
    Then player health should reset to 100
    And AI health should reset to 100
    And both stamina bars should reset to 100
    And game loop should resume from initial positions
