import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import type { Quiz } from "@/lib/registry";
import { categoryDescription, quizDescription, serviceGuide } from "@/lib/content-copy";
import { quizTitle } from "@/lib/quiz-copy";
import { uiMessages } from "@/lib/i18n";
import { learningHint } from "@/lib/learning-hints";

const currentInformationNote: Record<Locale, string> = {
  ko: "수도·통화·국경·기술 표준처럼 바뀔 수 있는 정보는 문제에 표시된 기준이나 해설의 출처와 날짜를 함께 확인하세요. 퀴즈는 학습용이며 최신 공식 자료를 대신하지 않습니다.",
  en: "Some facts can change, including capitals, currencies, borders, and technical standards. Check any date or source named in an explanation; this quiz is for learning and does not replace current official references.",
  ja: "首都・通貨・国境・技術規格などは変わることがあります。解説に基準日や出典が示されている場合は併せて確認してください。このクイズは学習用で、最新の公式情報に代わるものではありません。",
  zh: "首都、货币、边界和技术标准等信息可能发生变化。请留意解析中注明的日期或来源；本测验用于学习，不能替代最新的官方资料。",
  es: "Algunos datos pueden cambiar, como las capitales, las monedas, las fronteras y los estándares técnicos. Consulta la fecha o la fuente indicada en la explicación; este cuestionario es educativo y no sustituye las referencias oficiales actuales.",
  "pt-br": "Alguns dados podem mudar, como capitais, moedas, fronteiras e padrões técnicos. Confira a data ou a fonte citada na explicação; este quiz é educativo e não substitui referências oficiais atualizadas.",
  de: "Manche Angaben können sich ändern, etwa Hauptstädte, Währungen, Grenzen und technische Standards. Achte auf Datum und Quelle in einer Erklärung. Dieses Quiz dient dem Lernen und ersetzt keine aktuellen offiziellen Angaben.",
  fr: "Certaines informations peuvent changer, notamment les capitales, les monnaies, les frontières et les normes techniques. Vérifiez la date ou la source indiquée dans une explication ; ce quiz est pédagogique et ne remplace pas les références officielles à jour.",
  vi: "Một số thông tin có thể thay đổi, chẳng hạn thủ đô, tiền tệ, biên giới và tiêu chuẩn kỹ thuật. Hãy xem ngày hoặc nguồn được nêu trong phần giải thích; bài trắc nghiệm này phục vụ học tập và không thay thế tài liệu chính thức mới nhất.",
  id: "Beberapa fakta dapat berubah, termasuk ibu kota, mata uang, perbatasan, dan standar teknis. Periksa tanggal atau sumber yang disebutkan dalam penjelasan; kuis ini untuk belajar dan bukan pengganti rujukan resmi terbaru.",
  th: "ข้อมูลบางอย่างอาจเปลี่ยนแปลงได้ เช่น เมืองหลวง สกุลเงิน พรมแดน และมาตรฐานทางเทคนิค โปรดตรวจสอบวันที่หรือแหล่งที่มาที่ระบุในคำอธิบาย แบบทดสอบนี้มีไว้เพื่อการเรียนรู้และไม่ใช้แทนข้อมูลทางการฉบับปัจจุบัน",
  "zh-tw": "首都、貨幣、邊界與技術標準等資訊可能改變。請留意解析中標示的日期或來源；本測驗供學習使用，不能取代最新官方資料。",
  it: "Alcuni dati possono cambiare, come capitali, valute, confini e standard tecnici. Controlla la data o la fonte indicata nella spiegazione; questo quiz è didattico e non sostituisce i riferimenti ufficiali aggiornati.",
  nl: "Sommige gegevens kunnen veranderen, zoals hoofdsteden, valuta, grenzen en technische standaarden. Controleer de datum of bron die bij een uitleg staat. Deze quiz is bedoeld om te leren en vervangt geen actuele officiële bronnen.",
  hi: "कुछ तथ्य बदल सकते हैं, जैसे राजधानियाँ, मुद्राएँ, सीमाएँ और तकनीकी मानक। व्याख्या में दी गई तारीख या स्रोत देखें; यह क्विज़ सीखने के लिए है और नवीनतम आधिकारिक जानकारी का विकल्प नहीं है।",
  ru: "Некоторые сведения могут меняться: например, столицы, валюты, границы и технические стандарты. Проверяйте дату и источник, указанные в пояснении. Этот тест предназначен для обучения и не заменяет актуальные официальные источники.",
  tr: "Başkentler, para birimleri, sınırlar ve teknik standartlar gibi bazı bilgiler değişebilir. Açıklamada belirtilen tarih veya kaynağı kontrol edin; bu test öğrenme amaçlıdır ve güncel resmî kaynakların yerini tutmaz.",
  pl: "Niektóre informacje mogą się zmieniać, na przykład stolice, waluty, granice i standardy techniczne. Sprawdź datę lub źródło podane w wyjaśnieniu. Ten quiz służy do nauki i nie zastępuje aktualnych oficjalnych źródeł.",
  fil: "Maaaring magbago ang ilang impormasyon, gaya ng mga kabisera, pera, hangganan, at teknikal na pamantayan. Tingnan ang petsa o sangguniang binanggit sa paliwanag; para sa pag-aaral ang pagsusulit na ito at hindi kapalit ng pinakabagong opisyal na sanggunian.",
  bn: "রাজধানী, মুদ্রা, সীমানা ও প্রযুক্তিগত মানের মতো কিছু তথ্য বদলাতে পারে। ব্যাখ্যায় উল্লেখ করা তারিখ বা উৎস দেখে নিন; এই কুইজ শেখার জন্য, হালনাগাদ সরকারি তথ্যের বিকল্প নয়।",
  uk: "Деякі відомості можуть змінюватися, зокрема столиці, валюти, кордони й технічні стандарти. Перевіряйте дату або джерело, зазначені в поясненні. Ця вікторина призначена для навчання й не замінює актуальні офіційні джерела.",
  ms: "Sesetengah maklumat boleh berubah, termasuk ibu negara, mata wang, sempadan dan piawaian teknikal. Semak tarikh atau sumber yang dinyatakan dalam penerangan; kuiz ini untuk pembelajaran dan bukan pengganti rujukan rasmi terkini.",
  sv: "Vissa uppgifter kan ändras, till exempel huvudstäder, valutor, gränser och tekniska standarder. Kontrollera datum och källa som anges i en förklaring. Quizet är till för lärande och ersätter inte aktuella officiella källor.",
  cs: "Některé údaje se mohou měnit, například hlavní města, měny, hranice a technické normy. Ověřte datum nebo zdroj uvedený ve vysvětlení. Kvíz slouží k učení a nenahrazuje aktuální oficiální zdroje.",
  ro: "Unele informații se pot schimba, precum capitalele, monedele, granițele și standardele tehnice. Verifică data sau sursa menționată în explicație; acest quiz are scop educativ și nu înlocuiește sursele oficiale actualizate.",
  el: "Ορισμένα στοιχεία μπορεί να αλλάξουν, όπως οι πρωτεύουσες, τα νομίσματα, τα σύνορα και τα τεχνικά πρότυπα. Ελέγξτε την ημερομηνία ή την πηγή που αναφέρεται στην εξήγηση· το κουίζ είναι εκπαιδευτικό και δεν αντικαθιστά τις επίσημες ενημερωμένες πηγές.",
};

export function QuizLearningCards({ locale, quiz }: { locale: Locale; quiz: Quiz }) {
  const ui = uiMessages[locale];
  const guide = serviceGuide[locale];
  const title = quizTitle(locale, quiz);
  const quizIntro = quizDescription(locale, quiz, title);
  const background = categoryDescription(locale, quiz.category);
  const studyPoint = learningHint(locale, quiz.category);
  const howTo = ui.howToDescription;

  const cards: { title: string; content: ReactNode }[] = [
    { title: ui.aboutQuiz, content: <p>{quizIntro}</p> },
    { title: ui.category[quiz.category] ?? guide.categories, content: <p>{background}</p> },
    { title: guide.focus, content: <p>{studyPoint}</p> },
    { title: ui.howToPlay, content: <p>{howTo}</p> },
    { title: ui.guidelines, content: <p>{currentInformationNote[locale]}</p> },
  ];

  return <section className="learning-cards" aria-label={ui.aboutQuiz}>
    {cards.map((card) => <article className="learning-card" key={card.title}>
      <h2>{card.title}</h2>
      <div className="learning-card-copy">{card.content}</div>
    </article>)}
  </section>;
}
