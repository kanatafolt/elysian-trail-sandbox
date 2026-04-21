import { useEffect, useRef, useState } from 'react'
import './App.css'

const fontCandidates = [
  { name: 'Archivo Black', category: 'display' },
  { name: 'BIZ UDPGothic', category: 'japanese' },
  { name: 'Bakbak One', category: 'display' },
  { name: 'Black Ops One', category: 'display' },
  { name: 'Candal', category: 'display' },
  { name: 'Carter One', category: 'display' },
  { name: 'Dela Gothic One', category: 'japanese' },
  { name: 'Fugaz One', category: 'display' },
  { name: 'Jockey One', category: 'display' },
  { name: 'Kosugi', category: 'japanese' },
  { name: 'Krona One', category: 'display' },
  { name: 'Lilita One', category: 'display' },
  { name: 'M PLUS 2', category: 'balanced' },
  { name: 'Mochiy Pop One', category: 'japanese' },
  { name: 'Passion One', category: 'display' },
  { name: 'Paytone One', category: 'display' },
  { name: 'Poetsen One', category: 'balanced' },
  { name: 'Righteous', category: 'display' },
  { name: 'Rowdies', category: 'balanced' },
  { name: 'Russo One', category: 'display' },
] as const

const filterOptions = [
  { id: 'all', label: 'すべて' },
  { id: 'japanese', label: '日本語向け' },
  { id: 'balanced', label: '汎用' },
  { id: 'display', label: '見出し向け' },
] as const

const pages = [
  {
    id: 'title',
    label: 'タイトル',
    description: 'サンプルページの入口です。',
  },
  {
    id: 'font-preview',
    label: 'フォントプレビュー',
    description: 'RPG UI向けの文言で候補フォントを比較します。',
  },
] as const

const defaultCustomPreviewText = `自由入力プレビュー
ここに確認したい文言を自由に入力できます。
タイトル、会話、長文説明などの見え方をまとめて試せます。`

const defaultCustomPreviewFontSize = 28
const customPreviewStorageKeys = {
  text: 'elysian-trail-sandbox:custom-preview-text',
  height: 'elysian-trail-sandbox:custom-preview-height',
  fontName: 'elysian-trail-sandbox:selected-font-name',
} as const

type PageId = (typeof pages)[number]['id']
type FilterId = (typeof filterOptions)[number]['id']

const readStoredCustomPreviewText = () => {
  if (typeof window === 'undefined') {
    return defaultCustomPreviewText
  }

  try {
    return (
      window.localStorage.getItem(customPreviewStorageKeys.text) ??
      defaultCustomPreviewText
    )
  } catch {
    return defaultCustomPreviewText
  }
}

const readStoredCustomPreviewHeight = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedHeight = window.localStorage.getItem(
      customPreviewStorageKeys.height,
    )
    const parsedHeight = Number(storedHeight)

    if (!storedHeight || !Number.isFinite(parsedHeight) || parsedHeight < 180) {
      return null
    }

    return parsedHeight
  } catch {
    return null
  }
}

