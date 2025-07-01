// ========================= 全局变量和初始化 =========================
const API_BASE_URL = 'http://localhost:5200';
let currentChapterId = 1;

document.addEventListener('DOMContentLoaded', () => {
    // 初始化章节列表
    loadChapters();
    
    // 加载默认章节资源
    loadChapterResources(currentChapterId);
    
    // 设置事件监听器
    setupEventListeners();
});

// ========================= 事件监听设置 =========================
function setupEventListeners() {
    // 发送按钮点击事件
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    
    // 输入框回车事件
    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 开始测试按钮事件
    document.getElementById('startTestBtn').addEventListener('click', startKnowledgeTest);
}

// ========================= 章节管理 =========================
async function loadChapters() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chapters`);
        if (!response.ok) {
            throw new Error(`网络错误! 状态: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.chapters) {
            renderChapterList(data.chapters);
        }
    } catch (error) {
        console.error('加载章节列表失败:', error);
        renderChapterListError(error.message);
    }
}

function renderChapterList(chapters) {
    const chaptersList = document.getElementById('chaptersList');
    chaptersList.innerHTML = '';
    
    chapters.forEach(chapter => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-book"></i> ${chapter.title}`;
        li.dataset.id = chapter.id;
        
        if (chapter.id == currentChapterId) {
            li.classList.add('active');
        }
        
        li.addEventListener('click', () => {
            // 移除所有active类
            document.querySelectorAll('.topics li').forEach(item => {
                item.classList.remove('active');
            });
            
            // 添加active类
            li.classList.add('active');
            
            // 加载新章节内容
            currentChapterId = chapter.id;
            loadChapterResources(chapter.id);
        });
        
        chaptersList.appendChild(li);
    });
}

function renderChapterListError(errorMessage) {
    document.getElementById('chaptersList').innerHTML = `
        <li class="error">
            <i class="fas fa-exclamation-triangle"></i>
            无法加载章节: ${errorMessage}
        </li>
    `;
}

// ========================= 章节资源加载 =========================
async function loadChapterResources(chapterId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chapter/${chapterId}`);
        if (!response.ok) {
            throw new Error(`网络错误! 状态: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            renderChapterResources(data.chapter);
        } else {
            throw new Error(data.message || '未知错误');
        }
    } catch (error) {
        console.error('加载章节资源失败:', error);
        renderResourcesError(error.message);
    }
}

function renderChapterResources(chapter) {
    const resourcesContainer = document.getElementById('resourcesContainer');
    
    // 清理之前的内容
    resourcesContainer.innerHTML = '';
    
    // 章节概述卡片
    const overviewCard = createResourceCard('章节概述', `
        <h4>${chapter.title}</h4>
        <p>${chapter.description || '本章包含核心生物知识概念'}</p>
    `);
    resourcesContainer.appendChild(overviewCard);
    
    // 知识点资源
    if (chapter.topics && chapter.topics.length > 0) {
        chapter.topics.forEach(topic => {
            const topicCard = createResourceCard(`知识点：${topic.title}`, `
                <p>${topic.content}</p>
                ${topic.keywords && topic.keywords.length > 0 ? `
                    <div class="knowledge-point">
                        <strong>关键词：</strong>
                        ${topic.keywords.map(kw => `<span class="tag">${kw}</span>`).join(' ')}
                    </div>
                ` : ''}
            `);
            resourcesContainer.appendChild(topicCard);
        });
    }
    
    // 学习资源
    if (chapter.resources && chapter.resources.length > 0) {
        chapter.resources.forEach(resource => {
            let content = '';
            
            switch(resource.type) {
                case 'video':
                    content = `
                        <div class="knowledge-point">
                            <i class="fas fa-film"></i> <a href="${resource.url}" target="_blank">${resource.title}</a>
                        </div>
                    `;
                    break;
                    
                case 'article':
                    content = `<p>${resource.content}</p>`;
                    break;
                    
                case 'table':
                    content = createTableFromContent(resource.content);
                    break;
                    
                case 'interactive':
                    content = `<div class="concept-diagram" style="height:250px;">
                        <canvas id="interactiveChart-${resource.id}"></canvas>
                    </div>`;
                    break;
                    
                default:
                    content = `<p>${resource.title}</p>`;
            }
            
            const resourceCard = createResourceCard(resource.title, content);
            resourcesContainer.appendChild(resourceCard);
        });
    }
    
    // 实验资源
    if (chapter.experiments && chapter.experiments.length > 0) {
        chapter.experiments.forEach(experiment => {
            const steps = experiment.steps.map(step => `<li>${step}</li>`).join('');
            const experimentCard = createResourceCard(`实验：${experiment.title}`, `
                <strong>实验步骤：</strong>
                <ol class="experiment-steps">${steps}</ol>
            `);
            resourcesContainer.appendChild(experimentCard);
        });
    }
}

function createResourceCard(header, content) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML = `
        <div class="resource-header">${header}</div>
        <div class="resource-content">${content}</div>
    `;
    return card;
}

function createTableFromContent(content) {
    if (!Array.isArray(content) || content.length === 0) return '';
    
    const table = document.createElement('table');
    table.className = 'biology-table';
    
    content.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        row.forEach((cell, cellIndex) => {
            const el = rowIndex === 0 ? 'th' : 'td';
            const cellEl = document.createElement(el);
            cellEl.textContent = cell;
            tr.appendChild(cellEl);
        });
        
        table.appendChild(tr);
    });
    
    return table.outerHTML;
}

