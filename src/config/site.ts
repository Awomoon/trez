/* -------------------------------------------------------------------------- */
/*  EDIT ME                                                                    */
/*  Everything the site says lives in this one file. Change the words here     */
/*  and the whole page updates — you never need to touch a component.          */
/* -------------------------------------------------------------------------- */

export const site = {
  /** Her name, shown huge on the hero. */
  name: "Trez",

  /** Shown under the name. Keep it short. */
  tagline: "Happy Birthday, my favourite person",

  /** Birthday. Months are 1-indexed here (10 = October). */
  birthday: {
    month: 10,
    day: 8,
  },

  /** Little line in the browser tab / link previews. */
  meta: {
    title: "Happy Birthday, Trez 💙",
    description:
      "A small corner of the internet built entirely for you — October 8th.",
  },

  /** The hero's rotating words. Any number of them. */
  heroWords: ["brilliant", "radiant", "kind", "unforgettable", "mine"],

  /** Countdown section copy. */
  countdown: {
    beforeTitle: "Counting down to your day",
    dayOfTitle: "It's today. It's finally today.",
    afterTitle: "Your day happened — and it was perfect",
    beforeSubtitle:
      "Every second between now and October 8th is a second closer to celebrating you.",
    dayOfSubtitle:
      "Eight of October. The best day on the whole calendar, and it belongs to you.",
    afterSubtitle:
      "Consider this page a permanent reminder of how loved you are.",
  },

  /** Reason cards. Add or remove freely — the grid adapts. */
  reasons: [
    {
      title: "Your laugh",
      body: "It arrives before the punchline and stays in the room long after. I have caught myself saying things just to hear it again.",
      emoji: "🎧",
    },
    {
      title: "Your mind",
      body: "You notice the things everyone else walks past. Talking to you makes the world feel bigger than it did an hour ago.",
      emoji: "🌊",
    },
    {
      title: "Your kindness",
      body: "It is never loud and never for show. It just shows up, quietly, exactly when someone needs it most.",
      emoji: "💙",
    },
    {
      title: "Your stubbornness",
      body: "Yes, this is a compliment. You decide something is worth it and then simply refuse to let the world talk you out of it.",
      emoji: "⚡",
    },
    {
      title: "Your blue",
      body: "Somehow you made an entire colour yours. Now I cannot see an ocean, a sky, or a neon sign without thinking of you.",
      emoji: "🫧",
    },
    {
      title: "Your everything",
      body: "There is no clean way to finish this list, so I will just say it plainly: it is you. All of it is you.",
      emoji: "✨",
    },
  ],

  /** Horizontal scrolling memory timeline. */
  timeline: [
    {
      chapter: "01",
      title: "The beginning",
      body: "Before I knew how important it would turn out to be. Funny how the biggest days never announce themselves.",
    },
    {
      chapter: "02",
      title: "The first real conversation",
      body: "The one that ran far too late and ended far too early, and rearranged something quietly in me.",
    },
    {
      chapter: "03",
      title: "The ordinary days",
      body: "No occasion, no plan. Just you, being you, somewhere near me. Still my favourite genre of day.",
    },
    {
      chapter: "04",
      title: "Every day after this one",
      body: "Unwritten on purpose. I would like to fill it in with you, slowly, for a very long time.",
    },
  ],

  /** The letter. Each string is its own paragraph. */
  letter: {
    greeting: "Dear Trez,",
    paragraphs: [
      "I built this instead of buying a card, because a card gives you about forty words and I needed more than that.",
      "You have this way of making everything lighter just by being in it. Rooms, bad days, long weeks — you walk in and the whole thing recalibrates. I do not think you know how rare that is.",
      "So today is not really about cake or candles or the number. It is about the fact that you exist, and that somehow I get to be the person standing next to you while you do it.",
      "Happy birthday. I hope this year is unreasonably good to you.",
    ],
    signature: "Always yours",
  },

  /**
   * Optional photo gallery. Drop images into `public/photos/` and list them
   * here — the gallery section appears automatically once there is at least
   * one. Leave the array empty and the section is skipped entirely.
   *
   *   { src: "/photos/us-01.jpg", caption: "That night in the rain" },
   */
  photos: [] as ReadonlyArray<{ src: string; caption: string }>,

  /** Final send-off. */
  closing: {
    title: "Make a wish",
    /** Shown before any candle is out. */
    body: "Five candles, five chances. Take your time with the wish.",
    /** Shown once every candle is out. */
    bodyDone:
      "Whatever you just wished for, I am on your side. Now go and have the kind of day you would want to relive.",
  },
} as const;

export type Site = typeof site;
