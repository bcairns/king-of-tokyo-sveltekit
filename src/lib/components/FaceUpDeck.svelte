<script>
  import PowerCard from '$lib/components/PowerCard.svelte';
  import {shuffle} from '$lib/game/game-kit.js';
  import {cards} from '$lib/game/game.js';

  export let players;
  export let discard;

  let faceUp = [];


  const buyFaceUpCard = event => {
    const activeCardIndex = faceUp.findIndex((card) => card.label == event.currentTarget.getAttribute('data-id'));
    const activeCard = faceUp[activeCardIndex];

    if (activeCard.type === 'keep') {
      // Remove clicked card from FaceUp deck and push to Player X deck
      let toPlayer = parseInt(prompt('Which player?'));
      toPlayer--;

      const boughtCard = faceUp.splice(activeCardIndex, 1)[0]; // splice returns an array of one
      players[toPlayer].cards.push(boughtCard);

      dealFaceUpCard(1);
    } else if (activeCard.type === 'discard') {
      // Move clicked card to Discards
      const boughtCard = faceUp.splice(activeCardIndex, 1)[0]; // splice returns an array of one
      discard.push(boughtCard);
      dealFaceUpCard(1);
    }

    players = players;
    faceUp = faceUp;
    discard = discard;
  }

  const sweepFaceUpCards = () => {
    discard = discard.concat(faceUp);
    faceUp = [];

    dealFaceUpCard(3);

    faceUp = faceUp;
    discard = discard;

  }

  // Cards
  const shuffledDeck = shuffle(cards.filter((item) => item.status === 'active'));

  const dealFaceUpCard = (numCards) => {
    // TODO: Check for the end of the deck; reshuffle discards? Check rules
    for (let i = 0; i < numCards; i++) {
      faceUp.push(shuffledDeck.pop());
    }
  }

  dealFaceUpCard(3);
</script>

<section class="face-up-deck">
  <!-- Centre things -->
  <h2>Power Cards
    <button class="sweep-cards" on:click={sweepFaceUpCards}>Sweep Cards</button>
  </h2>
  <ul>
    {#each faceUp as card}
      <li>
        <PowerCard {card} onClick={buyFaceUpCard}/>
      </li>
    {/each}
  </ul>
</section>

<style>
  h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  ul {
    /* TODO: Make responsive on mobile (either flex or media query) */
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    place-items: stretch;
    gap: 1rem;

    list-style: none;
    padding-left: 0;
  }
</style>
