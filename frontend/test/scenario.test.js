import test from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTERS, ZODIACS, getCharacter, characterFrame, rearFrame, ATLAS_SIZE } from '../src/game/characters.js';
import { SCENERY, projectTrack } from '../src/game/scenery.js';
import { existsSync } from 'node:fs';
import { JOURNEY_MAPS, checkpointsFor } from '../../shared/journey.js';
import { MAP_STORIES } from '../../shared/scenario.js';

test('all zodiac variants resolve to distinct, non-overlapping atlas frames', () => {
  assert.equal(ZODIACS.length, 12);
  assert.equal(new Set(CHARACTERS.map(c => c.id)).size, 24);
  for (const zodiac of ZODIACS) assert.deepEqual(CHARACTERS.filter(c => c.zodiac === zodiac.id).map(c => c.variant), ['nam','nu']);
  const frames = CHARACTERS.map(c => characterFrame(c.frame));
  frames.forEach((a, i) => {
    assert.ok(a.x >= 0 && a.y >= 0 && a.x + a.width <= ATLAS_SIZE.width && a.y + a.height <= ATLAS_SIZE.height);
    frames.slice(i + 1).forEach(b => assert.ok(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y));
  });
  assert.equal(getCharacter('deleted-avatar').id, 'ty-nam');
});
test('rear animation frames stay within atlas and all scenery projects to the same collision lanes', () => {
  CHARACTERS.forEach(c => {
    const frame = rearFrame(c.frame);
    assert.ok(frame.x >= 0 && frame.y >= 0 && frame.x + frame.width <= 1536 && frame.y + frame.height <= 1024);
  });
  JOURNEY_MAPS.forEach(map => {
    const { horizon } = SCENERY[map.theme];
    assert.ok(existsSync(new URL(`../public/assets/backgrounds/${map.theme}.png`, import.meta.url)));
    [0,1,2].forEach(lane => {
      assert.deepEqual(projectTrack(lane, 0, horizon), horizon);
      assert.deepEqual(projectTrack(lane, 1, horizon), { x: [360,640,920][lane], y: 625 });
    });
  });
});
test('each playable map has history, geography, recap sources and both quiz subjects', () => {
  for (const map of JOURNEY_MAPS) {
    const story = MAP_STORIES[map.id];
    assert.ok(story.geography && story.connection && story.timeline.length >= 3);
    assert.equal(new URL(story.source[1]).protocol, 'https:');
    for (const landmark of map.landmarks) assert.deepEqual(checkpointsFor(map.id).filter(c => c.landmarkId === landmark.id).map(c => c.subject), ['history','geography']);
  }
});
