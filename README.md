# search-naver-en-ko-dictionary

This extension is for searching English-Korean dictionary on Naver. If you search a word in English or Korean, you can get the result of the word in English and Korean.

### Usage
- ENTER: CopyToClipboard title
- CMD + (1~4) : CopyToClipboard first subtitle.
  - For example, the result is 'apple, apology, apologize' then 'CMD + 1' will copy 'apple' to clipboard.
- CMD + `: Open browser and search title on Naver dictionary.

### How to Install (Raycast 적용 방법)

#### 사전 요구사항
- [Raycast](https://raycast.com/) 설치 필요
- [Node.js](https://nodejs.org/) 18.x 이상
- npm 또는 yarn

#### 설치 단계

**1. 저장소 클론**
```bash
git clone https://github.com/silee9019/Raycast-naver-dictinary.git
cd Raycast-naver-dictinary
```

**2. 의존성 설치**
```bash
npm install
```

**3. 개발 모드로 실행**
```bash
npm run dev
```
> 이 명령어를 실행하면 Raycast가 자동으로 확장 프로그램을 인식합니다.

**4. Raycast에서 확장 프로그램 확인**
- Raycast 실행 (기본 단축키: `⌥ + Space`)
- "Search Naver" 입력하여 확장 프로그램 검색
- 검색 결과에 "Search Naver En Ko dictionary"가 표시되면 설치 완료!

#### 수동으로 Import하기 (선택사항)
개발 모드가 자동 인식되지 않는 경우:
1. Raycast 실행
2. "Import Extension" 검색 후 실행
3. 프로젝트 폴더 선택 (`Raycast-naver-dictinary`)
4. 확장 프로그램이 Raycast에 추가됨

#### 빌드 (배포용)
```bash
npm run build
```

### Reference 
- [alfnaversearch](https://github.com/Kuniz/alfnaversearch)
