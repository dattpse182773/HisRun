# PHASE 1 — HISRUN PROJECT SETUP
Mã nguồn đầy đủ từng file. Architecture, lệnh terminal, MongoDB, Run project, Test API và Verify build: xem ../README.md. Không bao gồm node_modules, dist, dữ liệu MongoDB, file .env riêng hoặc package-lock sinh tự động.

## FILE: .gitignore

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
coverage/
*.log
.local/

```

## FILE: backend/.env.example

```example
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hisrun
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

```

## FILE: backend/package.json

```json
{
  "name": "hisrun-api", "version": "0.1.0", "private": true, "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": { "dev": "node --watch src/server.js", "start": "node src/server.js", "seed": "node src/scripts/seedQuestions.js", "test": "node --test", "db:dev": "node src/scripts/localMongo.js" },
  "dependencies": { "cors": "^2.8.5", "dotenv": "^17.2.0", "express": "^5.1.0", "express-rate-limit": "^8.0.0", "helmet": "^8.1.0", "mongoose": "^8.19.0" },
  "devDependencies": { "mongodb-memory-server": "^10.2.0", "supertest": "^7.1.0" }
}

```

## FILE: backend/src/app.js

```js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';
import { isDatabaseConnected } from './config/database.js';
import questionRoutes from './routes/questionRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.origin }));
app.use(rateLimit({ windowMs: 60000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau một phút.' } }));
app.use(express.json({ limit: '16kb' }));
app.get('/api/health', (req, res) => {
  const connected = isDatabaseConnected();
  res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'degraded', database: connected ? 'connected' : 'disconnected', service: 'HisRun API' });
});
app.use('/api/questions', questionRoutes);
app.use(notFound);
app.use(errorHandler);

```

## FILE: backend/src/config/database.js

```js
import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('bufferCommands', false);
export async function connectDatabase() {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected');
}
export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

```

## FILE: backend/src/config/env.js

```js
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });
export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hisrun',
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  production: process.env.NODE_ENV === 'production',
};

```

## FILE: backend/src/controllers/questionController.js

```js
import * as service from '../services/questionService.js';

export async function list(req, res) { res.json(await service.getQuestions(req.query)); }
export async function random(req, res) { res.json(await service.getRandomQuestion(req.query)); }
export async function detail(req, res) { res.json(await service.getQuestion(req.params.id)); }
export async function answer(req, res) { res.json(await service.checkAnswer(req.params.id, req.body?.answer)); }

