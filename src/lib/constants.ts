export const LINKEDIN_CHAR_LIMIT = 3000;

export const POST_STYLES = [
  {
    id: "thought-leadership",
    label: "Thought Leader",
    emoji: "🧠",
    description: "Position yourself as an industry expert",
  },
  {
    id: "storytelling",
    label: "Story",
    emoji: "📖",
    description: "Share compelling personal narratives",
  },
  {
    id: "how-to",
    label: "How-To",
    emoji: "📋",
    description: "Step-by-step guides and tutorials",
  },
  {
    id: "personal-brand",
    label: "Personal Brand",
    emoji: "✨",
    description: "Build your professional identity",
  },
  {
    id: "controversial",
    label: "Hot Take",
    emoji: "🔥",
    description: "Challenge conventional wisdom",
  },
  {
    id: "data-driven",
    label: "Data Driven",
    emoji: "📊",
    description: "Insights backed by numbers",
  },
] as const;

export const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "inspirational", label: "Inspirational" },
  { id: "humorous", label: "Humorous" },
  { id: "authoritative", label: "Authoritative" },
  { id: "empathetic", label: "Empathetic" },
] as const;

export const TEMPLATES = [
  {
    id: "career-update",
    title: "Career Update",
    category: "Professional",
    description: "Announce a new role, promotion, or career milestone",
    template: `I'm thrilled to announce that [MILESTONE].

After [TIME PERIOD] of [EFFORT/JOURNEY], this moment feels surreal.

Here's what I learned along the way:

1. [LESSON 1]
2. [LESSON 2]
3. [LESSON 3]

To everyone who supported me — thank you. You know who you are.

What's next? [FUTURE PLANS]

#CareerUpdate #NewBeginnings #Growth`,
  },
  {
    id: "achievement",
    title: "Achievement / Win",
    category: "Professional",
    description: "Share a professional accomplishment or team win",
    template: `We just hit [ACHIEVEMENT] 🎯

Let me break down how we got here:

The challenge:
→ [CHALLENGE DESCRIPTION]

Our approach:
→ [APPROACH/STRATEGY]

The result:
→ [SPECIFIC NUMBERS/OUTCOME]

Key takeaway: [MAIN LESSON]

Grateful to [TEAM/PEOPLE] who made this possible.

What achievement are you proud of this quarter?

#Achievement #TeamWork #Results`,
  },
  {
    id: "insight",
    title: "Industry Insight",
    category: "Thought Leadership",
    description: "Share a valuable observation about your industry",
    template: `I've noticed something that most people in [INDUSTRY] are missing:

[BOLD STATEMENT]

Here's why this matters:

Most people think → [COMMON BELIEF]
Reality is → [YOUR INSIGHT]

I discovered this when [PERSONAL EXPERIENCE].

3 things you can do about it:

1. [ACTION ITEM 1]
2. [ACTION ITEM 2]
3. [ACTION ITEM 3]

What's your take? Do you agree or disagree?

#[INDUSTRY] #Insights #Leadership`,
  },
  {
    id: "question",
    title: "Engagement Question",
    category: "Engagement",
    description: "Ask a thought-provoking question to drive comments",
    template: `Unpopular opinion:

[YOUR STANCE ON TOPIC]

I know this might be controversial, but hear me out.

[2-3 SENTENCES EXPLAINING YOUR REASONING]

The data backs this up:
→ [SUPPORTING POINT 1]
→ [SUPPORTING POINT 2]

I'd love to hear your perspective.

Do you agree or disagree? Drop your thoughts below 👇

#[TOPIC] #Discussion #Perspective`,
  },
  {
    id: "lesson-learned",
    title: "Lesson Learned",
    category: "Personal",
    description: "Share a mistake or lesson from your experience",
    template: `My biggest mistake in [AREA]:

[THE MISTAKE]

I spent [TIME] doing it wrong before I realized:

[THE REALIZATION]

Here's what I'd tell my younger self:

1. [ADVICE 1]
2. [ADVICE 2]
3. [ADVICE 3]

The silver lining? [POSITIVE OUTCOME]

What's a mistake that taught you the most? Share below.

#LessonsLearned #Growth #Experience`,
  },
  {
    id: "day-in-life",
    title: "Day in My Life",
    category: "Personal Brand",
    description: "Share your daily routine or behind-the-scenes",
    template: `Here's what a typical day looks like as a [ROLE]:

⏰ [TIME] — [ACTIVITY]
☕ [TIME] — [ACTIVITY]
💻 [TIME] — [ACTIVITY]
🤝 [TIME] — [ACTIVITY]
📊 [TIME] — [ACTIVITY]
🏠 [TIME] — [ACTIVITY]

The part nobody sees: [BEHIND THE SCENES]

The part I love most: [FAVORITE PART]

What does your typical day look like?

#DayInMyLife #[ROLE] #BehindTheScenes`,
  },
  {
    id: "tool-recommendation",
    title: "Tool / Resource Share",
    category: "Value-Add",
    description: "Recommend tools or resources you use",
    template: `[NUMBER] tools that saved me [BENEFIT] this year:

1. [TOOL 1] — [WHAT IT DOES]
   Why I love it: [REASON]

2. [TOOL 2] — [WHAT IT DOES]
   Why I love it: [REASON]

3. [TOOL 3] — [WHAT IT DOES]
   Why I love it: [REASON]

Bonus: [EXTRA TOOL/TIP]

Save this post for later 🔖

What tools can't you live without? Share in the comments!

#Productivity #Tools #Recommendations`,
  },
  {
    id: "contrarian",
    title: "Contrarian View",
    category: "Thought Leadership",
    description: "Challenge popular opinions in your field",
    template: `Stop [COMMON PRACTICE].

I know everyone says you should [CONVENTIONAL WISDOM].

But after [EXPERIENCE], I realized it's actually holding you back.

Here's the truth nobody talks about:

❌ [MYTH 1] → ✅ [REALITY 1]
❌ [MYTH 2] → ✅ [REALITY 2]
❌ [MYTH 3] → ✅ [REALITY 3]

The real way to [DESIRED OUTCOME]:

→ [YOUR APPROACH]

Agree? Disagree? Let's debate 👇

#[TOPIC] #Myths #RealTalk`,
  },
] as const;

export const API_CONFIG = {
  url: "https://sai.sharedllm.com/v1/chat/completions",
  model: "gpt-oss:120b",
} as const;
