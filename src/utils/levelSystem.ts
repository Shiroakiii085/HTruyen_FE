export const LEVEL_SYSTEM = [
  { level: 1, name: "Đồng Bì Cảnh", requiredExp: 100, icon: "/level_icon/1.png", color: "#B8860B", tier: 1 },
  { level: 2, name: "Thảo Căn Cảnh", requiredExp: 300, icon: "/level_icon/2.png", color: "#32CD32", tier: 1 },
  { level: 3, name: "Liễu Cốt Cảnh", requiredExp: 1000, icon: "/level_icon/3.png", color: "#00FF00", tier: 1 },
  { level: 4, name: "Cốt Khí Cảnh", requiredExp: 2000, icon: "/level_icon/4.png", color: "#00FFFF", tier: 1 },
  { level: 5, name: "Chúc Lô Cảnh", requiredExp: 3000, icon: "/level_icon/5.png", color: "#FF8C00", tier: 1 },
  { level: 6, name: "Động Phủ Cảnh", requiredExp: 4000, icon: "/level_icon/6.png", color: "#008080", tier: 2 },
  { level: 7, name: "Quan Hải Cảnh", requiredExp: 5000, icon: "/level_icon/7.png", color: "#1E90FF", tier: 2 },
  { level: 8, name: "Long Môn Cảnh", requiredExp: 6000, icon: "/level_icon/8.png", color: "#4B0082", tier: 2 },
  { level: 9, name: "Kim Đan Cảnh", requiredExp: 7000, icon: "/level_icon/9.png", color: "#FFD700", tier: 2 },
  { level: 10, name: "Nguyên Anh Cảnh", requiredExp: 8000, icon: "/level_icon/10.png", color: "#87CEEB", tier: 2 },
  { level: 11, name: "Ngọc Phác Cảnh", requiredExp: 11000, icon: "/level_icon/11.png", color: "#2E8B57", tier: 3 },
  { level: 12, name: "Tiên Nhân Cảnh", requiredExp: 12000, icon: "/level_icon/12.png", color: "#DAA520", tier: 3 },
  { level: 13, name: "Phi Thăng Cảnh", requiredExp: 13000, icon: "/level_icon/13.png", color: "#FFFACD", tier: 3 },
  { level: 14, name: "Hợp Đạo Cảnh", requiredExp: 14000, icon: "/level_icon/14.png", color: "#800080", tier: 3 },
  { level: 15, name: "Chí Cao Viễn Cổ Thần Linh", requiredExp: 0, icon: "/level_icon/15.png", color: "#FFFFFF", tier: 3 } // Max level
];

const RANK_PREFIXES = [
  "Nhất Cảnh", "Nhị Cảnh", "Tam Cảnh", "Tứ Cảnh", "Ngũ Cảnh",
  "Lục Cảnh", "Thất Cảnh", "Bát Cảnh", "Cửu Cảnh", "Thập Cảnh",
  "Thập Nhất Cảnh", "Thập Nhị Cảnh", "Thập Tam Cảnh", "Thập Tứ Cảnh", "Thập Ngũ Cảnh"
];

export const getFullRankName = (level: number) => {
  const prefix = RANK_PREFIXES[level - 1] || RANK_PREFIXES[0];
  const realm = LEVEL_SYSTEM.find(r => r.level == level) || LEVEL_SYSTEM[0];
  return `${prefix}: ${realm.name}`;
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