```

## FILE: backend/src/data/questions/geography.json

```json
[
  {"subject":"geography","grade":6,"difficulty":1,"topic":"Trái Đất","question":"Trái Đất chuyển động quanh ngôi sao nào?","answers":["Sao Hỏa","Mặt Trăng","Mặt Trời","Sao Kim"],"correctAnswer":2,"explanation":"Trái Đất chuyển động quanh Mặt Trời.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":6,"difficulty":1,"topic":"Phương hướng","question":"Trên bản đồ có hướng bắc ở phía trên, hướng đông ở phía nào?","answers":["Bên trái","Bên phải","Phía dưới","Ở giữa"],"correctAnswer":1,"explanation":"Khi hướng bắc ở trên, hướng đông nằm bên phải bản đồ.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":6,"difficulty":1,"topic":"Xích đạo","question":"Đường Xích đạo chia Trái Đất thành hai phần nào?","answers":["Bán cầu Bắc và bán cầu Nam","Bán cầu Đông và bán cầu Tây","Lục địa và đại dương","Núi và đồng bằng"],"correctAnswer":0,"explanation":"Đường Xích đạo phân chia bán cầu Bắc và bán cầu Nam.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":6,"difficulty":2,"topic":"Kinh tuyến","question":"Kinh tuyến gốc có số độ là bao nhiêu?","answers":["90°","180°","360°","0°"],"correctAnswer":3,"explanation":"Kinh tuyến gốc được quy ước là kinh tuyến 0°.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":6,"difficulty":2,"topic":"Chuyển động Trái Đất","question":"Hiện tượng ngày và đêm luân phiên chủ yếu do chuyển động nào?","answers":["Mặt Trăng quay quanh Trái Đất","Trái Đất tự quay quanh trục","Mây di chuyển","Thủy triều"],"correctAnswer":1,"explanation":"Sự tự quay quanh trục của Trái Đất tạo ra ngày và đêm luân phiên.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":7,"difficulty":1,"topic":"Châu lục","question":"Châu lục nào có diện tích lớn nhất?","answers":["Châu Âu","Châu Đại Dương","Châu Á","Châu Nam Cực"],"correctAnswer":2,"explanation":"Châu Á có diện tích lớn nhất trong các châu lục.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":7,"difficulty":1,"topic":"Đại dương","question":"Đại dương nào có diện tích lớn nhất?","answers":["Thái Bình Dương","Ấn Độ Dương","Bắc Băng Dương","Đại Tây Dương"],"correctAnswer":0,"explanation":"Thái Bình Dương là đại dương có diện tích lớn nhất.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":7,"difficulty":2,"topic":"Châu Phi","question":"Hoang mạc Sahara nằm ở châu lục nào?","answers":["Châu Á","Châu Âu","Châu Đại Dương","Châu Phi"],"correctAnswer":3,"explanation":"Sahara nằm ở phía bắc châu Phi.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":7,"difficulty":2,"topic":"Châu Nam Cực","question":"Châu lục nào bao quanh cực Nam?","answers":["Châu Âu","Châu Nam Cực","Châu Á","Châu Phi"],"correctAnswer":1,"explanation":"Châu Nam Cực bao quanh cực Nam của Trái Đất.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":7,"difficulty":3,"topic":"Nam Mỹ","question":"Rừng Amazon chủ yếu nằm ở khu vực nào?","answers":["Bắc Phi","Tây Âu","Nam Mỹ","Trung Á"],"correctAnswer":2,"explanation":"Rừng Amazon nằm ở Nam Mỹ.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":8,"difficulty":1,"topic":"Việt Nam","question":"Việt Nam thuộc khu vực nào của châu Á?","answers":["Đông Nam Á","Tây Á","Trung Á","Nam Á"],"correctAnswer":0,"explanation":"Việt Nam thuộc khu vực Đông Nam Á.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":8,"difficulty":1,"topic":"Biển Việt Nam","question":"Biển nằm ở phía đông phần đất liền Việt Nam có tên là gì?","answers":["Biển Đỏ","Biển Đông","Biển Đen","Địa Trung Hải"],"correctAnswer":1,"explanation":"Phía đông phần đất liền Việt Nam giáp Biển Đông.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":8,"difficulty":2,"topic":"Địa hình","question":"Đỉnh núi cao nhất Việt Nam có tên là gì?","answers":["Bà Đen","Bạch Mã","Fansipan","Lang Biang"],"correctAnswer":2,"explanation":"Fansipan là đỉnh núi cao nhất Việt Nam.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":9,"difficulty":1,"topic":"Đồng bằng","question":"Đồng bằng sông Cửu Long gắn với hệ thống sông nào?","answers":["Sông Nile","Sông Amazon","Sông Danube","Sông Mekong"],"correctAnswer":3,"explanation":"Đồng bằng sông Cửu Long là phần châu thổ sông Mekong ở Việt Nam.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":9,"difficulty":2,"topic":"Tây Nguyên","question":"Dạng địa hình tiêu biểu của Tây Nguyên là gì?","answers":["Cao nguyên","Băng hà","Đồng bằng châu thổ","Đảo san hô"],"correctAnswer":0,"explanation":"Tây Nguyên có các cao nguyên là dạng địa hình tiêu biểu.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":10,"difficulty":1,"topic":"Khí quyển","question":"Dụng cụ nào thường dùng để đo nhiệt độ không khí?","answers":["La bàn","Nhiệt kế","Thước dây","Cân"],"correctAnswer":1,"explanation":"Nhiệt kế được dùng để đo nhiệt độ.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":10,"difficulty":2,"topic":"Vòng tuần hoàn nước","question":"Nước chuyển từ thể lỏng sang thể hơi gọi là gì?","answers":["Đông đặc","Ngưng tụ","Bay hơi","Kết tinh"],"correctAnswer":2,"explanation":"Bay hơi là quá trình nước chuyển từ thể lỏng sang thể hơi.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":11,"difficulty":1,"topic":"Đông Nam Á","question":"Quốc gia nào sau đây thuộc Đông Nam Á?","answers":["Thái Lan","Canada","Ai Cập","Pháp"],"correctAnswer":0,"explanation":"Thái Lan là một quốc gia ở Đông Nam Á.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":12,"difficulty":1,"topic":"Nông nghiệp","question":"Cây lúa nước thuộc nhóm cây nào?","answers":["Cây lấy gỗ","Cây lương thực","Cây cao su","Cây cảnh"],"correctAnswer":1,"explanation":"Lúa nước là cây lương thực quan trọng.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"geography","grade":12,"difficulty":2,"topic":"Năng lượng","question":"Nguồn nào sau đây là năng lượng tái tạo?","answers":["Than đá","Dầu mỏ","Khí tự nhiên","Ánh sáng Mặt Trời"],"correctAnswer":3,"explanation":"Năng lượng Mặt Trời là nguồn năng lượng tái tạo.","source":"Sample data — chưa đối chiếu SGK chính thức"}
]

```

## FILE: backend/src/data/questions/history.json

```json
[
  {"subject":"history","grade":6,"difficulty":1,"topic":"Ngô Quyền","question":"Ngô Quyền đánh bại quân Nam Hán trên sông nào năm 938?","answers":["Sông Hồng","Sông Bạch Đằng","Sông Mã","Sông Cả"],"correctAnswer":1,"explanation":"Năm 938, Ngô Quyền đánh bại quân Nam Hán trên sông Bạch Đằng.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":6,"difficulty":1,"topic":"Văn Lang","question":"Những người đứng đầu nhà nước Văn Lang được gọi là gì?","answers":["Vua Hùng","Hoàng đế nhà Trần","Chúa Nguyễn","Vua Lê"],"correctAnswer":0,"explanation":"Các vua đứng đầu nhà nước Văn Lang được gọi là Hùng Vương, hay vua Hùng.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":6,"difficulty":1,"topic":"Âu Lạc","question":"Thành Cổ Loa gắn với nhà nước nào?","answers":["Đại Việt","Đại Ngu","Âu Lạc","Vạn Xuân"],"correctAnswer":2,"explanation":"Cổ Loa là kinh đô của nhà nước Âu Lạc.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":6,"difficulty":1,"topic":"Hai Bà Trưng","question":"Cuộc khởi nghĩa Hai Bà Trưng bùng nổ vào năm nào?","answers":["938","40","1009","1288"],"correctAnswer":1,"explanation":"Cuộc khởi nghĩa Hai Bà Trưng bùng nổ năm 40.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":6,"difficulty":2,"topic":"Vạn Xuân","question":"Ai đặt tên nước là Vạn Xuân sau khi lên ngôi?","answers":["Lý Bí","Ngô Quyền","Đinh Bộ Lĩnh","Lê Lợi"],"correctAnswer":0,"explanation":"Lý Bí lên ngôi năm 544, đặt tên nước là Vạn Xuân.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":7,"difficulty":1,"topic":"Nhà Đinh","question":"Đinh Bộ Lĩnh đặt quốc hiệu là gì?","answers":["Văn Lang","Âu Lạc","Đại Cồ Việt","Đại Nam"],"correctAnswer":2,"explanation":"Đinh Bộ Lĩnh đặt quốc hiệu Đại Cồ Việt năm 968.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":7,"difficulty":1,"topic":"Nhà Lý","question":"Ai dời đô từ Hoa Lư ra Đại La năm 1010?","answers":["Lê Lợi","Lý Công Uẩn","Quang Trung","Trần Hưng Đạo"],"correctAnswer":1,"explanation":"Lý Công Uẩn dời đô ra Đại La năm 1010 và đổi tên thành Thăng Long.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":7,"difficulty":2,"topic":"Thăng Long","question":"Sau khi dời đô năm 1010, Đại La được đổi tên thành gì?","answers":["Huế","Hội An","Hoa Lư","Thăng Long"],"correctAnswer":3,"explanation":"Lý Công Uẩn đổi tên Đại La thành Thăng Long.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":7,"difficulty":2,"topic":"Nhà Trần","question":"Trần Hưng Đạo gắn với các cuộc kháng chiến chống quân xâm lược nào?","answers":["Mông - Nguyên","Nam Hán","Thanh","Minh"],"correctAnswer":0,"explanation":"Trần Hưng Đạo là vị chỉ huy nổi bật trong kháng chiến chống Mông - Nguyên thời Trần.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":7,"difficulty":3,"topic":"Lam Sơn","question":"Ai là người lãnh đạo cuộc khởi nghĩa Lam Sơn?","answers":["Ngô Quyền","Lý Bí","Lê Lợi","Đinh Bộ Lĩnh"],"correctAnswer":2,"explanation":"Lê Lợi lãnh đạo cuộc khởi nghĩa Lam Sơn.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":8,"difficulty":1,"topic":"Tây Sơn","question":"Hoàng đế Quang Trung có tên thật là gì?","answers":["Nguyễn Trãi","Nguyễn Huệ","Nguyễn Du","Nguyễn Bỉnh Khiêm"],"correctAnswer":1,"explanation":"Nguyễn Huệ lên ngôi hoàng đế với niên hiệu Quang Trung.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":8,"difficulty":2,"topic":"Nhà Nguyễn","question":"Kinh đô của triều Nguyễn đặt tại đâu?","answers":["Huế","Cổ Loa","Hoa Lư","Lam Sơn"],"correctAnswer":0,"explanation":"Triều Nguyễn đặt kinh đô tại Huế.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":8,"difficulty":3,"topic":"Nguyễn Trãi","question":"Ai là tác giả Bình Ngô đại cáo?","answers":["Nguyễn Du","Hồ Xuân Hương","Nguyễn Trãi","Lý Công Uẩn"],"correctAnswer":2,"explanation":"Nguyễn Trãi viết Bình Ngô đại cáo.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":9,"difficulty":1,"topic":"Độc lập","question":"Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập năm 1945 tại đâu?","answers":["Bến Nhà Rồng","Quảng trường Ba Đình","Cố đô Huế","Thành Cổ Loa"],"correctAnswer":1,"explanation":"Tuyên ngôn Độc lập được đọc tại Quảng trường Ba Đình, Hà Nội.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":9,"difficulty":2,"topic":"Điện Biên Phủ","question":"Chiến thắng Điện Biên Phủ diễn ra năm nào?","answers":["1945","1930","1975","1954"],"correctAnswer":3,"explanation":"Chiến thắng Điện Biên Phủ diễn ra năm 1954.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":10,"difficulty":1,"topic":"Tư liệu lịch sử","question":"Một chiếc trống đồng cổ thuộc loại tư liệu nào?","answers":["Hiện vật","Truyền miệng","Dự báo thời tiết","Bản tin tương lai"],"correctAnswer":0,"explanation":"Trống đồng là hiện vật, có thể được dùng để nghiên cứu quá khứ.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":10,"difficulty":3,"topic":"Văn minh cổ đại","question":"Kim tự tháp Giza gắn với nền văn minh cổ đại nào?","answers":["Hy Lạp","La Mã","Ai Cập","Ấn Độ"],"correctAnswer":2,"explanation":"Các kim tự tháp Giza thuộc nền văn minh Ai Cập cổ đại.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":11,"difficulty":1,"topic":"Cách mạng công nghiệp","question":"Cách mạng công nghiệp lần thứ nhất khởi đầu ở nước nào?","answers":["Nhật Bản","Anh","Brazil","Ai Cập"],"correctAnswer":1,"explanation":"Cách mạng công nghiệp lần thứ nhất khởi đầu ở Anh.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":12,"difficulty":1,"topic":"Cách mạng tháng Tám","question":"Cách mạng tháng Tám ở Việt Nam diễn ra năm nào?","answers":["1954","1975","1945","1986"],"correctAnswer":2,"explanation":"Cách mạng tháng Tám diễn ra năm 1945.","source":"Sample data — chưa đối chiếu SGK chính thức"},
  {"subject":"history","grade":12,"difficulty":2,"topic":"Đại thắng mùa Xuân","question":"Chiến dịch Hồ Chí Minh kết thúc thắng lợi năm nào?","answers":["1975","1954","1945","1930"],"correctAnswer":0,"explanation":"Chiến dịch Hồ Chí Minh kết thúc thắng lợi ngày 30 tháng 4 năm 1975.","source":"Sample data — chưa đối chiếu SGK chính thức"}
]

```

## FILE: backend/src/middleware/errorHandler.js

```js
export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Không tìm thấy endpoint.' });
}
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error instanceof HttpError ? error.status : error.type === 'entity.parse.failed' ? 400 : error.type === 'entity.too.large' ? 413 : 500;
  const message = error instanceof HttpError ? error.message : status === 400 ? 'JSON không hợp lệ.' : status === 413 ? 'Dữ liệu quá lớn.' : 'Máy chủ đang gặp sự cố. Vui lòng thử lại.';
  res.status(status).json({ success: false, message });
}

