---
name: promo-reel
description: Make vertical (9:16) promo reels in Remotion. Style A (`PromoReel`) is a 30-second reel in the style of the "Izohda LINK deb yozib qoldiring" reference reel. Style B (`ChecklistReel`) is a 10-second "handwritten checklist" reel: a paper sheet with a serif title and a list of 3D pill icons, where a red pen writes each answer and then the brand. Use Style B for "best time to… / daily plan / list"-type reels. Style C (`HabitsReel`) edits the user's own talking-head video into an "N habits" reel: a glowing pill hook, a pin board of numbered cards the camera flies between, product clips, and a CTA pill that types the comment keyword. Use Style C when the user sends their own recording plus a reference edit to copy. Style D (`StoryReel`) is a narrated story drawn as white line-art stick figures on charcoal with orange accents. It draws on stroke by stroke in time with a TTS or recorded voiceover, and ends on a title card plus a speech bubble. Use Style D when the user gives a story script. Style E (`IllustratedReel`) tells a story with flat vector illustrations (teal palette, warm light) drawn in code. It adds parallax and a slow push-in, soft dissolves, a logo on top, and karaoke subtitles in a dark lower third. Use Style E when the reference is an illustrated narrated explainer. Style F (`FurnitureReel`) edits real product footage (furniture, interiors, retail) with 3D kinetic typography, whip and zoom-blur cuts on the beat, tracked callouts, colour swatches, a warm grade, an original music bed and a location-pin CTA. Style G (`ResourcesReel`) is a talking-head "resources by level" reel: the speaker points left or right and a resource icon pops on that side, with a section word per skill. The footage stays ungraded. Style H (`ScoreTableReel`) is an "8+ resource table" over a talking head: a row glows when the speaker names its skill, and the resource pops into the third column. Style I (`LadderReel`) is a "level ladder" talking head: the left hand brings up a score card, the right hand the resource for that level, and the reel ends on a hero resource reveal. Style J (`TiersReel`) is a YOMON / YAXSHI / AJOYIB tier reel: blurred app cards snap sharp as each tier is named. Style K (`CaptionsReel`) adds captions only to an already-cut clip: a punchline hook, popping stroke captions, a word-chain of chips that collapses into a punchline title. The footage and audio stay untouched. Style L (`PhoneMockReel`) puts a screen recording in a white phone mockup over a blurred still, with a glide-in and a URL end card. ffmpeg composites the recording pixel-exact between two Remotion layers. Style M (`InvitationReel`) is an animated wedding e-invitation (video taklifnoma): an arched photo with script names, then a monogram wreath with the date, venue and family, with line-art florals drawing on and a beige-and-gold paper look. Style N (`MarbleInviteReel`) is a marble wedding e-invitation: black-and-gold roses drawn in code, a wreath monogram, then a pan to an arched gold card with the details and rings. Style O (`PaintedInviteReel`) is a painterly-illustration wedding invitation: a push-in on the art with drifting painted cosmos, then a tilt up into the (extended) sky for the details. Style P (`IslamicInviteReel`) puts the user's faceless clip inside a gold mihrab arch on a navy girih card, with a gold Bismillah, crescent and details. Style Q (`CinemaInviteReel`) is a cinematic minimalist invitation for a dark clip: a near-black page, champagne type, the clip in a hairline window, and the user's music timed to the reveals. Its "wow" variant (`GrandInviteReel`) plays the clip inside giant gold Bodoni names before revealing it. The style uses an orange hero shot with year-tag pills, kinetic word-by-word text, full-bleed photo beats with a "KOMPUTER"-style punch word, an off-white grid board with a browser mockup, a screen-recording demo, and a comment-bait "LINK" ending. Use when the user asks for "this type of video", "the LINK video", a promo or Instagram/TikTok reel, or a Remotion video for a product or site.
---

# Promo reel (orange hero / grid board / "LINK" CTA)

A ready Remotion project lives in `template/` next to this file. Copy it, swap the assets and text in `props.json`, then render. Don't rebuild the components from scratch.

## 1. The reference, measured

Source: `Izohda “LINK” deb yozib qoldiring. Sayt havolasini yuboramiz.mp4`. It is 720x1280 at 30 fps, 29.8 s long, with voiceover over light music. The beat times below come from scene-cut detection.

| # | Time (s) | Beat | What happens |
|---|---|---|---|
| 1 | 0.0-4.9 | **hero** | Orange gradient (deep `#D9400B` top-left to `#FF8A00` bottom). A transparent cut-out of 3 students sits in the lower 70%. The camera **pushes in** on the middle person while a white pill tag "2009" pops over their head (0.2 s). The camera **pans left** as "2010" pops (1.2 s), then **pans right** as "2011" pops (1.9 s), then **pulls back** to the wide shot. At 3.1 s, "**BU VIDEO**" (white, weight 900) builds word by word and the italic *"sizlar uchun"* appears under it. |
| 2 | 4.9-6.77 | **caption** | Photo: exam on paper in a classroom, with a slow zoom. An orange label box at the top left grows word by word: "endi milliy sertifikat testlari". Under it a big white "Qog‘ozda" appears, and "emas" **slides in from the lower right**. The beat ends with a **warm light-leak flash**, which is the only transition in the video. |
| 3 | 6.77-8.47 | **punch** | The same room, now with laptops. A huge orange "**KOMPUTER**" pops in (scale 1.4 to 1 with blur), and white "formatida olinadi" sits under it. |
| 4-6 | 8.47-13.27 | **b-roll** ×3 | No text. Hard cuts: a wide shot (1.8 s), a worried close-up (1.7 s), the teacher watching (1.3 s). Each shot zooms slowly. |
| 7 | 13.27-17.77 | **board** | Off-white `#F7F7F5` board with a faint 72 px grid. The orange headline "Kelayotgan oylarda" builds word by word, then the black sub "imtihonga kiradigan bo‘lsangiz" (0.7 s). A dark **browser mockup** of the site (colour cards: IELTS / SAT / Milliy sertifikat / Multi Level) springs in from a dot, tilted about 2° (2.4 s). |
| 8 | 17.77-25.57 | **demo** | Phone footage of a laptop using the real site. |
| 9 | 25.57-29.77 | **cta** | Grid board. "SAYT HAVOLASINI" (ink, 800, caps) appears word by word, then *"olmoqchi bo‘lsangiz"* letter by letter (0.45 s). A small orange spark burst follows, then **“LINK”** (huge, orange) goes from **thin and widely spaced to heavy and tight** (1.9 s). |

**Style rules**
- **Text never appears all at once.** Words drop in from about 0.45 em above with fade, blur 10 px to 0 and scale 0.88 to 1, staggered 5-10 frames apart. Italic sublines go letter by letter.
- **Palette:** orange `#FF6B12`, ink `#1B1B1B`, board `#F7F7F5`, and white on photos. Nothing else.
- **Font:** Inter Tight, a geometric grotesk. Headlines use 800/900 with tight tracking (-0.03 em). Sublines use italic 500. The template bundles the font, so renders need no network.
- **Layout:** text sits in the top third, centred. Only the caption beat is left-aligned.
- **Cuts:** hard cuts everywhere, except the one light-leak flash out of the caption beat. Every photo or clip gets a 1 to 1.08 zoom.
- **Voiceover** speaks the on-screen text. Each word should land as it is spoken.
- **Post caption pattern:** `Izohda “LINK” deb yozib qoldiring. Sayt havolasini yuboramiz.`

## 2. Workflow when the user asks for one

1. **Collect the inputs.** Ask only for what is missing:
   - the topic or product and the script lines (or write them from the topic);
   - the CTA keyword (default `LINK`);
   - the assets: a hero cut-out PNG with a transparent background, 2-6 photos or clips, a site screenshot for the mockup, an optional screen recording, an optional voiceover and music.

   Write Uzbek in Latin script with the proper apostrophes (o‘, g‘, bo‘lsangiz). Write the script in the user's language.
2. **Assets.** If the user wants to generate the scenes themselves, give them per-scene prompts from `asset-prompts.md`, fitted to their script: a photo prompt for photo scenes, and a start-frame plus motion prompt for video scenes. Then wait for their files. If there are no assets, either generate images with an available image tool (the hero needs a background-removed cut-out; Higgsfield `remove_background` works), or run `scripts/placeholders.sh` to get stand-ins and say so.
   **Reusing an existing reel's footage** (when the user owns it):
   - Find clean frames by tiling candidates with ffmpeg. Text is often baked in from the first frame of a shot, so check every one.
   - Erase small baked-in bits with `delogo`.
   - Cut shots out as clips with `-ss/-to`, scaled to 1080x1920. Stretch a clip that is too short with `setpts=1.5*PTS,minterpolate=fps=30:mi_mode=blend`.
   - Crop around baked-in text when the clean part is big enough.
   - For a full-frame hero still, set the hero `fit: "cover"`.
   - Extract the soundtrack with `-vn` and use it as `voiceover`. If you do, keep the reference beat timings.
