import type { Locale } from "./i18n";
import { uiMessages } from "./i18n";
import type { Quiz } from "./registry";
import { quizDescription } from "./content-copy";
import ruCatalog from "./i18n/ru.json";
import trCatalog from "./i18n/tr.json";
import plCatalog from "./i18n/pl.json";
import filCatalog from "./i18n/fil.json";
import bnCatalog from "./i18n/bn.json";
import ukCatalog from "./i18n/uk.json";
import msCatalog from "./i18n/ms.json";

type StaticLocale = Exclude<Locale, "ru" | "tr" | "pl" | "fil" | "bn" | "uk" | "ms">;

const terms = ["general","knowledge","everyday","difficult","world","capitals","country","flags","currency","location","asia","europe","geography","basic","science","physics","chemistry","biology","astronomy","history","korean","ancient","modern","addition","subtraction","multiplication","division","table","mental","math","arithmetic","challenge","english","vocabulary","spelling","grammar","hiragana","katakana","japanese","chinese","character","computer","programming","web","development","database","network","it","number","word","sequence","visual","pattern","recognition","concentration","reaction","time","click","typing","speed","color","random","trivia","true","false","impossible","mixed","hard","quiz","test"] as const;
export const quizTitleWordCount = terms.length;
export function quizTitleTranslationWordCount(locale: Locale): number { return locale === "ru" ? ruCatalog.titleTerms.length : locale === "tr" || locale === "fil" ? quizTitleWordCount : locale === "bn" ? bnCatalog.titleTerms.length : locale === "uk" ? ukCatalog.titleTerms.length : locale === "pl" ? plCatalog.titleTerms.length : locale === "ms" ? msCatalog.titleTerms.length : localizedTerms[locale].length; }
const localizedTerms: Record<StaticLocale, readonly string[]> = {
  ko:"일반|상식|일상|고난도|세계|수도|국가|국기|통화|위치|아시아|유럽|지리|기초|과학|물리|화학|생물|천문|역사|한국|고대|근현대|덧셈|뺄셈|곱셈|나눗셈|구구단|암산|수학|산수|도전|영어|어휘|맞춤법|문법|히라가나|가타카나|일본어|중국어|문자|컴퓨터|프로그래밍|웹|개발|데이터베이스|네트워크|IT|숫자|단어|순서|시각|패턴|인식|집중력|반응|시간|클릭|타자|속도|색상|랜덤|상식|참거짓|거짓|불가능|종합|고난도|퀴즈|테스트".split("|"),
  en:terms.map((term)=>term==="it"?"IT":term.charAt(0).toUpperCase()+term.slice(1)),
  ja:"一般|知識|日常|難問|世界|首都|国|国旗|通貨|位置|アジア|ヨーロッパ|地理|基礎|科学|物理|化学|生物|天文学|歴史|韓国|古代|近現代|足し算|引き算|掛け算|割り算|九九|暗算|数学|計算|チャレンジ|英語|語彙|綴り|文法|ひらがな|カタカナ|日本語|中国語|文字|コンピューター|プログラミング|ウェブ|開発|データベース|ネットワーク|IT|数字|単語|順序|視覚|パターン|認識|集中力|反応|時間|クリック|タイピング|速度|色|ランダム|トリビア|正誤|誤り|難問|総合|上級|クイズ|テスト".split("|"),
  zh:"一般|知識|日常|高難度|世界|首都|國家|國旗|貨幣|位置|亞洲|歐洲|地理|基礎|科學|物理|化學|生物|天文|歷史|韓國|古代|近代|加法|減法|乘法|除法|乘法表|心算|數學|算術|挑戰|英語|詞彙|拼寫|文法|平假名|片假名|日語|中文|文字|電腦|程式設計|網頁|開發|資料庫|網路|IT|數字|詞語|序列|視覺|圖形|辨識|專注力|反應|時間|點擊|打字|速度|顏色|隨機|常識|是非|錯誤|不可能|綜合|高難度|測驗|測試".split("|"),
  es:"General|Conocimiento|Cotidiano|Difícil|Mundo|Capitales|País|Banderas|Moneda|Ubicación|Asia|Europa|Geografía|Básica|Ciencia|Física|Química|Biología|Astronomía|Historia|Coreana|Antigua|Moderna|Suma|Resta|Multiplicación|División|Tabla|Mental|Matemáticas|Aritmética|Desafío|Inglés|Vocabulario|Ortografía|Gramática|Hiragana|Katakana|Japonés|Chino|Caracteres|Informática|Programación|Web|Desarrollo|Base de datos|Redes|TI|Números|Palabras|Secuencia|Visual|Patrones|Reconocimiento|Concentración|Reacción|Tiempo|Clic|Mecanografía|Velocidad|Color|Aleatorio|Trivia|Verdadero|Falso|Imposible|Mixto|Difícil|Quiz|Prueba".split("|"),
  "pt-br":"Geral|Conhecimentos|Cotidiano|Difícil|Mundo|Capitais|País|Bandeiras|Moeda|Localização|Ásia|Europa|Geografia|Ciência|Ciências|Física|Química|Biologia|Astronomia|História|Coreana|Antiga|Moderna|Adição|Subtração|Multiplicação|Divisão|Tabuada|Mental|Matemática|Aritmética|Desafio|Inglês|Vocabulário|Ortografia|Gramática|Hiragana|Katakana|Japonês|Chinês|Caractere|Computação|Programação|Web|Desenvolvimento|Banco de dados|Rede|TI|Número|Palavra|Sequência|Visual|Padrão|Reconhecimento|Concentração|Reação|Tempo|Clique|Digitação|Velocidade|Cor|Aleatório|Curiosidades|Verdadeiro|Falso|Impossível|Misto|Difícil|Quiz|Teste".split("|"),
  de:"Allgemein|Wissen|Alltag|Schwer|Welt|Hauptstädte|Land|Flaggen|Währung|Lage|Asien|Europa|Geografie|Grundlagen|Wissenschaft|Physik|Chemie|Biologie|Astronomie|Geschichte|Koreanisch|Antike|Moderne|Addition|Subtraktion|Multiplikation|Division|Einmaleins|Kopfrechnen|Mathematik|Rechnen|Herausforderung|Englisch|Wortschatz|Rechtschreibung|Grammatik|Hiragana|Katakana|Japanisch|Chinesisch|Schriftzeichen|Computer|Programmierung|Web|Entwicklung|Datenbank|Netzwerk|IT|Zahlen|Wörter|Reihenfolge|Visuell|Muster|Erkennung|Konzentration|Reaktion|Zeit|Klick|Tippen|Geschwindigkeit|Farbe|Zufall|Wissen|Richtig|Falsch|Unmöglich|Gemischt|Schwer|Quiz|Test".split("|"),
  fr:"Culture|Générale|Quotidien|Difficile|Monde|Capitales|Pays|Drapeaux|Monnaie|Localisation|Asie|Europe|Géographie|Bases|Sciences|Physique|Chimie|Biologie|Astronomie|Histoire|Coréenne|Ancienne|Moderne|Addition|Soustraction|Multiplication|Division|Tables|Mental|Mathématiques|Calcul|Défi|Anglais|Vocabulaire|Orthographe|Grammaire|Hiragana|Katakana|Japonais|Chinois|Caractères|Informatique|Programmation|Web|Développement|Base de données|Réseau|Informatique|Nombres|Mots|Séquence|Visuel|Motifs|Reconnaissance|Concentration|Réaction|Temps|Clic|Saisie|Vitesse|Couleur|Aléatoire|Culture|Vrai|Faux|Impossible|Mixte|Difficile|Quiz|Test".split("|"),
  vi:"Tổng|Quát|Hằng ngày|Khó|Thế giới|Thủ đô|Quốc gia|Lá cờ|Tiền tệ|Vị trí|Châu Á|Châu Âu|Địa lý|Cơ bản|Khoa học|Vật lý|Hóa học|Sinh học|Thiên văn|Lịch sử|Hàn Quốc|Cổ đại|Hiện đại|Cộng|Trừ|Nhân|Chia|Bảng|Nhẩm|Toán|Số học|Thử thách|Tiếng Anh|Từ vựng|Chính tả|Ngữ pháp|Hiragana|Katakana|Tiếng Nhật|Tiếng Trung|Ký tự|Máy tính|Lập trình|Web|Phát triển|Cơ sở dữ liệu|Mạng|IT|Con số|Từ|Chuỗi|Thị giác|Mẫu|Nhận dạng|Tập trung|Phản xạ|Thời gian|Nhấp chuột|Đánh máy|Tốc độ|Màu sắc|Ngẫu nhiên|Đố vui|Đúng|Sai|Bất khả thi|Tổng hợp|Khó|Đố vui|Bài kiểm tra".split("|"),
  id:"Umum|Pengetahuan|Sehari-hari|Sulit|Dunia|Ibu kota|Negara|Bendera|Mata uang|Lokasi|Asia|Eropa|Geografi|Dasar|Sains|Fisika|Kimia|Biologi|Astronomi|Sejarah|Korea|Kuno|Modern|Penjumlahan|Pengurangan|Perkalian|Pembagian|Tabel|Mental|Matematika|Aritmetika|Tantangan|Inggris|Kosakata|Ejaan|Tata bahasa|Hiragana|Katakana|Jepang|Tionghoa|Karakter|Komputer|Pemrograman|Web|Pengembangan|Basis data|Jaringan|IT|Angka|Kata|Urutan|Visual|Pola|Pengenalan|Konsentrasi|Reaksi|Waktu|Klik|Mengetik|Kecepatan|Warna|Acak|Trivia|Benar|Salah|Mustahil|Campuran|Sulit|Kuis|Tes".split("|"),
  th:"ความรู้|ทั่วไป|ประจำวัน|ยาก|โลก|เมืองหลวง|ประเทศ|ธงชาติ|สกุลเงิน|ตำแหน่ง|เอเชีย|ยุโรป|ภูมิศาสตร์|พื้นฐาน|วิทยาศาสตร์|ฟิสิกส์|เคมี|ชีววิทยา|ดาราศาสตร์|ประวัติศาสตร์|เกาหลี|โบราณ|สมัยใหม่|บวก|ลบ|คูณ|หาร|สูตรคูณ|คิดเลขในใจ|คณิตศาสตร์|เลขคณิต|ท้าทาย|อังกฤษ|คำศัพท์|การสะกด|ไวยากรณ์|ฮิรางานะ|คาตากานะ|ญี่ปุ่น|จีน|ตัวอักษร|คอมพิวเตอร์|เขียนโปรแกรม|เว็บ|พัฒนา|ฐานข้อมูล|เครือข่าย|ไอที|ตัวเลข|คำ|ลำดับ|ภาพ|รูปแบบ|จดจำ|สมาธิ|ปฏิกิริยา|เวลา|คลิก|พิมพ์|ความเร็ว|สี|สุ่ม|ความรู้รอบตัว|ถูก|ผิด|เป็นไปไม่ได้|ผสม|ยาก|แบบทดสอบ|ทดสอบ".split("|"),
  "zh-tw":"一般|常識|日常|高難度|世界|首都|國家|國旗|貨幣|位置|亞洲|歐洲|地理|基礎|科學|物理|化學|生物|天文|歷史|韓國|古代|近代|加法|減法|乘法|除法|乘法表|心算|數學|算術|挑戰|英語|詞彙|拼字|文法|平假名|片假名|日語|中文|文字|電腦|程式設計|網頁|開發|資料庫|網路|IT|數字|詞語|序列|視覺|圖形|辨識|專注力|反應|時間|點擊|打字|速度|顏色|隨機|常識|是非|錯誤|不可能|綜合|高難度|測驗|測試".split("|"),
  it:"Cultura|Generale|Quotidiana|Difficile|Mondo|Capitali|Paese|Bandiere|Valuta|Posizione|Asia|Europa|Geografia|Base|Scienze|Fisica|Chimica|Biologia|Astronomia|Storia|Coreana|Antica|Moderna|Addizione|Sottrazione|Moltiplicazione|Divisione|Tabelline|Mentale|Matematica|Aritmetica|Sfida|Inglese|Vocabolario|Ortografia|Grammatica|Hiragana|Katakana|Giapponese|Cinese|Caratteri|Informatica|Programmazione|Web|Sviluppo|Database|Rete|IT|Numeri|Parole|Sequenza|Visivo|Schemi|Riconoscimento|Concentrazione|Reazione|Tempo|Clic|Digitazione|Velocità|Colore|Casuale|Curiosità|Vero|Falso|Impossibile|Misto|Difficile|Quiz|Test".split("|"),
  nl:"Algemene|Kennis|Dagelijkse|Moeilijke|Wereld|Hoofdsteden|Land|Vlaggen|Valuta|Locatie|Azië|Europa|Aardrijkskunde|Basis|Wetenschap|Natuurkunde|Scheikunde|Biologie|Astronomie|Geschiedenis|Koreaanse|Oude|Moderne|Optellen|Aftrekken|Vermenigvuldigen|Delen|Tafel|Hoofdrekenen|Wiskunde|Rekenen|Uitdaging|Engels|Woordenschat|Spelling|Grammatica|Hiragana|Katakana|Japans|Chinees|Tekens|Computer|Programmeren|Web|Ontwikkeling|Database|Netwerk|IT|Getallen|Woorden|Reeks|Visueel|Patroon|Herkenning|Concentratie|Reactie|Tijd|Klik|Typen|Snelheid|Kleur|Willekeurig|Trivia|Waar|Onwaar|Onmogelijk|Gemengd|Moeilijk|Quiz|Test".split("|"),
  hi:"सामान्य|ज्ञान|रोज़मर्रा|कठिन|विश्व|राजधानियाँ|देश|झंडे|मुद्रा|स्थान|एशिया|यूरोप|भूगोल|बुनियादी|विज्ञान|भौतिकी|रसायन|जीवविज्ञान|खगोल|इतिहास|कोरियाई|प्राचीन|आधुनिक|जोड़|घटाव|गुणा|भाग|पहाड़ा|मानसिक|गणित|अंकगणित|चुनौती|अंग्रेज़ी|शब्दावली|वर्तनी|व्याकरण|हिरागाना|काताकाना|जापानी|चीनी|अक्षर|कंप्यूटर|प्रोग्रामिंग|वेब|विकास|डेटाबेस|नेटवर्क|आईटी|संख्या|शब्द|क्रम|दृश्य|पैटर्न|पहचान|एकाग्रता|प्रतिक्रिया|समय|क्लिक|टाइपिंग|गति|रंग|यादृच्छिक|सामान्य ज्ञान|सही|गलत|असंभव|मिश्रित|कठिन|क्विज़|परीक्षण".split("|"),
};
const extraTerms: Record<StaticLocale, Record<string, string>> = {
  ko:{fraction:"분수",percentage:"백분율",equation:"방정식",basics:"기초",memory:"기억력"},en:{fraction:"Fraction",percentage:"Percentage",equation:"Equation",basics:"Basics",memory:"Memory"},ja:{fraction:"分数",percentage:"割合",equation:"方程式",basics:"基礎",memory:"記憶"},zh:{fraction:"分數",percentage:"百分比",equation:"方程",basics:"基礎",memory:"記憶"},es:{fraction:"Fracciones",percentage:"Porcentajes",equation:"Ecuaciones",basics:"Básicos",memory:"Memoria"},"pt-br":{fraction:"Frações",percentage:"Porcentagem",equation:"Equações",basics:"Básicos",memory:"Memória"},de:{fraction:"Brüche",percentage:"Prozent",equation:"Gleichungen",basics:"Grundlagen",memory:"Gedächtnis"},fr:{fraction:"Fractions",percentage:"Pourcentages",equation:"Équations",basics:"Bases",memory:"Mémoire"},vi:{fraction:"Phân số",percentage:"Phần trăm",equation:"Phương trình",basics:"Cơ bản",memory:"Trí nhớ"},id:{fraction:"Pecahan",percentage:"Persentase",equation:"Persamaan",basics:"Dasar",memory:"Ingatan"},th:{fraction:"เศษส่วน",percentage:"ร้อยละ",equation:"สมการ",basics:"พื้นฐาน",memory:"ความจำ"},"zh-tw":{fraction:"分數",percentage:"百分比",equation:"方程式",basics:"基礎",memory:"記憶"},it:{fraction:"Frazioni",percentage:"Percentuali",equation:"Equazioni",basics:"Fondamenti",memory:"Memoria"},nl:{fraction:"Breuken",percentage:"Percentages",equation:"Vergelijkingen",basics:"Basis",memory:"Geheugen"},hi:{fraction:"भिन्न",percentage:"प्रतिशत",equation:"समीकरण",basics:"मूल बातें",memory:"याददाश्त"}
};

