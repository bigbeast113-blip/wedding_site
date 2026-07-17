/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL WEDDING CONTENT
 *  Edit this file to make the whole site yours. Everything below is a
 *  placeholder modelled on the reference video — swap in your real details.
 *  Photos use Unsplash URLs; replace with your own by dropping files in
 *  /public and using "/your-photo.jpg" instead of the full URL.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const couple = {
  // Full display name shown huge on the hero
  names: "Jesse & Francesca",
  // Short monogram used in the nav and splash
  monogram: "J&F",
  // ISO date+time of the wedding — drives the countdown. The -05:00 offset
  // pins it to the venue's Eastern time (EST in December) so the countdown is
  // correct for guests in every timezone, not each viewer's local 4:00pm.
  date: "2027-12-11T16:00:00-05:00",
  // Human-friendly date shown in the reveal section
  dateDisplay: "December 11, 2027",
  venue: "Grand Cascades Lodge",
  city: "Hamburg, NJ",
};

export const splash = {
  // Interactive parallax intro (see Splash.tsx), built from real transparent
  // PNG layers (crisp edges, no fade):
  //   backdrop  = the deep woods scene behind everything
  //   couple    = the two of you, background removed, standing in the woods
  //   blossom   = a sky-keyed flowering branch used to frame the edges
  // Mouse moves the layers (parallax); clicking "Click to Enter" dives through.
  // A single cinematic "winter portal" image (archway of frosted pines opening
  // onto a snowy valley). Clicking enter dives THROUGH the opening.
  // Layered "winter portal": the proposal scene sits behind two foliage layers
  // that fly toward the viewer on enter, revealing the full background.
  bg: "/photos/winter-bg.webp", // BACK — the full proposal scene (revealed)
  bgTall: "/photos/winter-bg-tall.webp",
  frame: "/photos/winter-frame.webp", // FAR foliage — the archway (center cut out)
  frameTall: "/photos/winter-frame-tall.webp",
  near: "/photos/winter-near.webp", // NEAR foliage — the closest snow bank
  nearTall: "/photos/winter-near-tall.webp",
  tagline: "an adventure to wonderland awaits",
  cta: "Click to Enter",
};

// The pups, background removed, used as scroll animations.
export const decoDogs = {
  daisy: "/photos/cutouts/daisy.png", // side profile — trots across
  duke: "/photos/cutouts/duke.png", // paws-forward — peeks over edges
};

// Watercolor pines (background removed) used as scroll decorations.
export const decoTrees = {
  left: "/photos/cutouts/tree_left.png", // shorter, fuller pine
  right: "/photos/cutouts/tree_right.png", // taller, narrower pine
  frost: "/photos/cutouts/tree_frost.png", // snow-dusted, frosty colour
  pineA: "/photos/cutouts/tree2_left.png", // darker, droopier pine (set 2)
  pineB: "/photos/cutouts/tree2_right.png", // darker, slim pine (set 2)
};

export const hero = {
  // The revealed proposal scene — continues seamlessly from the splash.
  image: "/photos/winter-bg.webp",
  scrollHint: "scroll to explore",
};

// Photos that scatter around the names as you scroll past the hero
export const scatterPhotos: string[] = [
  "/photos/new/img_3477.webp",
  "/photos/new/img_3456.webp",
  "/photos/new/img_3458.webp",
  "/photos/new/img_3475.webp",
  "/photos/new/img_3482.webp",
];

export type Chapter = {
  title: string;
  body: string;
  caption: string;
  photos: string[];
};

export const story = {
  heading: "our story",
  chapters: [
    {
      title: "chapter one: how we met",
      body: "It started with a message and a maybe. A few late-night conversations later, two strangers from the internet realized they had accidentally found the best part of their day in each other.",
      caption: "Where it all began",
      photos: ["/photos/new/img_3463.webp", "/photos/new/img_3478.webp"],
    },
    {
      title: "chapter two: falling in love",
      body: "Somewhere between the inside jokes, the lazy Sunday mornings, and a very spoiled pair of dogs, “I like you” quietly grew into “I can’t imagine my life without you.”",
      caption: "Falling in love",
      photos: ["/photos/new/img_3453.webp", "/photos/new/img_3481.webp"],
    },
    {
      title: "chapter three: the next step",
      body: "On a golden afternoon among the trees, a walk in the woods turned into a question — and a very easy yes. Suddenly the future we had been imagining had a date on it.",
      caption: "The proposal",
      photos: ["/photos/new/img_3464.webp", "/photos/new/img_3486.webp"],
    },
  ] as Chapter[],
};

export const dateReveal = {
  lead: "so please join us…",
};

export const countdown = {
  // Real venue: Grand Cascades Lodge in the snow.
  illustration: "/photos/Venue/mainVenueImage.webp",
  // Clicking the venue image books a room at the lodge.
  bookingUrl: "https://www.crystalgolfresort.com/stay/grand-cascades-lodge",
  bookingCta: "Book your stay at Grand Cascades Lodge",
};