3. **Plan the beats.** Show a timing table like the one above, fitted to their script, before building.
4. **Scaffold the project:**
   ```bash
   cp -r .claude/skills/promo-reel/template <workdir>/promo-reel && cd <workdir>/promo-reel
   npm i
   cp props.example.json props.json   # then edit text, durations, asset names
   # put assets in public/ (or run ./scripts/placeholders.sh for stand-ins)
   npx tsc --noEmit
   ```
5. **Check stills before the full render.** Render one frame inside each beat:
   `npx remotion still PromoReel out/f.png --frame=N --props=props.json --scale=0.5`.
   Then Read each PNG. Fix tag positions over the heads, text that overflows or wraps into 3 or more lines, and legibility on bright photos.
6. **Render:**
   `npx remotion render PromoReel out/promo.mp4 --props=props.json --codec=h264 --crf=18`.
   Verify the output with `ffprobe` and a contact sheet:
   `ffmpeg -i out/promo.mp4 -vf "fps=2,scale=180:-1,tile=10x6" -frames:v 1 sheet.png`.
   Look at the sheet. Send the mp4 with SendUserFile, together with the suggested post caption.
7. **Sandbox notes (cloud containers):**
   - Remotion's own Chrome download may be blocked. Pass `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`. If that path is missing, `ls /opt/pw-browsers` to find the current one.
   - Headless Chrome does not trust the sandbox proxy's certificate, so anything the page fetches over HTTPS fails (`ERR_CERT_AUTHORITY_INVALID`). Keep every asset local in `public/`. This is why the font comes from `@fontsource-variable/inter-tight` and not `@remotion/google-fonts`.
   - If npm is blocked, zip the project and send it with these instructions: `npm i && npx remotion studio`.

## 3. Template map

```
template/
  package.json          remotion + @remotion/cli pinned to the same version, bundled Inter Tight
  remotion.config.ts
  props.example.json    the reference reel as data, with the measured timings
  scripts/placeholders.sh   stand-in assets in public/ (never overwrites)
  src/index.ts, Root.tsx    composition "PromoReel", 1080x1920 at 30 fps; duration = sum of beats
  src/kit.tsx           style primitives: Media (Ken Burns), WordReveal, CharReveal,
                        HighlightCaption, YearTag, GridBoard, BrowserMockup, Sparks,
                        LightLeak, CtaKeyword
  src/PromoReel.tsx     Beat types, BeatView per beat type, heroCamera, promoDefaults
```

**Beat types** (in `props.json`, all times in seconds):

