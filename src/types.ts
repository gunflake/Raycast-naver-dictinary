// 자동완성 API에서 사용하는 사전 항목
export interface DictionaryEntry {
  id: string;
  title: string;
  subtitle: string;
}

// 상세 API 응답에서 사용하는 단어 상세 정보
export interface WordDetailData {
  word: string;
  entryId?: string;
  phonetic?: string;
  phoneticType?: string;
  audioUrl?: string;
  source?: string;
  dictType?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: string[];
  }>;
}

// 네이버 상세 API 응답 타입
export interface NaverDetailApiResponse {
  searchResultMap: {
    searchResultListMap: {
      WORD?: {
        items: NaverWordItem[];
      };
    };
  };
}

export interface NaverWordItem {
  entryId?: string;
  destinationLink?: string;
  handleEntry?: string;
  expEntry?: string;
  expDictTypeForm?: string;
  sourceDictnameKO?: string;
  searchPhoneticSymbolList?: Array<{
    symbolType?: string;
    symbolTypeCode?: string;
    symbolValue?: string;
    symbolFile?: string;
  }>;
  meansCollector?: Array<{
    partOfSpeech?: string;
    partOfSpeech2?: string;
    means?: Array<{
      order?: string;
      value?: string;
    }>;
  }>;
}