export type DetailCard = {
  id: string;
  title: string;
  blurb: string;
  image: string;
  // Rich modal body — array of blocks
  modal: {
    intro: string;
    sections?: { heading: string; items: { name: string; desc?: string }[] }[];
    links?: { label: string; url: string }[];
    hotels?: { name: string; desc: string; url: string; image?: string }[];
    gallery?: string[];
  };
};

// Engagement-party photo album. Fill with image paths (e.g. dropped into
// /public/photos/gallery/ or pulled from a shared Drive folder). Empty = the
// gallery card shows a friendly "coming soon".
export const gallery: string[] = [];

export const details = {
  heading: "and now some additional details…",
  subheading:
    "The people, places, and practical details that will make the weekend feel effortless.",
  cards: [
    {
      id: "wedding-parties",
      title: "Wedding Parties",
      blurb: "Meet our favorite people.",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
      modal: {
        intro:
          "The friends and family standing beside us. We could not have picked a better crew to share the day with.",
        sections: [
          {
            heading: "The Bridal Party",
            items: [
              { name: "Maid of Honor", desc: "Sister of the bride" },
              { name: "Bridesmaids", desc: "Our closest friends" },
            ],
          },
          {
            heading: "The Groom's Party",
            items: [
              { name: "Best Man", desc: "Brother of the groom" },
              { name: "Groomsmen", desc: "The day-ones" },
            ],
          },
        ],
      },
    },
    {
      id: "travel-logistics",
      title: "Travel Logistics",
      blurb: "Plan your trip and stay.",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
      modal: {
        intro:
          "Where to stay for the weekend. We have room blocks at the resort, plus a nearby budget-friendly option. Tap any hotel to book.",
        hotels: [
          {
            name: "Grand Cascades Lodge",
            desc: "Our wedding venue — the most convenient place to stay, right where the celebration is.",
            url: "https://www.crystalgolfresort.com/stay/grand-cascades-lodge",
            image: "/photos/Venue/mainVenueImage.webp",
          },
          {
            name: "Minerals Hotel",
            desc: "Part of Crystal Springs Resort, a short drive from the venue. We have a room block here too.",
            url: "https://www.crystalgolfresort.com/stay/minerals-hotel",
            image: "/photos/MineralsMainImage.webp",
          },
          {
            name: "Quality Inn near Mountain Creek",
            desc: "A budget-friendly option about 10 minutes away in Vernon, near Mountain Creek.",
            url: "https://www.choicehotels.com/new-jersey/vernon/quality-inn-hotels/nj311",
          },
        ],
      },
    },
    {
      id: "registry",
      title: "Registry",
      blurb: "Your presence is enough, but if you insist…",
      image:
        "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80",
      modal: {
        intro:
          "Your presence is truly the only gift we need. For those who have asked, here is where we are registered.",
        links: [
          { label: "View our registry", url: "https://www.zola.com/registry/jesseandfrancesca2027" },
        ],
      },
    },
    {
      id: "dinner-menu",
      title: "Dinner Menu",
      blurb: "A quick look at what we are serving.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
      modal: {
        intro:
          "We are working with our caterer to finalize a delicious multi-course meal for everyone.",
        sections: [
          {
            heading: "Cocktail Hour",
            items: [
              {
                name: "Passed Canapes",
                desc: "Seasonal tartlet with whipped goat cheese and herbs. Crispy prawn skewer with citrus aioli.",
              },
            ],
          },
          {
            heading: "Dinner",
            items: [
              { name: "First Course", desc: "Garden greens, shaved vegetables, lemon vinaigrette" },
              { name: "Main", desc: "Choice of beef, fish, or a seasonal vegetarian plate" },
              { name: "Dessert", desc: "A little surprise from the kitchen" },
            ],
          },
        ],
      },
    },
    {
      id: "gallery",
      title: "Engagement Photos",
      blurb: "A peek from our engagement photos.",
      image: "/photos/new/img_3486.webp",
      modal: {
        intro: "A few of our favorite moments.",
        gallery,
      },
    },
  ] as DetailCard[],
};

export const vision = {
  text: "The vision for the night is simple: all of our most beloved people in one place, a cozy mountain lodge, flowing drinks, and an unforgettable dance floor.",
};

export const faq = {
  heading: "Questions and answers",
  helpLead: "Can’t find the answer here?",
  helpLinkLabel: "Reach out to Jesse or Francesca",
  helpLinkHref: "mailto:hello@example.com",
  items: [
    {
      q: "When should I RSVP by?",
      a: "Please RSVP by November 1st using the Submit RSVP button at the top of the page.",
    },
    {
      q: "Is there a dress code?",
      a: "Winter formal / black-tie optional. Think rich tones, velvets, and warm layers — the celebration is indoors at the lodge.",
    },
    {
      q: "Is the wedding indoors?",
      a: "Yes — both the ceremony and reception are held indoors at Grand Cascades Lodge, so you’ll be warm and cozy all night.",
    },
    {
      q: "What will the weather be like?",
      a: "December in the Appalachians can be cold and snowy, so bundle up for the trip in. Everything inside the lodge will be warm and comfortable.",
    },
    {
      q: "Can I bring a plus one or my kids?",
      a: "Your invitation will specify the number of seats reserved for you. Please refer to it when you RSVP.",
    },
    {
      q: "What time should I arrive at the ceremony?",
      a: "Please arrive 30 minutes before the ceremony start time so we can begin promptly.",
    },
    {
      q: "I have a food allergy, can I make a special request?",
      a: "Absolutely. Note any dietary restrictions on your RSVP and we will take care of it.",
    },
    {
      q: "Is there parking at the venue?",
      a: "Yes, on-site parking is available at the lodge. Many guests also stay overnight at the resort.",
    },
    {
      q: "Help! I have other questions!",
      a: "No problem at all — reach out to us any time and we will be happy to help.",
    },
  ],
};