```

## FILE: backend/src/models/Question.js

```js
import mongoose from 'mongoose';

const integer = { validator: Number.isInteger, message: 'Must be an integer' };
const questionSchema = new mongoose.Schema({
  subject: { type: String, enum: ['history', 'geography'], required: true },
  grade: { type: Number, min: 6, max: 12, required: true, validate: integer },
  difficulty: { type: Number, min: 1, max: 5, required: true, validate: integer },
  topic: { type: String, required: true, trim: true, maxlength: 200 },
  question: { type: String, required: true, trim: true, maxlength: 2000 },
  answers: {
    type: [String], required: true,
    validate: { validator: value => value.length === 4 && value.every(answer => answer.trim().length > 0), message: 'Question must contain exactly 4 non-empty answers' },
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3, validate: integer, select: false },
  explanation: { type: String, default: '', select: false },
  source: { type: String, default: 'SGK' },
  chapter: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });
questionSchema.index({ subject: 1, grade: 1, difficulty: 1 });
export default mongoose.model('Question', questionSchema);

```

## FILE: backend/src/routes/questionRoutes.js

```js
import { Router } from 'express';
import * as controller from '../controllers/questionController.js';
import { isDatabaseConnected } from '../config/database.js';
import { HttpError } from '../middleware/errorHandler.js';

const router = Router();
router.use((req, res, next) => next(isDatabaseConnected() ? undefined : new HttpError(503, 'MongoDB chưa kết nối. Vui lòng thử lại sau.')));
router.get('/', controller.list);
router.get('/random', controller.random);
router.get('/:id', controller.detail);
router.post('/:id/answer', controller.answer);
export default router;

```

## FILE: backend/src/scripts/localMongo.js

```js
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Optional development-only launcher. Runs a real local mongod, with persistent data.
const port = 27017;
const portFree = await new Promise(resolve => {
  const probe = net.createServer();
  probe.once('error', () => resolve(false));
  probe.listen(port, '127.0.0.1', () => probe.close(() => resolve(true)));
});
if (!portFree) {
  console.error('Port 27017 already in use. Keep your existing MongoDB service; do not start a second one.');
  process.exit(1);
}
const dbPath = fileURLToPath(new URL('../../.local/mongodb', import.meta.url));
await mkdir(dbPath, { recursive: true });
let mongo;
try {
  mongo = await MongoMemoryServer.create({ instance: { port, ip: '127.0.0.1', dbPath, storageEngine: 'wiredTiger' } });
  console.log('Development MongoDB: mongodb://127.0.0.1:27017/hisrun');
  console.log(`Data persisted in ${dbPath}. Ctrl+C to stop. Not a production service.`);
} catch {
  console.error('Cannot start development MongoDB. Check download access and port 27017, or use MongoDB Community/Atlas.');
  process.exit(1);
}
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await mongo.stop({ doCleanup: false });
  process.exit(0);
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);

```

## FILE: backend/src/scripts/seedQuestions.js

```js
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Question from '../models/Question.js';

try {
  const groups = await Promise.all(['history', 'geography'].map(async subject => {
    const rows = JSON.parse(await readFile(new URL(`../data/questions/${subject}.json`, import.meta.url), 'utf8'));
    if (!Array.isArray(rows) || rows.length !== 20 || rows.some(row => row.subject !== subject)) throw new Error('Invalid sample dataset');
    return rows;
  }));
  const rows = groups.flat();
  await Promise.all(rows.map(row => new Question(row).validate()));
  await connectDatabase();
  const result = await Question.bulkWrite(rows.map(row => ({ updateOne: { filter: { subject: row.subject, question: row.question, source: row.source }, update: { $set: row }, upsert: true } })));
  console.log(`Seed complete: ${rows.length} validated samples, ${result.upsertedCount} inserted. Existing non-sample questions preserved.`);
} catch {
  console.error('Seed failed. Check MongoDB connection and the two sample JSON files.');
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

```

## FILE: backend/src/server.js

```js
import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, isDatabaseConnected } from './config/database.js';