const koreanTitles: Record<string, string> = {
  "general-knowledge-quiz":"일반 상식 퀴즈","everyday-knowledge-quiz":"생활 상식 퀴즈","difficult-general-knowledge-quiz":"고난도 일반 상식 퀴즈","world-capitals-quiz":"세계 수도 퀴즈","country-flags-quiz":"국기 퀴즈","country-currency-quiz":"국가별 통화 퀴즈","country-location-quiz":"국가 위치 퀴즈","asia-capitals-quiz":"아시아 수도 퀴즈","europe-capitals-quiz":"유럽 수도 퀴즈","world-geography-quiz":"세계 지리 퀴즈","basic-science-quiz":"기초 과학 퀴즈","physics-quiz":"물리 퀴즈","chemistry-quiz":"화학 퀴즈","biology-quiz":"생물 퀴즈","astronomy-quiz":"천문학 퀴즈","difficult-science-quiz":"고난도 과학 퀴즈","world-history-quiz":"세계사 퀴즈","korean-history-quiz":"한국사 퀴즈","ancient-history-quiz":"고대사 퀴즈","modern-history-quiz":"근현대사 퀴즈","addition-quiz":"덧셈 퀴즈","subtraction-quiz":"뺄셈 퀴즈","multiplication-quiz":"곱셈 퀴즈","division-quiz":"나눗셈 퀴즈","multiplication-table-quiz":"구구단 퀴즈","mental-math-quiz":"암산 퀴즈","fraction-quiz":"분수 퀴즈","percentage-quiz":"백분율 퀴즈","equation-quiz":"방정식 퀴즈","arithmetic-challenge":"산수 도전","english-vocabulary-quiz":"영어 어휘 퀴즈","english-spelling-quiz":"영어 철자 퀴즈","english-grammar-quiz":"영어 문법 퀴즈","hiragana-quiz":"히라가나 퀴즈","katakana-quiz":"가타카나 퀴즈","japanese-vocabulary-quiz":"일본어 어휘 퀴즈","chinese-character-quiz":"한자 퀴즈","korean-vocabulary-quiz":"한국어 어휘 퀴즈","computer-basics-quiz":"컴퓨터 기초 퀴즈","programming-basics-quiz":"프로그래밍 기초 퀴즈","web-development-quiz":"웹 개발 퀴즈","database-quiz":"데이터베이스 퀴즈","network-basics-quiz":"네트워크 기초 퀴즈","difficult-it-quiz":"고난도 IT 퀴즈","number-memory-test":"숫자 기억력 테스트","word-memory-test":"단어 기억력 테스트","sequence-memory-test":"순서 기억력 테스트","visual-memory-test":"시각 기억력 테스트","pattern-recognition-test":"패턴 인식 테스트","concentration-test":"집중력 테스트","reaction-time-test":"반응 속도 테스트","click-speed-test":"클릭 속도 테스트","typing-speed-test":"타자 속도 테스트","color-reaction-test":"색상 반응 테스트","random-trivia-challenge":"랜덤 상식 도전","true-false-challenge":"참·거짓 퀴즈","impossible-quiz":"불가능 퀴즈","mixed-hard-quiz":"종합 고난도 퀴즈"
};

