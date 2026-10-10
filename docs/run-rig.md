# Rear-view running rig

Generated via built-in ImageGen, using zodiac-rear-a.png as the identity reference; saved to frontend/public/assets/characters/zodiac-run-rig.png. Original front-facing character selector artwork is unchanged.

Prompt: preserve all 24 Vietnamese zodiac identities in 8×3 order, rear view, neutral symmetrical stance, two visible separate legs with heels on the same baseline, shortened hems revealing legs, transparent background, no labels or grid. Full production prompt specified 1536×1024, transparent gutters and all male/female pairs.

The engine uses individually measured costume hems (runRig.js) and three texture frames per character. Each foot has its own pivot; shortening/lifting the leg and bending at the hip alternate half a cycle apart. The body covers the leg roots. A continuous phase uses delta time and running speed; it freezes when the game pauses, resets on restart, and yields to jump/roll poses. No changes to hitboxes, scores or movement speed.

frontend/animation-review.html is a local Vite visual review page for all 24 rigs. The production character selector also shows the selected rear-view run cycle next to the original portrait.
