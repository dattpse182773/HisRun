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