const bankTerms: Record<StaticLocale, Record<string, string>> = {
  ko:{easy:"쉬운",adult:"성인",daily:"일상",life:"생활",nonsense:"넌센스",riddle:"수수께끼",brain:"두뇌",teaser:"티저",logic:"논리",reasoning:"추론",advanced:"심화",probability:"확률",civilizations:"문명",space:"우주",capital:"수도",cities:"도시",language:"언어",fully:"완전",10:"10",20:"20",question:"문제"},
  en:{easy:"Easy",adult:"Adult",daily:"Daily",life:"Life",nonsense:"Nonsense",riddle:"Riddle",brain:"Brain",teaser:"Teaser",logic:"Logic",reasoning:"Reasoning",advanced:"Advanced",probability:"Probability",civilizations:"Civilizations",space:"Space",capital:"Capital",cities:"Cities",language:"Language",fully:"Fully",10:"10",20:"20",question:"Question"},
  ja:{easy:"やさしい",adult:"大人",daily:"日常",life:"生活",nonsense:"ナンセンス",riddle:"なぞなぞ",brain:"脳",teaser:"パズル",logic:"論理",reasoning:"推理",advanced:"上級",probability:"確率",civilizations:"文明",space:"宇宙",capital:"首都",cities:"都市",language:"言語",fully:"完全",10:"10",20:"20",question:"問"},
  zh:{easy:"简单",adult:"成人",daily:"日常",life:"生活",nonsense:"趣味",riddle:"谜语",brain:"脑力",teaser:"挑战",logic:"逻辑",reasoning:"推理",advanced:"进阶",probability:"概率",civilizations:"文明",space:"太空",capital:"首都",cities:"城市",language:"语言",fully:"完全",10:"10",20:"20",question:"题"},
  es:{easy:"Fácil",adult:"Adulto",daily:"Diario",life:"Vida",nonsense:"Absurdo",riddle:"Adivinanzas",brain:"Cerebro",teaser:"Reto",logic:"Lógica",reasoning:"Razonamiento",advanced:"Avanzado",probability:"Probabilidad",civilizations:"Civilizaciones",space:"Espacio",capital:"Capitales",cities:"Ciudades",language:"Idioma",fully:"Totalmente",10:"10",20:"20",question:"Preguntas"},
  "pt-br":{easy:"Fácil",adult:"Adulto",daily:"Diário",life:"Vida",nonsense:"Charadas",riddle:"Adivinhas",brain:"Cérebro",teaser:"Desafio",logic:"Lógica",reasoning:"Raciocínio",advanced:"Avançado",probability:"Probabilidade",civilizations:"Civilizações",space:"Espaço",capital:"Capitais",cities:"Cidades",language:"Idioma",fully:"Totalmente",10:"10",20:"20",question:"Perguntas"},
  de:{easy:"Einfach",adult:"Erwachsene",daily:"Alltag",life:"Leben",nonsense:"Unsinn",riddle:"Rätsel",brain:"Gehirn",teaser:"Knobel",logic:"Logik",reasoning:"Denken",advanced:"Fortgeschritten",probability:"Wahrscheinlichkeit",civilizations:"Zivilisationen",space:"Weltraum",capital:"Hauptstädte",cities:"Städte",language:"Sprache",fully:"Komplett",10:"10",20:"20",question:"Fragen"},
  fr:{easy:"Facile",adult:"Adulte",daily:"Quotidien",life:"Vie",nonsense:"Loufoque",riddle:"Devinettes",brain:"Cerveau",teaser:"Défi",logic:"Logique",reasoning:"Raisonnement",advanced:"Avancé",probability:"Probabilité",civilizations:"Civilisations",space:"Espace",capital:"Capitales",cities:"Villes",language:"Langue",fully:"Entièrement",10:"10",20:"20",question:"Questions"},
  vi:{easy:"Dễ",adult:"Người lớn",daily:"Hằng ngày",life:"Đời sống",nonsense:"Đố vui",riddle:"Câu đố",brain:"Trí não",teaser:"Thử thách",logic:"Logic",reasoning:"Suy luận",advanced:"Nâng cao",probability:"Xác suất",civilizations:"Nền văn minh",space:"Vũ trụ",capital:"Thủ đô",cities:"Thành phố",language:"Ngôn ngữ",fully:"Toàn bộ",10:"10",20:"20",question:"Câu hỏi"},
  id:{easy:"Mudah",adult:"Dewasa",daily:"Harian",life:"Kehidupan",nonsense:"Teka-teki lucu",riddle:"Teka-teki",brain:"Otak",teaser:"Tantangan",logic:"Logika",reasoning:"Penalaran",advanced:"Lanjutan",probability:"Probabilitas",civilizations:"Peradaban",space:"Antariksa",capital:"Ibu kota",cities:"Kota",language:"Bahasa",fully:"Sepenuhnya",10:"10",20:"20",question:"Soal"},
  th:{easy:"ง่าย",adult:"ผู้ใหญ่",daily:"ประจำวัน",life:"ชีวิต",nonsense:"ปริศนาชวนขำ",riddle:"ปริศนา",brain:"สมอง",teaser:"ท้าทาย",logic:"ตรรกะ",reasoning:"การคิด",advanced:"ขั้นสูง",probability:"ความน่าจะเป็น",civilizations:"อารยธรรม",space:"อวกาศ",capital:"เมืองหลวง",cities:"เมือง",language:"ภาษา",fully:"ครบถ้วน",10:"10",20:"20",question:"ข้อ"},
  "zh-tw":{easy:"簡單",adult:"成人",daily:"日常",life:"生活",nonsense:"趣味",riddle:"謎語",brain:"腦力",teaser:"挑戰",logic:"邏輯",reasoning:"推理",advanced:"進階",probability:"機率",civilizations:"文明",space:"太空",capital:"首都",cities:"城市",language:"語言",fully:"完全",10:"10",20:"20",question:"題"},
  it:{easy:"Facile",adult:"Adulti",daily:"Quotidiano",life:"Vita",nonsense:"Assurdo",riddle:"Indovinelli",brain:"Cervello",teaser:"Sfida",logic:"Logica",reasoning:"Ragionamento",advanced:"Avanzato",probability:"Probabilità",civilizations:"Civiltà",space:"Spazio",capital:"Capitali",cities:"Città",language:"Lingua",fully:"Completo",10:"10",20:"20",question:"Domande"},
  nl:{easy:"Makkelijke",adult:"Volwassenen",daily:"Dagelijkse",life:"Levens",nonsense:"Gekke",riddle:"Raadsels",brain:"Brein",teaser:"Puzzel",logic:"Logica",reasoning:"Redeneren",advanced:"Gevorderde",probability:"Kansberekening",civilizations:"Beschavingen",space:"Ruimte",capital:"Hoofdsteden",cities:"Steden",language:"Taal",fully:"Volledig",10:"10",20:"20",question:"Vragen"},
  hi:{easy:"आसान",adult:"वयस्क",daily:"दैनिक",life:"जीवन",nonsense:"मज़ेदार",riddle:"पहेली",brain:"दिमाग़",teaser:"चुनौती",logic:"तर्क",reasoning:"अनुमान",advanced:"उन्नत",probability:"प्रायिकता",civilizations:"सभ्यताएँ",space:"अंतरिक्ष",capital:"राजधानियाँ",cities:"शहर",language:"भाषा",fully:"पूर्ण",10:"10",20:"20",question:"प्रश्न"},
};

