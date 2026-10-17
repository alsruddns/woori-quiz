import type { Difficulty } from "../registry";
import type { Locale } from "../i18n";
import type { QuestionLocaleCopy, QuizQuestion } from "./types";

export type { QuestionLocaleCopy, QuizQuestion } from "./types";

// Curated evergreen questions. Keep IDs stable so a run can avoid repeats.
const rows: Array<[string, Difficulty, string, string[], number, string]> = [
  ["general","easy","Which planet is known as the Red Planet?",["Venus","Mars","Jupiter","Mercury"],1,"Iron-rich dust gives Mars its reddish appearance."],
  ["general","easy","How many sides does a hexagon have?",["Five","Six","Seven","Eight"],1,"A hexagon has six sides."],
  ["general","hard","Which instrument measures air pressure?",["Thermometer","Barometer","Hygrometer","Compass"],1,"A barometer measures atmospheric pressure."],
  ["general","hard","What is the hardest naturally occurring mineral on the Mohs scale?",["Quartz","Topaz","Diamond","Corundum"],2,"Diamond is rated 10 on the Mohs hardness scale."],
  ["general","easy","How many minutes are in two hours?",["100","110","120","130"],2,"Two hours contain 120 minutes."],
  ["general","medium","Which gas makes up most of Earth's atmosphere?",["Oxygen","Nitrogen","Carbon dioxide","Argon"],1,"Nitrogen makes up about 78% of dry air."],
  ["general","easy","Which ocean is the largest?",["Atlantic","Indian","Arctic","Pacific"],3,"The Pacific is the largest ocean by area."],
  ["general","medium","What is the freezing point of water at standard pressure?",["0 °C","10 °C","32 °C","100 °C"],0,"Pure water freezes at 0 °C (32 °F) at standard pressure."],
  ["general","easy","Which shape has three sides?",["Square","Triangle","Pentagon","Circle"],1,"A triangle has three sides."],
  ["general","medium","Which metal is liquid at ordinary room temperature?",["Iron","Copper","Mercury","Aluminium"],2,"Mercury is liquid at typical room temperature."],
  ["science","easy","What is the chemical symbol for water?",["CO₂","H₂O","O₂","NaCl"],1,"A water molecule contains two hydrogen atoms and one oxygen atom."],
  ["science","easy","Which part of a plant usually absorbs water from soil?",["Flower","Leaf","Root","Fruit"],2,"Roots absorb water and minerals from soil."],
  ["science","medium","What force keeps planets in orbit around the Sun?",["Friction","Gravity","Magnetism","Buoyancy"],1,"Gravity provides the centripetal acceleration for planetary orbits."],
  ["science","medium","Which particle has a negative electric charge?",["Proton","Neutron","Electron","Photon"],2,"Electrons carry a negative elementary charge."],
  ["science","easy","At sea level, water boils at approximately what temperature?",["50 °C","75 °C","100 °C","150 °C"],2,"At standard atmospheric pressure, water boils at 100 °C."],
  ["science","medium","Which organelle is known for producing most cellular ATP?",["Nucleus","Mitochondrion","Ribosome","Golgi apparatus"],1,"Mitochondria produce much of a eukaryotic cell's ATP through cellular respiration."],
  ["science","easy","What gas do plants take in for photosynthesis?",["Oxygen","Carbon dioxide","Helium","Hydrogen"],1,"Plants use carbon dioxide and water to build sugars during photosynthesis."],
  ["science","medium","What is the approximate speed of light in a vacuum?",["30,000 km/s","150,000 km/s","300,000 km/s","3,000,000 km/s"],2,"Light travels at about 300,000 kilometers per second in vacuum."],
  ["science","medium","Which blood cells primarily carry oxygen?",["Red blood cells","Platelets","White blood cells","Stem cells"],0,"Hemoglobin in red blood cells binds and transports oxygen."],
  ["science","easy","What is the center of an atom called?",["Orbit","Nucleus","Shell","Bond"],1,"An atom's nucleus contains protons and neutrons."],
  ["geography","easy","What is the capital of Japan?",["Osaka","Kyoto","Tokyo","Sapporo"],2,"Tokyo is Japan's capital."],
  ["geography","easy","Which country is home to the city of Cairo?",["Morocco","Egypt","Jordan","Sudan"],1,"Cairo is the capital of Egypt."],
  ["geography","medium","Which is the largest continent by area?",["Africa","Asia","Europe","North America"],1,"Asia is the largest continent by land area."],
  ["geography","medium","The Andes Mountains are primarily in which continent?",["Africa","Asia","South America","Europe"],2,"The Andes extend along the western side of South America."],
  ["geography","easy","Which country has the maple leaf on its national flag?",["Canada","Austria","Denmark","Peru"],0,"The maple leaf is the central emblem on Canada's flag."],
  ["geography","medium","Which river flows through Paris?",["Rhine","Seine","Danube","Thames"],1,"The Seine flows through Paris."],
  ["geography","easy","Which is the smallest continent by area?",["Europe","Antarctica","Australia","South America"],2,"Australia is the smallest continent by area."],
  ["geography","medium","Mount Kilimanjaro is in which country?",["Kenya","Tanzania","Uganda","Ethiopia"],1,"Kilimanjaro is in northeastern Tanzania."],
  ["geography","medium","Which ocean lies east of Africa?",["Pacific","Atlantic","Indian","Arctic"],2,"The Indian Ocean borders Africa to the east."],
  ["geography","easy","What is the capital of Italy?",["Milan","Venice","Rome","Naples"],2,"Rome is Italy's capital."],
  ["history","easy","The ancient Olympic Games began in which region?",["Greece","Egypt","Persia","Rome"],0,"The ancient Olympic Games were held at Olympia in Greece."],
  ["history","medium","Which wall fell in 1989, becoming a symbol of German reunification?",["Hadrian's Wall","Berlin Wall","Great Wall","Western Wall"],1,"The Berlin Wall opened in November 1989."],
  ["history","medium","The printing press associated with movable metal type in Europe is linked to whom?",["Galileo","Johannes Gutenberg","Isaac Newton","Marco Polo"],1,"Gutenberg's press helped spread printing in Europe in the 15th century."],
  ["history","easy","Which civilization built the pyramids at Giza?",["Romans","Ancient Egyptians","Aztecs","Minoans"],1,"The Giza pyramids were built in ancient Egypt."],
  ["history","medium","In which year did the French Revolution begin?",["1492","1776","1789","1815"],2,"The French Revolution began in 1789."],
  ["history","medium","The Renaissance began in which present-day country?",["Italy","Germany","Spain","England"],0,"The Renaissance began in Italian city-states before spreading across Europe."],
  ["history","easy","Who was the first person to walk on the Moon?",["Buzz Aldrin","Yuri Gagarin","Neil Armstrong","John Glenn"],2,"Neil Armstrong stepped onto the Moon in 1969 during Apollo 11."],
  ["history","medium","Which empire built the extensive road network centered on Rome?",["Mongol Empire","Roman Empire","Mali Empire","Inca Empire"],1,"Roman roads connected territories across the Roman Empire."],
  ["history","medium","The Magna Carta was sealed in which year?",["1066","1215","1492","1607"],1,"King John sealed the Magna Carta in 1215."],
  ["history","easy","Which ship carried the Pilgrims to North America in 1620?",["Santa Maria","Mayflower","Endeavour","Beagle"],1,"The Mayflower carried the English Separatists in 1620."],
  ["math","easy","What is 8 × 7?",["54","56","58","64"],1,"Eight groups of seven equal 56."],
  ["math","easy","What is 144 ÷ 12?",["10","11","12","14"],2,"144 divided by 12 is 12."],
  ["math","medium","Solve: 3x + 5 = 20.",["3","5","7","15"],1,"Subtract 5 to get 3x = 15, then divide by 3: x = 5."],
  ["math","medium","What is 25% of 80?",["10","15","20","25"],2,"25% is one quarter; 80 divided by 4 is 20."],
  ["math","easy","What is 3/4 written as a decimal?",["0.25","0.5","0.75","1.25"],2,"Three divided by four equals 0.75."],
  ["math","medium","What number comes next: 2, 6, 12, 20, 30, …?",["36","40","42","44"],2,"The differences are 4, 6, 8, 10, then 12; the next term is 42."],
  ["math","medium","A fair six-sided die is rolled. What is the probability of rolling an even number?",["1/6","1/3","1/2","2/3"],2,"Three of the six outcomes (2, 4, 6) are even, so the probability is 1/2."],
  ["math","hard","A rectangle has perimeter 30 and length 9. What is its width?",["5","6","7","12"],1,"2(9 + w) = 30, so w = 6."],
  ["math","medium","What is the least common multiple of 6 and 8?",["12","18","24","48"],2,"24 is the smallest positive number divisible by both 6 and 8."],
  ["math","hard","If 5 workers finish a job in 12 days at the same rate, how many worker-days is the job?",["17","30","60","72"],2,"5 workers × 12 days = 60 worker-days."],
  ["language","easy","Which word is a synonym of “brief”?",["Short","Distant","Heavy","Quiet"],0,"Brief means short in duration or length."],
  ["language","medium","Which punctuation mark ends a direct question?",["Comma","Colon","Question mark","Semicolon"],2,"A direct question ends with a question mark."],
  ["language","easy","What is the plural of “child”?",["Childs","Children","Childes","Childrens"],1,"Children is the conventional plural form of child."],
  ["language","medium","Which sentence uses “their” correctly?",["Their going home.","The team left their bags here.","Put it over their.","Their is a book."],1,"Their is a possessive determiner; it shows the bags belong to the team."],
  ["language","medium","Which word is spelled correctly?",["Separate","Seperate","Seperete","Sepparate"],0,"Separate is spelled with “par” in the middle."],
  ["language","easy","What is the opposite of “ancient”?",["Old","Historic","Modern","Early"],2,"Modern is an antonym of ancient."],
  ["language","medium","In “She sang beautifully,” which word is the adverb?",["She","sang","beautifully","none"],2,"Beautifully modifies the verb sang and is an adverb."],
  ["language","medium","Which is a complete sentence?",["Because it was raining.","The bright red umbrella.","They walked home.","After the long trip."],2,"“They walked home” has a subject and a complete predicate."],
  ["language","easy","Which word means “to look quickly”?",["Glance","Stare","Watch","Observe"],0,"A glance is a brief or quick look."],
  ["language","medium","Which pair are homophones in common English pronunciation?",["Flower / flour","Book / boot","Cat / cut","Seat / set"],0,"Flower and flour are pronounced alike in common English."],
  ["technology","easy","What does CPU stand for?",["Central Processing Unit","Computer Power Utility","Core Program Upload","Central Print Unit"],0,"CPU stands for Central Processing Unit."],
  ["technology","medium","Which language runs natively in web browsers?",["Java","C","JavaScript","Swift"],2,"Browsers implement JavaScript engines to run JavaScript."],
  ["technology","medium","What does HTTP status code 404 commonly mean?",["Success","Not found","Unauthorized","Server unavailable"],1,"HTTP 404 indicates that the requested resource was not found."],
  ["technology","easy","Which device forwards packets between different networks?",["Router","Keyboard","Monitor","Printer"],0,"A router forwards packets between networks."],
  ["technology","medium","In Git, what does a commit represent?",["A saved snapshot of project changes","A network cable","A programming language","A file compression format"],0,"A Git commit records a snapshot and its metadata in repository history."],
  ["technology","medium","Which is a relational database query language?",["SQL","HTML","CSS","PNG"],0,"SQL is used to query and manage relational databases."],
  ["technology","easy","What does URL stand for?",["Uniform Resource Locator","Universal Routing Link","Unified Record List","User Reference Language"],0,"URL stands for Uniform Resource Locator."],
  ["technology","medium","Which number system uses only 0 and 1?",["Decimal","Binary","Octal","Roman"],1,"Binary is base 2 and uses the digits 0 and 1."],
  ["technology","medium","What is the main role of DNS?",["Translate domain names to network records such as IP addresses","Encrypt every file","Store passwords in a browser","Compile source code"],0,"DNS resolves domain names to records used to locate internet services."],
  ["technology","easy","Which file extension is commonly used for a PNG image?",[".png",".mp3",".csv",".exe"],0,"PNG image files commonly use the .png extension."],
  ["brain","easy","What comes next in the sequence 1, 4, 9, 16, …?",["20","24","25","36"],2,"These are consecutive square numbers: 1², 2², 3², 4²; next is 5² = 25."],
  ["brain","medium","A clock shows 3:15. What is the smaller angle between its hands?",["0°","7.5°","15°","30°"],1,"At 3:15 the minute hand is at 90° and the hour hand at 97.5°, a 7.5° gap."],
  ["brain","easy","If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?",["Yes","No","Cannot be determined","Only some"],0,"By transitivity, every Bloop belongs to the set of Razzies and therefore Lazzies."],
  ["brain","medium","A pattern repeats: circle, square, triangle, circle, square, … What comes next?",["Circle","Square","Triangle","Pentagon"],2,"The three-shape sequence repeats, so triangle is next."],
  ["brain","medium","You overtake the runner in second place. What place are you in?",["First","Second","Third","Fourth"],1,"Passing the second-place runner puts you in second place."],
  ["brain","easy","Which number does not belong: 2, 3, 5, 9, 11?",["2","3","9","11"],2,"9 is composite; the others are prime numbers."],
  ["brain","medium","A farmer has 17 sheep. All but 9 leave. How many remain?",["8","9","17","26"],1,"“All but 9” means 9 sheep remain."],
  ["brain","medium","If yesterday was Monday, what day is the day after tomorrow?",["Tuesday","Wednesday","Thursday","Friday"],2,"Yesterday Monday means today Tuesday; tomorrow Wednesday and the day after tomorrow Thursday."],
  ["brain","hard","Two fathers and two sons share three apples equally, one each. How is that possible?",["They cut each apple","There are three people: grandfather, father, son","One person gets none","There are four people"],1,"The middle person is both a son and a father, so the group has three people."],
  ["brain","medium","What is the next letter: A, C, F, J, O, …?",["S","T","U","V"],2,"Letter positions increase by 2, 3, 4, 5; next add 6 to O (15) to get U (21)."],
  ["nonsense","easy","What has many teeth but cannot bite?",["A comb","A shark","A zipper","A saw"],0,"A comb has teeth, but they are not used for biting."],
  ["nonsense","easy","What gets wetter as it dries?",["A towel","A cloud","A sponge","A river"],0,"A towel absorbs water while drying something else."],
  ["nonsense","medium","What has a neck but no head?",["A bottle","A person","A giraffe","A shirt"],0,"A bottle has a neck but no head."],
  ["nonsense","easy","What has hands but cannot clap?",["A clock","A pianist","A glove","A statue"],0,"A clock has hour and minute hands."],
  ["nonsense","medium","What can travel around the world while staying in one corner?",["A stamp","A compass","A cloud","A suitcase"],0,"A postage stamp stays in the corner of an envelope while it travels."],
  ["nonsense","easy","What has one eye but cannot see?",["A needle","A camera","A storm","A potato"],0,"The eye of a needle is the hole for thread."],
  ["nonsense","medium","What has keys but cannot open a lock?",["A piano","A locksmith","A map","A door"],0,"A piano has musical keys, not lock keys."],
  ["nonsense","easy","What has a face and two hands but no arms or legs?",["A clock","A doll","A painting","A glove"],0,"A clock face and hands are named by analogy with a person."],
  ["nonsense","medium","What goes up but never comes down?",["Your age","A balloon","Smoke","An elevator"],0,"Your age increases as time passes."],
  ["nonsense","easy","What has four legs but cannot walk?",["A table","A dog","A horse","A spider"],0,"A table has legs but cannot move by itself."],
];