let connecting = false;
async function tryConnect() {
  if (connecting || isDatabaseConnected()) return;
  connecting = true;
  try { await connectDatabase(); }
  catch { console.error('MongoDB unavailable. Check MONGODB_URI and MongoDB service. Retrying in 10 seconds.'); }
  finally { connecting = false; }
}
const server = app.listen(env.port, () => console.log(`HisRun API: http://localhost:${env.port}`));
server.on('error', () => { console.error('Cannot start API. Check PORT availability.'); process.exit(1); });
void tryConnect();
const retry = setInterval(tryConnect, 10000);
async function shutdown() {
  clearInterval(retry);
  const deadline = setTimeout(() => process.exit(1), 5000);
  deadline.unref();
  server.close(async () => { await mongoose.disconnect(); process.exit(0); });
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

```

## FILE: backend/src/services/questionService.js

```js
import mongoose from 'mongoose';
import Question from '../models/Question.js';
import { HttpError } from '../middleware/errorHandler.js';

const publicFields = { _id: 1, subject: 1, grade: 1, difficulty: 1, topic: 1, question: 1, answers: 1, source: 1, chapter: 1 };
export function parseInteger(value, name, min, max, fallback) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < min || Number(value) > max) {
    throw new HttpError(400, `${name} phải là số nguyên từ ${min} đến ${max}.`);
  }
  return Number(value);
}
export function validateId(id) {
  if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id) || !mongoose.isValidObjectId(id)) throw new HttpError(400, 'ID câu hỏi không hợp lệ.');
}
export function buildFilters(query) {
  const filters = { active: true };
  if (query.subject !== undefined) {
    if (!['history', 'geography'].includes(query.subject)) throw new HttpError(400, 'Môn học không hợp lệ.');
    filters.subject = query.subject;
  }
  for (const [key, min, max] of [['grade', 6, 12], ['difficulty', 1, 5]]) {
    const value = parseInteger(query[key], key, min, max);
    if (value !== undefined) filters[key] = value;
  }
  if (query.exclude !== undefined) {
    if (typeof query.exclude !== 'string') throw new HttpError(400, 'exclude phải là danh sách ID.');
    const ids = query.exclude.split(',');
    if (ids.length > 20) throw new HttpError(400, 'Chỉ loại trừ tối đa 20 câu gần nhất.');
    ids.forEach(validateId);
    filters._id = { $nin: ids.map(id => new mongoose.Types.ObjectId(id)) };
  }
  return filters;
}
export async function getQuestions(query) {
  const filters = buildFilters(query);
  const page = parseInteger(query.page, 'page', 1, 10000, 1);
  const limit = parseInteger(query.limit, 'limit', 1, 100, 20);
  const [questions, total] = await Promise.all([
    Question.find(filters).select(publicFields).sort({ _id: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Question.countDocuments(filters),
  ]);
  return { questions, page, limit, total };
}
export async function getRandomQuestion(query) {
  const [question] = await Question.aggregate([{ $match: buildFilters(query) }, { $sample: { size: 1 } }, { $project: publicFields }]);
  if (!question) throw new HttpError(404, 'Không có câu hỏi phù hợp. Hãy đổi bộ lọc hoặc seed dữ liệu.');
  return question;
}
export async function getQuestion(id) {
  validateId(id);
  const question = await Question.findOne({ _id: id, active: true }).select(publicFields).lean();
  if (!question) throw new HttpError(404, 'Không tìm thấy câu hỏi.');
  return question;
}
export async function checkAnswer(id, answer) {
  validateId(id);
  if (!Number.isInteger(answer) || answer < 0 || answer > 3) throw new HttpError(400, 'answer phải là số nguyên từ 0 đến 3.');
  const question = await Question.findOne({ _id: id, active: true }).select('+correctAnswer +explanation').lean();
  if (!question) throw new HttpError(404, 'Không tìm thấy câu hỏi.');
  return { correct: answer === question.correctAnswer, correctAnswer: question.correctAnswer, explanation: question.explanation };
}

```

## FILE: backend/test/api.test.js

```js
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/app.js';
import Question from '../src/models/Question.js';

let mongo;
let known;
before(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri('hisrun_test');
  const seedPath = new URL('../src/scripts/seedQuestions.js', import.meta.url);
  const { fileURLToPath } = await import('node:url');
  for (let i = 0; i < 2; i++) execFileSync(process.execPath, [fileURLToPath(seedPath)], { env: { ...process.env, MONGODB_URI: uri }, timeout: 30000 });
  await mongoose.connect(uri);
  known = await Question.findOne({ topic: 'Ngô Quyền' }).select('+correctAnswer +explanation').lean();
});
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });

test('health reports the actual database connection', async () => {
  const response = await request(app).get('/api/health').expect(200);
  assert.deepEqual(response.body, { status: 'ok', database: 'connected', service: 'HisRun API' });
});
test('seed is repeatable: 40 samples, 20 per subject', async () => {
  assert.equal(await Question.countDocuments(), 40);
  for (const subject of ['history', 'geography']) {
    const rows = JSON.parse(await readFile(new URL(`../src/data/questions/${subject}.json`, import.meta.url), 'utf8'));
    assert.equal(rows.length, 20);
    assert.equal(await Question.countDocuments({ subject }), 20);
  }
});
test('list, random and detail never disclose answers or explanations', async () => {
  for (const path of ['/api/questions', '/api/questions/random', `/api/questions/${known._id}`]) {
    const { body } = await request(app).get(path).expect(200);
    const rows = body.questions || [body];
    for (const row of rows) {
      assert.equal('correctAnswer' in row, false);
      assert.equal('explanation' in row, false);
      assert.equal(row.answers.length, 4);
    }
  }
});
test('random respects subject, grade, difficulty and recent exclusions', async () => {
  const { body } = await request(app).get(`/api/questions/random?subject=history&grade=6&difficulty=1&exclude=${known._id}`).expect(200);
  assert.equal(body.subject, 'history'); assert.equal(body.grade, 6); assert.equal(body.difficulty, 1);
  assert.notEqual(body._id, String(known._id));
  await request(app).get('/api/questions/random?subject=history&grade=6&difficulty=5').expect(404);
});
test('pagination is bounded and deterministic', async () => {
  const first = await request(app).get('/api/questions?limit=2&page=1').expect(200);
  const second = await request(app).get('/api/questions?limit=2&page=2').expect(200);
  assert.equal(first.body.total, 40); assert.equal(first.body.questions.length, 2);
  assert.notEqual(first.body.questions[0]._id, second.body.questions[0]._id);
});
test('backend validates correct and incorrect submissions', async () => {
  const correct = await request(app).post(`/api/questions/${known._id}/answer`).send({ answer: known.correctAnswer }).expect(200);
  assert.deepEqual(correct.body, { correct: true, correctAnswer: known.correctAnswer, explanation: known.explanation });
  const wrong = await request(app).post(`/api/questions/${known._id}/answer`).send({ answer: (known.correctAnswer + 1) % 4 }).expect(200);
  assert.equal(wrong.body.correct, false);
});
test('answer rejects coercion, fractions and out-of-range values', async () => {
  for (const answer of [-1, 4, 'a', '1', null, true, 1.5, {}, []]) await request(app).post(`/api/questions/${known._id}/answer`).send({ answer }).expect(400);
  await request(app).post(`/api/questions/${known._id}/answer`).send({}).expect(400);
});
test('invalid IDs and query filters return safe 400 responses', async () => {
  for (const query of ['grade=5', 'grade=13', 'difficulty=0', 'difficulty=1.5', 'subject=math', 'exclude=bad', 'limit=101', 'page=0', 'grade=6&grade=7']) {
    const { body } = await request(app).get(`/api/questions?${query}`).expect(400);
    assert.equal(body.success, false); assert.equal('stack' in body, false);
  }
  await request(app).get('/api/questions/not-an-id').expect(400);
  await request(app).post('/api/questions/invalid/answer').send({ answer: 1 }).expect(400);
  await request(app).get('/api/questions/000000000000000000000000').expect(404);
});
test('inactive questions cannot be retrieved or answered', async () => {
  await Question.updateOne({ _id: known._id }, { $set: { active: false } });
  await request(app).get(`/api/questions/${known._id}`).expect(404);
  await request(app).post(`/api/questions/${known._id}/answer`).send({ answer: 1 }).expect(404);
  await Question.updateOne({ _id: known._id }, { $set: { active: true } });
});
test('security headers, restricted CORS and centralized JSON errors', async () => {
  const response = await request(app).get('/api/health').set('Origin', 'http://localhost:5173').expect(200);
  assert.equal(response.headers['access-control-allow-origin'], 'http://localhost:5173');
  assert.ok(response.headers['x-content-type-options']);
  const blocked = await request(app).get('/api/health').set('Origin', 'https://untrusted.example');
  assert.notEqual(blocked.headers['access-control-allow-origin'], 'https://untrusted.example');
  const invalid = await request(app).post(`/api/questions/${known._id}/answer`).set('Content-Type', 'application/json').send('{broken').expect(400);
  assert.equal(invalid.body.success, false);
  await request(app).get('/api/missing').expect(404);
});
test('database loss returns degraded health and safe 503, never fake connected', async () => {
  await mongoose.disconnect();
  const { body } = await request(app).get('/api/health').expect(503);
  assert.equal(body.database, 'disconnected');
  await request(app).get('/api/questions/random').expect(503);
});

```

## FILE: frontend/.env.example

```example
VITE_API_URL=http://localhost:5000/api

```

## FILE: frontend/index.html

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#123d35" />
    <meta name="description" content="HisRun — Chạy xuyên lịch sử - Khám phá địa lý. Một hành trình khám phá Việt Nam." />
    <title>HisRun — Hành trình bắt đầu</title>
  </head>
  <body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>
</html>

```

## FILE: frontend/package.json