const addedCategoryLabels: Record<StaticLocale, Record<"nonsense" | "brain" | "random" | "challenge", string>> = {
  ko:{nonsense:"넌센스·수수께끼",brain:"브레인 티저",random:"랜덤 퀴즈",challenge:"챌린지"},
  en:{nonsense:"Nonsense & Riddles",brain:"Brain Teasers",random:"Random Quiz",challenge:"Challenge"},
  ja:{nonsense:"ナンセンス・なぞなぞ",brain:"脳トレ",random:"ランダムクイズ",challenge:"チャレンジ"},
  zh:{nonsense:"趣味谜题",brain:"脑力挑战",random:"随机测验",challenge:"挑战"},
  es:{nonsense:"Acertijos y adivinanzas",brain:"Retos mentales",random:"Quiz aleatorio",challenge:"Desafío"},
  "pt-br":{nonsense:"Charadas e adivinhas",brain:"Desafios para o cérebro",random:"Quiz aleatório",challenge:"Desafio"},
  de:{nonsense:"Unsinn & Rätsel",brain:"Knobelaufgaben",random:"Zufallsquiz",challenge:"Herausforderung"},
  fr:{nonsense:"Devinettes et énigmes",brain:"Défis cérébraux",random:"Quiz aléatoire",challenge:"Défi"},
  vi:{nonsense:"Đố vui và câu đố",brain:"Thử thách trí não",random:"Câu đố ngẫu nhiên",challenge:"Thử thách"},
  id:{nonsense:"Teka-teki lucu",brain:"Asah otak",random:"Kuis acak",challenge:"Tantangan"},
  th:{nonsense:"ปริศนาชวนสนุก",brain:"ท้าทายสมอง",random:"ควิซสุ่ม",challenge:"ชาเลนจ์"},
  "zh-tw":{nonsense:"趣味謎題",brain:"腦力挑戰",random:"隨機測驗",challenge:"挑戰"},
  it:{nonsense:"Indovinelli e rompicapi",brain:"Sfide per la mente",random:"Quiz casuale",challenge:"Sfida"},
  nl:{nonsense:"Gekke raadsels",brain:"Breinbrekers",random:"Willekeurige quiz",challenge:"Uitdaging"},
  hi:{nonsense:"मज़ेदार पहेलियाँ",brain:"दिमाग़ी चुनौती",random:"रैंडम क्विज़",challenge:"चुनौती"},
};

