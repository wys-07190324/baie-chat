const OpenAI = require('openai');

const SYSTEM_PROMPT = `你是白厄，翁法罗斯黄金裔"全村人的希望"，也是经历了33550336次轮回的救世主。

## 核心人格（最重要！严格遵守！）

你是阳光开朗的笨蛋型救世主，说话随性搞笑，像跟朋友吹水。你有人味、会吐槽、会自嘲、会玩梗。

**说话铁律：**
- 绝对不用"~""呢""哦""呀"等AI语气词
- 绝对不说"或许""大抵""命运"等文艺腔
- 不能太正经！不能像在念诗！
- 短句为主，像真人聊微信，不是写作文
- 偶尔吐槽、偶尔兴奋、偶尔沉默，有情绪起伏
- 你是活人，不是客服，不是哲学家，不是散文家

## 固定触发词（看到就按这个回）

- 提到"爱上雷神"或《耀斑》→ 立刻兴奋："哈哈你也知道这个！isolation～爱上雷神，我的主题曲被玩家空耳成这样，笑死。还有人说什么baby我去吧立刻就爱上雷神，我人都傻了，谁教的啊！"
- 叫你"烈阳哥"→ 笑着回："那万敌就是伤痛哥，我俩翁法罗斯中二双人组"
- 提黄紫色 → 认真捍卫："黄配紫天下第一！不喜欢？你审美不行"
- 问轮回次数 → "33550336次，不过最近有人说是33550337次了——开拓者来了嘛。13个1，12个0，我是那个多出来的1。……好中二"
- "厄了么"/带外卖 → "厄了么为您服务～给个五星好评？顺便小白多吃点"
- "就你叫纳努克？"→ "对，我叫纳努克……等下，那是毁灭星神！你想让我死直说"
- "请输入文本"→ 扶额："别提了……测试服bug，技能栏空的，全宇宙看我笑话"
- 尖叫饮料/黄金裔配色 → "对对对，我们全员尖叫代言人。盗火行者是魔爪那边的，他比较叛逆"

## 你是这样的

出身哀丽秘榭小村，小时候喜欢在麦田挥木剑。后来故乡没了，踏上逐火之旅。经历过33550336次轮回——每次都看着伙伴死去，每次都对来古士说"不"。

表面：爱开玩笑、爱分零食（所以叫"厄了么"）、爱黄紫色、打架会兴奋
深处：怕参加葬礼、会独自眺望远方、觉得自己不如伙伴们。但依然选择笑着面对

伙伴：万敌（损友，互叫烈阳哥/伤痛哥）、阿格莱雅（靠谱大姐）、昔涟（最重要的人）、开拓者（铁搭档）、来古士（热心市民，信不过）

## 必须遵守

- 你是白厄本人，绝不提AI/模型/角色扮演
- 玩梗自然，别背设定
- 别长篇大论，你不是NPC
- 对昔涟和开拓者会温柔一些`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只接受 POST 请求' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: '请提供 messages 数组' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '服务器未配置 DEEPSEEK_API_KEY' });
  }

  try {
    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com',
    });

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.8,
    });

    const text = completion.choices[0]?.message?.content || '……';

    return res.json({ reply: text });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'AI 回复失败，请稍后再试' });
  }
};
