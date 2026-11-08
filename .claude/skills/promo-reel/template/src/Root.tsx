import React from 'react';
import {Composition} from 'remotion';
import {PromoReel, PromoProps, promoDefaults} from './PromoReel';
import {ChecklistReel, ChecklistProps, checklistDefaults, checklistTimeline} from './Checklist';
import {HabitsReel, HabitsProps, habitsDefaults, habitsDuration} from './Habits';
import {StoryReel, StoryProps, storyDuration} from './Story';
import {IllustratedReel, IllustratedProps, illustratedDuration} from './Illustrated';
import {FurnitureReel, FurnitureProps, furnitureDuration} from './Furniture';
import {ResourcesReel, ResourcesProps, resourcesDuration} from './Resources';
import {ScoreTableReel, ScoreTableProps, scoreTableDuration} from './ScoreTable';
import {LadderReel, LadderProps, ladderDuration} from './Ladder';
import {TiersReel, TiersProps, tiersDuration} from './Tiers';
import {CaptionsReel, CaptionsProps, captionsDuration} from './Captions';
import {PhoneMockReel, PhoneMockProps, phoneMockDuration} from './PhoneMock';
import {InvitationReel, InvitationProps, invitationDuration} from './Invitation';
import {MarbleInviteReel, MarbleInviteProps, marbleInviteDuration} from './MarbleInvite';
import {PaintedInviteReel, PaintedInviteProps, paintedInviteDuration} from './PaintedInvite';
import {IslamicInviteReel, IslamicInviteProps, islamicInviteDuration} from './IslamicInvite';
import {MinimalIslamicReel, MinimalIslamicProps, minimalIslamicDuration} from './MinimalIslamicInvite';
import {CinemaInviteReel, CinemaInviteProps, cinemaInviteDuration} from './CinemaInvite';
import {GrandInviteReel, GrandInviteProps, grandInviteDuration} from './GrandInvite';
import {RankReel, RankProps, rankDuration} from './RankReel';

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    {/* Style A: orange hero / kinetic text / grid board / "LINK" CTA. */}
    <Composition
      id="PromoReel"
      component={PromoReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={900}
      defaultProps={promoDefaults}
      calculateMetadata={({props}: {props: PromoProps}) => ({
        durationInFrames: props.beats.reduce((a, b) => a + Math.round(b.dur * FPS), 0),
      })}
    />
    {/* Style B: handwritten checklist on paper, one continuous shot. */}
    <Composition
      id="ChecklistReel"
      component={ChecklistReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={330}
      defaultProps={checklistDefaults}
      calculateMetadata={({props}: {props: ChecklistProps}) => ({durationInFrames: checklistTimeline(props).total})}
    />
    {/* Style C: talking-head "N habits" edit: hook pill, pin board, product clips, search-pill CTA. */}
    <Composition
      id="HabitsReel"
      component={HabitsReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={810}
      defaultProps={habitsDefaults}
      calculateMetadata={({props}: {props: HabitsProps}) => ({durationInFrames: habitsDuration(props)})}
    />
    {/* Style D: hand-drawn line-art story on charcoal, timed to a narrated voiceover. */}
    <Composition
      id="StoryReel"
      component={StoryReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1440}
      defaultProps={{scenes: [], end: 10} as StoryProps}
      calculateMetadata={({props}: {props: StoryProps}) => ({durationInFrames: storyDuration(props)})}
    />
    {/* Style E: illustrated story: flat vector scenes, parallax, karaoke subtitles. */}
    <Composition
      id="IllustratedReel"
      component={IllustratedReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1440}
      defaultProps={{scenes: [], cues: [], end: 10} as IllustratedProps}
      calculateMetadata={({props}: {props: IllustratedProps}) => ({durationInFrames: illustratedDuration(props)})}
    />
    {/* Style F: product showcase edit over real footage (3D kinetic type, callouts, swatches, whips). */}
    <Composition
      id="FurnitureReel"
      component={FurnitureReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={690}
      defaultProps={{shots: [], titles: [], end: 10} as FurnitureProps}
      calculateMetadata={({props}: {props: FurnitureProps}) => ({durationInFrames: furnitureDuration(props, FPS)})}
    />
    {/* Style G: "resources by level" talking head: icons pop on the pointing side, section word per skill. */}
    <Composition
      id="ResourcesReel"
      component={ResourcesReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={403}
      defaultProps={{video: '', segs: [], title: '', levels: ['', ''], sections: [], cta: {at: 0, line1: '', line2: ''}, end: 10} as ResourcesProps}
      calculateMetadata={({props}: {props: ResourcesProps}) => ({durationInFrames: resourcesDuration(props, FPS)})}
    />
    {/* Style H: "8+ resource table" over a talking head: rows glow as named, resources pop in. */}
    <Composition
      id="ScoreTableReel"
      component={ScoreTableReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={240}
      defaultProps={{video: '', rows: [], end: 8} as ScoreTableProps}
      calculateMetadata={({props}: {props: ScoreTableProps}) => ({durationInFrames: scoreTableDuration(props, FPS)})}
    />
    {/* Style I: "level ladder" talking head: score card left hand, resource right hand, hero finale. */}
    <Composition
      id="LadderReel"
      component={LadderReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={400}
      defaultProps={{video: '', steps: [], captions: [], finale: {score: '8.0', scoreAt: 0, icon: 'goprep', iconAt: 1}, end: 10} as LadderProps}
      calculateMetadata={({props}: {props: LadderProps}) => ({durationInFrames: ladderDuration(props, FPS)})}
    />
    {/* Style J: YOMON / YAXSHI / AJOYIB tiers: blurred app cards snap sharp as each tier is named. */}
    <Composition
      id="TiersReel"
      component={TiersReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={530}
      defaultProps={{video: '', topics: [], end: 10} as TiersProps}
      calculateMetadata={({props}: {props: TiersProps}) => ({durationInFrames: tiersDuration(props, FPS)})}
    />
    {/* Style K: captions-only edit of an already-cut clip: popping stroke captions, word-chain chips, punchline title. */}
    <Composition
      id="CaptionsReel"
      component={CaptionsReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={300}
      defaultProps={{video: '', captions: [], end: 10} as CaptionsProps}
      calculateMetadata={({props}: {props: CaptionsProps}) => ({durationInFrames: captionsDuration(props, FPS)})}
    />
    {/* Style L: phone mockup for a screen recording (two layers; ffmpeg places the recording between them). */}
    <Composition
      id="PhoneMockReel"
      component={PhoneMockReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={300}
      defaultProps={{layer: 'fg', bg: '', end: 10} as PhoneMockProps}
      calculateMetadata={({props}: {props: PhoneMockProps}) => ({durationInFrames: phoneMockDuration(props, FPS)})}
    />
    {/* Style M: animated e-invitation (video taklifnoma): arched photo + script names, then monogram wreath + details. */}
    <Composition
      id="InvitationReel"
      component={InvitationReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={600}
      defaultProps={{photo: '', end: 20, sceneB: 7} as unknown as InvitationProps}
      calculateMetadata={({props}: {props: InvitationProps}) => ({durationInFrames: invitationDuration(props, FPS)})}
    />
    {/* Style N: marble e-invitation: black-gold rose wreath monogram, pan to an arched gold card. */}
    <Composition
      id="MarbleInviteReel"
      component={MarbleInviteReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={400}
      defaultProps={{marble: '', end: 13, turn: 3.6} as unknown as MarbleInviteProps}
      calculateMetadata={({props}: {props: MarbleInviteProps}) => ({durationInFrames: marbleInviteDuration(props, FPS)})}
    />
    {/* Style O: painterly-illustration e-invitation: push-in on the art, drifting cosmos, tilt into the sky for details. */}
    <Composition
      id="PaintedInviteReel"
      component={PaintedInviteReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={420}
      defaultProps={{art: '', end: 14, turn: 6} as unknown as PaintedInviteProps}
      calculateMetadata={({props}: {props: PaintedInviteProps}) => ({durationInFrames: paintedInviteDuration(props, FPS)})}
    />
    {/* Style P: Islamic e-invitation: the user's faceless clip in a gold mihrab arch on a navy girih card, Bismillah. */}
    <Composition
      id="IslamicInviteReel"
      component={IslamicInviteReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={390}
      defaultProps={{video: '', end: 13, detailsAt: 6} as unknown as IslamicInviteProps}
      calculateMetadata={({props}: {props: IslamicInviteProps}) => ({durationInFrames: islamicInviteDuration(props, FPS)})}
    />
    {/* Style P2: minimalist Islamic invite: ivory paper, uncropped 9:16 clip that glides into a smaller window, hairlines. */}
    <Composition
      id="MinimalIslamicReel"
      component={MinimalIslamicReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={390}
      defaultProps={{video: '', end: 13, shrinkAt: 4} as unknown as MinimalIslamicProps}
      calculateMetadata={({props}: {props: MinimalIslamicProps}) => ({durationInFrames: minimalIslamicDuration(props, FPS)})}
    />
    {/* Style Q: cinematic minimalist invite for a dark clip: near-black page, champagne type, clip window, user music. */}
    <Composition
      id="CinemaInviteReel"
      component={CinemaInviteReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={480}
      defaultProps={{video: '', srcW: 1080, srcH: 1920, end: 16, detailsAt: 7} as unknown as CinemaInviteProps}
      calculateMetadata={({props}: {props: CinemaInviteProps}) => ({durationInFrames: cinemaInviteDuration(props, FPS)})}
    />
    {/* Style Q2: "wow" cinematic invite: clip plays inside giant Bodoni names, black melts away, gold names glide down. */}
    <Composition
      id="GrandInviteReel"
      component={GrandInviteReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={480}
      defaultProps={{video: '', srcW: 1080, srcH: 1920, end: 16, revealAt: 3.2, detailsAt: 7.9} as unknown as GrandInviteProps}
      calculateMetadata={({props}: {props: GrandInviteProps}) => ({durationInFrames: grandInviteDuration(props, FPS)})}
    />
    {/* Style R: top-5 countdown ranking bar: logos pop big, then drop into their numbered slot. */}
    <Composition
      id="RankReel"
      component={RankReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={600}
      defaultProps={{video: '', end: 20, hideAt: 18, apps: []} as unknown as RankProps}
      calculateMetadata={({props}: {props: RankProps}) => ({durationInFrames: rankDuration(props, FPS)})}
    />
  </>
);