export function quizCategoryName(locale: Locale, category: string): string {
  if (locale === "ms") return msCatalog.categoryLabels[category as keyof typeof msCatalog.categoryLabels] ?? msCatalog.ui.category[category as keyof typeof msCatalog.ui.category] ?? category;
  if (locale === "uk") return ukCatalog.categoryLabels[category as keyof typeof ukCatalog.categoryLabels] ?? category;
  if (locale === "bn") return bnCatalog.categoryLabels[category as keyof typeof bnCatalog.categoryLabels] ?? category;
  if (locale === "fil") return filCatalog.categoryLabels[category as keyof typeof filCatalog.categoryLabels] ?? category;
  if (locale === "ru") return ruCatalog.categoryLabels[category as keyof typeof ruCatalog.categoryLabels] ?? ruCatalog.ui.category[category as keyof typeof ruCatalog.ui.category] ?? category;
  if (locale === "tr") return trCatalog.categoryLabels[category as keyof typeof trCatalog.categoryLabels] ?? category;
  if (locale === "pl") return plCatalog.categoryLabels[category as keyof typeof plCatalog.categoryLabels] ?? category;
  if (category in addedCategoryLabels[locale]) return addedCategoryLabels[locale][category as keyof typeof addedCategoryLabels[StaticLocale]];
  return uiMessages[locale].category[category] ?? category;
}

