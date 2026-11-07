import type { Level } from "./types";
import type { Locale } from "./i18n/dictionaries";

/**
 * DEMO CONTENT ONLY.
 * These are fictional sample members and skills used while Supabase is not connected.
 * They are not real users, and they never carry ratings or reviews.
 */

export type Bi<T = string> = { ar: T; en: T };

export interface SampleCategory {
  slug: string;
  name: Bi;
}

export interface SampleMember {
  id: string;
  name: Bi;
  bio: Bi;
  interests: Bi<string[]>;
  availability: Bi;
}

export interface SampleListing {
  id: string;
  memberId: string;
  categorySlug: string;
  level: Level;
  title: Bi;
  description: Bi;
  outcomes: Bi<string[]>;
  wants: Bi<string[]>;
}

export const sampleCategories: SampleCategory[] = [
  { slug: "programming", name: { ar: "البرمجة والتقنية", en: "Programming & Technology" } },
  { slug: "languages", name: { ar: "اللغات", en: "Languages" } },
  { slug: "design", name: { ar: "التصميم والإبداع", en: "Design & Creativity" } },
  { slug: "business", name: { ar: "التسويق والأعمال", en: "Marketing & Business" } },
  { slug: "media", name: { ar: "التصوير والفيديو", en: "Photography & Video" } },
  { slug: "writing", name: { ar: "الكتابة والمحتوى", en: "Writing & Content" } },
  { slug: "personal", name: { ar: "التطوير الشخصي", en: "Personal Development" } },
];

export const sampleMembers: SampleMember[] = [
  {
    id: "demo-m1",
    name: { ar: "عمر عادل", en: "Omar Adel" },
    bio: {
      ar: "مطوّر واجهات ويب يحب تبسيط المفاهيم التقنية ومشاركتها مع المبتدئين.",
      en: "A front-end developer who enjoys simplifying technical concepts and sharing them with beginners.",
    },
    interests: { ar: ["تطوير الويب", "القراءة", "الألعاب الذهنية"], en: ["Web development", "Reading", "Puzzle games"] },
    availability: { ar: "مساءً، 3 أيام أسبوعيًا", en: "Evenings, 3 days a week" },
  },
  {
    id: "demo-m2",
    name: { ar: "نور خالد", en: "Nour Khaled" },
    bio: {
      ar: "مدرّبة محادثة إنجليزية، أؤمن بأن اللغة تُكتسب بالممارسة اليومية.",
      en: "An English conversation coach who believes language is learned through daily practice.",
    },
    interests: { ar: ["اللغات", "السفر", "البودكاست"], en: ["Languages", "Travel", "Podcasts"] },
    availability: { ar: "عطلة نهاية الأسبوع", en: "Weekends" },
  },
  {
    id: "demo-m3",
    name: { ar: "سلمى حسن", en: "Salma Hassan" },
    bio: {
      ar: "مصمّمة هويات بصرية، أحب العمل مع المشاريع الصغيرة وأصحاب الأفكار الجديدة.",
      en: "A brand identity designer who loves working with small projects and new ideas.",
    },
    interests: { ar: ["الهوية البصرية", "الرسم", "التصوير"], en: ["Brand identity", "Drawing", "Photography"] },
    availability: { ar: "صباحًا، يومان أسبوعيًا", en: "Mornings, 2 days a week" },
  },
  {
    id: "demo-m4",
    name: { ar: "كريم سمير", en: "Karim Samir" },
    bio: {
      ar: "مصوّر فوتوغرافي هاوٍ منذ سنوات، أستمتع بتعليم أساسيات الإضاءة والتكوين.",
      en: "A longtime hobbyist photographer who enjoys teaching the basics of light and composition.",
    },
    interests: { ar: ["التصوير", "المشي في الطبيعة", "التسويق"], en: ["Photography", "Hiking", "Marketing"] },
    availability: { ar: "مساءً في أيام الأسبوع", en: "Weekday evenings" },
  },
  {
    id: "demo-m5",
    name: { ar: "مريم يوسف", en: "Mariam Youssef" },
    bio: {
      ar: "كاتبة محتوى تساعد الآخرين على صياغة أفكارهم بوضوح وإيجاز.",
      en: "A content writer who helps others express their ideas clearly and concisely.",
    },
    interests: { ar: ["الكتابة", "التصميم", "القصص القصيرة"], en: ["Writing", "Design", "Short stories"] },
    availability: { ar: "مرنة", en: "Flexible" },
  },
  {
    id: "demo-m6",
    name: { ar: "ياسين فتحي", en: "Yassin Fathy" },
    bio: {
      ar: "متخصص في التسويق الرقمي للمشاريع الناشئة، وأتعلّم التصوير لتحسين محتواي.",
      en: "A digital marketer for early-stage projects, learning photography to improve my content.",
    },
    interests: { ar: ["التسويق الرقمي", "ريادة الأعمال", "التصوير"], en: ["Digital marketing", "Entrepreneurship", "Photography"] },
    availability: { ar: "مساءً، عطلة نهاية الأسبوع", en: "Evenings and weekends" },
  },
];

