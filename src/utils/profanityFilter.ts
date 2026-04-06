const BAD_WORDS = ['địt', 'đụ', 'lồn', 'cặc', 'buồi', 'đéo', 'đm', 'vcl', 'vcc', 'cl', 'dcm', 'chó', 'khốn'];

export const filterProfanity = (text: string): string => {
  if (!text) return '';
  let filteredText = text;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredText = filteredText.replace(regex, '***');
  });
  return filteredText;
};

export const hasProfanity = (text: string): boolean => {
  if (!text) return false;
  return BAD_WORDS.some(word => 
    new RegExp(`\\b${word}\\b`, 'gi').test(text)
  );
};
