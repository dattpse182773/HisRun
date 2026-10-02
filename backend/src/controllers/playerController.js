import * as service from '../services/playerService.js';
export async function create(req, res) { res.status(201).json(await service.createPlayer(req.body?.username)); }
export async function detail(req, res) { res.json(await service.getPlayer(req.params.id)); }
export async function result(req, res) { res.json(await service.saveResult(req.body, req.headers.authorization)); }
export async function leaderboard(req, res) { res.json(await service.leaderboard(req.params.metric)); }