export const sampleListings: SampleListing[] = [
  {
    id: "demo-1",
    memberId: "demo-m1",
    categorySlug: "programming",
    level: "advanced",
    title: { ar: "بناء واجهات الويب باستخدام React", en: "Building web interfaces with React" },
    description: {
      ar: "جلسات عملية نبني فيها واجهة كاملة خطوة بخطوة، مع شرح التفكير وراء كل قرار تقني.",
      en: "Hands-on sessions where we build a complete interface step by step, explaining the thinking behind each technical decision.",
    },
    outcomes: {
      ar: ["فهم المكوّنات والحالة", "تنظيم مشروع React", "بناء واجهة تفاعلية كاملة"],
      en: ["Understand components and state", "Structure a React project", "Build a complete interactive interface"],
    },
    wants: { ar: ["المحادثة بالإنجليزية"], en: ["English conversation"] },
  },
  {
    id: "demo-2",
    memberId: "demo-m2",
    categorySlug: "languages",
    level: "advanced",
    title: { ar: "محادثة اللغة الإنجليزية للمبتدئين", en: "English conversation for beginners" },
    description: {
      ar: "حوارات قصيرة منتظمة تبني ثقتك في الحديث، مع تصحيح لطيف للأخطاء الشائعة.",
      en: "Short, regular conversations that build your speaking confidence, with gentle correction of common mistakes.",
    },
    outcomes: {
      ar: ["التحدث بثقة في مواقف يومية", "توسيع المفردات العملية", "تحسين النطق"],
      en: ["Speak confidently in everyday situations", "Grow practical vocabulary", "Improve pronunciation"],
    },
    wants: { ar: ["أساسيات تطوير الويب"], en: ["Web development basics"] },
  },
  {
    id: "demo-3",
    memberId: "demo-m3",
    categorySlug: "design",
    level: "expert",
    title: { ar: "تصميم الهوية البصرية للمشاريع الصغيرة", en: "Brand identity design for small projects" },
    description: {
      ar: "من فهم الفكرة إلى اختيار الألوان والخطوط وتصميم الشعار ودليل استخدام بسيط.",
      en: "From understanding the idea to choosing colors and fonts, designing a logo and a simple usage guide.",
    },
    outcomes: {
      ar: ["تحديد شخصية العلامة", "اختيار الألوان والخطوط", "تصميم شعار ودليل استخدام"],
      en: ["Define a brand's personality", "Choose colors and typography", "Design a logo and usage guide"],
    },
    wants: { ar: ["التصوير الفوتوغرافي"], en: ["Photography"] },
  },
  {
    id: "demo-4",
    memberId: "demo-m4",
    categorySlug: "media",
    level: "intermediate",
    title: { ar: "أساسيات التصوير الفوتوغرافي والإضاءة", en: "Photography and lighting fundamentals" },
    description: {
      ar: "تعلّم التحكم في الإضاءة والتكوين لتلتقط صورًا أوضح وأجمل بأي كاميرا.",
      en: "Learn to control light and composition to take clearer, better photos with any camera.",
    },
    outcomes: {
      ar: ["فهم الإضاءة الطبيعية", "قواعد التكوين", "التعديل البسيط على الصور"],
      en: ["Understand natural light", "Composition rules", "Simple photo editing"],
    },
    wants: { ar: ["التسويق الرقمي"], en: ["Digital marketing"] },
  },
  {
    id: "demo-5",
    memberId: "demo-m5",
    categorySlug: "writing",
    level: "advanced",
    title: { ar: "كتابة المحتوى بأسلوب واضح ومؤثر", en: "Writing clear, engaging content" },
    description: {
      ar: "تمارين عملية على بناء الفكرة وصياغة العناوين وتحرير النص ليصل إلى قارئه.",
      en: "Practical exercises in structuring ideas, writing headlines and editing text so it reaches its reader.",
    },
    outcomes: {
      ar: ["بناء الفكرة قبل الكتابة", "صياغة عناوين جذابة", "تحرير النص وتحسينه"],
      en: ["Structure an idea before writing", "Write compelling headlines", "Edit and refine text"],
    },
    wants: { ar: ["التصميم الجرافيكي"], en: ["Graphic design"] },
  },
  {
    id: "demo-6",
    memberId: "demo-m6",
    categorySlug: "business",
    level: "intermediate",
    title: { ar: "التسويق الرقمي للمشاريع الناشئة", en: "Digital marketing for early-stage projects" },
    description: {
      ar: "كيف تحدد جمهورك وتبني خطة محتوى بسيطة وتقيس نتائجها دون ميزانية كبيرة.",
      en: "How to define your audience, build a simple content plan and measure results without a large budget.",
    },
    outcomes: {
      ar: ["تحديد الجمهور المستهدف", "بناء خطة محتوى", "قياس النتائج بأدوات بسيطة"],
      en: ["Define your target audience", "Build a content plan", "Measure results with simple tools"],
    },
    wants: { ar: ["التصوير الفوتوغرافي"], en: ["Photography"] },
  },
];

export function pick<T>(value: Bi<T>, locale: Locale): T {
  return value[locale];
}
