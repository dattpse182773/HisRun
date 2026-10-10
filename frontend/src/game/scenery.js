export const SCENERY = {
  mountain: { name: 'Núi rừng Pác Bó', horizon: { x: 640, y: 305 } },
  battlefield: { name: 'Thung lũng Mường Thanh', horizon: { x: 640, y: 280 } },
  citadel: { name: 'Dạo quanh Hồ Gươm', horizon: { x: 755, y: 300 } },
  karst: { name: 'Non nước Hoa Lư', horizon: { x: 640, y: 300 } },
  village: { name: 'Đường làng xứ Nghệ', horizon: { x: 678, y: 325 } },
  imperial: { name: 'Kinh thành bên sông Hương', horizon: { x: 640, y: 300 } },
  port: { name: 'Phố cổ đèn lồng', horizon: { x: 640, y: 300 } },
  saigon: { name: 'Phố chợ và bến cảng', horizon: { x: 640, y: 300 } },
};
export const backgroundUrl = theme => `/assets/backgrounds/${theme}.png`;
export function projectTrack(lane, perspective, horizon = { x: 640, y: 315 }) {
  return { x: horizon.x + (640 - horizon.x) * perspective + (lane - 1) * 280 * perspective,
    y: horizon.y + (625 - horizon.y) * perspective };
}
