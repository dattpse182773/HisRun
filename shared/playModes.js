export const PLAY_MODES = [
  { id: 'explore', name: 'Khám phá Việt Nam', icon: '⌖', detail: 'Bản đồ 63/34 tỉnh thành · 34 map hiện nay · mỗi lượt 10 câu về địa phương.', route: '/maps' },
  { id: 'study', name: 'Học tập theo cấp', icon: '▤', detail: 'Chọn lớp 4–12 · bài 10 hoặc 15 câu · chấm điểm, lời giải và tóm tắt kiến thức.', route: '/study' },
  { id: 'ranked', name: 'Kiến thức tổng hợp', icon: '✦', detail: 'Thi 30 câu không phân cấp · chấm điểm và xếp hạng. Ngân hàng tạm thời chờ bộ đề mới.', route: '/ranked' },
  { id: 'world', name: 'Khám phá thế giới', icon: '◎', detail: 'Sắp ra mắt · chế độ demo, chưa có bản đồ hay câu hỏi.', route: '/world', comingSoon: true },
];
export const getPlayMode = id => PLAY_MODES.find(mode => mode.id === id) || PLAY_MODES.find(mode => mode.id === 'study');
export const WORLD_TOPICS = ['Trái Đất', 'Phương hướng', 'Xích đạo', 'Kinh tuyến', 'Chuyển động Trái Đất', 'Châu lục', 'Đại dương', 'Châu Phi', 'Châu Nam Cực', 'Nam Mỹ', 'Đông Nam Á', 'Khí quyển', 'Vòng tuần hoàn nước'];
export function studyAssessment(correct, wrong) {
  const total = correct + wrong;
  const mark = total ? Math.round(correct / total * 100) / 10 : null;
  return { total, mark, label: mark === null ? 'Chưa đủ dữ liệu đánh giá' : mark >= 8 ? 'Nắm vững kiến thức trong lượt này' : mark >= 5 ? 'Đã nắm nền tảng · luyện thêm câu sai' : 'Cần ôn lại các chủ đề vừa gặp' };
}
