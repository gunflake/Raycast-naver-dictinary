export function getNaverDictionaryUrl(text: string): string {
  // Critical #3: encodeURIComponent로 쿼리 파라미터 특수문자(&, =, #, 공백 등) 인코딩
  return `https://en.dict.naver.com/#/search?query=${encodeURIComponent(text)}`;
}
