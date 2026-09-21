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
      title: "Your laugh 😭✨",
      paragraphs: [
        "So thin and cute, just like your voice. 😭 Even though you sometimes go completely mute the moment you’re laughing too hard, I really love how thin your laugh sounds. It genuinely makes me happy hearing you laugh. 😭💕",
      ],
    },
    {
      title: "Your mind 💭",
      paragraphs: [
        "You notice the smallest things. Sometimes I’ll tell you something and wonder how you even noticed it in the first place. I really like that about you. You pay attention to things that most people would probably miss, and I think that’s really special. 💭✨",
      ],
    },
    {
      title: "Your kindness 💕✨",
      paragraphs: [
        "You’re kind, but not everyone gets to see that side of you. It’s so quiet. You don’t always make a big deal out of it, it just shows up exactly when someone needs it the most. And I really love that about you. 💕",
      ],
    },
    {
      title: "Your stubbornness 😭😭",
      paragraphs: [
        "The way you purposely disagree with something just because you’re “wicked” and you don’t want “la Peace” but “la War.” 😭😭",
        "I genuinely don’t know how you manage to argue about things just for the fun of arguing, but somehow it’s still one of the things I love about you. 😭",
      ],
    },
    {
      title: "Your everything 💕✨",
      paragraphs: [
        "Honestly, these are only a few of the things I can talk about. Because if I actually went on and on about everything I love about you, I’d probably run out of words before I even got halfway through.",
        "Everything about you is something I’d be proud to know, proud to love, and proud to have in my life. 💕✨",
      ],
    },
  ],

  /** Horizontal scrolling memory timeline. */
  timeline: [
    {
      chapter: "01",
      title: "The Comment 💕😭",
      paragraphs: [
        "Funny how a comment on your post started all of this.",
        "Out of all the things I could’ve said, somehow that comment became one of the most important comments I’ve ever made. 😭💕",
        "I still think it was the best comment.",
      ],
    },
    {
      chapter: "02",
      title: "The First Conversation 😭💕",
      paragraphs: [
        "Funny how I messaged you thinking you were a guy, and then I got nervous the moment I found out you were a girl. 😭💕",
        "I still laugh thinking about it.",
        "I’m just glad I didn’t stop talking to you.",
      ],
    },
    {
      chapter: "03",
      title: "The Ordinary Days 💕✨",
      paragraphs: [
        "I remember being worried sometimes that we’d have nothing to talk about.",
        "But somehow you made me realise that we didn’t always need some big conversation or something exciting happening.",
        "Sometimes just being there with each other was enough.",
        "The ordinary days became some of my favourite ones. 💕✨",
      ],
    },
    {
      chapter: "04",
      title: "Every Day After This One 💕✨",
      paragraphs: [
        "Nothing to write here yet.",
        "I want to fill this part with you, slowly, one day at a time.",
        "There’s still so much that hasn’t been written yet. 💕✨",
      ],
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
      title: "The Spotify mornings 🎧😭",
      paragraphs: [
        "I remember how we’d sometimes wake up in the morning apologising for sleeping off while we were on a jam on Spotify. 😭🎧",
        "Like somehow we’d both just disappear mid-jam and wake up later like, “I’m sorry, I slept off.” 😭",
      ],
      photo: null,
    },
    {
      title: "Random names 😭😭",
      paragraphs: [
        "I remember how we’d just randomly call each other names and make fun of each other whenever we were bored.",
        "Mostly because we had each other and apparently that was enough entertainment. Fish. 😭😭",
      ],
      photo: null,
    },
    {
      title: "Comforting each other 😗✨",
      paragraphs: [
        "I remember the times we’d just comfort each other even though nothing might actually be wrong.",
        "We’d still somehow find a reason to make sure the other person was okay. 😗✨",
      ],
      photo: null,
    },
    {
      title: "Hearing my name 😭💕",
      paragraphs: [
        "I remember the days when I’d be blushing just because of the way you called my name on calls. 😭💕",
        "I don’t even know why it affected me that much, but it did. 😭",
      ],
      photo: null,
    },
    {
      title: "The cramps panic 😭😭",
      paragraphs: [
        "I remember how nervous I was when I heard about your cramps because I genuinely had no idea what I was supposed to do. 😭😭",
        "I was probably more confused than helpful, but I really wanted you to be okay.",
      ],
      photo: null,
    },
    {
      title: "Our first Battle Royale win 🎮😭",
      paragraphs: [
        "I remember how excited you were after our first Call of Duty Battle Royale win. 😭🎮",
        "It was just a game, but seeing how happy you were made the whole thing feel so much more special.",
      ],
      photo: null,
    },
  ] as ReadonlyArray<{
    title: string;
    paragraphs: ReadonlyArray<string>;
    photo: string | null;
  }>,

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
    title: "Songs that remind me of you",
    subtitle:
      "Press play. I cannot hear any of these without thinking of you, so now neither can you.",

    tracks: [
      {
        youtubeId: null,
        spotifyId: "3oNQ6NkihVzQkV5qhk2Pbe",
        note:
          "This one explains how much you mean to me. Sometimes the way I see you makes you seem almost perfect in my eyes, and honestly, I don’t even know how to properly explain it. This song just puts some of those feelings into words when I can’t.",
      },
      {
        youtubeId: null,
        spotifyId: "39sDitIeCMrVX2QyXHY46t",
        note:
          "I don’t really know how to explain this one. There’s just something about this song that reminds me of you every single time I hear it. I can’t even point to one specific thing about it, but somehow, it feels like you.",
      },
      {
        youtubeId: null,
        spotifyId: "0WQiDwKJclirSYG9v5tayI",
        note:
          "I remember singing this one to you the first time I heard it. 🥹 And that’s probably why it means a little more to me. It reminds me of how I want to be there with you through whatever comes our way whenever you need me, whatever happens, and wherever life takes us.",
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


  /* ---------------------------------------------------------------------- */
  /*  THE SURPRISE                                                           */
  /*  Hidden until she throws the confetti at the very bottom of the page.   */
  /*  Deliberately not shown anywhere else, or it stops being a surprise.    */
  /* ---------------------------------------------------------------------- */
  surprise: {
    /** The button, before she has found it. */
    button: "Throw confetti for a surprise",
    /** The same button afterwards. */
    buttonAgain: "Throw more confetti",
    label: "One more gift",
    title: "A playlist, just for you",
    note: "A playlist of songs that remind me of you.",
    spotifyId: "3SnUzkEZrZvNjxaYUUG9kD",
  },

  /** The closing lines under the last greeting. */
  footer: {
    subtitle: "One more, because you deserve more than one.",
    signoff: "Made with far too much care \u00B7 October 8",
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
