# Feature: AI Opponent

**Feature ID:** 04-ai-opponent  
**Status:** In Development

## Overview
Autonomous decision tree for AI boxer that selects actions based on distance, stamina, and cooldowns.

## Acceptance Scenarios (Gherkin)

```gherkin
Feature: AI Opponent Decision Making

  Background:
    Given an AI opponent exists
    And the AI has initial stamina of 100
    And the AI has health of 100

  Scenario: AI jabs when player is at close range and AI has stamina
    Given the player is at distance 50 pixels
    And the AI has stamina greater than 20
    And the jab cooldown is 0
    When the AI makes a decision
    Then the AI should execute a jab

  Scenario: AI hooks when player is at close range and hook is off cooldown
    Given the player is at distance 40 pixels
    And the AI has stamina greater than 30
    And the hook cooldown is 0
    And the jab was used recently
    When the AI makes a decision
    Then the AI should execute a hook

  Scenario: AI moves forward when player is at far range
    Given the player is at distance 200 pixels
    When the AI makes a decision
    Then the AI should move forward

  Scenario: AI dodges when player is winding up an attack
    Given the player is winding up an attack
    And the AI has stamina greater than 15
    And the dodge cooldown is 0
    When the AI makes a decision
    Then the AI should execute a dodge

  Scenario: AI backs away when stamina is low
    Given the AI has stamina less than 25
    And the player is at distance 60 pixels
    When the AI makes a decision
    Then the AI should move backward

  Scenario: AI does not attack when on cooldown
    Given the player is at distance 50 pixels
    And the jab cooldown is 500 milliseconds
    And the hook cooldown is 1000 milliseconds
    When the AI makes a decision
    Then the AI should move forward or backward

  Scenario: AI maintains optimal fighting distance
    Given the player is at distance 80 pixels
    And the AI has stamina greater than 50
    When the AI makes a decision
    Then the AI should maintain position or circle
```

## Technical Requirements

### Decision Tree Priority
1. **Emergency Responses** (highest priority)
   - Dodge if player is winding up an attack and dodge is off cooldown
   - Back away if stamina < 25%

2. **Offensive Actions**
   - Hook if distance <= 50px, stamina >= 30, hook off cooldown, and random chance
   - Jab if distance <= 70px, stamina >= 20, jab off cooldown

3. **Positioning**
   - Move forward if distance > 150px
   - Move backward if distance < 30px
   - Circle/strafe if distance between 70-150px

4. **Idle** (default)
   - Stand and recover stamina

### Parameters
- **Optimal range:** 50-100 pixels
- **Jab range:** <= 70 pixels, costs 20 stamina, 800ms cooldown
- **Hook range:** <= 50 pixels, costs 30 stamina, 1500ms cooldown  
- **Dodge:** costs 15 stamina, 1200ms cooldown
- **Stamina recovery:** 10 per second when idle

### AI Difficulty Settings
- **Easy:** Slower reaction time (300ms delay), predictable patterns
- **Medium:** Normal reaction time (150ms delay), some variation
- **Hard:** Fast reactions (50ms delay), varied attack patterns

## Dependencies
- None (base game feature)

## Notes
- AI should feel challenging but fair
- Patterns should vary to avoid predictability
- AI should respect the same physics/cooldown rules as the player
