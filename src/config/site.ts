/* -------------------------------------------------------------------------- */
/*  EDIT ME                                                                    */
/*  Everything the site says lives in this one file. Change the words here     */
/*  and the whole page updates — you never need to touch a component.          */
/* -------------------------------------------------------------------------- */

export const site = {
  /**
   * What you call her — this is the one splashed across the hero, the
   * preloader and the closing line.
   */
  name: "Trez",

  /**
   * Her full name. Used only where the extra weight earns it: the letter
   * greeting and the browser tab. Set it to the same as `name` if you would
   * rather it never appears.
   */
  fullName: "Treasure",

  /** Shown under the name. Keep it short. */
  tagline: "Happy Birthday, my favourite person",

  /** Birthday. Months are 1-indexed here (10 = October). */
  birthday: {
    month: 10,
    day: 8,
  },

  /** Little line in the browser tab / link previews. */
  meta: {
    title: "Happy Birthday, Treasure 💙",
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
    greeting: "Dear Treasure,",
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

  /* ---------------------------------------------------------------------- */
  /*  LITTLE THINGS I REMEMBER                                               */
  /*  Small moments, not big ones. One or two sentences each — the shorter   */
  /*  and more specific, the better they land. Add or remove freely.         */
  /*  `photo` is optional: drop a file in `public/photos/` and point at it.  */
  /* ---------------------------------------------------------------------- */
  memories: [
    {
      text: "The way you always steal the window seat and then pretend you did not plan it.",
      photo: null,
    },
    {
      text: "How you narrate films you have already seen, even when I ask you not to. Especially when I ask you not to.",
      photo: null,
    },
    {
      text: "That you say goodnight twice — once when you mean it, and once forty minutes later.",
      photo: null,
    },
    {
      text: "The face you make at the first sip of something too hot, every single time, having learned nothing.",
      photo: null,
    },
    {
      text: "How you remember tiny things about people and bring them up months later like it is nothing.",
      photo: null,
    },
    {
      text: "The specific quiet of you concentrating. I have gotten very good at not interrupting it.",
      photo: null,
    },
  ] as ReadonlyArray<{ text: string; photo: string | null }>,

  /* ---------------------------------------------------------------------- */
  /*  BIRTHDAY TIME CAPSULE                                                  */
  /*  A sealed envelope she clicks open. `message` is the letter inside      */
  /*  (one string per paragraph); `wishes` is the list for her new year.     */
  /* ---------------------------------------------------------------------- */
  timeCapsule: {
    eyebrow: "Sealed until today",
    title: "A time capsule",
    prompt: "Something I wrote down and saved for this exact morning. Go on — open it.",
    sealInitial: "T",
    buttonSealed: "Break the seal",
    message: [
      "I wrote this a while before your birthday, so by the time you read it I have already been looking forward to it for weeks.",
      "Here is what I want you to know going into this year: you are allowed to take up space in it. Ask for the thing. Go to the place. Be as much as you already are.",
    ],
    wishesTitle: "For your new year",
    wishes: [
      "That the thing you have been quietly working towards finally gives.",
      "That you sleep properly, at least sometimes.",
      "That someone surprises you in the good way.",
      "That you get a whole day with nothing scheduled and nobody needing you.",
      "That you laugh so hard it stops being about anything funny.",
    ],
    signoff: "See you on the other side of the candles.",
  },

  /* ---------------------------------------------------------------------- */
  /*  MUSIC                                                                  */
  /*                                                                         */
  /*  Each track can carry either player:                                    */
  /*                                                                         */
  /*   youtubeId  PREFERRED — plays the song in FULL, free, no account.      */
  /*              The id is the bit after `v=` in a watch link, or the last  */
  /*              path segment of a youtu.be link.                           */
  /*                                                                         */
  /*   spotifyId  Fallback, used only when youtubeId is null. A Spotify      */
  /*              embed plays a 30-second preview unless the listener is     */
  /*              signed in to Spotify in that same browser.                 */
  /*                                                                         */
  /*  Either player supplies its own artwork and title, so only the note     */
  /*  needs writing here.                                                    */
  /* ---------------------------------------------------------------------- */
  music: {
    eyebrow: "On repeat",
    title: "Two songs that are just you now",
    subtitle:
      "Press play. I cannot hear either of these without thinking of you, so now neither can you.",
    tracks: [
      {
        youtubeId: null,
        spotifyId: "3oNQ6NkihVzQkV5qhk2Pbe",
        note: "This one is yours. It has been for a while.",
      },
      {
        youtubeId: null,
        spotifyId: "39sDitIeCMrVX2QyXHY46t",
        note: "And this one is ours.",
      },
    ] as ReadonlyArray<{
      youtubeId: string | null;
      spotifyId: string | null;
      note: string;
    }>,
  },

  /* ---------------------------------------------------------------------- */
  /*  OUTRO                                                                  */
  /*  The last thing on the page: one more song to see her out.              */
  /* ---------------------------------------------------------------------- */
  outro: {
    eyebrow: "You reached the end",
    title: "One last song",
    body: "You have read the whole thing, so you have earned this. Press play and let it see you out.",
    hint: "Tap play — I picked this one for right now",

    /**
     * PREFERRED. A YouTube video id — the bit after `v=` in a watch link, or
     * the last path segment of a youtu.be link.
     *
     * Why YouTube for this one: a Spotify embed only plays a 30-second
     * preview unless the listener happens to be signed in to Spotify in that
     * same browser. YouTube plays the song in full, for free, with no account
     * — which is what "let it play all the way through" actually needs.
     * It also lets the page try to start the song by itself when she arrives.
     */
    youtubeId: null as string | null,

    /** Fallback, used only when `youtubeId` is null. Plays a 30s preview. */
    spotifyId: "0DfHX7TBn8srQlyUS7UUBC",
  },


  /** Final send-off. */
  closing: {
    title: "Make a wish",
    /** How many candles sit on the cake. */
    candles: 3,
    /** Shown before any candle is out. */
    body: "Three candles. Take your time with the wish.",
    /** The big animated line once every candle is out. */
    wish: "I hope your wish comes true",
    /** Shown under it. */
    bodyDone:
      "Whatever you just wished for, I am on your side. Now go and have the kind of day you would want to relive.",
  },
} as const;

export type Site = typeof site;