const koQuestionCopy: Record<string, QuestionLocaleCopy> = {
  "What comes next in the sequence 1, 4, 9, 16, …?": { question:"수열 1, 4, 9, 16, …에서 다음 숫자는 무엇인가요?", options:["20","24","25","36"], explanation:"연속된 제곱수 1², 2², 3², 4²이므로 다음은 5²인 25입니다." },
  "A clock shows 3:15. What is the smaller angle between its hands?": { question:"시계가 3시 15분을 가리킬 때 두 바늘 사이의 작은 각도는 몇 도인가요?", options:["0°","7.5°","15°","30°"], explanation:"분침은 90°, 시침은 97.5°에 있으므로 차이는 7.5°입니다." },
  "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?": { question:"모든 블룹이 라지이고 모든 라지가 래지라면, 모든 블룹은 래지인가요?", options:["예","아니요","알 수 없음","일부만"], explanation:"블룹은 모두 라지에 포함되고 라지는 모두 래지에 포함되므로 그렇습니다." },
  "A pattern repeats: circle, square, triangle, circle, square, … What comes next?": { question:"원, 사각형, 삼각형이 반복됩니다. 원, 사각형 다음에는 무엇이 오나요?", options:["원","사각형","삼각형","오각형"], explanation:"세 도형이 반복되므로 다음은 삼각형입니다." },
  "You overtake the runner in second place. What place are you in?": { question:"2등으로 달리는 사람을 앞질렀습니다. 지금 몇 등인가요?", options:["1등","2등","3등","4등"], explanation:"2등인 사람을 앞지르면 2등이 됩니다." },
  "Which number does not belong: 2, 3, 5, 9, 11?": { question:"다음 숫자 중 성격이 다른 하나는 무엇인가요? 2, 3, 5, 9, 11", options:["2","3","9","11"], explanation:"9는 합성수이고 나머지는 소수입니다." },
  "A farmer has 17 sheep. All but 9 leave. How many remain?": { question:"양 17마리 중 9마리만 남기고 모두 떠났습니다. 몇 마리가 남았나요?", options:["8마리","9마리","17마리","26마리"], explanation:"‘9마리만 남기고’ 떠났으므로 9마리가 남습니다." },
  "If yesterday was Monday, what day is the day after tomorrow?": { question:"어제가 월요일이었다면 모레는 무슨 요일인가요?", options:["화요일","수요일","목요일","금요일"], explanation:"오늘은 화요일, 내일은 수요일이므로 모레는 목요일입니다." },
  "Two fathers and two sons share three apples equally, one each. How is that possible?": { question:"아버지 둘과 아들 둘이 사과 세 개를 하나씩 나눠 가졌습니다. 어떻게 가능할까요?", options:["사과를 잘랐다","세 사람: 할아버지, 아버지, 아들","한 명은 못 받았다","네 사람이다"], explanation:"가운데 사람은 아들이면서 동시에 아버지이므로 모두 세 사람입니다." },
  "What is the next letter: A, C, F, J, O, …?": { question:"다음 순서에서 이어질 알파벳은 무엇인가요? A, C, F, J, O, …", options:["S","T","U","V"], explanation:"위치가 2, 3, 4, 5씩 늘어나므로 다음에는 6을 더해 U가 됩니다." },
};

