# 🧬 AI辅助高中生物教学平台

## 项目概述

这是一个基于AI技术的高中生物教学辅助平台，专门为学生提供智能问答、知识点查询、学习资源管理等功能。结合 DeepSeek API 的专业知识问答能力和精心设计的生物知识库，为学生提供专业、生动的学习体验。
---

## 功能亮点

- **智能生物问答系统**  
  基于 DeepSeek 的自然语言处理能力，提供专业准确的高中生物问题解答

- **结构化知识库**  
  精心设计的生物学科知识体系，涵盖高中生物核心知识点

- **交互式学习体验**  
  流畅的聊天式交互界面，模拟与特级教师的对话

- **丰富教学资源**  
  包含实验指导、表格对比、图表解析等多样化教学资源

- **响应式设计**  
  适配电脑、平板等多种设备的学习需求

---

## 技术架构

- **前端**：HTML5 + CSS3 + JavaScript  
- **后端**：Node.js + Express  
- **AI引擎**：DeepSeek API  
- **数据库**：JSON 格式知识库  

---

## 安装与配置

### 前置要求

- Node.js 16+ 环境  
- DeepSeek API 密钥（[免费申请](https://platform.deepseek.com/)）  
- 基础命令行操作能力  

### 安装步骤

**克隆仓库**
```bash
git clone https://github.com/yourusername/ai-biology-teaching-platform.git](https://github.com/Colofuluang/ai-biology-teaching-platform.git
cd ai-biology-teaching-platform
```

**安装依赖**

```bash
npm install express cors body-parser openai dotenv
```

**配置环境变量**

创建 `.env` 文件并添加你的 DeepSeek API 密钥：

```env
DEEPSEEK_API_KEY=your_api_key_here
PORT=5200
```

**启动服务**

```bash
node server.js
```

**访问应用**

在浏览器打开：[http://localhost:5200](http://localhost:5200)

---

## 配置文件说明

### 知识库配置（`biology_db.json`）

* `topics`: 核心知识点定义
* `chapters`: 章节组织结构
* `resources`: 学习资源（视频、图片等）
* `experiments`: 生物实验指导

### 前端配置（`public/script.js`）

* `API_BASE_URL`: 后端服务地址
* `currentChapterId`: 默认章节
* 界面交互行为定制

---

## 功能使用指南

### 主要功能模块

| 功能模块 | 描述         | 使用场景       |
| ---- | ---------- | ---------- |
| 智能问答 | AI助教解答生物问题 | 解决学习中遇到的问题 |
| 章节学习 | 按教材章节学习知识点 | 系统化学习课程内容  |
| 资源中心 | 各类教学资源展示   | 辅助理解复杂概念   |
| 实验指导 | 生物实验详细步骤   | 实验课预习与复习   |
| 知识测试 | 知识点小测验     | 检测学习效果     |

---

### 使用流程

#### 提问解惑

* 在聊天框中输入生物相关问题
* 获得 AI 助教的详细解答

#### 章节学习

* 左侧菜单选择学习章节
* 查看该章节知识点
* 学习相关实验和资源

#### 知识测试

* 点击“开始知识点测试”
* 完成测试题目
* 获取即时反馈

---

## 自定义配置选项

| 配置项                   | 默认值   | 说明                  |
| --------------------- | ----- | ------------------- |
| `DEEPSEEK_API_KEY`    | 无     | DeepSeek 平台的 API 密钥 |
| `PORT`                | 5200  | 服务监听端口              |
| `REQUEST_TIMEOUT`     | 10000 | API 请求超时（毫秒）        |
| `MAX_RESPONSE_TOKENS` | 800   | AI 回复的最大 token 数    |
| `TEMPERATURE`         | 0.7   | AI 创造力控制参数（0\~1）    |

---

## 项目结构说明

```
├── public/                  # 前端静态资源
│   ├── index.html           # 主页面
│   ├── style.css            # 样式文件
│   └── script.js            # 前端交互脚本
├── biology_db.json          # 生物知识库
├── server.js                # 后端服务主文件
├── .env                     # 环境配置文件
├── package.json             # 依赖管理
└── README.md                # 项目文档
```

---

## 常见问题解答（FAQ）

**Q: 如何获取 DeepSeek API 密钥？**
A:

1. 访问 [https://platform.deepseek.com/](https://platform.deepseek.com/)
2. 注册/登录账户
3. 在控制台创建 API 密钥

**Q: 如何修改服务器端口？**
A: 编辑 `.env` 文件中的 `PORT` 值即可。

**Q: 如何扩展知识库？**
A: 编辑 `biology_db.json` 文件，参考现有数据结构添加新内容。

**Q: 为什么 AI 回答不正确？**
A:

* 检查 DeepSeek API 是否正常
* 确认提示词工程是否恰当
* 确保问题描述清晰明确

---

## 开发路线图

* ✅ 用户账户系统（开发中）：保存学习记录和错题本
* 🧬 3D 生物模型查看器（规划中）：交互式生物结构可视化
* 🔬 实验模拟功能（规划中）：虚拟实验操作与观察
* 📊 学习数据分析（规划中）：生成个性化学习报告

---

## 贡献指南

欢迎贡献！请遵循以下流程：

1. Fork 本项目
2. 创建你的分支

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. 提交更改

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. 推送到分支

   ```bash
   git push origin feature/AmazingFeature
   ```
5. 提交 Pull Request

---

## 开源协议

本项目采用 `LICENSE` 开源协议。

---

> 让生物学学习像 DNA 复制一样高效而精准！🧬