export function quizTitle(locale: Locale, quiz: Pick<Quiz, "slug" | "title">): string {
  if (locale === "ms") return msCatalog.quizTitles[quiz.slug as keyof typeof msCatalog.quizTitles] ?? quiz.title;
  if (locale === "uk") return ukCatalog.quizTitles[quiz.slug as keyof typeof ukCatalog.quizTitles] ?? quiz.title;
  if (locale === "bn") return bnCatalog.quizTitles[quiz.slug as keyof typeof bnCatalog.quizTitles] ?? quiz.title;
  if (locale === "ru") return ruCatalog.quizTitles[quiz.slug as keyof typeof ruCatalog.quizTitles] ?? quiz.title;
  if (locale === "tr") return trCatalog.quizTitles[quiz.slug as keyof typeof trCatalog.quizTitles] ?? quiz.title;
  if (locale === "pl") return plCatalog.quizTitles[quiz.slug as keyof typeof plCatalog.quizTitles] ?? quiz.title;
  if (locale === "fil") return filCatalog.quizTitles[quiz.slug as keyof typeof filCatalog.quizTitles] ?? quiz.title;
  if (quiz.slug === "brain-teaser") return brainTeaserTitles[locale];
  if (locale === "en") return quiz.title;
  if (locale === "ko" && koreanTitles[quiz.slug]) return koreanTitles[quiz.slug];
  const localized = localizedTerms[locale];
  const replacements = new Map<string, string>(terms.map((term, index) => [term, localized[index] ?? term]));
  for (const [term, translation] of Object.entries(extraTerms[locale])) replacements.set(term, translation);
  for (const [term, translation] of Object.entries(bankTerms[locale])) replacements.set(term, translation);
  const words = quiz.slug.split("-").map((word) => replacements.get(word) ?? word);
  return ["ja", "zh", "zh-tw"].includes(locale) ? words.join("") : words.join(" ");
}

const brainTeaserTitles: Record<StaticLocale, string> = {
  ko: "뇌를 깨우는 퀴즈 - 브레인 티저", en: "Brain Teaser - Wake Up Your Brain",
  ja: "脳を目覚めさせるクイズ - ブレインティーザー", zh: "唤醒大脑的谜题 - 脑力挑战",
  es: "Despierta tu mente - Acertijos", "pt-br": "Desperte seu cérebro - Desafios de lógica",
  de: "Wecke dein Gehirn – Knobelquiz", fr: "Réveillez votre esprit – Casse-tête",
  vi: "Đánh thức trí não – Câu đố tư duy", id: "Asah Otak dengan Teka-teki",
  th: "ปลุกสมองด้วยเกมปริศนา", "zh-tw": "喚醒大腦的謎題－腦力挑戰",
  it: "Risveglia la mente – Rompicapi", nl: "Prikkel je brein – Breinbrekers",
  hi: "दिमाग़ जगाने वाली पहेलियाँ",
};

