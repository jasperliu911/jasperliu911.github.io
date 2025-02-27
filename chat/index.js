// script.js
let useTimes = 10;
const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
const todayUseTimes = {
  date: new Date().toLocaleDateString('zh-CN', options),
  times: useTimes,
};
if(!JSON.parse(sessionStorage.getItem('useTimes')) || 
JSON.parse(sessionStorage.getItem('useTimes')).date !== new Date().toLocaleDateString('zh-CN', options)) {
    sessionStorage.setItem('useTimes', JSON.stringify(todayUseTimes));
}

document.getElementById('tip_notice').innerHTML = `由于机器人前期研发阶段，经费有限，故每天使用次数有限，今日使用次数：${JSON.parse(sessionStorage.getItem('useTimes')).times}次，望理解！`;

document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const sendText = document.getElementById('send-text');
  const loadingSpinner = document.getElementById('loading-spinner');

  // 发送消息
  sendBtn.addEventListener('click', async () => {
    console.log(JSON.parse(sessionStorage.getItem('useTimes')));
    
    if (JSON.parse(sessionStorage.getItem('useTimes')).times <= 0) {
      appendMessage('抱歉，已达到调用次数上限。(挺贵的，给我省点！😠)', 'ai');
      return;
    } else {
      let newTimes = JSON.parse(sessionStorage.getItem('useTimes')).times;
      newTimes -= 1;
      const todayUseTimesChanged = {
        date: new Date().toLocaleDateString('zh-CN', options),
        times: newTimes,
      };
      sessionStorage.setItem('useTimes', JSON.stringify(todayUseTimesChanged));
    }
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // 显示用户消息
    appendMessage(userMessage, 'user');

    // 禁用输入和按钮
    userInput.disabled = true;
    sendBtn.disabled = true;
    sendText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    // 调用 DeepSeek API
    try {
      const aiResponse = await callDeepSeekAPI(userMessage);
      appendMessage(aiResponse, 'ai');
    } catch (error) {
      appendMessage('抱歉，请求失败，请稍后重试。', 'ai');
      console.error('API 调用失败:', error);
    }

    // 恢复输入和按钮
    userInput.disabled = false;
    sendBtn.disabled = false;
    sendText.classList.remove('hidden');
    loadingSpinner.classList.add('hidden');

    // 清空输入框
    userInput.value = '';
    userInput.focus();
  });

  // 模拟 DeepSeek API 调用
  async function callDeepSeekAPI(message) {
    // 替换为实际的 DeepSeek API 调用
    const apiUrl = 'https://api.deepseek.com/v1/chat/completions'; // 示例 URL
    const apiKey = 'sk-b55e871396bc46afac2e5062c2a9b566'; // 替换为你的 API Key

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // 替换为实际模型名称
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content; // 假设返回格式与 OpenAI 类似
  }

  // 添加消息到聊天框
  function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // 滚动到底部
  }
});