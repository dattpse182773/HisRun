import * as service from '../services/questionService.js';

export async function list(req, res) { res.json(await service.getQuestions(req.query)); }
export async function random(req, res) { res.json(await service.getRandomQuestion(req.query)); }
export async function detail(req, res) { res.json(await service.getQuestion(req.params.id)); }
export async function answer(req, res) { res.json(await service.checkAnswer(req.params.id, req.body?.answer)); }
