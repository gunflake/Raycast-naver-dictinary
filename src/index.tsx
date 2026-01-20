import { Action, ActionPanel, List } from "@raycast/api";
import { useState } from "react";
import { useDebounce } from "react-use";
import { DictionaryEntry, getDictionaryData } from "./api";
import { WordDetail } from "./detail";
import { getNaverDictionaryUrl } from "./function";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchWord = async (query: string) => {
    if (!query || !query.trim()) {
      setDictionaryData([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await getDictionaryData(query);
      setDictionaryData(data);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useDebounce(
    () => {
      setIsLoading(true);
      searchWord(searchText);
    },
    500,
    [searchText]
  );

  return (
    <List onSearchTextChange={setSearchText} isLoading={isLoading} searchBarPlaceholder="Search word...">
      {dictionaryData?.map((el) => (
        <List.Item
          key={el.id}
          title={el.title}
          subtitle={el.subtitle}
          actions={
            <ActionPanel>
              <Action.Push title="상세보기" target={<WordDetail word={el.title} subtitle={el.subtitle} />} />
              <Action.CopyToClipboard title="단어 복사" content={el.title} />
              <Action.CopyToClipboard
                title="첫 번째 뜻 복사"
                content={el.subtitle.split(",")[0]?.trim() || el.subtitle}
                shortcut={{ modifiers: ["cmd"], key: "1" }}
              />
              <Action.CopyToClipboard
                title="전체 뜻 복사"
                content={el.subtitle}
                shortcut={{ modifiers: ["cmd"], key: "a" }}
              />
              <Action.OpenInBrowser
                title="네이버 사전에서 열기"
                url={getNaverDictionaryUrl(el.title)}
                shortcut={{ modifiers: ["cmd"], key: "`" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