export type PartyMember = { name: string; role?: string; image?: string };

export const weddingParty = {
  heading: "the wedding party",
  intro: "The people standing beside us — our favorite humans, all in one place.",
  // PHOTOS: just drop a file named after the person (e.g. "Roger.jpg" or
  // "Ian.png") into  photos/weddingparty/  and run  python _optimize_party.py
  // — the site finds each avatar BY NAME automatically (no code change needed).
  // Anyone without a photo shows their initials. (You can still hard-code a
  // path with image: "/photos/weddingparty/whatever.webp" to override.)
  groups: [
    {
      title: "Bridesmaids",
      members: [
        { name: "Brittany", role: "Maid of Honor" },
        { name: "Gia" },
        { name: "Tyler" },
        { name: "Taylor" },
        { name: "Kasey" },
        { name: "Emily" },
      ] as PartyMember[],
    },
    {
      title: "Flower Girls",
      members: [
        { name: "Giuliana" },
        { name: "Alessandra" },
        { name: "Victoria" },
      ] as PartyMember[],
    },
    {
      title: "Groomsmen",
      members: [
        { name: "Roger", role: "Best Man" },
        { name: "Ray" },
        { name: "Chris" },
        { name: "Vinny" },
        { name: "Greg" },
        { name: "Nick" },
        { name: "Ian" },
      ] as PartyMember[],
    },
  ],
};

export const closing = {
  image: "/photos/new/img_3494.webp",
  line: "you’re my favorite person to do anything with for the rest of my life.",
};

export const rsvp = {
  // Paste your deployed Google Apps Script web-app URL here to save responses
  // to a Google Sheet. Leave "" and the form just shows a thank-you (no save).
  endpoint: "https://script.google.com/macros/s/AKfycbx0S63aL06cVg2MW-LlXs2XWB-3uhgKRpzkUzHuneHC-vlLdbvQcWhgOvXUu3-VfGM/exec",
  // Households / parties — like Zola. Each invitation is ONE entry listing
  // everyone on it. A guest searches their name; we find their party and let
  // them respond for each member. Leave [] for open RSVP (anyone can respond).
  // NOTE: names here are visible in page source (fine for most weddings).
  // Example:
  //   { members: ["Jesse Abruzzo", "Francesca Primiani"] },
  //   { members: ["Roger Smith", "Jane Smith", "Smith Family +2"] },
  parties: [] as { members: string[] }[],
  // OR — pull the guest list LIVE from a Google Sheet so you can edit it anytime
  // without redeploying. Make a SEPARATE sheet, share it "Anyone with the link →
  // Viewer", and paste its ID + tab name below. Layout = TWO columns with a header
  // row:  Name | Plus one
  //   • blank "Plus one"  -> that person RSVPs solo (no plus-one)
  //   • a name in "Plus one" -> they get that named plus-one
  //   • the word "Guest"  -> they get a plus-one and type the name themselves
  // A guest can search EITHER column; we auto-fill the rest of the household. If
  // they fill in / change a "Guest" name, it's saved back to this sheet (via the
  // Apps Script) so they can return and update it. Leave id "" for open RSVP.
  guestSheet: {
    id: "1w0DCumOOjYJoRWMWAlJQpZscgcYg7yemYdGlBLYq0wA",
    tab: "", // "" = read the first tab (gid 0), so the tab name doesn't matter
  },
  // Optional "how well do you know us" quiz shown before the RSVP. Answers are
  // saved to the Google Sheet (one "Trivia" column). Give a question `options`
  // to make it multiple-choice; otherwise it's a free-text field. Edit freely.
  quiz: [
    { q: 'Do you know where the nickname "Tutti" came from?' },
    { q: "How old are Duke and Daisy?" },
    { q: "What's our favorite coffee shop?" },
    {
      q: "Which of these has Tutti NOT baked?",
      options: ["Chocolate chip cookies", "Cinnamon rolls", "CrinkleTop cake", "Scones"],
    },
    { q: "What's our favorite food to order in?" },
    { q: "Any advice for a long, happy marriage?" },
  ] as { q: string; options?: string[] }[],
};

export const nav = {
  links: [
    { label: "Travel Logistics", href: "#details" },
    { label: "Registry", href: "#details" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: "Submit RSVP",
};
