/* -------------------------------------------------------------------------- */
/*  EDIT ME                                                                    */
/*  Everything the site says lives in this one file. Change the words here     */
/*  and the whole page updates, so you never touch a component.            */
/* -------------------------------------------------------------------------- */

export const site = {
  /**
   * What you call her. This is the one splashed across the hero, the
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
      "A small corner of the internet built entirely for you, for October 8th.",
  },

  /** The hero's rotating words. Any number of them. */
  heroWords: ["brilliant", "radiant", "kind", "unforgettable", "mine"],

  /** Countdown section copy. */
  countdown: {
    beforeTitle: "Counting down to your day",
    dayOfTitle: "It's today. It's finally today.",
    afterTitle: "Your day happened, and it was perfect",
    beforeSubtitle:
      "Every second between now and October 8th is a second closer to celebrating you.",
    dayOfSubtitle:
      "Eight of October. The best day on the whole calendar, and it belongs to you.",
    afterSubtitle:
      "Consider this page a permanent reminder of how loved you are.",
  },

  /** Reason cards. Add or remove freely; the grid adapts. */
  reasons: [
    {
      title: "Your laugh",
      body: "It arrives before the punchline and stays in the room long after. I have caught myself saying things just to hear it again.",
      emoji: "🎧",
    },
    {
      title: "Your mind",
      body: "You actually want to know people. Not the surface of them. The whole thing. You ask the question after the question, you listen to the answer, and you remember it months later.",
      emoji: "💭",
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
      title: "Your everything",
      body: "There is no clean way to finish this list, so I will just say it plainly: it is you. All of it is you.",
      emoji: "✨",
    },
  ],

  /** Horizontal scrolling memory timeline. */
  timeline: [
    {
      chapter: "01",
      title: "A comment under a TikTok",
      body: "That’s honestly how it started. One comment, the kind you scroll past a thousand times without thinking twice. Neither of us had any idea what it was going to turn into.",
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

  /**
   * The letter, in his words, unedited. Each string is its own paragraph.
   * `closing` is the final line, set larger than the body. `signature` is
   * optional: leave it empty and only the drawn flourish appears.
   */
  letter: {
    greeting: "Happy birthday, Treasure. \u2764\uFE0F",
    paragraphs: [
      "There are so many things I could say about you, and I still don\u2019t think I\u2019d ever find the right words to explain how much you mean to me.",
      "You\u2019re one of the sweetest people I\u2019ve had the privilege of knowing. You have such a gentle heart and a kindness that I don\u2019t think you always realize you carry. I love the way you care about the people you love, the way you try even when things aren\u2019t easy, and all the little things that make you who you are.",
      "Thank you for every conversation, every random laugh, every late night, every \u201Care you okay?\u201D, and every little moment we shared. Some of my favorite memories are the simplest ones just talking, laughing, and knowing you were there.",
      "Meeting you has been one of the most meaningful parts of my life, and I\u2019ll always be grateful for the memories we made.",
      "I hope you never forget how appreciated you are, and I hope this new year brings you beautiful things.",
      "Thank you for being you.",
      "And most of all, thank you for existing.",
    ],
    closing: "Happy birthday, Trez. \u2764\uFE0F",
    signature: "",
  },

  /**
   * Optional photo gallery. Drop images into `public/photos/` and list them
   * here. The gallery section appears automatically once there is at least
   * one. Leave the array empty and the section is skipped entirely.
   *
   *   { src: "/photos/us-01.jpg", caption: "That night in the rain" },
   */
  photos: [] as ReadonlyArray<{ src: string; caption: string }>,

  /* ---------------------------------------------------------------------- */
  /*  LITTLE THINGS I REMEMBER                                               */
  /*  Small moments, not big ones. One or two sentences each. The shorter     */
  /*  and more specific, the better they land. Add or remove freely.         */
  /*  `photo` is optional: drop a file in `public/photos/` and point at it.  */
  /* ---------------------------------------------------------------------- */
  memories: [
    {
      text: "I remember the Spotify jams that ran way too late. Both of us going quiet, both of us falling asleep with it still playing. 🎧",
      photo: null,
    },
    {
      text: "I remember how we prank each other out of nowhere. No reason, no warning, just because you were there and I was bored.",
      photo: null,
    },
    {
      text: "I remember the days we would comfort each other over absolutely nothing. Nothing was wrong. We did it anyway.",
      photo: null,
    },
    {
      text: "I remember the first night you sent me a picture of you before bed. I’ve thought about that one more than I should probably admit. 🌙",
      photo: null,
    },
    {
      text: "I remember how nervous I got the first time you told me about your cramps. I genuinely didn’t know what to do with myself.",
      photo: null,
    },
    {
      text: "I remember how loud you got when we finally won our first Call of Duty battle royale. I can still hear it. 🎮",
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
    prompt: "Something I wrote down and saved for this exact morning. Go on, open it.",
    sealInitial: "T",
    buttonSealed: "Break the seal",
    message: [
      "I wrote this a while before your birthday, so by the time you read it, I\u2019ve already been looking forward to this day for weeks.",
      "Here\u2019s what I want you to know going into this year: you\u2019re allowed to take up space in it. Ask for the thing. Go to the place. Be as much as you already are.",
    ],
    wishesTitle: "For your new year",
    wishes: [
      "May the thing you\u2019ve been quietly working towards finally give.",
      "May you sleep properly, at least sometimes.",
      "May someone surprise you in the best way.",
      "May you love yourself a little more.",
      "May you laugh so hard that, for a moment, it stops being about anything funny.",
    ],
    /**
     * Shown in place of `prompt` once the capsule is open. Empty on purpose:
     * his message is the only voice that belongs here, so nothing of mine is
     * left sitting above it. Set it to a line of your own and it reappears.
     */
    signoff: "",
  },

  /* ---------------------------------------------------------------------- */
  /*  MUSIC                                                                  */
  /*                                                                         */
  /*  Each track can carry either player:                                    */
  /*                                                                         */
  /*   youtubeId  PREFERRED. Plays the song in FULL, free, no account.       */
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
    title: "Three songs that are just you now",
    subtitle:
      "Press play. I cannot hear any of these without thinking of you, so now neither can you.",
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
      {
        youtubeId: null,
        spotifyId: "0WQiDwKJclirSYG9v5tayI",
        note: "And this one, because some songs only make sense once you know the person.",
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
    hint: "Tap play. I picked this one for right now",

    /**
     * PREFERRED. A YouTube video id, the bit after `v=` in a watch link, or
     * the last path segment of a youtu.be link.
     *
     * Why YouTube for this one: a Spotify embed only plays a 30-second
     * preview unless the listener happens to be signed in to Spotify in that
     * same browser. YouTube plays the song in full, for free, with no account
     * which is what "let it play all the way through" actually needs.
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
