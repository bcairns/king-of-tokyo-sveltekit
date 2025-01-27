<script>
  import {roll, reduceRollResults} from '$lib/game/game-kit.js';
  import {dieFaces, dice} from '$lib/game/game.js';

  export let fullScreen = false;

  let rollBtn;
  let resolveBtn
  let resetBtn;

  let keepPile = [];
  let rollPile = [];

  let rollState = 'initial'; // initial|rolling|resolved
  let rollCount = 0;

  let rollResults = [];

  const resolveDice = () => {

    // Reduce the results of the dice
    rollResults = reduceRollResults($dice);

    rollState = 'resolved';

  }

  const resetDice = () => {
    $dice.forEach((die, index) => {
      $dice[index].value = '';
      $dice[index].keep = false;
    });

    rollCount = 0;
    rollResults = [];
    rollState = 'initial';
  }

  const rollDice = () => {

    rollState = 'rolling';

    if (rollCount < 3) {
      $dice.forEach((die, index) => {
        if (!die.keep) {
          $dice[index].value = roll(dieFaces).label;
        }
      })

      rollCount++;

      if (rollCount === 3) {
        resolveDice();
      }

    } else {
      resolveDice();
    }

  };

  $: resolveDisabled = rollState !== 'rolling';
  $: rollDisabled = rollState === 'resolved';
  $: resetDisabled = rollState === 'initial';

  $: keepPile = $dice.filter(die => die.keep);
  $: rollPile = $dice.filter(die => !die.keep);
</script>

<div class="dice" class:full-screen={fullScreen}>
  <section class="roll-nav">
    <ul>
      <li>
        <button bind:this={rollBtn} on:click={rollDice} class="roll-dice" disabled={rollDisabled}>Roll Dice</button>
      </li>
      <li>
        <button bind:this={resolveBtn} on:click={resolveDice} class="resolve-dice" disabled={resolveDisabled}>Resolve
        </button>
      </li>
      <li>
        <button bind:this={resetBtn} on:click={resetDice} class="reset-dice" disabled={resetDisabled}>Reset</button>
      </li>
    </ul>
  </section>
  <section class="dice-piles">
    {#if keepPile.length}
      <ul class="keep-pile">
        {#each keepPile as die}
          <li>
            <button on:click={() => $dice[die.id].keep = !die.keep} class="die {die.value}" aria-label={die.value}
                    disabled={resolveDisabled}></button>
          </li>
        {/each}
      </ul>
    {/if}
    {#if rollPile.length}
      <ul class="roll-pile">
        {#each rollPile as die}
          <li>
            <button on:click={() => $dice[die.id].keep = !die.keep} class="die {die.value}" aria-label={die.value}
                    disabled={resolveDisabled}></button>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
  <section class="resolve-pile">
    <ul>
      {#each Object.entries(rollResults) as [key, value]}
        <li>
          <button disabled>{key}: {value}</button>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  :root {
    --dice-font-size: 100%;
    --direction: column;
    --roller-width: min-content;
    --grid-areas: 
      'resolve piles'
      'nav     piles';
  }

  @media screen and (orientation: landscape) {
    :root {
      --direction: row;
      --grid-areas: 
        'nav'
        'piles'
        'resolve';
    }
  }

  .full-screen {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }

  .dice {
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-areas: 
      var(--grid-areas);
  }

  .roll-nav {
    padding: 1rem 0;
    grid-area: nav;
  }
  .roll-nav ul {
    display: flex;
    flex-direction: var(--direction);
    justify-content: center;
    padding-left: 0;
    margin: 0;
  }
  .resolve-pile {
    grid-area: resolve;
  }
  .resolve-pile ul {
    display: flex;
    flex-direction: var(--direction);
    justify-content: center;
    list-style: none;
  }

  .dice {
    margin-bottom: 5rem;
  }

  /* TODO: Figure out how to display dice on mobile */
  .dice-piles {
    grid-area: piles;

    display: flex;
    flex-direction: var(--direction);
    justify-content: center;
    align-items: center;
  }

  .roll-pile, .keep-pile {
    display: flex;
    flex-direction: var(--direction);
    gap: 0.5em;
    align-items: center;

    margin: 0;
    padding: 0.5em;
  }

  .keep-pile {
    box-shadow: inset 0 0 5px rgba(0,0,0,0.6);
    background-color: hsl(0deg, 0%, 93%);
    border-radius: 1em;
    width: var(--roller-width);
  }

  .die {
    display: grid;
    place-items: center;
    width: 3em;
    height: 3em;
    font-size: var(--dice-font-size);

    margin: 0;
    padding: 0;

    color: hsl(60deg, 90%, 55%);
    border-radius: 0.2em;
    background-color: hsl(250deg, 10%, 40%);
    box-shadow: 0px 1px 1px rgba(0,0,0,0.08),
    0px 2px 2px rgba(0,0,0,0.08),
    0px 4px 4px rgba(0,0,0,0.08),
    0px 8px 8px rgba(0,0,0,0.08);
    border: none;
  }

  .die::before {
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    font-size: 1.75em;
  }

  .die:hover {
    color: hsl(60deg, 100%, 55%);
    background-color: hsl(250deg, 20%, 40%);
  }

  /* TODO: Rafactor using custom SVGs */
  button.die.one::before {
    content: "\f525";
  }

  button.die.two::before {
    content: "\f528";
  }

  button.die.three::before {
    content: "\f527";
  }

  button.die.attack::before {
    content: "\f1b0";
  }

  button.die.heal::before {
    content: "\f004";
  }

  button.die.money::before {
    content: "\f0e7";
  }


  .die:disabled {
    opacity: .75;
  }

  .die:disabled:hover {
    color: hsl(60deg, 90%, 55%);
    background-color: hsl(250deg, 10%, 40%);
  }


</style>
