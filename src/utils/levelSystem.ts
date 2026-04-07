export const LEVEL_SYSTEM = [
  { level: 1, name: "Nhất Cảnh: Đồng Bì Cảnh", requiredExp: 100, icon: "/level_icon/dong_bi.png", color: "#94a3b8", tier: 1 },
  { level: 2, name: "Nhị Cảnh: Thảo Căn Cảnh", requiredExp: 300, icon: "/level_icon/thao_can.png", color: "#B8860B", tier: 1 },
  { level: 3, name: "Tam Cảnh: Liễu Cốt Cảnh", requiredExp: 1000, icon: "/level_icon/lieu_cot.png", color: "#C0C0C0", tier: 1 },
  { level: 4, name: "Tứ Cảnh: Cốt Khí Cảnh", requiredExp: 2000, icon: "/level_icon/cot_khi.png", color: "#FFD700", tier: 1 },
  { level: 5, name: "Ngũ Cảnh: Chúc Lô Cảnh", requiredExp: 3000, icon: "/level_icon/chuc_lo.png", color: "#E5E4E2", tier: 1 },
  { level: 6, name: "Lục Cảnh: Động Phủ Cảnh", requiredExp: 4000, icon: "/level_icon/dong_phu.png", color: "#B9F2FF", tier: 2 },
  { level: 7, name: "Thất Cảnh: Quan Hải Cảnh", requiredExp: 5000, icon: "/level_icon/quan_hai.png", color: "#50C878", tier: 2 },
  { level: 8, name: "Bát Cảnh: Long Môn Cảnh", requiredExp: 6000, icon: "/level_icon/long_mon.png", color: "#FF4500", tier: 2 },
  { level: 9, name: "Cửu Cảnh: Kim Đan Cảnh", requiredExp: 7000, icon: "/level_icon/kim_dan.png", color: "#FF00FF", tier: 2 },
  { level: 10, name: "Thập Cảnh: Nguyên Anh Cảnh", requiredExp: 8000, icon: "/level_icon/nguyen_anh.png", color: "#8A2BE2", tier: 2 },
  { level: 11, name: "Thập Nhất Cảnh: Ngọc Phác Cảnh", requiredExp: 11000, icon: "/level_icon/ngoc_phac.png", color: "#FF1493", tier: 3 },
  { level: 12, name: "Thập Nhị Cảnh: Tiên Nhân Cảnh", requiredExp: 12000, icon: "/level_icon/tien_nhan.png", color: "#00BFFF", tier: 3 },
  { level: 13, name: "Thập Tam Cảnh: Phi Thăng Cảnh", requiredExp: 13000, icon: "/level_icon/phi_thang.png", color: "#FF8C00", tier: 3 },
  { level: 14, name: "Thập Tứ Cảnh: Hợp Đạo Cảnh", requiredExp: 14000, icon: "/level_icon/hop_dao.png", color: "#FF0000", tier: 3 },
  { level: 15, name: "Thập Ngũ Cảnh: Chí Cao Viễn Cổ Thần Linh", requiredExp: 0, icon: "/level_icon/chi_cao_vien_co_than_linh.png", color: "#FFFFFF", tier: 3 }
];

const RANK_PREFIXES = [
  "Cấp 1", "Cấp 2", "Cấp 3", "Cấp 4", "Cấp 5",
  "Cấp 6", "Cấp 7", "Cấp 8", "Cấp 9", "Cấp 10",
  "Cấp 11", "Cấp 12", "Cấp 13", "Cấp 14", "Cấp 15"
];

export const getFullRankName = (level: number) => {
  const realm = LEVEL_SYSTEM.find(r => r.level == level) || LEVEL_SYSTEM[0];
  return realm.name;
};

export const getRealmInfo = (level: number, currentExp: number) => {
  const currentRealm = LEVEL_SYSTEM.find(r => r.level == level) || LEVEL_SYSTEM[0];
  const requiredExp = currentRealm.requiredExp;
  const fullRankName = getFullRankName(level);
  
  if (level >= 15) {
    return {
      level,
      name: currentRealm.name,
      fullRankName,
      currentExp: 0,
      requiredExp: 0,
      progressPercent: 100,
      isMax: true
    };
  }

  const progressPercent = Math.min((currentExp / requiredExp) * 100, 100);

  return {
    level,
    name: currentRealm.name,
    fullRankName,
    currentExp,
    requiredExp,
    progressPercent,
    isMax: false
  };
};