| type | fields |
|---|---|
| `hero` | `hook?{badge?,text}` (red DIQQAT-style badge + hook line visible from frame 0, plus a zoom snap; fades out when the title builds), `image`, `fit?` (`cutout` default: transparent PNG in the lower 72%; `cover`: a full-frame 9:16 image that already has its background), `tags[{label,x,y,at}]`, `title`, `subtitle`, `titleAt`, `titleTop?` (title block top in %, default 9; lower it when heads sit high so the tags don't hit the subtitle) |
| `caption` | `media`, `label`, `statement?`, `statementAt?`, `dim?[]` (word indexes shown at half opacity), `slide?[]` (word indexes that slide in from the lower right), `strike?[]` (word indexes struck through in red after the statement lands, with a scratch sound), `flash?` (default true) |
| `punch` | `media`, `word`, `sub?` |
| `tension` | the worried beat: `media`, `origin?`, `zoomTo?` (punch-in, eases in), `line?` + `lineAt?`, `small?` + `punch?` + `punchAt?` (big orange stacked words), `textPos?` (`top` / `bottom`: bottom adds a dark fade; use it when a face fills the top half), `timer?{from,to?,at?}` (exam clock in seconds, accelerating, red near zero; chain two beats e.g. 300→298, then 298→0), `shake?`, `pulse?` (red heartbeat edge) |
| `broll` | `media` (image or .mp4/.mov/.webm), `origin?`, `startFrom?` (frames), `steps?[{at,text}]` (numbered step pills, for demos), `chips?{at,items[]}` (grade/result chips popping in) |
| `board` | `headline`, `sub`, `subAt?`, `mockup?`, `mockupAt?` |
| `cta` | `line1`, `line2`, `keyword`, `line2At?`, `keywordAt?`, `comment?` (comment box that types the keyword and taps send, with a bouncing arrow) |

Top-level props: `beats`, `voiceover?`, `music?`, `musicVolume?` (default 0.25), `progress?` (orange progress bar on top), `sfx?` + `sfxVolume?` (default 0.6): sound effects placed automatically (whoosh into every cut, pops on text and tags, impacts on punch words, timer ticks, a riser + ding on the keyword, key clicks on the comment). Run `./scripts/sfx.sh` once to synthesize them into `public/sfx/`. Audio files go in `public/`.

## 4. Making it hooky / viral (default for new reels)

- **The first frame must carry text and motion.** It is the cover and the scroll-stopper. Use `hook` with a callout of the audience ("2009–2011-yilda tug‘ilganlar") and a red badge (DIQQAT). Never start on a flash or an empty frame.
- Turn on `sfx: true` and `progress: true`.
- **Give every 2–3 s a new visual event.** No beat may run longer than about 3 s without text or a cut. Caption long demos with numbered `steps` that match the voiceover, and end with result `chips`.
- **Turn the pain point into a `tension` beat** with a timer, a red pulse and punch words.
- **Make the CTA demonstrate the action:** use `comment: true`, so the box types the keyword.
- Check that the mixed audio has its max under -1 dB (`ffmpeg -af volumedetect`).

## 5. Adapting it

- **Beat order is flexible.** Keep the hero first, the CTA last, and at least one grid board in the middle. Keep the total at 20-40 s.
- **Tags.** `x` and `y` are the pointer tip in % of the frame, at the wide shot. The hero camera pans to each tag's `x` as it pops. Check them on a still at the end of the hero beat (all tags visible) and adjust.
- **Long words.** If a headline overflows 1080 px, lower that beat's `fontSize` in `PromoReel.tsx` instead of letting it wrap.
- **Voiceover timing.** Fit the beat durations to the VO. If the VO runs long, stretch the b-roll and demo beats, not the text beats.
- **Brand colour.** Change `C.orange` and `HERO_BG` in `kit.tsx` together.
- **Output.** Render 1080x1920 at 30 fps with CRF 18. That suits Instagram Reels and TikTok.

## 6. Style B: handwritten checklist (`ChecklistReel`)

Reference: the "Best Time to Take Vitamins" reel. It is a single continuous shot of about 10 s with no cuts:
- an off-white paper background with a large serif title (DM Serif Display);
- 4–5 rows, each a glossy 3D capsule icon plus a navy label;
- a red pen that writes each row's answer in handwriting (Caveat), revealed left to right under the pen tip.

**Hook:** frame 0 shows the full list with empty answers, which creates a curiosity gap. The pen glides in from the lower right.

`Checklist.tsx` builds it. Props:
- `title` ("\n" splits lines);
- `rows[{label, answer, icon, color}]`, where `icon` is mic / pen / book / headphones / check / star;
- `footer?{lead?, brand}`: written after the rows, with the brand big and underlined, plus a ding;
- `sfx?` (pen scribble per word);
- `music?` + `musicVolume?`.

The duration is computed from the text lengths: about 3 frames per character.

Rules:
- Keep answers short (≤ 14 characters) so they fit the answer column.
- The footer must stay above the bottom ~20% of the frame.
- Render with `npx remotion render ChecklistReel out/x.mp4 --props=props.json`.
- Tell the user to add trending music in the Instagram/TikTok app. Don't reuse a third party's audio.

Example: `examples/goprep-ielts-checklist.props.json`.

## 7. Style C: talking-head "N habits" edit (`HabitsReel`)

Reference: "IELTS 8 uchun sizda bo'lishi kerak bo'lgan 5 ta odat". The user's own single-take talking-head video stays underneath the whole edit as one continuous voice track.

| Part | Starts | What it shows |
|---|---|---|
| 1. Hook | 0 s | Talking head with a white pill that glows blue ("IELTS 8+"), a small corner badge ("uchun"), an italic subline typed word by word, and a bold last line ("5 TA ODAT") with a punch-in zoom. |
| 2. Board | `boardAt` | Pushes in from the right: a grey pin board of numbered pastel cards (pin, number, title, short description). The camera flies to each card at its `at` time, when the habit is spoken. |
| 3. Product | `appAt` | Pushes to the product `clips[{src, from, to}]`, cut on the voiceover's beats, each with a punch-in. |
| 4. CTA | `ctaAt` | Pushes back to the face: a glowing title ("IELTS UCHUN") and blue icon tiles popping in. Then a search pill types the comment keyword at `typeAt` (when it is spoken) and taps the arrow. |

Workflow:
1. **Timings come from the speech.** Run `python3 -I .claude/skills/promo-reel/tools/transcribe.py <voice.wav> small` (needs `pip install faster-whisper`). It prints segments and writes word timestamps to `<wav>.json`. Uzbek comes out phonetically garbled, but the timestamps are good. Ask the user for the exact script and map its phrases onto the timestamps.
2. **Normalize the voice:**
   `ffmpeg -i head.mp4 -vn -af "highpass=f=70,loudnorm=I=-14:TP=-1.5:LRA=7" voice.wav`
   Put the muted video in as `head`. Phone recordings often clip.
3. Put the hook and CTA text in the top ~20%, above the face. Put the search pill at ~64%.
4. Example: `examples/goprep-5-odat.props.json`.

## 8. Style D: hand-drawn story (`StoryReel`)

Reference: the "Kelin va qaynona…" reel.
- **Look:** a charcoal background (#4B4A4F) with white line-art stick figures and objects on a ground line, and a few orange accents (glow, hearts, flag, key words).
- **Motion:** each element draws on stroke by stroke. Each scene erases before the next one starts.
- **Ending:** a title card and a speech bubble.

**Voiceover:**
- Use the user's own recording if they have one (then get word timings with `tools/transcribe.py`).
- Otherwise use TTS: `python3 -I .claude/skills/promo-reel/tools/tts.py uz-UZ-SardorNeural script.txt vo.mp3 +10%` (`pip install edge-tts`; the female voice is uz-UZ-MadinaNeural). It writes per-word timings to `vo.mp3.words.json`. It already trusts the sandbox proxy CA.
- Respell for TTS: IELTS → "ayelts", goprep.gg → "goprep nuqta ji ji", 7.5 → "yetti yarim", 4 → "to‘rt".
- Normalize the result with loudnorm.

**Scenes (props JSON):**
- `scenes[{start, end, els[]}]`. Each element is `{b: builder, at: sec, dur?, …params}`.
- Start a scene ~0.1 s before its clause. Set each element's `at` to the word it illustrates.
- Builders in `Story.tsx` → `BUILDERS`:
  - **People and places:** person (pose down/up/point/sad/type, cap, woman), university, door, board, desk, table.
  - **Objects:** certificate, chart, laptop (screen text), bulb, cards, roadmap, tag, jar, calendar, scroll.
  - **Marks and text:** ground, glow, cross, arrow, burst, hearts, text, bubble.
- Add a builder when a story needs a new object.

**Without a voiceover:**
- Omit `voice` from the props. The composition's defaults carry no voice, so nothing leaks in.
- Keep the scene timings from the script so the user can record over them later.
- Then lift the SFX-only mix: `ffmpeg -i in.mp4 -c:v copy -af loudnorm=I=-20:TP=-1.5 out.mp4`.

**Camera and sound (automatic):**
- **Camera:** each scene is framed like the reference. The drawing fills ≈90% of the width (figures about a third of the frame height), the ground sits at ≈67% of the height, and there is a slow 3% push-in. The ground line is re-fitted to span just the drawing.
- **Strokes:** they keep a constant on-screen width. Never use `vector-effect: non-scaling-stroke`, because it breaks pathLength draw-on in Chrome.
- **Sound (`sfx: true`):**
  - pencil scribble while each element draws;
  - a swish on every scene change;
  - a chime on orange accents (glow / hearts / burst / bulb / tag / flag / bubble / big orange text);
  - a scratch on crosses;
  - a soft impact under big orange numbers.
  - Override per element with `sfx: 'chime' | 'pop' | 'impact' | 'scratch' | 'none'`.
- Run `./scripts/sfx.sh` once (it makes chime.wav too).

**Rules:**
- Draw in the 1080×1920 drawing space with the ground at 1120. The camera rescales each scene.
- Hold the end card ≥ 2 s after its last word.
- Check one still per scene before rendering.
- Tell the user to add soft music in the app.

Example: `examples/anvar-goprep-story.props.json` (+ `.tts.txt`).

## 9. Style E: illustrated story (`IllustratedReel`)

Reference: the bashar.uz "ilm" reel.
- **Look:** flat vector scenes in a teal palette (#0B2324 → #3E8C84) with warm lamp light (#F2C27B) and faceless characters.
- **Motion:** each scene has parallax layers and a slow 6% push-in. Scenes change with soft dissolves (with a little blur).
- **Frame:** the reference has a small logo top-centre and its brand at the bottom. These are off by default (`logo: true` / `brand` turn them on). The user prefers the brand only inside the story and on the end card.
- **Subtitles:** in the dark lower third, at y≈1390, two lines, 58 px, weight 800. Words light up karaoke-style: unspoken words are dim, spoken words are white, `keys` words are gold. Only one cue shows at a time.

**Scenes are code** (`SCENES` in `Illustrated.tsx`), built from primitives:
- `Layer` (parallax), `Stars`, `City` (lit windows), `Books`, `ArchWindow`, `LampGlow`;
- `Person` (stand / sit / desk / cheer / sad, cap, hijab, beard, older), `Desk`, `Laptop`, `Phone`, `useCount` (animated numbers).

Product reveals should be sudden: `find` flicks a feed with motion blur, accelerating, then stops dead on the product post (`FIND_STOP`) with a punch-in, white flash and impact. Don't type a URL slowly.

The existing scenes are: graduate, repetitor, class, certificate, study, mock, find, roadmap, savings, score, university, family, end. Write a new scene component when a story needs one.

**Props:**
- `scenes[{id, start, end}]`
- `cues[{text, start, end, keys[]}]`
- `end`, `brand?`, `logo?`
- `voice?` (omit: the user records later)
- `sfx?`: whoosh between scenes, chime / ding on reveals, ticks on counters, keys on typing, impact on the big score.

**Timings without a voice:** run `tools/tts.py` only to get natural word timings (`vo.mp3.words.json`). Build the cues from them and do not include the audio.

**Image generation costs the user credits** (Higgsfield ≈0.25 credit per image). Ask before generating; code-drawn scenes are the free default.

Example: `examples/anvar-goprep-illustrated.props.json`.

## 10. Style F: product showcase edit over real footage (`FurnitureReel`)

Motion language comes from the "5 ta viral Reels" reference (3D kinetic type, whips, flashes). It is re-dressed per product; for furniture that means champagne gold, cream and ink, Oswald plus a DM Serif Display accent, and floating gold dust.

**Timeline:** one global clock = the talking-head take's own time. Its audio is the continuous `voice`. B-roll `shots` cut in over the voice (J/L-cuts).

**Shots** (`shots[]`):
- `{src, from, to, srcStart?, rate?, follow?, still?, zoom?, origin?, trans}`.
- `follow: true` keeps the head clip in sync.
- `trans` is `zoom`, `whipL`, `whipR` or `cut`. Whips overscale so the frame edge never shows.
- Every shot drifts in scale and rotation. `punches[]` adds beat punch-ins.
- Freeze the final frame with `still` for the CTA tail (export the last frame as a jpg).

**Overlays:**
- `titles[]` with kinds `fly3d` (letters fly through Z with trails on a drifting 3D plane), `slab` (extruded word slams from huge, tracking collapses, shake), `serif` (gold accent), `small` (tracked caps + gold rule).
- `callouts[]`: a ring and leader line tracked by `[sec, x%, y%]` keyframes to a product part, plus a frosted label.
- `swatches[]`: colour dots, a word per beat, then a stamp.
- `cta`: blur and dim, a bouncing pin, a slab and a serif sub.

**Workflow:**
- Transcribe for word timings (Uzbek text comes out garbled). Ask for the exact script if you need word captions, or use keyword titles only.
- Put cuts on the music grid (120 bpm: multiples of 0.5 s) near phrase starts.
- Place callouts from a gridded frame strip.
- Check stills, then dense frame strips around every cut.

**Music:** `python3 -I tools/music.py music.wav <sec> 120 house` makes an original deep-house bed. Its drop lands at bar 1 (2 s).
- Mix with `musicVol` ≈ 0.16 under the voice, `musicVolOpen` / tail louder.
- Process the voice: highpass, acompressor, loudnorm −14.

**Export:**
- `--pixel-format=yuv420p`, then re-encode `scale=in_range=pc:out_range=tv,format=yuv420p` (Remotion's jpeg frames otherwise give yuvj420p).
- `loudnorm=I=-14:TP=-1.5` on the final mix.

**Product hero ending** (bass drop):
- Generate music with a hero section: `tools/music.py music.wav <sec> 120 house <hero_at_music_time>`. It adds a riser, a half-beat of silence, a sub boom, then 808 bass with glides, a half-time snare and hat rolls.
- `hero_at` must be a bar start. Use `musicOffset` to slide the music so a bar lands where the voice ends. Example: offset 1 s means bars land at odd seconds, so hero 22 s in the file plays at 21 s.
- `hero{at, until, vol}` adds a drop flash, cinematic letterbox bars, kick-synced 2.8% bumps and a vignette pulse, and raises the music to `vol`.
- Cut to the cleanest product shots. Speed-ramp the first one: a 0.5× shot, then a `cut` shot continuing at 1× from the matching `srcStart`.
- Keep type minimal (one `small`, one `serif`). Close on a frozen frame with the `cta`.

Example: `examples/mebel-showroom.props.json`.

## 11. Style G: "resources by level" talking head (`ResourcesReel`)

Reference: the "IELTSga tayyorgarlik — Band 5.5–6.5 / Band 7.0–9.0" reel.
- A white title and a red section word (white outline) that re-animates per section.
- Level pills on the left and right.
- When the speaker raises the left hand, the lower-level resource icon pops on the left. When they raise the right hand, the higher-level one pops on the right. Both clear just before the next cut.
- CTA: "Hammasini olish uchun izohda + qoldiring", with a pulsing + badge and a bouncing arrow.

**Don't touch the footage.** Users notice quality loss. No grade, brightness or contrast change; only the soft top gradient behind the type.
- Render with `--image-format=png --crf=12 --x264-preset=slow --pixel-format=yuv420p`.
- Then tag the stream with `-c copy -bsf:v h264_metadata=video_full_range_flag=0:colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1`.
- Verify the match with a PSNR / mean-RGB check against the source in an overlay-free area (≥40 dB and about 1 level).

**Building it:**
- Find the hand raises from a 4 fps strip of the hands.
- `segs[{srcFrom, srcTo, scale?}]` reorder or trim the single take into sections that match the music's accents.
- A section can reuse a gesture pair. Give the repeat a small punch-in (`scale` 1.06) so it reads as a new angle.
- Put icons at finger-up: `sections[{start, word, left{icons[], label, at}, right{…}}]`.
- Icons are original vector tiles in `ICONS` (cambridge19, engnovate, iot, dmono, chatgpt, goprep, speakpractice). Add new ones there rather than pasting third-party logo images.
- Music: when the user asks for the reference's own music, extract its audio track (`-vn`) and keep it at its level.

Example: `examples/ielts-resources.props.json`.

**v2 options:**
- `levelsUnder: true` puts the band label under each icon group (as in the reference), instead of pills at the top.
- `icons` accept image tiles, `{img, bg?, pad?, text?, textColor?, mask?, color?, contain?}`, so real logos can be used. Sources:
  - Simple Icons masks (OpenAI);
  - site SVG logos (ieltsonlinetests.com `/themes/iot/images/logo.svg`);
  - Google's favicon service (`google.com/s2/favicons?domain=…&sz=256`), for sites that block bots (Engnovate);
  - the user's own reference frames, for book covers and app tiles that have no public file (Cambridge 19, IELTS Speaking Practice 2026, the "D" tile).
- `join: '+'` shows two icons with a small + badge between them.
- `overlayOnly` and `cues` work as in `TiersReel`: composite with ffmpeg for colour-exact HEVC output (PSNR ≈50 dB).
- Silent takes: when both videos have no audio, deliver silent. This user prefers no music and no sound effects on silent takes, so composite with `-an`. Ask before adding SFX.

Example: `examples/ielts-resources-v2.props.json`.

**Sticker text skin** (`skin: 'sticker'`), from the "Studying for IELTS — Band 7.5–9 / Band 5–6" reel:
- Rounded heavy Fredoka text with a thick dark-brown outline and a hard drop.
- Yellow title.
- Band labels pinned above each side, coloured by `levelColors` (red for the lower band, green for the higher).
- The skill name in white under each icon. Section words are shown capitalized.
- CTA: an orange outlined headline at the top, plus a white comment line at chest height that types in word by word, ending with an optional emoji image (`ctaLine2Emoji`, Twemoji SVG).

Example: `examples/ielts-resources-sticker.props.json`.

## 12. Style H: "8+ resource table" (`ScoreTableReel`)

Reference: the Speaking / Listening / Reading / Writing "8+" table reel.
- Frosted mint rows with three cells: skill icon and name, an 8+ pill, and the resource.
- The rows build in on frame 0. That is the hook.
- When the speaker names a skill, its row lifts and gets a green glow, its icon wobbles and its pill turns solid green.
- When they name the resource, it springs into the third cell with a small sparkle burst.
- The footage is untouched. The only addition is the cards' drop shadow.

**Props:** `rows[{skill, label, badge?, at, resource{at, tile? | text, sub?, caption?}}]` and `top`.
- `skill` is one of listening / vocabulary / reading / speaking / writing.
- `tile` is youtube or preppy. All icons are original SVG in `SKILL_ICONS` / `RESOURCE_TILES`.
- Take the times from the transcript: `at` = when the skill word starts, resource `at` = when the resource word starts.

**"Same music as the reference" when the reference also has a voice:** separate the stems with `tools/separate_music.py <ref44.wav> <outprefix>`.
- Setup: `pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu && pip install demucs`, run with `SSL_CERT_FILE=/root/.ccr/ca-bundle.crt`.
- The script runs htdemucs and writes the drums+bass+other stem as `_music.wav`.
- Verify the stem is voice-free (transcribe it: no words).
- Mix with the user's voice normalized to −15 LUFS and the music to −23 LUFS, then loudnorm −14 for the final mix.

**Phone clips with rotation metadata:** Remotion's `OffthreadVideo` applies the rotation, so don't pre-rotate.

**Quality check:** compare frame-aligned frames decoded from the start of both files, not `-ss` seeks (seeking lands on different frames). Expect ≥38 dB.

**Real logos and the clean look (the "cafe table" reference):**
- Resource `img` (with `imgH`) draws a real logo, optionally with `text` (`textSize`) or `caption` under it. Assets that worked:
  - The official YouTube icon: the Simple Icons path in #FF0000 with a white play triangle drawn behind it.
  - The real Preppy face from goprep.gg, cropped to its alpha bbox.
  - GoPrep's `favicon.svg` above "Goprep.gg" (`imgH: 50`, `textSize: 31`).
- `clean: true`: no drop shadows, no blurred glow, no pill shadow; each cell gets a crisp 2 px hairline outline. Pair it with `overlayOnly: true` and the §22 ffmpeg composite.
- That reference doesn't highlight the active row. Rows slide in from the left with a small tilt in the first ~10 frames, then only the resources pop on their words. Use `highlight: false, enter: 'left', scale: 0.91, top: 1050` (an 800 px wide table).
- Keep the rows in the order the speaker says them, not the reference's skill order.

Examples: `examples/ielts-8plus-table.props.json` (original tiles, music + SFX) and `examples/ielts-table-real-logos.props.json` (real logos, clean, silent, voice stream-copied).

## 13. Style I: "level ladder" (`LadderReel`)

Reference: the "Agar bu kerak bo'lsa → bundan foydalaning" reel.
- Left hand up: an IELTS score card pops top-left (red band, big score, 5-segment level bar).
- Right hand up: that level's resource icon pops top-right.
- Word-by-word white captions at chest height (y≈1290).
- Finale: "Agar IELTSdan 8 olmoqchi bo'lsangiz" with an 8.0 card in the centre, then the hero resource icon in the centre with two caption lines (`below`) and a bass hit.

**Props:**
- `steps[{score, scoreAt, icon, iconAt, out}]`
- `captions[{text, start, end, y?, below?}]`
- `finale{score, scoreAt, icon, iconAt, hit?}`
- `icon` is a `LADDER_ICONS` key (original drawings: owl, liz, engnovate, goprep) **or a real logo tile** `{img, bg?, pad?, topText?, topColor?, radius?}`. Prefer real logos, because real icons build trust. Use the official Duolingo Play Store icon (`=w512`), the ieltsliz.com icon on white with `topText: "IELTS"`, Engnovate's favicon rebuilt to 512 px and GoPrep's `favicon.svg`.
- `clean: true`: no card shadow, no icon drop shadow, and captions get a crisp 6 px dark `WebkitTextStroke` instead of `textShadow`. `overlayOnly: true` renders the graphics on transparent for the ffmpeg 4:2:0 composite (see §22). Use both whenever the user cares about quality.
- With a continuous single take, keep the reference's level order if the gestures already match it (5 → 7 → 6 → 8 here), so the left and right finger points line up. Time `scoreAt` to the left-finger frame and `iconAt` to the right-finger frame, from a 10 fps strip.
- **"Hammasi" finale (preferred upgrade):** `finale.score: "5.0|6.0|7.0"` pops every level card in a row (0.18 s stagger, pop SFX each), then the Goprep hero lands with whoosh + boom + sparkle. Order the steps ascending: 5.0→Duolingo, 6.0→Engnovate, 7.0→IELTS Liz. In captions, `*word*` turns a word yellow (bu, bundan, hammasi, Goprep.gg). Example: `examples/ielts-ladder-hammasi.props.json`.
- **Skill-ladder variant:** a non-numeric `score` renders a skill card (red "IELTS" band plus the skill name, sized to fit, no level bar). For a take that ends "Agar **hammasi** kerak bo‘lsa → Goprep.gg dan foydalaning", use the steps Listening→YouTube, Writing→Engnovate and Speaking→HelloTalk, then the finale "Hammasi"→Goprep.gg. Those match the user's own tier picks.
  - SFX: a click when each skill card pops, pop + chime on each resource, and whoosh + boom + sparkle on the Goprep hero.
  - Example: `examples/ielts-ladder-skills.props.json`.
- Keep the voice by stream-copying the source audio (`-map 0:a -c:a copy`), so there is no re-encode and no processing.

**Editing rules learned here:**
- Before trimming pauses in a locked single take, measure the pose jump: compare the best-matching frame pair against the take's own adjacent-frame difference. If it's larger than the natural motion maximum, keep the take continuous. Jump cuts that save 0.2 s aren't worth it.
- Order ladder levels ascending (5 → 6 → 7 → target) when you can cut freely, and keep each level's resource pairing. In a continuous take, follow the gesture order instead (see above).
- "Same background music": separate the reference's stems first. If the music stem is near-silent (median ≈ −50 dB), the reference has no music. Reuse only its sound effects (here a bass hit at the hero reveal, cut from the stem) and tell the user.
- Voice cleanup for phone takes: `highpass=f=90,afftdn=nf=-30,acompressor,loudnorm`.

Examples: `examples/ielts-ladder.props.json` (original icons, music + SFX) and `examples/ielts-ladder-real-icons.props.json` (real logos, `clean`, silent, the same continuous take).

**Copying a viral reference's sound design** (proven on the ladder reel):
1. Run `tools/separate_music.py` on the reference. The `_music` stem is SFX + bed without the voice.
2. Map onsets to the on-screen events. Score cards had a sharp double click (−16 dB). Resource icons had a bright bell ding with a low tone (−10 dB, louder). Under everything was a 43–54 Hz sub pulse about every 0.8 s, plus ~300 Hz slides.
3. **Prefer rebuilding over lifting.** Lifted one-shots still carry the reference's music underneath, and users hear it. Measure the partials up to 22 kHz (the main ding tone here was at 12.9 kHz, above a 12 kHz cap) and synthesize clean versions: `python3 -I tools/ui_sfx.py public/` writes click.wav (two ticks 78 ms apart), ding.wav (2344 Hz + 2372 Hz beat + 12.9 kHz + an 8.2 kHz detuned cluster + a 173 Hz tone, holding 0.12 s, then τ 0.17 s) and ding_big.wav. Compare spectrograms against the reference and resample to the same sample rate, because `showspectrumpic` has a linear frequency axis. Only if the user insists, lift one-shots from the cleanest instances: `-ss <onset-0.02> -t 0.6–0.8 -af highpass=f=350,afade…`. Don't reuse the reference's music bed unless asked. Users usually want only the effects.
4. Place them with `cues[{file, at, vol}]` on your own event times (≈20–30 ms before the visual pop). Set `music` to the bed.
5. Match the reference's voice-to-SFX ratio. Measure LUFS of its vocal and music stems, set `voiceVolume` so your voice sits at the same offset, keep SFX at 1.0 (they're near full scale), and loudnorm the final mix.

## 14. Style J: YOMON / YAXSHI / AJOYIB tiers (`TiersReel`)

Reference: the "Fikrlash / Qidirish / Kod yozish…" app-tier reel.
- Three white app cards sit under the tier labels; the centre one is raised.
- They start heavily blurred. When the speaker says each tier word (rasvo / yaxshi / zo'r), that card snaps sharp with a punch and a ring burst, and its label lights up (red, yellow or green, with a crisp dark outline, not a glow).
- A white topic pill with an emoji sits at chest height.

**Props:** `topics[{title, emoji, start, reveal[3], logos[3]}]`.
- **Reveal timing:** time `reveal` to the gesture, not the word. Speakers say the tier word first and finish pointing 0.3–0.6 s later. Make a 10 fps strip of the hands with decisecond labels and pick the first frame where the finger is fully extended toward that card. Users notice early reveals.
- Each logo is `{name, kind: 'mask', file: svg, color | gradient}` for monochrome brand marks, or `{kind: 'img', file, radius, scale}` for full-colour icons.

**Real brand icons:**
- **Simple Icons** (`npm pack simple-icons@15.12.0`): monochrome SVGs with official hex colours, covering Google Translate, Anki, Instagram, YouTube, OpenAI, Gemini, Perplexity and Claude. Tint them with CSS masks; use gradients for Instagram and Gemini.
- **Apps not in Simple Icons** (e.g. HelloTalk): fetch the Play Store page `play.google.com/store/apps/details?id=<pkg>` and download its `og:image` at `=w512`.
- **The user's own brand:** take the site's `favicon.svg`. For sub-products, crop their artwork from the site's OG images and screenshots and key out the background.
- **Emoji:** Twemoji SVGs (`npm pack @twemoji/svg@15.0.0`).

**Colour-exact output for HEVC phone footage:** Remotion's decode shifted the RGB means by about 3 levels. Instead:
1. Render the graphics only (`overlayOnly: true`) as `--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --muted`.
2. Render the audio separately (`--codec=wav`).
3. Composite in ffmpeg: `[1:v]format=yuva444p,scale=out_color_matrix=bt709:out_range=tv[ov];[0:v][ov]overlay=format=yuv444,format=yuv420p`, with x264 CRF 12 and BT.709 tags. The source pixels pass through untouched; verify the mean RGB is within about 0.5.

**Clean look and the 4-topic IELTS version:**
- `clean: true` removes every shadow. Cards get a 2 px hairline and a 5 px tier-colour ring when lit. Labels get an 8 px black stroke. The pill gets a hairline.
- The reveal blur stays, because it's the style's signature and it blurs only the card graphic, never the footage.
- Logos used:
  - Official Play Store icons for Duolingo, TikTok and HelloTalk.
  - Simple Icons masks for Anki (gradient), Instagram (gradient) and ChatGPT (the OpenAI mark, black).
  - The full-colour YouTube SVG.
  - The GoPrep favicon, and the padded 512 px Preppy and IELTS Runner art.
  - Twemoji 📱 (Telefon) and 📖 (Kitob).
- Gesture rhythm in this take:
  - The topic close-up comes first.
  - The finger points to screen-left (YOMON) ~1.3 s after the topic starts.
  - The finger points up (YAXSHI) ~0.85 s later.
  - The thumb points right (AJOYIB) ~0.9 s after that.
- Take each `reveal` from the 10 fps strip: the first frame where the finger is fully extended.
- Topic titles say "IELTS Listening" and "IELTS Speaking" (the user asked for that earlier).
- Keep only the user's audio: stream-copy it, with no music or SFX.

- **"Viral" SFX (user preferred these to the soft dings):** `tools/viral_sfx.py <dir>` synthesizes the common ranking-reel sound types from scratch:
  - Per topic: a whoosh as the cards fly in (−13 dB).
  - YOMON: a pop (−14) plus a two-tone "eh-eh" buzzer (−16).
  - YAXSHI: a pop (−14) plus a C6→E6 "correct" chime (−15).
  - AJOYIB: a saturated bass boom (−9, audible on phone speakers) plus a sparkle (−17).
  - Limit only the effects bus where voice+fx would clip (smoothed per-sample gain), so the voice keeps its level.
  - The blur reveal is fine with this user. "No filter" means nothing on the footage.
- **SFX on request:** use `tools/ui_sfx.py` sounds, mixed in numpy straight onto the source voice (overlay renders are muted):
  - a click at each topic start (−14 dB);
  - a ding on YOMON (−17 dB) and YAXSHI (−15 dB), and ding_big on AJOYIB (−12 dB), each 20 ms before the reveal.
  - If the sum clips, scale the whole mix to −0.2 dBFS. Mux it with `-c:v copy` and AAC at 320k.
- **`mirror: true`** puts YOMON on the right and AJOYIB on the left. The user asked for it on the pen take, where the final "zo'r" pose ends on screen-left. Rule: AJOYIB goes on the side where the last, highest gesture ends.
- **User-supplied icons:** crop them from the screenshots the user sends (1080×2400 phone captures).
  - Angry Preppy (goprep.gg/preppy-ai): crop the head and drop the floor shadow. Key out the page background by colour distance (ramp 6→32). The white face can stay transparent, because the card is white.
  - IELTS Runner (goprep.gg/games): crop it as a square dark tile including its glow, and show it with radius 28. Both files are in `template/public/logos/`.
- **`row: {y, raise, scale}`** places the card row. The user wants the cards **above the head**, never over the hair. Measure the hair top from frames (here ≈250 px in the closest shots) and fit the row above it: `{y: 58, raise: 38, scale: 0.64}` keeps the side cards ending at ≈y 245.
- **Section changes get a click** (`ui_sfx.py` click.wav at −9 dB, at each topic start). Keep the viral pop/buzzer, pop/chime and boom/sparkle on the reveals.
- **Default gesture read for this user:** an index finger pointing to screen-right, then a finger up, then a thumb toward screen-left means `mirror: true`.
- Add the viral SFX by default after the user asked for them once. Also offer a clean, voice-only copy, which costs only another mux.
- **Pen-in-hand takes (Writing version):** the speaker may not point left, centre and right at all. Here a pen sat at chest height (YOMON), was raised beside the head (YAXSHI), then raised high (AJOYIB). Read the rising pose from a full-frame 10 fps strip; a chest crop misses it. Use the later of the pose and the tier word.
- For this user's topics, "IELTS Writing ✍️" uses ChatGPT, then Engnovate (the 512 px rebuild of its official favicon), then Goprep.gg.
- When measuring PSNR, crop a region with no graphics. The topic pill covers y≈1270–1400, so use y≥1500.

Examples: `examples/ai-tools-tiers.props.json`, `examples/ielts-tiers-4topics.props.json` (clean, real logos) and `examples/ielts-tiers-writing.props.json`.

## 15. Style K: captions on an already-cut clip (`CaptionsReel`)

Use it when the user sends a finished-looking clip (own cuts, inserts and music already in) and asks for a "pro edit with interesting captions" but nothing that touches quality. First case: the "Men tovuqman" Preppy prank.
- **Don't re-edit the picture.** No zooms (a zoom upscales), no grade, no shadows. Add only graphics, composited with the §22 pipeline. Stream-copy the audio (`-map 0:a -c:a copy`).
- **Find the script when whisper fails.** Music under mixed languages gave garbage even on the demucs vocal stem. If a screen is in shot, read it instead: crop the on-screen transcript once per second at full resolution and tile the crops. Then time each line from the vocal-stem RMS envelope (50 ms windows): who speaks, then silence, then the reply.
- **Write captions around the payoff.**
  - A hook that teases the punchline (`AI ustozni aldab “Men tovuqman” dedirdim 😂`).
  - Short narration beats on each pause ("1-so‘z ✅", "U hali sezmayapti 😅").
  - A `chips` word chain: one chip appears per spoken word. When the words are read back together, each chip lights yellow (`lit` times), then the row collapses into the `title` punchline at the same spot.
  - The final rant as short subtitles, 2–4 words each.
- **Exact script beats guessing.** If the user can give the SRT or the script, use it and caption the real speech word for word. Do this rather than narration. Keep the SRT's line starts, but re-check one-word replies against the RMS envelope and the screen, because SRT tools put them late (here "Man" was at 8.0 s, not 9.04 s). Use the user's own spelling from their script (they chose "Man tovokman", "tovug‘san"). Leave the scenes they name bare (here: no captions over Preppy's first speaking scene, 0–5.2 s).
- **Mark the speakers.** The AI's lines get `icon: "preppy.png"` (the real Preppy face) before the text, and the human's lines stay plain.
- **Props:**
  - `captions[{text, start, end, y?, size?, emoji?, icon?}]`: `**word**` turns that word yellow, and `\n` breaks the line.
  - `chips{y, outAt, items[{text, at, lit?}]}`
  - `title{text, at, y, size?, emoji?}`
  - Emoji are Twemoji SVGs.
- **Look:** white Montserrat 900 with a crisp black stroke (16% of the font size, `paintOrder: stroke fill`), and no shadows at all.
- **Placement:** narration at chest height (y≈960). Hook between the chin and the laptop. Chips and title at y≈185. While an existing insert (e.g. the chicken photo) covers the chest, move the subtitles below it (y≈1790).
- **It's a series.** The user films the same prank with different words (Man + Toe + Wok + Man = "Men tovuqman"; Man + Core + Coke + Man = "Man qo‘rqoqman"). Reuse the same props shape. Then:
  - Chips: the four English words, each timed to Preppy's one-word reply.
  - `lit`: the four bumps when Preppy reads them back.
  - `title`: the punchline, timed to Preppy's angry repeat, with a fitting emoji (🐔 or 😨).
  - Leave the opening Preppy scene bare.
  - Set the caption `y` just above the laptop's top edge in that take (960 there, 885 in the hoodie take).
  - In the user's script, a mid-sentence "To'xta" can belong to the next line. Check the RMS gaps.
- Examples: `examples/preppy-tovuq-captions.props.json` and `examples/preppy-qorqoq-captions.props.json`.
- **One-word fast captions (`fast: true`):** use these when the user asks for "one word caption style":
  - One caption per word, each ending exactly when the next word starts, with a hard cut (no fade).
  - A snappy pop (spring 420/9) from 0.55 with a −6° tilt, uppercase, nowrap, 104 px. Words longer than 11 letters drop to 80 px.
  - Per-word `color`: yellow for keywords, red for "yo'q" and wrong answers, green for the correction ("am"). Add a Twemoji on the punchline words.
  - Word times come from faster-whisper word timestamps on the demucs vocal stem. Run uz, tr and en, plus uz with an Uzbek `initial_prompt`; Turkish often spells Uzbek best. Then fix the words by hand, and line ends come from RMS segments.
  - Place the words over the chest or laptop edge (y≈930 in the desk take).
  - Example: `examples/one-word-fast-captions.props.json`.
  - **With a user SRT:** use its words and spelling. For word times, run faster-whisper medium per SRT window with that line as `initial_prompt` (uz plus tr). A window's first word gets clamped to the window start, so take that one from the RMS onset.
  - In b-roll or service footage, set y≈1330 (lower-middle, clear of the part being shown). Colour the product and part names yellow (Tracker, filtr, amortizator, stoyki, stabilizator). Example: `examples/car-service-one-word-captions.props.json`.

## 16. Style L: phone mockup for a screen recording (`PhoneMockReel`)

Reference: the invitestudio.uz wedding-site promo. A white phone floats over a blurred, dim still and plays the site recording. A social or URL badge pops at the end.
- **Background:** one frame of the recording, cropped to 9:16, then `gblur=sigma=34`, slightly darkened and desaturated. Save it as `public/bg.png`. The `bg` layer gives it a slow 1.04→1.12 push-in. Only the background is blurred; the recording itself never is.
- **Phone geometry (fixed):**
  - Screen 696×1546 (a 1080×2400 recording ×0.644, downscale only).
  - 16 px white bezel, outer radius 92.
  - A 1.5 px grey outer hairline, a 2 px black inner ring and side buttons. No shadow.
  - Centred, so the screen sits at (192, 187).
- **Keep the recording out of the browser.** Render `layer: 'bg'` as ProRes HQ and `layer: 'fg'` as ProRes 4444 with alpha. Then run `tools/phone_mock.sh <project> <recording> <out.mp4>`. The script:
  - Lanczos-downscales the recording to exactly 696×1546 and converts the phone's BT.601 to BT.709.
  - Makes it 30 fps constant frame rate by duplicating frames (phone recordings are variable, ~24 fps; this is not interpolation).
  - Applies a rounded alpha mask (r 77). Without it, the screen's square corners poke out past the frame's rounded outline.
  - Overlays it between the two layers, then encodes two-pass at 12 Mbps and stream-copies the recording's audio.
- **Entrance:** the phone glides up over 20 frames (ease-out cubic, drop 1700). The ffmpeg overlay `y` must use `t*30`, not `n`: `n` ran one frame ahead of the Remotion layer, so the screen jumped out of the frame.
- **"Opened from the website" intro (`intro{url, handoff, time?, tabs?, placeholder?}`):**
  - The screen first shows the phone's own Chrome look: the dark bar `#19100C` and the address pill `#3C312C`, both measured from the recording, in Roboto.
  - The sequence is an empty tab, a tap ripple on the address bar, then the URL typed (1.6 frames per character) with a globe suggestion row. Then a tap on the suggestion and a blue load bar on a dark page, fading at `handoff` into the recording. Its first frame shows the same bar, so the cut is seamless.
  - Pass `handoff` as the script's 4th argument: it delays the recording (`tpad` clone) and its audio (`adelay`, re-encoded AAC 320k).
  - `header: "site.uz"` adds a globe + URL line above the phone for the whole video (white, crisp 5 px stroke).
- **Outro:** a white pill with a globe icon and the site URL (`outro{at, text, icon?}`). It replaces the reference's dimmed Instagram end card, because this user doesn't want darkening. Use the brand's real handle only if the user gives it; never invent one.
- Example: `examples/taklifnoma-phone-mock.props.json`.

## 17. Style M: animated e-invitation (`InvitationReel`)

References: the "Davron & Munisa" video taklifnoma (two scenes, line-art florals, blur reveals) and a beige "a beautiful beginning of forever" poster (double gold frame, serif caps, script, hearts and dot dividers, watercolour leaves, boxed tagline banner). It's a fully designed reel with no footage. The user sells e-invitations (taklifnomation.uz).
- **Scene A, 0 to `sceneB`:**
  - An arched photo (r = half its width) with a gold outline one step outside, and a slow 1.10→1.00 push-in.
  - Line-art florals that draw on by stroke (`pathLength=1` dash). One sits on the arch's top-right; one is small at the bottom-left, kept clear of the names.
  - Watercolour leaves at the bottom-left.
  - The verse in serif caps, with its source in small gold caps aligned right.
  - The groom and bride in Great Vibes at 150 px, separated by line–"va"–line, then a letter-spaced tagline.
  - Exit: every element blur-fades in a top-to-bottom stagger.
- **Scene B:**
  - A heart divider.
  - An oval wreath (rx 250, ry 320) that draws on, with two small florals on its edge (top-left, and bottom-right rotated 180°) that never sit over the letters.
  - A two-letter script monogram split by a diagonal stroke.
  - The invitation lines, then a larger "TAKLIF ETAMIZ", a dot divider, the date (70 px), the venue in bold caps with "to‘yxonasi" and an italic gold address.
  - "Hurmat bilan," plus the family name in script.
  - A boxed banner tagline, like the poster's "two hearts. one promise."
- **Look (v2: the user asked for "not simple fonts"):**
  - Paper `#F7F1E8` with a soft radial lightening.
  - Ink `#5A4232`, gold `#A8865F`.
  - **v3 fix (the user said the capitals looked wrong):** Pinyon Script's A, z and N read as other letters. Use **Allura** for the names and family name, a **Cormorant Garamond italic 600** foil monogram, and **sentence-case** Cormorant for the verse and invitation lines. All-caps paragraphs looked wrong, so Cinzel caps are only for short labels (Taklif etamiz, date, venue, tagline, banner). Before picking a script font, render a comparison sheet of the real names.
  - (v2, superseded) Names, monogram and family name were in **Pinyon Script** (copperplate) with a **gold-foil gradient** (`background-clip:text`) whose sheen keeps sliding. They are written on left→right through a soft-edged mask.
  - Headings are **Cinzel** caps (500/600/700) that settle from wide tracking (+0.28 em) while sharpening. "Taklif etamiz" and the venue are in foil.
  - Details are Cormorant Garamond italic.
  - Camera: scene A drifts in (1.05→1.0) and pushes through (+0.08) into scene B, which arrives from 0.93 and keeps creeping. The florals sit on a nearer parallax layer.
  - Floating gold dust: sharp motes, plus five large soft ones in front for depth.
  - No shadows. Keep the script sign-off at 62 px or less, or it hits the frame.
- **Photo:** offer the user an image-generation prompt for the arch photo (4:5 portrait, warm ivory/champagne palette, the subject centred low, soft top area, no text). Swap it in when it arrives.
- **Content:** with no couple data from the user, use the demo couple on their own site (Azizbek & Nilufar, 18-Sentabr 17:00, «Oqsaroy» to‘yxonasi, Samarqand; Karimovlar va Ergashevlar oilasi). The photo is the hands-with-rings frame from their screen recording, cropped from the site hero with BT.601→709 conversion. Never reuse the reference's couple or photo.
- **Music:** if the user asks for the reference's own track, extract it (`-vn -c:a pcm_s16le`), set `end` to its length and put `sceneB` where the reference cuts (~5 s). Otherwise use `tools/wedding_music.py <out.wav> <sec> [bpm=84]`, an original soft 3/4 waltz: felt piano arpeggios, a melody from bar 3, a string pad, room reverb, around −16 LUFS. The reference's own audio is never reused.
- **Export:** render ProRes HQ with audio, then x264 two-pass at 12 Mbps with `-tune animation`. Flat graphics settle around 8 Mbps.
- Example: `examples/taklifnoma-video-invite.props.json`.

## 18. Style N: marble e-invitation (`MarbleInviteReel`)

Reference: the "Shaxzod & Hilola" black-and-gold rose invite (taklifnoma, 13.5 s).
- **Background:** a white marble slab, `tools/marble.py <out.png> 2160 1920 [seed]`. It's procedural: broad broken grey ribbons with a soft bloom, shown at 0.72 opacity on `#FAFAF9`. The slab is two pages wide, so the page turn is a single **horizontal pan** (0.9 s, inOut cubic) across one continuous stone, with a slow 1→1.03 drift.
- **Botanicals are drawn in code:**
  - `Rose`: three petal rings plus a cupped centre, with radial grey→black gradients and gold-gradient rims.
  - `Leaf`: dark with a gold rim and midrib.
  - `GoldLeaf`: thin gold line art.
  - `GoldSprig`: foil wheat leaves.
  - Clusters are placed by hand (`TOP_A`, `BOT_A`, `WREATH` around R 300, `TOP_B`, `BOT_B`). Each item grows in with a back-ease stagger and breathes ±1.2%. Keep the leaves tucked into the clusters, pointing outward: hanging leaves look dropped.
- **Page 1:**
  - The gold rectangle frame draws on.
  - "Wedding invitation" written on in Allura.
  - The wreath circle draws on and the roses pop in.
  - The **A & N** monogram is written on. It must be complete about 1 s before `turn`.
  - Wrap page-1 HTML in a 1080-wide box, or `Center` centres on the 2160 slab.
- **Page 2:**
  - An arched double gold frame (the arch radius is half the width) and gold sprigs at the sides.
  - Verse in Playfair Display 700 caps, with an italic source line.
  - The names written on in Allura (readable capitals), with "&".
  - Two lines of invitation in caps, the date and time in Montserrat 300, "Manzil", then the venue in Playfair caps.
  - Two gold rings (SVG gradient ellipses) that drop in with a moving glint.
- **v2 (user: "make it Uzbek, no Islamic lines, animate more"):**
  - The heading is "To'yga taklifnoma". Allura has no U+2018, so use an ASCII apostrophe in script. Page 2 opens with "Qadrli mehmonlar!". **No verse or religious lines unless the user asks.**
  - Motion layers:
    - Marble pans slower than the page (+300 px parallax). It's oversized (2780×2440 at −260) so the mid-turn camera pull-back (×0.93) and the ±0.5° sway never show an edge.
    - Rose clusters overshoot the pan by 240·sin(πp).
    - A push-in of 1→1.05 on each page.
    - The wreath turns −14°→4°.
    - Twinkling 4-point gold stars.
    - A light sweep runs along every gold line (animated `gradientTransform` with `spreadMethod="reflect"`).
    - Caps reveal letter by letter (`Letters`).
    - 7 large tumbling petals (r 34–64, gold rim + midrib) in screen space. Small dark petals read as dirt.
- **Music:** the reference's own track if the user asks; `end` = track length, `turn` ≈ 3.55 s.
- Example: `examples/taklifnoma-marble-invite.props.json`.

## 19. Style O: painterly-illustration e-invitation (`PaintedInviteReel`)

Reference: a gouache-style couple in a cosmos meadow with a pastel teal sky.
- **One illustration drives the reel.**
  - Scene A: a slow push-in on the couple, with "To'yga taklifnoma" in Cinzel caps and the names written on in Allura, all in the sky.
  - Scene B (`turn`): the camera tilts up into open sky. The details are ink-brown on the sky: the names, an italic invitation line, a drawn cosmos sprig, the date in Cinzel, the time in rose, then the venue in script with caps under it and the city.
- **Sky room:** when the art has little sky, run `tools/sky_extend.py art.png sky.png 1800`. It blends the art's own top-row colours toward a deeper zenith and adds soft grain. Stack it above the art (`skyExt`, `skyH`) and move the stack with `lift: {a, b}` (A ≈300 to clear the names, B ≈1720 so the art leaves the frame). There's no generative fill and no upscaled detail.
- **Motion:**
  - Painted cosmos (8 notched petals, two-tone gradient) and loose petals drift left→right with gusts at two sharp depths.
  - A soft near layer gets blur on the graphic only. It fades out in scene B, so nothing crosses the details.
  - A ±0.35° camera sway.
- **Source art:** never ship someone else's artwork or a low-resolution image (the reference was 736×949). Use it only for a preview, then give the user prompts: a 9:16 original at ≥2160 px wide, couple in the lower half, top 45% empty sky, no text. Swap the result into `art`.
- **Two-art mode** (`art2`, `sky2`, `sky2H`, `lift2`, `focus2`, `tilt2`, `closing`):
  - Shot 1: couple + names. Lift ≈120 with a 1200 px sky extension.
  - At `turn`: a 0.9 s crossfade, with a gust of the soft near flowers covering the cut.
  - Shot 2: the hands-with-rings art, with the invitation line, sprig, date and time in its sky (top ≈150–500).
  - At `tilt2`: tilt up 1780 px into the extended sky for the names, venue, city and a rose-script closing ("Sizni intizorlik bilan kutamiz").
  - Use rose `#A3405C`: the lighter rose disappears on teal.
  - The user's generated art came in at 941×1672 (a ~1.15× Lanczos upscale is acceptable for painterly art). Ask for a 2× upscale when available.
- **Music:** `tools/wedding_music.py` (original), unless the user supplies a track.
- Example: `examples/taklifnoma-painted.props.json` (two-art).
- **Typography for painterly art: `typo: 'storybook'`.** The user rejected formal wedding scripts (Allura, Great Vibes) on gouache art as not matching, and wants **Latin** text even when the client's card is Cyrillic: transliterate it.
  - Fraunces, a soft picture-book serif, for everything: italic for names and venue (`NK` 0.66 size factor), upright caps for labels, date and time, and italic 400/500 for body text.
  - Sacramento (hand-drawn monoline) only for accents: the "&" and the closing line.
  - Pick fonts from a comparison sheet rendered on the art's own colours, never from memory.
  - Example: `examples/taklifnoma-painted-storybook.props.json`.
- **Client cards in Cyrillic** (only if the user asks for Cyrillic): copy the card's text exactly, and keep the script it's printed in.
  - Set `cyrillic: true`: Great Vibes script plus Cormorant Garamond caps, because Allura and Cinzel have no Cyrillic.
  - `invite` takes any number of lines. `family: {lead, name[]}` replaces the names row in the venue scene. Family names are set in Cormorant italic, because Great Vibes draws ғ like Ғ.
  - Example: `examples/taklifnoma-painted-cyrillic.props.json`.

## 20. Style P: Islamic e-invitation around the user's clip (`IslamicInviteReel`)

- Midnight-navy card with a faint gold 8-point-star (girih) lattice, a double gold frame, and corner star rosettes that draw on and turn.
- The user's faceless clip plays inside a pointed mihrab arch (780×1000, about 1:1 for a 720-wide source), and its gold outline draws on.
- Gold-foil بسم الله الرحمن الرحيم in Aref Ruqaa sits above, with a masked crescent and star at the top right and twinkling stars.
- Names are written in foil script under the arch. At `detailsAt` they give way to the invitation line, date (foil caps), time, venue and city, with a closing line at the bottom.
- The clip's own audio is kept. Inside a component, call hooks before any early return: `useCurrentFrame` after `return null` crashed the render.
- Example: `examples/taklifnoma-islamic.props.json`.


**P2: minimalist version (`MinimalIslamicReel`), which the user preferred.** The arch cropped a head at the frame edge, and the navy ornament read as busy.
- Warm ivory paper `#F4EFE6`, one ink colour, a muted gold accent and 1 px hairlines. No ornaments, lattice or shadows.
- The clip is **never cropped**: it keeps its own 9:16 shape in a softly rounded window, with no zoom inside.
- A small Amiri Bismillah stays on top. At `shrinkAt` the large window (900 wide) glides up and shrinks (600 wide) as one transform, and the details set in below one line at a time: spaced-caps label, script names with a gold &, a hairline with a diamond, date, time, italic venue and city, and a tiny closing.
- Never place a clip into a shape narrower than its aspect when people sit at the frame edge.
- Example: `examples/taklifnoma-islamic-minimal.props.json`.

## 21. Style Q: cinematic minimalist invite for a dark clip (`CinemaInviteReel`)

Use it for moody footage (a silhouette first dance against a window).
- **Page:** a near-black page `#0A0908` that melts into the clip's dark edges, champagne `#E8DCC4` and gold `#BFA27A` type in Cormorant Garamond (italic 500 names at 118 px, a gold "&", spaced caps for small labels), and hairlines only. No ornaments, gradients or blur.
- **Clip window:** close to native width for low-res sources (576→720 is about 1.25×), with soft corners and a hairline ring.
- **Stickers:** `cropTop` hides baked-in stickers at the top of downloaded clips (here a 💍🫀 at y 70–105, so cropTop 118).
- **Timing:** names first. At `detailsAt` they give way to the invitation lines, a hairline, the date, time, venue and city, then a closing line. Everything fades to black over the last 0.9 s.
- **Music:** the user's track via `music`, trimmed to the reel. Pick the start so the track's swell lands on `detailsAt`: find it with a 0.5 s RMS envelope ("Hijo de la Luna" instrumental: intro at 1.5 s, swell at 9.5 s, so start at 1.3 s with details at 7.9 s). The clip's own audio is muted.
- Example: `examples/taklifnoma-cinema.props.json`.

**Q2: "wow" variant (`GrandInviteReel`).** On review the user went back to the plain `CinemaInviteReel` ("previous one was better"). Default to plain Q; offer Q2 only when asked for something more dramatic.
- **Opening:** the couple's names, huge, in **Bodoni Moda italic 700**, with the clip playing *inside the letters*: a black layer with white type in `mix-blend-mode: multiply` over the clip, in an `isolation: isolate` box.
- **Gold trace:** a 1.6 px gold hairline (`WebkitTextStroke`) traces the letters.
- **Reveal:** at `revealAt` the black melts away (the clip surfaces from inside the names), while a gold-foil copy of the names (same geometry) glides down under the window to 0.6 scale.
- **Details:** on the music's swell, in Bodoni (italic body, foil date with a light sweep, spaced caps), with floating gold dust.
- **Page and sizing:** the page must be pure `#000`, or the multiplied window shows as a rectangle. Size the names so the widest one fits inside the clip window (188 px for "Fotima" in a 720 window).
- Example: `examples/taklifnoma-grand.props.json`.

## 22. Footage quality rules (this user notices any loss; apply to every edit over their video)

- **No grading and no darkening layers** over the footage. That includes "a bit of shadow" gradients: the top gradient in ResourcesReel darkened the top of the frame by about 40%. Use `clean: true`: there are no gradients and no blurred text or icon shadows; legibility comes from crisp outlines (WebkitTextStroke) and hard offset drops only.
- **Composite in the source's native 4:2:0:** `[1:v]scale=out_color_matrix=bt709:out_range=tv,format=yuva420p[ov];[0:v][ov]overlay=format=yuv420`. A yuv444 overlay followed by format=yuv420 resamples the source chroma and softens it.
- **Default export = the user's CapCut settings:** 1080p, 30 fps, 12 Mbps, AI ultra HD off, optical flow off.
  - Use two-pass x264 `-preset slow -tune film -profile:v high -b:v 12M -maxrate 18M -bufsize 24M`, `fps=30`, BT.709 limited-range tags, `-an` if silent. Expect about 27 MB for 18 s.
  - Offer a CRF 8 "master" (~50 Mbps) only if the user asks for maximum quality.
- **Verify** against the source in an overlay-free area. Expect luma PSNR ≈ 46 dB at 12 Mbps (≈ 52 dB for a CRF 8 master) and chroma ≥ 54 dB. Also check that the brightness in the top area matches the source.
