const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const axios = require('axios'); // 添加 axios
require('dotenv').config(); // 加载环境变量

const app = express();
const port = process.env.PORT || 5000;

// 加载生物知识库
let biologyDB = {};
async function loadDB() {
    try {
        const data = await fs.readFile('biology_db.json', 'utf8');
        biologyDB = JSON.parse(data);
    } catch (err) {
        console.error('加载生物知识库失败:', err);
        process.exit(1);
    }
}

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// API端点：获取所有章节
app.get('/api/chapters', (req, res) => {
    res.json({
        success: true,
        chapters: biologyDB.chapters.map(c => ({
            id: c.id,
            title: c.title
        }))
    });
});

// API端点：获取章节详情
app.get('/api/chapter/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const chapter = biologyDB.chapters.find(c => c.id === id);
    
    if (!chapter) {
        return res.status(404).json({
            success: false,
            message: '章节不存在'
        });
    }
    
    // 获取章节相关知识点
    const topics = chapter.topicIds.map(tid => 
        biologyDB.topics.find(t => t.id === tid)
    ).filter(Boolean);
    
    // 获取章节相关资源
    const resources = biologyDB.resources.filter(r => 
        r.chapterId === id
    );
    
    // 获取章节相关实验
    const experiments = biologyDB.experiments.filter(e => 
        e.chapterId === id
    );
    
    // 获取章节概述
    const chapterInfo = biologyDB.chapterInfo.find(ci => ci.id === id);
    
    res.json({
        success: true,
        chapter: {
            id: chapter.id,
            title: chapter.title,
            description: chapterInfo ? chapterInfo.description : '',
            topics,
            resources,
            experiments
        }
    });
});

// API端点：智能问答（使用 DeepSeek API）
// API端点：智能问答（使用 DeepSeek API）
app.post('/api/ask', async (req, res) => {
    const { question } = req.body;
    
    if (!question || question.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message: '问题至少需要3个字符'
        });
    }
    
    try {
        // 构造专业提示词
        const prompt = `
            你是一位高中生物老师，请用专业且通俗易懂的方式回答以下问题。
            回答时请遵守以下要求：
            1. 内容严格遵循高中生物教学大纲
            2. 包含关键概念定义
            3. 使用恰当的比喻帮助理解
            4. 包含1-2个生活实例
            5. 避免使用 Markdown 语法
            6. 使用纯文本格式（不要使用 HTML 或 Markdown）
            7. 字数控制在200-300字

            问题：${question}
        `;
        
        // 调用 DeepSeek API
        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "你是一位经验丰富的高中生物特级教师，擅长用生动的比喻和生活实例解释复杂的生物学概念。"
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 800,
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
                }
            }
        );
        
        // 提取回复内容
        const answer = response.data.choices[0].message.content;
        
        res.json({
            success: true,
            answer
        });
        
    } catch (error) {
        console.error('DeepSeek API调用失败:', error);
        
        let errorMessage = 'AI服务不可用，请稍后重试';
        if (error.response) {
            // 处理 DeepSeek API 返回的错误响应
            const { status, data } = error.response;
            errorMessage = `DeepSeek API错误: ${status} - ${data.error?.message || '未知错误'}`;
        } else if (error.request) {
            // 请求已发出但没有响应
            errorMessage = '没有收到DeepSeek API的响应';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
});

// 启动服务器
async function startServer() {
    try {
        await loadDB();
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
            console.log('AI服务使用: DeepSeek API');
        });
    } catch (err) {
        console.error('无法启动服务器:', err);
        process.exit(1);
    }
}

startServer();