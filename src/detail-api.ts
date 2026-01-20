import axios from "axios";
import { WordDetailData, NaverDetailApiResponse, NaverWordItem } from "./types";

const NAVER_SEARCH_API_URL = "https://en.dict.naver.com/api3/enko/search";

// Entry ID가 있는 경우 정확한 사전 URL 반환
export const getNaverEntryUrl = (entryId: string): string => {
  return `https://en.dict.naver.com/#/entry/enko/${entryId}`;
};

export const fetchWordDetail = async (word: string): Promise<WordDetailData | null> => {
  if (!word || !word.trim()) {
    return null;
  }

  const trimmedWord = word.trim();

  try {
    // PC 버전 API 사용 (m=pc) - entryId 포함된 응답
    const response = await axios.get<NaverDetailApiResponse>(NAVER_SEARCH_API_URL, {
      params: {
        m: "pc",
        query: trimmedWord,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        Referer: "https://en.dict.naver.com/",
      },
    });

    const wordItems = response.data?.searchResultMap?.searchResultListMap?.WORD?.items;

    if (!wordItems || wordItems.length === 0) {
      return null;
    }

    // 첫 번째 결과에서 상세 정보 파싱
    return parseWordItem(wordItems[0]);
  } catch (error) {
    console.error(`Error fetching word detail: ${error}`);
    return null;
  }
};

// HTML 태그 제거 및 텍스트 정리 유틸리티
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "") // HTML 태그 제거
    .replace(/\(→[^)]*\)/g, "") // reference word 제거 (→...)
    .replace(/\s+/g, " ") // 연속 공백 정리
    .trim();
};

const parseWordItem = (item: NaverWordItem): WordDetailData => {
  // 단어 추출 (handleEntry가 가장 깨끗한 텍스트)
  const word = item.handleEntry || stripHtml(item.expEntry || "");

  // 발음 기호 추출
  const phoneticInfo = item.searchPhoneticSymbolList?.find((p) => p.symbolValue);
  const phonetic = phoneticInfo?.symbolValue;
  const phoneticType = phoneticInfo?.symbolType || phoneticInfo?.symbolTypeCode;
  const audioUrl = phoneticInfo?.symbolFile;

  // 품사별 의미 추출 (HTML 태그 제거)
  const meanings =
    item.meansCollector
      ?.filter((collector) => collector.means && collector.means.length > 0)
      .map((collector) => ({
        partOfSpeech: collector.partOfSpeech || collector.partOfSpeech2 || "기타",
        definitions: collector.means?.map((mean) => stripHtml(mean.value || "")).filter(Boolean) || [],
      }))
      .filter((m) => m.definitions.length > 0) || [];

  return {
    word,
    entryId: item.entryId,
    phonetic,
    phoneticType,
    audioUrl,
    source: item.sourceDictnameKO,
    dictType: item.expDictTypeForm,
    meanings,
  };
};
