export const MAX_LIVES = 3;
export const QUESTION_SECONDS = 20;
export const QUESTION_METERS = 180;
export function questionReady(state) {
  return state.examIndex < 10 && state.duration >= (state.questionAtTime || 0) + QUESTION_SECONDS && state.distance >= (state.questionAtDistance || 0) + QUESTION_METERS;
}
export function resolveRunAnswer(state, correct) {
  state.health = Math.max(0, Math.min(MAX_LIVES, state.health + (correct ? 1 : -1)));
  state.distance = Math.max(0, Math.min(state.distanceTarget || Infinity, state.distance + (correct ? 20 : -50)));
  state.questionAtTime = state.duration;
  state.questionAtDistance = state.distance;
}