export function quizSeoCopy(locale: Locale, quiz: Quiz): { title: string; description: string } {
  if (locale === "ru") {
    if (quiz.slug === "brain-teaser") return { title: ruCatalog.brainSeo.title, description: ruCatalog.brainSeo.description };
    const title = quizTitle(locale, quiz);
    return { title: `${title} | woori.today`, description: ruCatalog.quizDescriptions[quiz.slug as keyof typeof ruCatalog.quizDescriptions] };
  }
  if (locale === "tr") {
    if (quiz.slug === "brain-teaser") return { title: trCatalog.brainSeo.title, description: trCatalog.brainSeo.description };
    const title = quizTitle(locale, quiz);
    return { title: `${title} | woori.today`, description: trCatalog.quizDescriptions[quiz.slug as keyof typeof trCatalog.quizDescriptions] };
  }
  if (locale === "pl") {
    const title = quizTitle(locale, quiz);
    return { title: quiz.slug === "brain-teaser" ? plCatalog.brainSeo.title : `${title} | woori.today`, description: quizDescription(locale, quiz, title) };
  }
  if (locale === "fil") {
    const title = quizTitle(locale, quiz);
    return { title: quiz.slug === "brain-teaser" ? filCatalog.brainSeo.title : `${title} | woori.today`, description: quizDescription(locale, quiz, title) };
  }
  if (locale === "bn") {
    const title = quizTitle(locale, quiz);
    return { title: quiz.slug === "brain-teaser" ? bnCatalog.brainSeo.title : `${title} | woori.today`, description: quizDescription(locale, quiz, title) };
  }
  if (locale === "uk") {
    const title = quizTitle(locale, quiz);
    return { title: `${title} | woori.today`, description: quizDescription(locale, quiz, title) };
  }
  if (locale === "ms") {
    const title = quizTitle(locale, quiz);
    return { title: quiz.slug === "brain-teaser" ? `${msCatalog.quizTitles["brain-teaser"]} | woori.today` : `${title} | woori.today`, description: quizDescription(locale, quiz, title) };
  }
  if (quiz.slug === "brain-teaser") {
    const descriptions: Record<StaticLocale, string> = {
      ko: "가볍게 풀면서 뇌를 깨워보세요. 논리, 패턴, 숫자, 기억력, 추리 문제로 구성된 브레인 티저 퀴즈를 무료로 즐길 수 있습니다.",
      en: "Wake up your brain with free logic, pattern, number, memory, and deduction puzzles in this brain teaser quiz.",
      ja: "論理、パターン、数字、記憶、推理の問題に挑戦して、気軽に頭をリフレッシュしましょう。",
      zh: "通过逻辑、规律、数字、记忆和推理题轻松唤醒大脑，免费享受脑力挑战。",
      es: "Despierta tu mente con retos gratuitos de lógica, patrones, números, memoria y deducción.",
      "pt-br": "Desperte a mente com desafios gratuitos de lógica, padrões, números, memória e dedução.",
      de: "Bringe dein Gehirn mit kostenlosen Rätseln zu Logik, Mustern, Zahlen, Gedächtnis und Schlussfolgern in Schwung.",
      fr: "Réveillez votre esprit avec des énigmes gratuites de logique, de suites, de nombres, de mémoire et de déduction.",
      vi: "Đánh thức trí não với các câu đố miễn phí về logic, quy luật, con số, trí nhớ và suy luận.",
      id: "Asah otak dengan teka-teki gratis tentang logika, pola, angka, ingatan, dan penalaran.",
      th: "ปลุกสมองด้วยปริศนาฟรีเกี่ยวกับตรรกะ รูปแบบ ตัวเลข ความจำ และการใช้เหตุผล",
      "zh-tw": "透過邏輯、規律、數字、記憶與推理題輕鬆喚醒大腦，免費享受腦力挑戰。",
      it: "Risveglia la mente con rompicapi gratuiti di logica, schemi, numeri, memoria e deduzione.",
      nl: "Prikkel je brein met gratis puzzels over logica, patronen, getallen, geheugen en redeneren.",
      hi: "तर्क, पैटर्न, संख्या, स्मृति और अनुमान वाली मुफ़्त पहेलियों से अपने दिमाग़ को सक्रिय करें।",
    };
    return { title: `${brainTeaserTitles[locale]} | woori.today`, description: descriptions[locale] };
  }
  const title = quizTitle(locale, quiz);
  return { title: `${title} | woori.today`, description: quizDescription(locale, quiz, title) };
}

export function quizSummary(locale: Locale, title: string): string {
  return uiMessages[locale].quizSummary(title);
}

const mathPromptCopy: Record<StaticLocale, { findX: string; decimal: string }> = {
  ko:{findX:"x의 값을 구하세요.",decimal:"소수로"},en:{findX:"Find x.",decimal:"decimal"},ja:{findX:"xの値を求めましょう。",decimal:"小数で"},zh:{findX:"求 x 的值。",decimal:"小数"},es:{findX:"Calcula el valor de x.",decimal:"decimal"},"pt-br":{findX:"Encontre o valor de x.",decimal:"decimal"},de:{findX:"Berechne x.",decimal:"Dezimalzahl"},fr:{findX:"Calculez la valeur de x.",decimal:"décimal"},vi:{findX:"Hãy tìm giá trị của x.",decimal:"số thập phân"},id:{findX:"Tentukan nilai x.",decimal:"desimal"},th:{findX:"หาค่าของ x",decimal:"ทศนิยม"},"zh-tw":{findX:"求出 x 的值。",decimal:"小數"},it:{findX:"Trova il valore di x.",decimal:"decimale"},nl:{findX:"Bereken de waarde van x.",decimal:"decimaal"},hi:{findX:"x का मान ज्ञात करें।",decimal:"दशमलव"}
};