const readStoredFontIndex = () => {
  if (typeof window === 'undefined') {
    return 0
  }

  try {
    const storedFontName = window.localStorage.getItem(
      customPreviewStorageKeys.fontName,
    )

    if (!storedFontName) {
      return 0
    }

    const storedFontIndex = fontCandidates.findIndex(
      (font) => font.name === storedFontName,
    )

    return storedFontIndex === -1 ? 0 : storedFontIndex
  } catch {
    return 0
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('title')
  const [fontIndex, setFontIndex] = useState(readStoredFontIndex)
  const [fontFilter, setFontFilter] = useState<FilterId>('all')
  const [customPreviewText, setCustomPreviewText] = useState(
    readStoredCustomPreviewText,
  )
  const [customPreviewFontSize, setCustomPreviewFontSize] = useState(
    defaultCustomPreviewFontSize,
  )
  const [customPreviewHeight, setCustomPreviewHeight] = useState<number | null>(
    readStoredCustomPreviewHeight,
  )
  const customPreviewTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  const selectedFont = fontCandidates[fontIndex]
  const filteredFonts = fontCandidates.filter(
    (font) => fontFilter === 'all' || font.category === fontFilter,
  )
  const currentFont =
    filteredFonts.find((font) => font.name === selectedFont.name) ??
    filteredFonts[0] ??
    selectedFont

  const sampleStyle = {
    fontFamily: `'${currentFont.name}', var(--font-fallback)`,
  }

  const customPreviewStyle = {
    ...sampleStyle,
    fontSize: `${customPreviewFontSize}px`,
    ...(customPreviewHeight === null
      ? {}
      : { height: `${customPreviewHeight}px` }),
  }

  const syncCustomPreviewHeight = () => {
    const target = customPreviewTextareaRef.current

    if (!target) {
      return
    }

    const nextHeight = Math.round(target.getBoundingClientRect().height)

    setCustomPreviewHeight((currentHeight) =>
      currentHeight === nextHeight ? currentHeight : nextHeight,
    )
  }

  useEffect(() => {
    document.title =
      currentPage === 'title'
        ? 'Elysian Trail Sandbox'
        : 'フォントプレビュー | Elysian Trail Sandbox'
  }, [currentPage])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        customPreviewStorageKeys.text,
        customPreviewText,
      )
    } catch {
      return
    }
  }, [customPreviewText])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        customPreviewStorageKeys.fontName,
        selectedFont.name,
      )
    } catch {
      return
    }
  }, [selectedFont.name])

  useEffect(() => {
    if (customPreviewHeight === null) {
      return
    }

    try {
      window.localStorage.setItem(
        customPreviewStorageKeys.height,
        String(customPreviewHeight),
      )
    } catch {
      return
    }
  }, [customPreviewHeight])

  useEffect(() => {
    const target = customPreviewTextareaRef.current

    if (!target || typeof ResizeObserver === 'undefined') {
      return
    }

    syncCustomPreviewHeight()

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      syncCustomPreviewHeight()
    })

    observer.observe(target)

    return () => observer.disconnect()
  }, [])

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="topbar__eyebrow">Elysian Trail Sandbox</p>
          <p className="topbar__title">
            {currentPage === 'title' ? 'タイトル' : 'フォントプレビュー'}
          </p>
        </div>

        <nav className="topbar__nav" aria-label="ページナビゲーション">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              className={currentPage === page.id ? 'is-active' : undefined}
              onClick={() => setCurrentPage(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </header>

      {currentPage === 'title' ? (
        <section className="title-page">
          <div className="title-hero">
            <p className="title-hero__eyebrow">Prototype Menu</p>
            <h1>Elysian Trail</h1>
            <p className="title-hero__lead">
              プレビュー用の各ページをここから選択できます。現在はフォント比較ページを用意しています。
            </p>
          </div>

          <div className="page-grid">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                className="page-card"
                onClick={() => setCurrentPage(page.id)}
              >
                <span className="page-card__name">{page.label}</span>
                <span className="page-card__description">{page.description}</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="font-page">
          <div className="font-page__main">
            <div className="font-card__header">
              <p className="font-card__eyebrow">Google Fonts Preview</p>
              <h1>仕様候補フォント確認</h1>
              <p className="font-card__lead">
                RPG の UI 文言を使って、タイトル向けと読みやすさの両方を比較できます。
              </p>
            </div>

            <div className="font-samples" style={sampleStyle}>
              <section className="font-sample font-sample--custom">
                <div className="font-custom-preview__header">
                  <span className="font-sample__tag">Free Input Preview</span>

                  <label className="font-custom-preview__slider">
                    <span>フォントサイズ</span>
                    <input
                      type="range"
                      min="16"
                      max="72"
                      step="1"
                      value={customPreviewFontSize}
                      onChange={(event) =>
                        setCustomPreviewFontSize(Number(event.target.value))
                      }
                    />
                    <strong>{customPreviewFontSize}px</strong>
                  </label>
                </div>

                <textarea
                  ref={customPreviewTextareaRef}
                  className="font-custom-preview__textarea"
                  value={customPreviewText}
                  onChange={(event) => setCustomPreviewText(event.target.value)}
                  onMouseUp={syncCustomPreviewHeight}
                  onTouchEnd={syncCustomPreviewHeight}
                  onBlur={syncCustomPreviewHeight}
                  style={customPreviewStyle}
                  aria-label="自由入力プレビュー"
                />
              </section>

              <section className="font-sample font-sample--title">
                <span className="font-sample__tag">Title / Key Art</span>
                <p className="font-sample__main">
                  Elysian Trail
                  <br />
                  記憶を越えて、秘境の旅へ。
                </p>
              </section>

              <section className="font-sample font-sample--battle">
                <span className="font-sample__tag">Battle Log</span>
                <p className="font-sample__log">
                  アストラの連撃。氷槍ヴァルガに命中。
                </p>
                <p className="font-sample__log">
                  クリティカルヒット。248 のダメージ。
                </p>
                <p className="font-sample__log">
                  氷槍ヴァルガの体勢が大きく崩れた。
                </p>
                <p className="font-sample__damage">-248</p>
              </section>

              <section className="font-sample font-sample--status">
                <span className="font-sample__tag">Status / UI Labels</span>
                <div className="font-status-grid">
                  <p>HP 1840 / 1840</p>
                  <p>MP 126 / 126</p>
                  <p>ATK 142</p>
                  <p>DEF 97</p>
                  <p>SPD 121</p>
                  <p>CRIT 18%</p>
                </div>
              </section>

              <section className="font-sample font-sample--dialogue">
                <span className="font-sample__tag">
                  Character Name / Dialogue
                </span>
                <p className="font-sample__name">セレス</p>
                <p className="font-sample__dialogue">
                  「急ぎましょう。夜が明ける前に、星海の門へ辿り着かないと」
                </p>
              </section>

              <section className="font-sample font-sample--skill">
                <span className="font-sample__tag">Skill Name / Effect</span>
                <p className="font-sample__skill-name">星霜断ち</p>
                <p className="font-sample__sub">
                  敵単体に斬撃属性ダメージ。ブレイク中は威力が 150% に上昇。
                </p>
              </section>

              <section className="font-sample font-sample--popup">
                <span className="font-sample__tag">UI Popup</span>
                <div className="font-popup-list">
                  <p className="font-popup font-popup--break">BREAK!</p>
                  <p className="font-popup font-popup--damage">DAMAGE!</p>
                  <p className="font-popup font-popup--ice">ICE ANOMALY BURST!</p>
                </div>
              </section>

              <section className="font-sample font-sample--terms">
                <span className="font-sample__tag">用語プレビュー</span>
                <div className="font-term-list">
                  <p>通常攻撃</p>
                  <p>特殊スキル</p>
                  <p>支援要請</p>
                  <p>反撃連携</p>
                  <p>星核共鳴</p>
                  <p>ターンスキップ</p>
                </div>
              </section>

              <section className="font-sample font-sample--menu">
                <span className="font-sample__tag">Menu Button</span>
                <button
                  type="button"
                  className="font-menu-button"
                  onClick={() => setCurrentPage('title')}
                >
                  タイトルへ戻る
                </button>
              </section>
            </div>
          </div>

          <aside className="font-sidebar">
            <div className="font-filter">
              <span className="font-filter__label">カテゴリ</span>

              <div className="font-filter__chips" aria-label="フォントカテゴリ">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={fontFilter === option.id ? 'is-active' : undefined}
                    onClick={() => setFontFilter(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <p className="font-filter__result">
                {filteredFonts.length} 件表示 / 全 {fontCandidates.length} 件
              </p>
            </div>

            <ul className="font-list" aria-label="候補フォント一覧">
              {filteredFonts.length > 0 ? (
                filteredFonts.map((font) => (
                  <li key={font.name}>
                    <button
                      type="button"
                      className={
                        font.name === currentFont.name ? 'is-active' : undefined
                      }
                      onClick={() =>
                        setFontIndex(
                          fontCandidates.findIndex(
                            (candidate) => candidate.name === font.name,
                          ),
                        )
                      }
                    >
                      {font.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="font-list__empty">
                  条件に一致するフォントがありません。
                </li>
              )}
            </ul>
          </aside>
        </section>
      )}
    </main>
  )
}

export default App