export const legacyQuestionBank: QuizQuestion[] = rows.map(([category, difficulty, question, options, answer, explanation], index) => ({
  id: `${category}-${String(index + 1).padStart(3, "0")}`,
  category, difficulty, question, options, answer, explanation, tags: [category],
  ...(koQuestionCopy[question] ? { localizations: { ko: koQuestionCopy[question] } } : {}),
}));

export function questionCopyForLocale(question: QuizQuestion, locale: Locale): QuestionLocaleCopy {
  return questionCopyResultForLocale(question, locale).value;
}

export type QuestionCopyResult = {
  value: QuestionLocaleCopy;
  sourceLocale: Locale;
  isFallback: boolean;
  questionIsFallback: boolean;
  optionFallbacks: boolean[];
  explanationIsFallback: boolean;
};

export function questionCopyResultForLocale(question: QuizQuestion, locale: Locale): QuestionCopyResult {
  const localized = question.localizations?.[locale];
  const value = localized ?? {
    question: question.question,
    options: question.options,
    explanation: question.explanation,
  };
  const questionIsFallback = locale !== "en" && value.question === question.question;
  const optionFallbacks = value.options.map((option, index) => locale !== "en" && option === question.options[index]);
  const explanationIsFallback = locale !== "en" && value.explanation === question.explanation;
  return {
    value,
    sourceLocale: questionIsFallback ? "en" : locale,
    isFallback: questionIsFallback || optionFallbacks.some(Boolean) || explanationIsFallback,
    questionIsFallback,
    optionFallbacks,
    explanationIsFallback,
  };
}

