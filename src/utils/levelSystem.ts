export const LEVEL_SYSTEM = [
  { level: 1, name: "Đồng Bì Cảnh", requiredExp: 100 },
  { level: 2, name: "Thảo Căn Cảnh", requiredExp: 300 },
  { level: 3, name: "Liễu Cốt Cảnh", requiredExp: 1000 },
  { level: 4, name: "Cốt Khí Cảnh", requiredExp: 2000 },
  { level: 5, name: "Chúc Lô Cảnh", requiredExp: 3000 },
  { level: 6, name: "Động Phủ Cảnh", requiredExp: 4000 },
  { level: 7, name: "Quan Hải Cảnh", requiredExp: 5000 },
  { level: 8, name: "Long Môn Cảnh", requiredExp: 6000 },
  { level: 9, name: "Kim Đan Cảnh", requiredExp: 7000 },
  { level: 10, name: "Nguyên Anh Cảnh", requiredExp: 8000 },
  { level: 11, name: "Ngọc Phác Cảnh", requiredExp: 11000 },
  { level: 12, name: "Tiên Nhân Cảnh", requiredExp: 12000 },
  { level: 13, name: "Phi Thăng Cảnh", requiredExp: 13000 },
  { level: 14, name: "Hợp Đạo Cảnh", requiredExp: 14000 },
  { level: 15, name: "Chí Cao Viễn Cổ Thần Linh", requiredExp: 0 } // Max level
];

export const getRealmInfo = (level: number, currentExp: number) => {
  const currentRealm = LEVEL_SYSTEM.find(r => r.level == level) || LEVEL_SYSTEM[0];
  const requiredExp = currentRealm.requiredExp;
  
  if (level >= 15) {
    return {
      level,
      name: currentRealm.name,
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
    currentExp,
    requiredExp,
    progressPercent,
    isMax: false
  };
};