```json
{
  "name": "hisrun-web", "version": "0.1.0", "private": true, "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": { "dev": "vite --host 127.0.0.1", "build": "vite build", "preview": "vite preview --host 127.0.0.1" },
  "dependencies": { "phaser": "^3.90.0", "react": "^19.1.0", "react-dom": "^19.1.0", "react-router-dom": "^7.9.0" },
  "devDependencies": { "@vitejs/plugin-react": "^5.0.0", "vite": "^7.1.0" }
}

```

## FILE: frontend/src/App.jsx

```jsx
import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import BackendStatus from './components/BackendStatus.jsx';

const Game = lazy(() => import('./pages/Game.jsx'));
export default function App() {
  return <div className="app-shell">
    <header className="header"><Link to="/" className="brand" aria-label="HisRun — Trang chủ"><span className="brand-mark">H<span>↗</span></span><span>HIS<span className="brand-run">RUN</span><small>ĐI ĐỂ HIỂU. CHẠY ĐỂ KHÁM PHÁ.</small></span></Link><nav aria-label="Điều hướng chính"><Link to="/">Khám phá</Link><a href="/#journey">Hành trình</a><span className="phase-badge">BẢN THỬ NGHIỆM · 01</span></nav></header>
    <main><Suspense fallback={<div className="loading" role="status">Đang chuẩn bị hành trình…</div>}><Routes><Route path="/" element={<Home />} /><Route path="/game" element={<Game />} /><Route path="*" element={<div className="not-found"><h1>Bạn đã đi lạc một chút.</h1><Link className="primary-button" to="/">Về trang chủ ↗</Link></div>} /></Routes></Suspense></main>
    <footer><span>© {new Date().getFullYear()} HISRUN <i>•</i> Mỗi bước chạy, một điều mới.</span>{import.meta.env.DEV && <BackendStatus />}<span>Được tạo nên cho những tâm hồn khám phá <span className="footer-star">✦</span></span></footer>
  </div>;
}

```

## FILE: frontend/src/components/BackendStatus.jsx

```jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function BackendStatus() {
  const [status, setStatus] = useState('Đang kiểm tra API');
  useEffect(() => {
    const controller = new AbortController();
    api.health(controller.signal).then(data => setStatus(data.database === 'connected' ? 'API & MongoDB đã kết nối' : 'API online · MongoDB chưa kết nối')).catch(error => {
      if (!controller.signal.aborted) setStatus(error.data?.database === 'disconnected' ? 'API online · MongoDB chưa kết nối' : 'API offline · vẫn xem được bản thử');
    });
    return () => controller.abort();
  }, []);
  return <span className="backend-status" role="status"><span className="status-dot" />{status}</span>;
}

```

## FILE: frontend/src/components/Landscape.jsx

```jsx
export default function Landscape() {
  return <svg className="landscape" viewBox="0 0 1000 800" role="img" aria-label="Minh họa nguyên bản: nhà thám hiểm trên con đường qua ruộng lúa, núi xanh và làng quê Việt Nam">
    <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#beddd6"/><stop offset="1" stopColor="#e5edcc"/></linearGradient><linearGradient id="rice" x2="0" y2="1"><stop stopColor="#94b366"/><stop offset="1" stopColor="#416c48"/></linearGradient><linearGradient id="road" x2="0" y2="1"><stop stopColor="#f8df9e"/><stop offset="1" stopColor="#d79f58"/></linearGradient></defs>
    <rect width="1000" height="800" fill="url(#sky)"/><circle cx="750" cy="155" r="77" fill="#fff5c8"/>
    <g fill="#f6f6df" opacity=".7"><ellipse cx="288" cy="131" rx="100" ry="18"/><ellipse cx="233" cy="117" rx="49" ry="25"/><ellipse cx="914" cy="235" rx="112" ry="17"/></g>
    <path d="M0 421 68 323Q100 280 132 335L175 274Q210 214 251 284L313 380 380 298Q410 265 448 312L512 419 640 245Q673 178 704 233L749 352 802 272Q831 231 852 296L931 404 1000 366V650H0Z" fill="#82afa0"/>
    <path d="M0 441 124 380 241 450 343 371 458 452 600 390 710 447 867 364 1000 409V630H0Z" fill="#618f77"/>
    <path d="M0 490Q280 396 570 478T1000 457V800H0Z" fill="url(#rice)"/>
    <g fill="none" stroke="#bed18b" strokeWidth="12" opacity=".65"><path d="M0 524Q250 441 574 510T1000 511"/><path d="M0 575Q260 493 550 555T1000 567"/><path d="M0 645Q263 564 540 620T1000 631"/><path d="M0 737Q265 642 556 706T1000 721"/></g>
    <path d="M547 444C520 503 703 519 636 590S410 678 434 800H727C652 684 797 638 740 568S567 496 574 444Z" fill="url(#road)"/>
    <path d="M560 481Q576 509 644 529M659 645 688 649M528 757 569 772" fill="none" stroke="#b78853" strokeWidth="5" opacity=".45"/>
    <g transform="translate(209 412)"><path d="M-60 24H75V111H-60Z" fill="#ead8a7"/><path d="M-88 31 7-38 101 31Z" fill="#a26343"/><path d="M-88 31 7-24 101 31" fill="none" stroke="#754c37" strokeWidth="9"/><rect x="-15" y="56" width="33" height="55" fill="#536344"/><rect x="39" y="51" width="20" height="24" fill="#536344"/></g>
    <g transform="translate(891 332)"><path d="M0 29 -12 301H12L17 35Z" fill="#765838"/><path d="M4 40Q-116-40-132 69  -52 23 4 40M4 40Q-59-101 27-82 17-10 4 40M4 40Q94-60 115 24 66 13 4 40M4 40Q122 51 98 112 61 62 4 40" fill="#326d51"/></g>
    <g transform="translate(576 571) rotate(5)"><ellipse cy="124" rx="54" ry="13" fill="#795d37" opacity=".2"/><path d="M-24 63-34 111-9 118 5 75M11 66 28 113 50 105 36 56" fill="#264d49"/><path d="M-35 104-47 119Q-45 128-14 125L-9 115M28 108 37 121 61 114Q64 101 46 102" fill="#f4ebce"/><rect x="-40" y="5" width="73" height="69" rx="17" fill="#e58743"/><rect x="-37" y="17" width="24" height="47" rx="8" fill="#bb6639"/><path d="M-27 16-52 50-43 58-12 37M28 13 48 37 63 20" fill="none" stroke="#eeb681" strokeWidth="15" strokeLinecap="round"/><circle cy="-18" r="28" fill="#efc192"/><path d="M-27-25Q-21-53 9-47 34-43 31-18Z" fill="#214d44"/><ellipse cx="1" cy="-28" rx="41" ry="9" fill="#285c4b"/><path d="M-22-32 27-32" stroke="#e2bc64" strokeWidth="7"/><circle cx="17" cy="-13" r="3" fill="#27443b"/><path d="M12 2 23-1" stroke="#a66044" strokeWidth="3"/><path d="M-11 12-6 68" stroke="#ffcc76" strokeWidth="7"/></g>
    <g fill="#edc75e" stroke="#fff0ad" strokeWidth="5"><ellipse cx="645" cy="554" rx="12" ry="17"/><ellipse cx="686" cy="583" rx="15" ry="20"/><ellipse cx="706" cy="627" rx="18" ry="23"/></g>
    <g fill="#315f45"><path d="M0 705Q81 641 153 711L202 800H0Z"/><path d="M798 800Q833 714 892 726 944 652 1000 696V800Z"/></g>
    <g stroke="#669151" strokeWidth="5" fill="none"><path d="M69 800 51 737M69 780 26 754M69 783 103 744M930 800 938 747M938 778 968 755"/></g>
    <g fill="none" stroke="#496d61" strokeWidth="3" strokeLinecap="round"><path d="M459 157q10-12 20 0 10-12 20 0M533 185q8-10 16 0 8-10 16 0"/></g>
  </svg>;
}

```

