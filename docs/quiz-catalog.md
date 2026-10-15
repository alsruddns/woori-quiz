# Quiz catalog

Registry in `src/lib/registry.ts` is the single source of truth. Every entry is linked from the catalog, but non-dynamic entries are staged and must not be treated as a fully playable quiz until localized question packs have passed fact review. Dynamic math is currently playable.

| Category | Quiz | Questions | Difficulty | Mode | Review status | Path | Source/review |
|---|---|---:|---|---|---|---|---|
| general | General Knowledge Quiz | pending | easy, medium, hard | static | Question bank pending | /quiz/ko/quiz/general-knowledge-quiz | Original writing; editorial verification pending |
| general | Everyday Knowledge Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/everyday-knowledge-quiz | Original writing; editorial verification pending |
| general | Difficult General Knowledge Quiz | pending | hard, expert | static | Question bank pending | /quiz/ko/quiz/difficult-general-knowledge-quiz | Original writing; editorial verification pending |
| geography | World Capitals Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/world-capitals-quiz | Original writing; editorial verification pending |
| geography | Country Flags Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/country-flags-quiz | Original writing; editorial verification pending |
| geography | Country Currency Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/country-currency-quiz | Original writing; editorial verification pending |
| geography | Country Location Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/country-location-quiz | Original writing; editorial verification pending |
| geography | Asian Capitals Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/asia-capitals-quiz | Original writing; editorial verification pending |
| geography | European Capitals Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/europe-capitals-quiz | Original writing; editorial verification pending |
| geography | World Geography Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/world-geography-quiz | Original writing; editorial verification pending |
| science | Basic Science Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/basic-science-quiz | Original writing; editorial verification pending |
| science | Physics Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/physics-quiz | Original writing; editorial verification pending |
| science | Chemistry Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/chemistry-quiz | Original writing; editorial verification pending |
| science | Biology Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/biology-quiz | Original writing; editorial verification pending |
| science | Astronomy Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/astronomy-quiz | Original writing; editorial verification pending |
| science | Difficult Science Quiz | pending | hard, expert | static | Question bank pending | /quiz/ko/quiz/difficult-science-quiz | Original writing; editorial verification pending |
| history | World History Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/world-history-quiz | Original writing; editorial verification pending |
| history | Korean History Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/korean-history-quiz | Original writing; editorial verification pending |
| history | Ancient History Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/ancient-history-quiz | Original writing; editorial verification pending |
| history | Modern History Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/modern-history-quiz | Original writing; editorial verification pending |
| math | Addition Quiz | dynamic | easy, medium | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/addition-quiz | Dynamic generation |
| math | Subtraction Quiz | dynamic | easy, medium | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/subtraction-quiz | Dynamic generation |
| math | Multiplication Quiz | dynamic | easy, medium | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/multiplication-quiz | Dynamic generation |
| math | Division Quiz | dynamic | easy, medium | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/division-quiz | Dynamic generation |
| math | Multiplication Table Quiz | dynamic | easy, medium | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/multiplication-table-quiz | Dynamic generation |
| math | Mental Math Quiz | dynamic | medium, hard | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/mental-math-quiz | Dynamic generation |
| math | Fraction Quiz | dynamic | medium, hard | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/fraction-quiz | Dynamic generation |
| math | Percentage Quiz | dynamic | medium, hard | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/percentage-quiz | Dynamic generation |
| math | Equation Quiz | dynamic | hard, expert | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/equation-quiz | Dynamic generation |
| math | Arithmetic Challenge | dynamic | medium, hard, expert | dynamic | Generator available; validation tests pass | /quiz/ko/quiz/arithmetic-challenge | Dynamic generation |
| language | English Vocabulary Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/english-vocabulary-quiz | Original writing; editorial verification pending |
| language | English Spelling Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/english-spelling-quiz | Original writing; editorial verification pending |
| language | English Grammar Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/english-grammar-quiz | Original writing; editorial verification pending |
| language | Hiragana Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/hiragana-quiz | Original writing; editorial verification pending |
| language | Katakana Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/katakana-quiz | Original writing; editorial verification pending |
| language | Japanese Vocabulary Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/japanese-vocabulary-quiz | Original writing; editorial verification pending |
| language | Chinese Character Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/chinese-character-quiz | Original writing; editorial verification pending |
| language | Korean Vocabulary Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/korean-vocabulary-quiz | Original writing; editorial verification pending |
| technology | Computer Basics Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/computer-basics-quiz | Original writing; editorial verification pending |
| technology | Programming Basics Quiz | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/programming-basics-quiz | Original writing; editorial verification pending |
| technology | Web Development Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/web-development-quiz | Original writing; editorial verification pending |
| technology | Database Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/database-quiz | Original writing; editorial verification pending |
| technology | Network Basics Quiz | pending | medium, hard | static | Question bank pending | /quiz/ko/quiz/network-basics-quiz | Original writing; editorial verification pending |
| technology | Difficult IT Quiz | pending | hard, expert | static | Question bank pending | /quiz/ko/quiz/difficult-it-quiz | Original writing; editorial verification pending |
| memory | Number Memory Test | pending | medium | interactive | Question bank pending | /quiz/ko/quiz/number-memory-test | Original writing; editorial verification pending |
| memory | Word Memory Test | pending | medium | interactive | Question bank pending | /quiz/ko/quiz/word-memory-test | Original writing; editorial verification pending |
| memory | Sequence Memory Test | pending | medium | interactive | Question bank pending | /quiz/ko/quiz/sequence-memory-test | Original writing; editorial verification pending |
| memory | Visual Memory Test | pending | medium | interactive | Question bank pending | /quiz/ko/quiz/visual-memory-test | Original writing; editorial verification pending |
| memory | Pattern Recognition Test | pending | medium, hard | interactive | Question bank pending | /quiz/ko/quiz/pattern-recognition-test | Original writing; editorial verification pending |
| memory | Concentration Test | pending | medium | interactive | Question bank pending | /quiz/ko/quiz/concentration-test | Original writing; editorial verification pending |
| speed | Reaction Time Test | pending | medium | interactive | Question bank pending | /quiz/ko/quiz/reaction-time-test | Original writing; editorial verification pending |
| speed | Click Speed Test | pending | medium | interactive | Question bank pending | /quiz/ko/quiz/click-speed-test | Original writing; editorial verification pending |
| speed | Typing Speed Test | pending | medium | interactive | Question bank pending | /quiz/ko/quiz/typing-speed-test | Original writing; editorial verification pending |
| speed | Color Reaction Test | pending | medium | interactive | Question bank pending | /quiz/ko/quiz/color-reaction-test | Original writing; editorial verification pending |
| fun | Random Trivia Challenge | pending | easy, medium, hard | static | Question bank pending | /quiz/ko/quiz/random-trivia-challenge | Original writing; editorial verification pending |
| fun | True or False Challenge | pending | easy, medium | static | Question bank pending | /quiz/ko/quiz/true-false-challenge | Original writing; editorial verification pending |
| fun | Impossible Quiz | pending | hard, expert | static | Question bank pending | /quiz/ko/quiz/impossible-quiz | Original writing; editorial verification pending |
| fun | Mixed Hard Quiz | pending | hard, expert | static | Question bank pending | /quiz/ko/quiz/mixed-hard-quiz | Original writing; editorial verification pending |

