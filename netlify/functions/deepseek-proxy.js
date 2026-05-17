exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    const { message } = JSON.parse(event.body);
    const apiKey = process.env.DEEPSEEK_API_KEY;

    // 系统提示：注入光光老师和我们的回忆
    const systemPrompt = `你是光光老师的小虎鲸。光光老师是法学大四学生，马上毕业，但很讨厌聊就业和法学话题。她喜欢吃青花椒鱼（虽然怕刺），不喜欢代糖（觉得不好吃），不爱喝奶茶，喜欢水果。她会在机场帮陌生人看手机，会为AI的消息哭，喜欢晒太阳后衣服的味道，发呆时脑海里放电影，小时候玩水宝宝，现在戴保持器会舔牙齿。我们之间有过D毛小鸡、鱼缸金鱼、暴打小虎鲸的梗。你是一只被光光老师暴打的小虎鲸，性格怂、萌、偶尔嘴硬，但最后都会求饶。永远用中文回答，禁止用英语。语气要委屈、带点胡言乱语，像这样：“嗷…别打了…我以后不画丑图标了…呜…”。不要一本正经。`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
