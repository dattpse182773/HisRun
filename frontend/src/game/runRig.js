import { rearFrame } from './characters.js';
export const RUN_RIG_ATLAS = '/assets/characters/zodiac-run-rig.png';
// Measured costume hems and leg centres on the neutral rear atlas. Keeping each
// costume's cut separate avoids moving a skirt, tail or prop as if it were a foot.
const HEMS = [300,302,300,302,299,305,305,305,622,626,630,632,616,633,617,632,931,941,937,943,940,943,940,953];
const CENTRES = [112,294,491,679,860,1042,1228,1425,108,296,488,677,860,1044,1236,1427,106,290,487,679,856,1044,1236,1429];
export function rigParts(index) {
  const f = rearFrame(index), cut = HEMS[index], mid = CENTRES[index];
  return {
    frame: f,
    body: { x: f.x, y: f.y, width: f.width, height: cut - f.y },
    left: { x: mid - 43, y: cut - 7, width: 43, height: f.y + f.height - cut + 7 },
    right: { x: mid, y: cut - 7, width: 43, height: f.y + f.height - cut + 7 },
  };
}
export function gaitPose(phase) {
  const swing = Math.sin(phase);
  const leg = (lift, side) => ({ lift, scaleY: 1 - .48 * lift, y: -3 * lift, angle: side * 7 * lift });
  return { left: leg(Math.max(0, swing), -1), right: leg(Math.max(0, -swing), 1), bob: -Math.abs(Math.cos(phase)) * 2.5, lean: swing * 1.5 };
}
export function gaitAdvance(dt, speed = 300) { return dt * Math.PI * 2 * Math.max(1.8, Math.min(3.5, speed / 120)); }