## FILE: frontend/src/components/PhaserGame.jsx

```jsx
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../game/config.js';

export default function PhaserGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  useEffect(() => {
    // A private host prevents a deferred Phaser destroy from touching the next mount.
    const host = document.createElement('div');
    host.className = 'phaser-host';
    containerRef.current.appendChild(host);
    if (!gameRef.current) gameRef.current = new Phaser.Game(createGameConfig(host));
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      host.remove();
    };
  }, []);
  return <div className="game-canvas" ref={containerRef} role="img" aria-label="Canvas HisRun: nhân vật chạy tại chỗ ở làn giữa, giữa khung cảnh làng quê Việt Nam." />;
}

```

## FILE: frontend/src/game/config.js

```js
import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';

export function createGameConfig(parent) {
  return {
    type: Phaser.AUTO, parent, width: 1280, height: 720, backgroundColor: '#bdded6',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    render: { antialias: true },
    scene: [GameScene],
  };
}

```

## FILE: frontend/src/game/EventBus.js

```js
import Phaser from 'phaser';

export const EventBus = new Phaser.Events.EventEmitter();
export const GAME_EVENTS = Object.freeze({ READY: 'game:ready', REPLAY_PREVIEW: 'game:replay-preview' });

```

## FILE: frontend/src/game/objects/Player.js

```js
import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.currentLane = 1;
    this.state = 'run';
    const shadow = scene.add.ellipse(0, 69, 76, 19, 0x3c553c, 0.22);
    this.leftLeg = scene.add.rectangle(-15, 42, 19, 45, 0x234d45).setOrigin(0.5, 0.1);
    this.rightLeg = scene.add.rectangle(15, 42, 19, 45, 0x234d45).setOrigin(0.5, 0.1);
    const torso = scene.add.rectangle(0, 12, 56, 68, 0xe99149);
    const backpack = scene.add.rectangle(0, 14, 39, 45, 0xb86238).setStrokeStyle(3, 0xf6bd70);
    const head = scene.add.circle(0, -37, 25, 0xedc091);
    const hat = scene.add.ellipse(0, -49, 78, 19, 0x255b48);
    const hatTop = scene.add.rectangle(0, -61, 46, 24, 0x255b48);
    const hatBand = scene.add.rectangle(0, -51, 47, 7, 0xe9c467);
    const leftArm = scene.add.rectangle(-35, 10, 14, 43, 0xedc091).setAngle(14);
    const rightArm = scene.add.rectangle(35, 10, 14, 43, 0xedc091).setAngle(-14);
    this.add([shadow, this.leftLeg, this.rightLeg, leftArm, rightArm, torso, backpack, head, hatTop, hat, hatBand]);
    scene.add.existing(this);
    scene.tweens.add({ targets: this, y: y - 7, duration: 190, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    scene.tweens.add({ targets: this.leftLeg, angle: 22, duration: 190, yoyo: true, repeat: -1 });
    scene.tweens.add({ targets: this.rightLeg, angle: -22, duration: 190, yoyo: true, repeat: -1 });
    scene.tweens.add({ targets: [leftArm, rightArm], y: 3, duration: 190, yoyo: true, repeat: -1 });
  }
}

```

## FILE: frontend/src/game/scenes/GameScene.js

```js
import Phaser from 'phaser';
import Player from '../objects/Player.js';
import { EventBus, GAME_EVENTS } from '../EventBus.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  create() {
    const g = this.add.graphics();
    g.fillStyle(0xc3e2d8).fillRect(0, 0, 1280, 720);
    g.fillStyle(0xfff1bf).fillCircle(1030, 112, 56);
    g.fillStyle(0xedf4df, 0.8).fillEllipse(285, 113, 230, 35).fillEllipse(229, 94, 106, 56).fillEllipse(800, 156, 200, 27);
    g.fillStyle(0x8eb7a2);
    for (const [x, peak, width] of [[-40, 205, 330], [175, 139, 370], [464, 223, 285], [745, 159, 340], [1037, 215, 340]]) g.fillTriangle(x, 380, x + width / 2, peak, x + width, 380);
    g.fillStyle(0x608f70).fillEllipse(240, 379, 900, 190).fillEllipse(1120, 387, 900, 180);
    g.fillStyle(0x8ca858).fillRect(0, 380, 1280, 340);
    g.lineStyle(8, 0xb5c67b, 0.8);
    for (let y = 425; y < 720; y += 64) g.lineBetween(0, y, 1280, y + 30);
    g.fillStyle(0xe6c486).fillPoints([{ x: 564, y: 331 }, { x: 716, y: 331 }, { x: 1120, y: 720 }, { x: 160, y: 720 }], true);
    g.lineStyle(3, 0xf9e5af, 0.7).lineBetween(615, 331, 480, 720).lineBetween(665, 331, 800, 720);
    this.drawHouse(g, 207, 361);
    this.drawTree(g, 110, 408, 1.2);
    this.drawTree(g, 1131, 369, 1.6);
    this.drawTree(g, 988, 329, 0.6);
    this.roadMarks = this.add.graphics();
    this.phase = 0;
    this.player = new Player(this, 640, 556);
    this.add.text(32, 28, 'LÀNG QUÊ VIỆT NAM', { fontFamily: 'Arial', fontSize: '20px', color: '#244c40', fontStyle: 'bold' });
    this.add.text(32, 57, 'CHẶNG 01 · BẢN XEM TRƯỚC', { fontFamily: 'Arial', fontSize: '12px', color: '#426b57' });
    const replay = () => this.scene.restart();
    EventBus.on(GAME_EVENTS.REPLAY_PREVIEW, replay);
    const cleanup = () => {
      EventBus.off(GAME_EVENTS.REPLAY_PREVIEW, replay);
      this.events.off(Phaser.Scenes.Events.SHUTDOWN, cleanup);
      this.events.off(Phaser.Scenes.Events.DESTROY, cleanup);
    };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
    EventBus.emit(GAME_EVENTS.READY, { scene: this.scene.key, lane: this.player.currentLane });
  }
  drawHouse(g, x, y) {
    g.fillStyle(0xead5a0).fillRect(x - 65, y, 130, 92);
    g.fillStyle(0x9e6040).fillTriangle(x - 86, y + 4, x, y - 64, x + 86, y + 4);
    g.fillStyle(0x4b6145).fillRect(x - 14, y + 31, 29, 61).fillRect(x + 33, y + 24, 21, 25);
  }
  drawTree(g, x, y, scale) {
    g.fillStyle(0x78583b).fillRect(x - 7 * scale, y, 14 * scale, 116 * scale);
    g.fillStyle(0x356b4b).fillCircle(x, y - 20 * scale, 39 * scale).fillCircle(x - 28 * scale, y + 9 * scale, 35 * scale).fillCircle(x + 29 * scale, y + 7 * scale, 33 * scale);
    g.fillStyle(0x4c8053).fillCircle(x - 11 * scale, y - 34 * scale, 22 * scale);
  }
  update(time, delta) {
    this.phase = (this.phase + Math.min(delta, 50) * 0.0003) % 1;
    const g = this.roadMarks;
    g.clear();
    g.lineStyle(3, 0xc99d64, 0.45);
    for (let i = 0; i < 10; i++) {
      const depth = ((i / 10 + this.phase) % 1) ** 1.6;
      const y = 350 + depth * 390;
      const x = 640 + (i % 2 === 0 ? -1 : 1) * (40 + depth * 190);
      g.lineBetween(x, y, x + 10 + depth * 25, y + 2);
    }
  }
}

```

## FILE: frontend/src/main.jsx

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);

```

## FILE: frontend/src/pages/Game.jsx

```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PhaserGame from '../components/PhaserGame.jsx';
import { EventBus, GAME_EVENTS } from '../game/EventBus.js';

