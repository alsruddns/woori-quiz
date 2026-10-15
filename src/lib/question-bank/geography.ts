import type { QuizQuestion } from "./types";

const capitals: Array<[string, string]> = [
  ["Belgium","Brussels"],["Egypt","Cairo"],["Canada","Ottawa"],["Australia","Canberra"],["Brazil","Brasília"],["Argentina","Buenos Aires"],["Chile","Santiago"],["Peru","Lima"],["Mexico","Mexico City"],["Cuba","Havana"],
  ["France","Paris"],["Germany","Berlin"],["Denmark","Copenhagen"],["Spain","Madrid"],["Portugal","Lisbon"],["Norway","Oslo"],["Sweden","Stockholm"],["Finland","Helsinki"],["Poland","Warsaw"],["Greece","Athens"],
  ["Kenya","Nairobi"],["Ethiopia","Addis Ababa"],["Ghana","Accra"],["Morocco","Rabat"],["Nigeria","Abuja"],["Thailand","Bangkok"],["Vietnam","Hanoi"],["Indonesia","Jakarta"],["Nepal","Kathmandu"],["Mongolia","Ulaanbaatar"],
  ["New Zealand","Wellington"],["Ireland","Dublin"],["Austria","Vienna"],["Czechia","Prague"],["Hungary","Budapest"],["Romania","Bucharest"],["Iceland","Reykjavík"],["Turkey","Ankara"],["Pakistan","Islamabad"],["Bangladesh","Dhaka"],
];
const options = capitals.map(([, capital]) => capital);
export const geographyQuestions: QuizQuestion[] = capitals.map(([country, capital], i) => ({
  id: `geography-x-capital-${i + 1}`, category: "geography", difficulty: i < 12 ? "easy" : i < 30 ? "medium" : "hard",
  question: `What is the capital of ${country}?`, options: [capital, ...options.filter((x) => x !== capital).slice(i % (options.length - 3), i % (options.length - 3) + 3)], answer: 0,
  explanation: `${capital} is the capital city of ${country}.`, tags: ["geography", "capitals", country.toLowerCase()],
}));

const features: Array<[string, string, string]> = [
  ["The Sahara Desert","Africa","It is a vast hot desert in northern Africa."],["The Andes","South America","The Andes run along the western edge of South America."],["The Alps","Europe","The Alps are a major mountain range in central Europe."],["The Great Barrier Reef","Australia","The reef lies off the northeastern coast of Australia."],["The Amazon River","South America","The Amazon flows through northern South America."],
  ["The Danube River","Europe","The Danube flows through central and southeastern Europe."],["The Nile River","Africa","The Nile flows north through northeastern Africa."],["The Gobi Desert","Asia","The Gobi spans parts of Mongolia and northern China."],["Lake Baikal","Asia","Lake Baikal is in Siberia, Russia."],["The Rocky Mountains","North America","The Rockies extend through western North America."],
];
const continents = ["Africa","Asia","Europe","North America","South America","Australia","Antarctica"];
export const geographyFeatureQuestions: QuizQuestion[] = features.map(([feature, answer, explanation], i) => ({
  id: `geography-x-feature-${i + 1}`, category: "geography", difficulty: i < 4 ? "easy" : "medium",
  question: `On which continent is ${feature} primarily located?`, options: [answer, ...continents.filter((x) => x !== answer).slice(i % 3, i % 3 + 3)], answer: 0, explanation,
  tags: ["geography", "landforms"],
}));
