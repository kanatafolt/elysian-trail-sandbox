import { useEffect, useState } from 'react'
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

type PageId = (typeof pages)[number]['id']
type FilterId = (typeof filterOptions)[number]['id']

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('title')
  const [fontIndex, setFontIndex] = useState(0)
  const [fontFilter, setFontFilter] = useState<FilterId>('all')
  const [searchText, setSearchText] = useState('')
  const currentFont = fontCandidates[fontIndex]
  const normalizedSearchText = searchText.trim().toLowerCase()
  const filteredFonts = fontCandidates.filter((font) => {
    const matchesFilter =
      fontFilter === 'all' || font.category === fontFilter
    const matchesSearch = font.name.toLowerCase().includes(normalizedSearchText)

    return matchesFilter && matchesSearch
  })
  const sampleStyle = {
    fontFamily: `'${currentFont.name}', var(--font-fallback)`,
  }

  useEffect(() => {
    document.title =
      currentPage === 'title'
        ? 'Elysian Trail Sandbox'
        : 'フォントプレビュー | Elysian Trail Sandbox'
  }, [currentPage])

  useEffect(() => {
    if (!filteredFonts.some((font) => font.name === currentFont.name)) {
      const fallbackFont = filteredFonts[0]

      if (!fallbackFont) {
        return
      }

      setFontIndex(
        fontCandidates.findIndex((font) => font.name === fallbackFont.name),
      )
    }
  }, [currentFont.name, filteredFonts])

  const handleNextFont = () => {
    const currentFilteredIndex = filteredFonts.findIndex(
      (font) => font.name === currentFont.name,
    )

    if (filteredFonts.length === 0) {
      return
    }

    const nextFont =
      filteredFonts[(currentFilteredIndex + 1) % filteredFonts.length]

    setFontIndex(fontCandidates.findIndex((font) => font.name === nextFont.name))
  }

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
                RPGのUI文言を使って、タイトル向けか会話向けかを見比べられます。
              </p>
            </div>

            <div className="font-samples" style={sampleStyle}>
              <section className="font-sample font-sample--title">
                <span className="font-sample__tag">Title / Key Art</span>
                <p className="font-sample__main">
                  Elysian Trail
                  <br />
                  星霜を越えて、迷宮の奥へ。
                </p>
              </section>

              <section className="font-sample font-sample--battle">
                <span className="font-sample__tag">Battle Log</span>
                <p className="font-sample__log">アストラの攻撃。冥狼ヴァルガに斬撃。</p>
                <p className="font-sample__log">クリティカルヒット。248のダメージ。</p>
                <p className="font-sample__log">冥狼ヴァルガの防御力が低下した。</p>
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
                <span className="font-sample__tag">Character Name / Dialogue</span>
                <p className="font-sample__name">セレス</p>
                <p className="font-sample__dialogue">
                  「急ぎましょう。夜が明ける前に、封印の間へ辿り着かないと」
                </p>
              </section>

              <section className="font-sample font-sample--skill">
                <span className="font-sample__tag">Skill Name / Effect</span>
                <p className="font-sample__skill-name">星天断ち</p>
                <p className="font-sample__sub">
                  光属性の斬撃で敵単体を攻撃。ブレイク中は威力が30%上昇。
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
                  <p>必殺技</p>
                  <p>拡散攻撃</p>
                  <p>再行動</p>
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
            <div className="font-meta" aria-live="polite">
              <span className="font-meta__label">現在のフォント</span>
              <strong className="font-meta__name">{currentFont.name}</strong>
            </div>

            <div className="font-filter">
              <label className="font-filter__search">
                <span className="font-filter__label">名前で検索</span>
                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="例: Gothic / One"
                />
              </label>

              <div className="font-filter__chips" aria-label="用途フィルタ">
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

            <div className="font-actions">
              <button
                type="button"
                className="font-switch"
                onClick={handleNextFont}
                disabled={filteredFonts.length === 0}
              >
                次のフォントへ
              </button>
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