export default function Game() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const handler = () => setReady(true);
    EventBus.on(GAME_EVENTS.READY, handler);
    return () => EventBus.off(GAME_EVENTS.READY, handler);
  }, []);
  return <section className="game-page"><div className="game-heading"><div><Link className="back-link" to="/">← Về trang chủ</Link><h1>Hành trình đầu tiên<span>.</span></h1></div><span className="phase-badge">PHASE 1 · XEM TRƯỚC</span></div><div className="game-frame"><PhaserGame /></div><div className="game-caption"><div><span className="live-dot"/><strong>{ready ? 'Sẵn sàng khám phá' : 'Đang khởi tạo khung cảnh…'}</strong><p>Nhân vật đang chạy tại làn giữa. Điều khiển, chướng ngại vật và tính điểm sẽ được thêm ở Phase 2.</p></div><button className="outline-button" disabled={!ready} onClick={() => EventBus.emit(GAME_EVENTS.REPLAY_PREVIEW)}>↻ Xem lại khung cảnh</button></div></section>;
}

```

## FILE: frontend/src/pages/Home.jsx

```jsx
import { Link } from 'react-router-dom';
import Landscape from '../components/Landscape.jsx';

export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span /> VIỆT NAM, THEO TỪNG BƯỚC CHẠY</div><h1>Một bước chạy.<br/>Ngàn điều <span>khám phá<svg viewBox="0 0 400 18" aria-hidden="true"><path d="M4 12Q200-4 393 9"/></svg></span></h1><p className="slogan">Chạy xuyên lịch sử - Khám phá địa lý</p><p className="hero-description">Băng qua những miền đất Việt, mở cánh cửa tri thức.<br className="desktop-break"/> Cuộc phiêu lưu của bạn bắt đầu từ đây.</p><div className="hero-actions"><Link to="/game" className="primary-button">CHƠI NGAY <span>↗</span></Link><a className="secondary-link" href="#journey">Khám phá hành trình <span>↓</span></a></div><div className="hero-note"><span className="tiny-compass">✧</span><span>Không cần tài khoản. Chỉ cần một chút tò mò.</span></div></div>
      <div className="hero-art"><Landscape/><div className="art-label"><span className="label-dot"/><div>ĐIỂM XUẤT PHÁT<strong>Làng quê Việt Nam</strong></div><span className="label-arrow">↗</span></div><div className="coordinate">21°02′ B · 105°50′ Đ <span>CHUYẾN ĐI ĐẦU TIÊN</span></div><div className="floating-stamp">KHÁM PHÁ<br/><strong>VIỆT NAM</strong><span>✦</span></div></div>
    </section>
    <section className="journey" id="journey"><div className="section-heading"><div><div className="eyebrow">MỖI HÀNH TRÌNH LÀ MỘT BÀI HỌC</div><h2>Chạy xa hơn. Hiểu nhiều hơn.</h2></div><span className="section-note">Một thế giới để chơi, một Việt Nam để hiểu.</span></div><div className="feature-grid"><article><span className="feature-icon">↗</span><span className="feature-number">01</span><h3>Chạy qua miền đất Việt</h3><p>Từ làng quê yên bình đến núi rừng hùng vĩ. Mỗi cung đường, một khám phá mới.</p><span className="feature-tag">PHIÊU LƯU</span></article><article><span className="feature-icon book-icon">▤</span><span className="feature-number">02</span><h3>Đánh thức nhà sử học</h3><p>Gặp lại những dấu mốc và câu chuyện đã làm nên chiều dài lịch sử Việt Nam.</p><span className="feature-tag">LỊCH SỬ</span></article><article><span className="feature-icon globe-icon">◎</span><span className="feature-number">03</span><h3>Mở rộng bản đồ tri thức</h3><p>Khám phá sông núi, khí hậu và những điều thú vị về thế giới quanh mình.</p><span className="feature-tag">ĐỊA LÝ</span></article></div><p className="scope-note">Đang xây dựng từng chặng · Phase 1 giới thiệu khung cảnh và nhân vật. Gameplay và cổng kiến thức sẽ đến ở các phase tiếp theo.</p></section>
  </>;
}

```

## FILE: frontend/src/services/api.js

```js
const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request(path, { signal, ...options } = {}) {
  const timeout = AbortSignal.timeout(6000);
  const response = await fetch(`${baseUrl}${path}`, { ...options, signal: signal ? AbortSignal.any([signal, timeout]) : timeout, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Chưa thể kết nối máy chủ.');
    error.data = data;
    error.status = response.status;
    throw error;
  }
  return data;
}
const queryString = filters => new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== undefined && value !== '').map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])).toString();
export const api = {
  health: signal => request('/health', { signal }),
  questions: (filters = {}, signal) => request(`/questions?${queryString(filters)}`, { signal }),
  randomQuestion: (filters = {}, signal) => request(`/questions/random?${queryString(filters)}`, { signal }),
  answer: (id, answer, signal) => request(`/questions/${encodeURIComponent(id)}/answer`, { method: 'POST', body: JSON.stringify({ answer }), signal }),
};