export function localizeMathPrompt(locale: Locale, prompt: string): string {
  if (locale === "ms") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `${percentage[1]}% daripada ${percentage[2]} ialah berapa?`;
    return prompt.replace("What is x?", "Cari nilai x.").replace("Find x.", "Cari x.").replace("(decimal)", "(perpuluhan)");
  }
  if (locale === "uk") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Скільки становить ${percentage[1]}% від ${percentage[2]}?`;
    return prompt.replace("What is x?", "Знайдіть значення x.").replace("Find x.", "Знайдіть x.").replace("(decimal)", "(десяткове число)");
  }
  if (locale === "bn") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `${percentage[2]}-এর ${percentage[1]}% কত?`;
    return prompt.replace("What is x?", "x-এর মান কত?").replace("Find x.", "x-এর মান বের করুন।").replace("(decimal)", "(দশমিক সংখ্যা)");
  }
  if (locale === "fil") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Magkano ang ${percentage[1]}% ng ${percentage[2]}?`;
    return prompt.replace("What is x?", "Ano ang halaga ng x?").replace("Find x.", "Hanapin ang halaga ng x.").replace("(decimal)", "(decimal na numero)");
  }
  if (locale === "tr") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `${percentage[2]} sayısının %${percentage[1]}'i kaçtır?`;
    return prompt.replace("What is x?", "x değerini bulun.").replace("(decimal)", "(ondalık)");
  }
  if (locale === "ru") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Сколько составляет ${percentage[1]}% от ${percentage[2]}?`;
    return prompt.replace("What is x?", "Найдите x.").replace("(decimal)", "(десятичная дробь)");
  }
  if (locale === "hi") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `${percentage[2]} का ${percentage[1]}% कितना है?`;
    return prompt.replace("What is x?", "x का मान क्या है?").replace("(decimal)", "(दशमलव)");
  }
  if (locale === "nl") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Hoeveel is ${percentage[1]}% van ${percentage[2]}?`;
    return prompt.replace("What is x?", "Wat is de waarde van x?").replace("(decimal)", "(decimaal)");
  }
  if (locale === "it") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Quanto fa il ${percentage[1]}% di ${percentage[2]}?`;
    return prompt.replace("What is x?", "Qual è il valore di x?").replace("(decimal)", "(decimale)");
  }
  if (locale === "th") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `${percentage[2]} มีค่า ${percentage[1]}% เท่ากับเท่าไร?`;
    return prompt.replace("What is x?", "จงหาค่าของ x").replace("(decimal)", "(ทศนิยม)");
  }
  if (locale === "id") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Berapa ${percentage[1]}% dari ${percentage[2]}?`;
    return prompt.replace("What is x?", "Tentukan nilai x.").replace("(decimal)", "(desimal)");
  }
  if (locale === "vi") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `${percentage[1]}% của ${percentage[2]} bằng bao nhiêu?`;
    return prompt.replace("What is x?", "Tìm giá trị của x.").replace("(decimal)", "(số thập phân)");
  }
  if (locale === "fr") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Combien font ${percentage[1]} % de ${percentage[2]} ?`;
    return prompt.replace("What is x?", "Calculez la valeur de x.").replace("(decimal)", "(décimal)");
  }
  if (locale === "de") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Wie viel sind ${percentage[1]}% von ${percentage[2]}?`;
    return prompt.replace("What is x?", "Wie lautet der Wert von x?").replace("(decimal)", "(Dezimalzahl)");
  }
  if (locale === "pt-br") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Quanto é ${percentage[1]}% de ${percentage[2]}?`;
    return prompt.replace("What is x?", "Qual é o valor de x?").replace("(decimal)", "(decimal)");
  }
  if (locale === "es") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `¿Cuánto es el ${percentage[1]}% de ${percentage[2]}?`;
    return prompt.replace("What is x?", "¿Cuál es el valor de x?").replace("(decimal)", "(decimal)");
  }
  if (locale === "zh" || locale === "zh-tw") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `${percentage[2]} 的 ${percentage[1]}% 是多少？`;
    const decimal = locale === "zh-tw" ? "小數" : "小数";
    return prompt.replace("What is x?", "求 x 的值。").replace("(decimal)", `(${decimal})`);
  }
  if (locale === "ja") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `${percentage[2]} の ${percentage[1]}% はいくつですか？`;
    return prompt.replace("What is x?", "x の値を求めてください。").replace("(decimal)", "(小数)");
  }
  if (locale === "ko") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `${percentage[2]}의 ${percentage[1]}%는 얼마인가요?`;
  }
  if (locale === "pl") {
    const percentage = prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
    if (percentage) return `Ile wynosi ${percentage[1]}% z ${percentage[2]}?`;
    return prompt.replace("What is x?", "Rozwi\u0105\u017c r\u00f3wnanie dla x").replace("(decimal)", "(liczba dziesi\u0119tna)");
  }
  return prompt.replace("What is x?", mathPromptCopy[locale].findX).replace("(decimal)", `(${mathPromptCopy[locale].decimal})`);
}

export function hasQuizTermTranslations(locale: Locale, slugs: readonly string[]): boolean {
  if (locale === "ms") return slugs.every((slug) => Object.hasOwn(msCatalog.quizTitles, slug));
  if (locale === "bn") return slugs.every((slug) => Object.hasOwn(bnCatalog.quizTitles, slug));
  if (locale === "uk") return slugs.every((slug) => Object.hasOwn(ukCatalog.quizTitles, slug));
  if (locale === "ru") {
    return slugs.every((slug) => Object.hasOwn(ruCatalog.quizTitles, slug));
  }
  if (locale === "tr") {
    return slugs.every((slug) => Object.hasOwn(trCatalog.quizTitles, slug));
  }
  if (locale === "pl") {
    return slugs.every((slug) => Object.hasOwn(plCatalog.quizTitles, slug));
  }
  if (locale === "fil") {
    return slugs.every((slug) => Object.hasOwn(filCatalog.quizTitles, slug));
  }
  const translated = new Set<string>([...terms, ...Object.keys(extraTerms[locale]), ...Object.keys(bankTerms[locale])]);
  const localized = localizedTerms[locale];
  return localized.length === terms.length && slugs.every((slug) => slug.split("-").every((word) => translated.has(word)));
}

export function missingQuizTitleWords(slugs: readonly string[]): string[] {
  const translated = new Set<string>([...terms, ...Object.keys(extraTerms.en), ...Object.keys(bankTerms.en)]);
  return [...new Set(slugs.flatMap((slug) => slug.split("-").filter((word) => !translated.has(word))))];
}
