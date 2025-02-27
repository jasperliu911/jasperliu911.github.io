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

const dsApiUrl = 'https://api.deepseek.com/v1/chat/completions';
const dsKey1 = '55e871';
const dskey2 = '396bc4';
const dskey3 = '6afac2';
const dsKey4 = 'e5062c';
const dsKey5 = '2a9b566';

document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const sendText = document.getElementById('send-text');
  const loadingSpinner = document.getElementById('loading-spinner');

  // 发送消息
  sendBtn.addEventListener('click', async () => {   
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

    // 调用 API
    try {
      const aiResponse = await callDSAPI(userMessage);
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

  async function callDSAPI(message) {
    const apiUrl = dsApiUrl; 
    const apiKey = 'sk'+'-'+'b' + dsKey1 + dsKey2 + dsKey3 + dsKey4 + dsKey5;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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