import { Action, ActionPanel, Detail } from "@raycast/api";
import { useEffect, useState } from "react";
import { fetchWordDetail, getNaverEntryUrl } from "./detail-api.js";
import { getNaverDictionaryUrl } from "./function.js";
import { WordDetailData } from "./types.js";

interface Props {
  word: string;
  subtitle?: string;
}

export function WordDetail({ word, subtitle }: Props): JSX.Element {
  const [detail, setDetail] = useState<WordDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWordDetail(word);
        if (data) {
          setDetail(data);
        } else {
          setError("단어 상세 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("상세 정보를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [word]);

  const markdown = generateMarkdown(word, subtitle, detail, error);

  // entryId가 있으면 entry URL, 없으면 검색 URL 사용
  const naverUrl = detail?.entryId ? getNaverEntryUrl(detail.entryId) : getNaverDictionaryUrl(word);

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      metadata={detail && <WordMetadata detail={detail} />}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser title="네이버 사전에서 열기" url={naverUrl} />
          <Action.CopyToClipboard title="단어 복사" content={detail?.word || word} />
          {detail?.phonetic && (
            <Action.CopyToClipboard
              title="발음 기호 복사"
              content={detail.phonetic}
              shortcut={{ modifiers: ["cmd"], key: "p" }}
            />
          )}
          {detail?.audioUrl && (
            <Action.OpenInBrowser title="발음 듣기" url={detail.audioUrl} shortcut={{ modifiers: ["cmd"], key: "l" }} />
          )}
        </ActionPanel>
      }
    />
  );
}

function WordMetadata({ detail }: { detail: WordDetailData }): JSX.Element {
  const phoneticText = formatPhoneticText(detail.phonetic, detail.phoneticType);

  return (
    <Detail.Metadata>
      {phoneticText && <Detail.Metadata.Label title="발음" text={phoneticText} />}
      {detail.dictType && <Detail.Metadata.Label title="유형" text={detail.dictType} />}
      {detail.source && <Detail.Metadata.Label title="출처" text={detail.source} />}
    </Detail.Metadata>
  );
}

function formatPhoneticText(phonetic?: string, phoneticType?: string): string | undefined {
  if (!phonetic) {
    return undefined;
  }
  if (phoneticType) {
    return `/${phonetic}/ (${phoneticType})`;
  }
  return `/${phonetic}/`;
}

function generateMarkdown(
  word: string,
  subtitle: string | undefined,
  detail: WordDetailData | null,
  error: string | null
): string {
  if (error) {
    return `# ${word}\n\n⚠️ ${error}\n\n아래 액션에서 **네이버 사전에서 열기**를 선택하세요.`;
  }

  if (!detail) {
    return `# ${word}\n\n불러오는 중...`;
  }

  let md = `# ${detail.word}\n\n`;

  // 발음 기호
  if (detail.phonetic) {
    const phoneticLabel = detail.phoneticType ? ` (${detail.phoneticType})` : "";
    md += `**발음:** \`/${detail.phonetic}/\`${phoneticLabel}\n\n`;
  }

  // 기존 subtitle (자동완성에서 가져온 간단한 뜻)
  if (subtitle) {
    md += `> ${subtitle}\n\n`;
  }

  // 출처 정보
  if (detail.source) {
    md += `📖 *${detail.source}*\n\n`;
  }

  md += `---\n\n`;

  // 품사별 뜻
  if (detail.meanings.length > 0) {
    md += `## 품사별 의미\n\n`;

    for (const meaning of detail.meanings) {
      md += `### ${meaning.partOfSpeech}\n\n`;

      meaning.definitions.forEach((def, index) => {
        md += `${index + 1}. ${def}\n`;
      });

      md += `\n`;
    }
  }

  return md;
}