export type QuestionFilter = { category?: string; tag?: string; difficulty?: Difficulty; count: number; seed?: number; excludeIds?: string[] };

export function questionCategoryForQuiz(slug: string, fallback: string): string {
  if (slug === "random-quiz" || slug.startsWith("challenge-")) return "all";
  if (slug.includes("brain-teaser") || slug.includes("number-pattern") || slug.includes("logic-reasoning")) return "brain";
  if (slug.includes("nonsense") || slug.includes("riddle")) return "nonsense";
  if (slug.includes("math") || slug.includes("arithmetic") || slug.includes("probability")) return "math";
  if (slug.includes("history") || slug.includes("civilization")) return "history";
  if (slug.includes("science") || slug.includes("space") || slug.includes("biology")) return "science";
  if (slug.includes("geography") || slug.includes("capital") || slug.includes("country")) return "geography";
  if (slug.includes("language") || slug.includes("vocabulary")) return "language";
  if (slug.includes("it-") || slug.includes("programming")) return "technology";
  return fallback;
}

export function questionTagForQuiz(slug: string): string | undefined {
  if (slug === "daily-life-quiz") return "daily-life";
  if (slug === "space-quiz") return "astronomy";
  if (slug === "biology-knowledge-quiz") return "biology";
  if (slug === "capital-cities-quiz") return "capitals";
  if (slug === "world-geography") return "landforms";
  if (slug === "number-pattern-quiz") return "number-pattern";
  if (slug === "sequence-math-quiz") return "sequence";
  if (slug === "mental-arithmetic-test") return "arithmetic";
  if (slug === "programming-knowledge-quiz") return "programming";
  return undefined;
}