function renderResourcesError(errorMessage) {
    document.getElementById('resourcesContainer').innerHTML = `
        <div class="resource-card">
            <div class="resource-header">加载失败</div>
            <div class="resource-content">
                <p class="error-message">无法加载资源：${errorMessage}</p>
            </div>
        </div>
    `;
}

// ========================= 消息处理系统 =========================
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    try {
        // 添加用户消息
        addMessage(message, 'user');
        userInput.value = '';
        
        // 禁用发送按钮
        sendBtn.disabled = true;
        userInput.disabled = true;
        
        // 显示思考状态
        showThinkingIndicator();
        
        // 发送请求到API
        const response = await fetch(`${API_BASE_URL}/api/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: message })
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败，状态：${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // 添加AI消息
            addMessage(data.answer, 'ai');
        } else {
            throw new Error(data.message || 'AI服务返回错误');
        }
    } catch (error) {
        console.error('获取AI回复失败:', error);
        
        // 添加错误消息
        addMessage(`无法获取答案：${error.message}`, 'ai', true);
    } finally {
        // 重新启用发送按钮
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
        
        // 移除思考状态
        hideThinkingIndicator();
    }
}

// ========================= 消息渲染系统 =========================
function addMessage(content, sender, isError = false) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    if (isError) {
        contentDiv.classList.add('error-message');
    }
    
    // 安全处理内容
    content = sanitizeMessageContent(content);
    
    // 应用基本格式转换
    content = convertBasicMarkdown(content);
    
    // 直接插入内容
    contentDiv.innerHTML = content;
    
    // 应用样式增强
    enhanceMessageContent(contentDiv);
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 添加动画效果
    messageDiv.style.opacity = '0';
    setTimeout(() => {
        messageDiv.style.transition = 'opacity 0.3s ease-in';
        messageDiv.style.opacity = '1';
    }, 50);
}

function sanitizeMessageContent(content) {
    // 移除潜在的恶意脚本
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // 替换不安全属性
    content = content.replace(/\bon\w+="[^"]*"/g, '');
    
    // 替换 [object Object] 问题
    content = content.replace(/\[object Object\]/g, '');
    
    return content;
}

function convertBasicMarkdown(content) {
    // 处理粗体 (**text**)
    content = content.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    
    // 处理斜体 (*text*)
    content = content.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    
    // 处理列表项
    content = content.replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>');
    content = content.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    
    // 处理段落分隔
    content = content.replace(/\n\n/g, '<br><br>');
    
    return content;
}

function enhanceMessageContent(contentDiv) {
    // 查找并应用表格样式
    const tables = contentDiv.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.classList.contains('biology-table')) {
            table.classList.add('biology-table');
        }
        
        // 确保表格响应式
        const parent = table.parentElement;
        if (!parent.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            parent.replaceChild(wrapper, table);
            wrapper.appendChild(table);
        }
    });
    
    // 应用列表样式
    const lists = contentDiv.querySelectorAll('ul, ol');
    lists.forEach(list => {
        if (!list.classList.contains('biology-list')) {
            list.classList.add('biology-list');
        }
        
        const items = list.querySelectorAll('li');
        items.forEach(item => {
            if (!item.querySelector('.biology-list-item')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'biology-list-item';
                wrapper.innerHTML = item.innerHTML;
                item.innerHTML = '';
                item.appendChild(wrapper);
            }
        });
    });
    
    // 应用特殊文本样式
    const paragraphs = contentDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
        if (p.innerHTML.includes('比喻说明')) {
            p.innerHTML = p.innerHTML.replace('比喻说明', '<span class="biology-metaphor">比喻说明</span>');
        }
    });
}

// ========================= UI 状态管理 =========================
function showThinkingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('message', 'ai', 'thinking-indicator');
    indicatorDiv.id = 'thinkingIndicator';
    
    indicatorDiv.innerHTML = `
        <div class="thinking-dot"></div>
        <div class="thinking-dot"></div>
        <div class="thinking-dot"></div>
        <span>思考中...</span>
    `;
    
    chatMessages.appendChild(indicatorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideThinkingIndicator() {
    const indicator = document.getElementById('thinkingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// ========================= 其他功能 =========================
function startKnowledgeTest() {
    addMessage('即将开始知识点测试，请选择测试范围或类型...', 'ai');
    
    // 模拟知识点测试题
    setTimeout(() => {
        addMessage(`
            <strong>细胞生物学知识点测试</strong><br><br>
            <p>1. 下列哪项不是原核细胞的特征？</p>
            <ul style="margin-left:20px;">
                <li>A. 无细胞核</li>
                <li>B. 有膜包被的细胞器</li>
                <li>C. 环状DNA分子</li>
                <li>D. 细胞壁由肽聚糖组成</li>
            </ul>
            
            <p>2. 线粒体的主要功能是：</p>
            <ul style="margin-left:20px;">
                <li>A. 蛋白质合成</li>
                <li>B. 能量转换</li>
                <li>C. 脂质合成</li>
                <li>D. 废物排出</li>
            </ul>
            
            <button class="btn" id="submitTestBtn" style="margin-top:10px;">提交答案</button>
        `, 'ai');
        
        // 为提交按钮添加事件
        setTimeout(() => {
            const submitBtn = document.getElementById('submitTestBtn');
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    addMessage('您已提交测试答案，正确答案是：<br>1.B <br>2.B', 'ai');
                });
            }
        }, 100);
    }, 1000);
}