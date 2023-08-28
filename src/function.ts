export const getNaverDictionaryUrl = (text: string) => {
  return encodeURI(`https://en.dict.naver.com/#/search?query=${text}`);
};