```

## FILE: frontend/src/styles.css

```css
:root{font-family:"Segoe UI",Arial,sans-serif;color:#183e34;background:#f8f7ef;font-synthesis:none;text-rendering:optimizeLegibility;font-weight:400;--green:#214d3f;--orange:#e88e44;--muted:#788075}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}a{color:inherit;text-decoration:none}button{font:inherit}button,a{-webkit-tap-highlight-color:transparent}a:focus-visible,button:focus-visible{outline:3px solid #e88e44;outline-offset:5px}button:disabled{opacity:.5;cursor:wait}.app-shell{max-width:1600px;margin:auto;padding:0 5.2%}.header{height:111px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dedfd3}.brand{display:flex;gap:12px;align-items:center;font-size:26px;font-weight:900;letter-spacing:-1px;line-height:1}.brand-run{color:#c7763c}.brand small{display:block;font-size:7px;letter-spacing:1.6px;margin-top:8px;font-weight:600}.brand-mark{position:relative;display:grid;place-items:center;background:#214d3f;color:#f8f7ef;width:41px;height:44px;border-radius:12px 12px 12px 3px;font-size:30px;font-style:italic}.brand-mark span{position:absolute;right:-4px;top:-5px;color:#f1b75c;font-size:23px}.header nav{display:flex;gap:32px;align-items:center;font-size:13px;font-weight:600}.header nav a{padding:12px 0}.header nav a:hover{color:#bd692c}.phase-badge{font-size:9px;letter-spacing:1.2px;border:1px solid #d5d9c9;border-radius:5px;padding:9px 12px;white-space:nowrap;font-weight:700}.hero{display:grid;grid-template-columns:1.02fr 1fr;gap:3%;padding:58px 0 53px;align-items:center}.hero-copy{padding:6px 0 21px}.eyebrow{font-size:9px;letter-spacing:1.8px;font-weight:800;display:flex;align-items:center;gap:9px}.eyebrow>span{width:6px;height:6px;background:#c68142;border-radius:50%}.hero h1{font-size:clamp(40px,4.5vw,68px);line-height:1.18;letter-spacing:-2.8px;font-weight:800;margin:27px 0 26px}.hero h1>span{position:relative;color:#bf713b;white-space:nowrap}.hero h1 svg{position:absolute;left:0;bottom:-10px;width:100%;height:16px;overflow:visible}.hero h1 path{stroke:#dca968;stroke-width:4;fill:none;stroke-linecap:round}.slogan{font-weight:650;font-size:16px;margin:31px 0 15px}.hero-description{font-size:13px;line-height:1.9;color:#73796d;margin-bottom:29px}.hero-actions{display:flex;align-items:center;gap:25px}.primary-button{display:inline-flex;align-items:center;justify-content:space-between;gap:39px;min-height:54px;padding:0 25px;background:#254e3e;color:#fffcec;font-size:12px;font-weight:750;border-radius:7px;box-shadow:0 5px 0 #17372c;transition:transform .2s,background .2s}.primary-button:hover{background:#346449;transform:translateY(-2px)}.primary-button span{font-size:23px;font-weight:400}.secondary-link{font-size:11px;font-weight:650;display:flex;gap:13px;align-items:center;min-height:44px}.secondary-link span{font-size:18px}.hero-note{display:flex;align-items:center;gap:8px;margin-top:25px;font-size:10px;color:#848979}.tiny-compass{font-size:18px;color:#597658}.hero-art{position:relative;aspect-ratio:1.13;min-width:0}.landscape{width:100%;height:100%;object-fit:cover;border-radius:100px 14px 14px 14px;box-shadow:0 12px 25px #214d3f0a}.art-label{position:absolute;top:24px;left:23px;background:#fffcefef;box-shadow:0 5px 14px #214d3f10;padding:13px 15px;border-radius:8px;display:flex;gap:10px;align-items:center;font-size:8px;letter-spacing:1px}.art-label strong{display:block;font-size:12px;letter-spacing:0;margin-top:4px}.label-dot{width:10px;height:10px;background:#e69d4e;border-radius:50%;border:2px solid #fff1cd}.label-arrow{font-size:20px;padding-left:17px}.coordinate{position:absolute;bottom:17px;left:21px;right:21px;display:flex;justify-content:space-between;font-size:8px;letter-spacing:1.1px;color:#f8f5d9}.floating-stamp{position:absolute;right:-16px;top:33px;transform:rotate(10deg);background:#f8f3dd;color:#50725a;border:1px solid #aeba9a;outline:5px solid #f8f3dd;border-radius:50%;width:87px;height:87px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:9px;letter-spacing:1px;box-shadow:0 6px 12px #214d3f15}.floating-stamp strong{font-size:11px;margin-top:4px}.floating-stamp span{font-size:22px;margin-top:1px}.journey{padding:30px 0 31px;border-top:1px solid #dedfd3;scroll-margin-top:24px}.section-heading{display:flex;justify-content:space-between;align-items:end;margin-bottom:23px}.section-heading .eyebrow{font-size:8px;letter-spacing:1.4px;color:#858a78}.section-heading h2{margin:10px 0 0;font-size:24px;letter-spacing:-.8px}.section-note{color:#858a7d;font-size:10px;padding-bottom:3px}.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.feature-grid article{position:relative;border:1px solid #dfe2d5;border-radius:9px;padding:21px 23px 17px;background:#fcfbf5}.feature-icon{display:grid;place-items:center;background:#e5eadb;color:#486c4a;width:37px;height:37px;border-radius:9px;font-size:25px}.book-icon{background:#f5e9d7;color:#b87c3c}.globe-icon{background:#e4ebe5;color:#537c71}.feature-number{position:absolute;right:21px;top:26px;font-size:12px;color:#afb49f;letter-spacing:1px}.feature-grid h3{font-size:15px;margin:16px 0 9px;font-weight:700}.feature-grid p{font-size:11px;line-height:1.85;color:#7c8273;max-width:280px;min-height:41px;margin:0 0 18px}.feature-tag{font-size:8px;letter-spacing:1px;font-weight:700;color:#7c866b}.scope-note{text-align:center;color:#8b907e;font-size:9px;line-height:1.8;margin:18px 0 0}footer{border-top:1px solid #dedfd3;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;padding:22px 0;font-size:8px;color:#87907f}footer i{font-style:normal;margin:0 8px}.footer-star{color:#c08d48;font-size:13px;margin-left:7px}.backend-status{display:flex;align-items:center;gap:6px}.status-dot{width:5px;height:5px;background:#999e8b;border-radius:50%}.game-page{padding:30px 0 45px}.game-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:23px}.back-link{font-size:11px;display:inline-flex;align-items:center;min-height:44px}.game-heading h1{font-size:31px;letter-spacing:-1px;margin:4px 0 0}.game-heading h1 span{color:#d08a48}.game-frame{border:8px solid #fffdf3;border-radius:17px;overflow:hidden;box-shadow:0 8px 25px #1b493615}.game-canvas{width:100%;aspect-ratio:16/9;position:relative;background:#bdded6}.phaser-host{position:absolute;inset:0}.phaser-host canvas{display:block}.game-caption{display:flex;align-items:center;justify-content:space-between;gap:25px;padding:23px 7px}.game-caption strong{font-size:14px}.game-caption p{font-size:12px;line-height:1.8;color:#818777;margin:8px 0}.live-dot{display:inline-block;background:#629459;width:7px;height:7px;border-radius:50%;margin-right:9px}.outline-button{min-height:44px;padding:10px 18px;border:1px solid #bfcab4;border-radius:6px;background:transparent;color:#385a43;font-size:12px;cursor:pointer;white-space:nowrap}.outline-button:hover{background:#edf0e3}.loading,.not-found{padding:100px 0;text-align:center}.not-found .primary-button{margin:25px 0}
@media(min-width:1450px){.hero{padding-top:72px;padding-bottom:66px}.hero-description{font-size:15px}.feature-grid p{font-size:13px;max-width:340px}.feature-grid h3{font-size:17px}.feature-grid article{padding:26px}.header{height:120px}}
@media(max-width:900px){.app-shell{padding:0 5%}.header nav{gap:17px}.hero{gap:4%}.hero h1{font-size:43px;letter-spacing:-1.8px}.hero-actions{gap:15px;flex-wrap:wrap}.hero-description{font-size:12px}.hero-art{aspect-ratio:.88}.landscape{border-radius:70px 12px 12px 12px}.hero h1>span{white-space:normal}.coordinate span{display:none}.floating-stamp{width:70px;height:70px;right:-6px;top:65px;font-size:8px}.floating-stamp strong{font-size:9px}.section-note{display:none}.feature-grid{gap:12px}.feature-grid article{padding:18px}.feature-grid h3{font-size:14px}}
@media(max-width:600px){.header{height:88px}.brand{font-size:24px}.brand small{font-size:6px}.header nav a,.header nav .phase-badge{display:none}.header nav:after{content:'PHASE 1';font-size:9px;letter-spacing:1px;color:#7d8874}.hero{display:flex;flex-direction:column;gap:27px;padding:34px 0}.hero-copy{width:100%;padding:0}.hero h1{font-size:48px;line-height:1.16;margin:22px 0}.eyebrow{font-size:8px;letter-spacing:1.3px}.slogan{font-size:14px;margin-top:29px}.hero-description{font-size:12px}.hero-actions{gap:23px}.hero-note{margin-top:20px}.hero-art{width:100%;aspect-ratio:1.22}.floating-stamp{top:30px;right:6px}.art-label{top:17px;left:18px}.section-heading h2{font-size:22px}.feature-grid{grid-template-columns:1fr}.feature-grid article{padding:19px 20px 18px 77px}.feature-icon{position:absolute;left:20px;top:22px}.feature-grid h3{margin-top:2px;padding-right:18px}.feature-grid p{max-width:none;min-height:0;margin-bottom:10px}.feature-number{top:20px;right:16px}.scope-note{text-align:left;font-size:10px}footer{font-size:9px;line-height:1.8;gap:9px}.game-heading{align-items:flex-start}.game-heading h1{font-size:23px}.game-heading>.phase-badge{margin-top:15px;padding:8px;font-size:7px}.game-frame{border-width:4px;border-radius:10px}.game-caption{flex-direction:column;align-items:flex-start;padding:20px 0;gap:10px}.game-caption p{font-size:12px}.game-page{padding-top:14px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.primary-button{transition:none}}

```

## FILE: frontend/vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ plugins: [react()], server: { port: 5173, strictPort: true }, build: { rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } }, chunkSizeWarningLimit: 1600 } });

```
