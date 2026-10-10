// Each province owns one playable visual route. Legacy routes keep their original artwork.
const existing = {
 caobang:['Pác Bó','Cao Bằng','mountain'], dienbien:['Thung lũng Mường Thanh','Điện Biên','battlefield'], hanoi:['Hồ Gươm','Hà Nội','citadel'], ninhbinh:['Non nước Hoa Lư','Ninh Bình','karst'], nghean:['Làng Sen – Kim Liên','Nghệ An','village'], hue:['Kinh thành Huế','Huế','imperial'], danang:['Phố cổ Hội An','Quảng Nam','port'], hochiminh:['Chợ Bến Thành – Bến Nhà Rồng','TP. Hồ Chí Minh','saigon'],
};
const additions = [
 ['tuyenquang','Tân Trào','Tuyên Quang','stilt','forest','#87c9d1','#668d48'],
 ['laocai','Ruộng bậc thang Mù Cang Chải','Yên Bái','terraces','mountain','#96d2df','#bbbf48'],
 ['laichau','Pu Ta Leng','Lai Châu','summit','mountain','#b2d4e5','#538579'],
 ['langson','Ải Chi Lăng','Lạng Sơn','pass','mountain','#a4d4da','#77954c'],
 ['thainguyen','Đồi chè Tân Cương','Thái Nguyên','tea','hills','#92d3d2','#75a747'],
 ['sonla','Nhà tù Sơn La','Sơn La','prison','hills','#aacdd9','#749955'],
 ['phutho','Đền Hùng','Phú Thọ','temple','forest','#b0d5cd','#6a9650'],
 ['bacninh','Đền Đô','Bắc Ninh','pagoda','lake','#9fd6d7','#8baa56'],
 ['quangninh','Vịnh Hạ Long','Quảng Ninh','bay','sea','#81cddb','#428c82'],
 ['haiphong','Vịnh Lan Hạ – Cát Bà','Hải Phòng','islands','sea','#a0dbe2','#538f67'],
 ['hungyen','Phố Hiến','Hưng Yên','town','river','#acd3d9','#88aa63'],
 ['thanhhoa','Thành nhà Hồ','Thanh Hóa','citadel','hills','#b9d8d5','#91a75f'],
 ['hatinh','Ngã ba Đồng Lộc','Hà Tĩnh','memorial','hills','#b2d5d8','#87a159'],
 ['quangtri','Phong Nha–Kẻ Bàng','Quảng Bình','cave','river','#91d1d4','#487a5c'],
 ['quangngai','Cổng Tò Vò – Lý Sơn','Quảng Ngãi','volcanic','sea','#8ed2e4','#8a9a62'],
 ['gialai','Bảo tàng Quang Trung','Bình Định','museum','hills','#aad3d9','#8dab61'],
 ['daklak','Thác Dray Nur','Đắk Lắk','waterfall','river','#a0d6d2','#497f54'],
 ['khanhhoa','Tháp Bà Ponagar','Khánh Hòa','cham','sea','#89cddc','#93ab64'],
 ['lamdong','Ga Đà Lạt','Lâm Đồng','station','pine','#b5cddd','#668d6b'],
 ['dongnai','Vườn quốc gia Cát Tiên','Đồng Nai','jungle','forest','#9cd2c3','#447b49'],
 ['tayninh','Núi Bà Đen','Tây Ninh','sacred-mountain','mountain','#add9de','#648c56'],
 ['dongthap','Tràm Chim','Đồng Tháp','lotus','wetland','#b1dddd','#77a967'],
 ['vinhlong','Miệt vườn xứ dừa Bến Tre','Bến Tre','coconut','river','#a1d5d5','#7baf5d'],
 ['angiang','Rừng tràm Trà Sư','An Giang','mangrove','wetland','#a6d6cd','#468752'],
 ['cantho','Chợ nổi Cái Răng','Cần Thơ','market','river','#acdce0','#78a569'],
 ['camau','Đất Mũi','Cà Mau','cape','wetland','#aed9d8','#598f64'],
];
export const PROVINCE_SCENERY = Object.fromEntries([
 ...Object.entries(existing).map(([id,[name,oldProvince,theme]]) => [id,{id,name,oldProvince,theme,legacy:true,url:`/assets/backgrounds/${theme}.png`}]),
 ...additions.map(([id,name,oldProvince,design,environment,sky,green]) => [id,{id,name,oldProvince,design,environment,sky,green,legacy:false,illustrated:true,url:`/assets/backgrounds/provinces/${id}-v2.png`,horizon:{x:640,y:310}}]),
]);
export const getProvinceScenery = id => PROVINCE_SCENERY[id];