/** Deterministic Fisher-Yates when a seed is supplied; always returns unique questions. */
export function selectQuestions(pool: readonly QuizQuestion[], filter: QuestionFilter): QuizQuestion[] {
  const candidates = pool.filter((q) => (!filter.category || filter.category === "all" || q.category === filter.category || q.tags?.includes(filter.category))
    && (!filter.tag || q.tags?.includes(filter.tag))
    && (!filter.difficulty || q.difficulty === filter.difficulty)
    && !filter.excludeIds?.includes(q.id));
  let state = filter.seed ?? Math.floor(Math.random() * 0x7fffffff);
  const random = () => {
    if (filter.seed === undefined) return Math.random();
    state = (state * 48271) % 0x7fffffff;
    return state / 0x7fffffff;
  };
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, Math.max(0, filter.count)).map((question) => {
    const order = question.options.map((_, index) => index);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const localizations = question.localizations
      ? Object.fromEntries(Object.entries(question.localizations).map(([locale, copy]) => [locale, { ...copy, options: order.map((index) => copy.options[index]) }])) as QuizQuestion["localizations"]
      : undefined;
    return { ...question, options: order.map((index) => question.options[index]), answer: order.indexOf(question.answer), localizations };
  });
}

export function validateQuestionBank(pool: readonly QuizQuestion[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  pool.forEach((q) => {
    if (ids.has(q.id)) errors.push(`duplicate id: ${q.id}`);
    ids.add(q.id);
    if (!q.question.trim()) errors.push(`missing question: ${q.id}`);
    if (!["general", "nonsense", "math", "brain", "history", "science", "geography", "language", "technology"].includes(q.category)) errors.push(`invalid category: ${q.id}`);
    if (q.options.length < 2 || new Set(q.options).size !== q.options.length) errors.push(`invalid options: ${q.id}`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errors.push(`invalid answer index: ${q.id}`);
    if (!q.explanation.trim()) errors.push(`missing explanation: ${q.id}`);
    if (!["easy", "medium", "hard", "expert"].includes(q.difficulty)) errors.push(`invalid difficulty: ${q.id}`);
  });
  return errors;
}
