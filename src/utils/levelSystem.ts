export const LEVEL_SYSTEM = [
  { level: 1, name: "Thành Viên Mới", requiredExp: 100, icon: "/level_icon/1.png", color: "#94a3b8", tier: 1 },
  { level: 2, name: "Sơ Cấp - Đồng", requiredExp: 300, icon: "/level_icon/2.png", color: "#B8860B", tier: 1 },
  { level: 3, name: "Sơ Cấp - Bạc", requiredExp: 1000, icon: "/level_icon/3.png", color: "#C0C0C0", tier: 1 },
  { level: 4, name: "Sơ Cấp - Vàng", requiredExp: 2000, icon: "/level_icon/4.png", color: "#FFD700", tier: 1 },
  { level: 5, name: "Trung Cấp - Bạch Kim", requiredExp: 3000, icon: "/level_icon/5.png", color: "#E5E4E2", tier: 1 },
  { level: 6, name: "Trung Cấp - Kim Cương", requiredExp: 4000, icon: "/level_icon/6.png", color: "#B9F2FF", tier: 2 },
  { level: 7, name: "Cao Cấp - Tinh Anh", requiredExp: 5000, icon: "/level_icon/7.png", color: "#50C878", tier: 2 },
  { level: 8, name: "Cao Cấp - Cao Thủ", requiredExp: 6000, icon: "/level_icon/8.png", color: "#FF4500", tier: 2 },
  { level: 9, name: "Đại Cao Thủ", requiredExp: 7000, icon: "/level_icon/9.png", color: "#FF00FF", tier: 2 },
  { level: 10, name: "Bậc Thầy", requiredExp: 8000, icon: "/level_icon/10.png", color: "#8A2BE2", tier: 2 },
  { level: 11, name: "Đại Sư", requiredExp: 11000, icon: "/level_icon/11.png", color: "#FF1493", tier: 3 },
  { level: 12, name: "Huyền Thoại", requiredExp: 12000, icon: "/level_icon/12.png", color: "#00BFFF", tier: 3 },
  { level: 13, name: "Thần Thoại", requiredExp: 13000, icon: "/level_icon/13.png", color: "#FF8C00", tier: 3 },
  { level: 14, name: "Thiên Đỉnh", requiredExp: 14000, icon: "/level_icon/14.png", color: "#FF0000", tier: 3 },
  { level: 15, name: "Cấp Độ Tối Đa", requiredExp: 0, icon: "/level_icon/15.png", color: "#FFFFFF", tier: 3 } // Max level
];

const RANK_PREFIXES = [
  "Cấp 1", "Cấp 2", "Cấp 3", "Cấp 4", "Cấp 5",
  "Cấp 6", "Cấp 7", "Cấp 8", "Cấp 9", "Cấp 10",
  "Cấp 11", "Cấp 12", "Cấp 13", "Cấp 14", "Cấp 15"
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
