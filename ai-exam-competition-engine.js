class AIExamCompetition {
    constructor() {
        this.players = [];
        this.currentStage = null;
        this.apiKeys = {};
        this.playerMemories = {};
        this.lastRequestAt = {};
        this.onLogCallback = null;
        this.onStatusUpdateCallback = null;

        this.checkpointKey = 'AIExamCompetitionCheckpoint_v1';
        this.progress = {
            stage1QuestionIndex: 0,
            stage2AnswerIndex: 0,
            stage3ScoreIndex: 0
        };
        this.playerOrder = ['deepseek', 'claude', 'grok', 'chatgpt'];

        // 竞赛主题
        this.theme = '人工智能';

        // 累积名次统计
        this.cumulativeStats = this.loadCumulativeStats();

        this.nameMapping = {
            'claude': '克劳德',
            'glm': '智谱',
            'llama': '羊驼',
            'qwen': '通义',
            'kimi': '月之暗面',
            'doubao': '豆包',
            'deepseek': '深度求索',
            'chatgpt': '瓜皮糖',
            'grok': '格罗克',
            'sparkdesk': '火花'
        };

        this.aiConfigs = {
            'claude': {
                url: 'https://api.vectorengine.ai/v1/chat/completions',
                headers: {},
                model: 'claude-sonnet-4-5-20250929-thinking',
                key: 'sk-zbCJ8o4EO5R2wnh2r1EcsOLgHC0iGEdzNxSHhwyxewP4jWYp',
                minIntervalMs: 1200,
                formatMessage: (messages) => ({
                    model: 'claude-sonnet-4-5-20250929-thinking',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 3200
                }),
                extractContent: (data) => data.choices[0].message.content
            },
            'glm': {
                url: 'https://api.vectorengine.ai/v1/chat/completions',
                headers: {},
                model: 'glm-4.7-thinking',
                key: 'sk-Juom3WhJO8UFMUZC55j7xXE5X1wpr7eJv50Jn3ZViOiHHAOP',
                minIntervalMs: 1200,
                formatMessage: (messages) => ({
                    model: 'glm-4.7-thinking',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 3200
                }),
                extractContent: (data) => data.choices[0].message.content
            },
            'sparkdesk': {
                url: 'https://api.vectorengine.ai/v1/chat/completions',
                headers: {},
                model: 'SparkDesk-v3.5',
                key: 'sk-iszOfItQj0sYa1pQ0CCBQ1NVoy5cl7r6oGxBkFfrFYf0wikC',
                minIntervalMs: 1200,
                formatMessage: (messages) => ({
                    model: 'SparkDesk-v3.5',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 3200
                }),
                extractContent: (data) => data.choices[0].message.content
            },
            'qwen': {
                url: 'https://api.vectorengine.ai/v1/chat/completions',
                headers: {},
                model: 'qwen3-235b-a22b-thinking-2507',
                key: 'sk-LwIsg86hXOHziKIisKnR2ZK4Uaq3bI94HyKopO4JHnT9y8va',
                minIntervalMs: 1200,
                formatMessage: (messages) => ({
                    model: 'qwen3-235b-a22b-thinking-2507',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 3200
                }),
                extractContent: (data) => data.choices[0].message.content
            },
            'kimi': {
                url: 'https://api.vectorengine.ai/v1/chat/completions',
                headers: {},
                model: 'kimi-k2.5',
                key: 'sk-o7M9YzHCzjONr8P69AMO4a9lV0AycMp0Hqa3GGg3PwOvY7lH',
                minIntervalMs: 1200,
                formatMessage: (messages) => ({
                    model: 'kimi-k2.5',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 3200
                }),
                extractContent: (data) => data.choices[0].message.content
            },
            'doubao': {
                url: 'https://api.vectorengine.ai/v1/chat/completions',
                headers: {},
                model: 'o4-mini-2025-04-16',
                key: 'sk-0ZFiYXiDE96QMlPb0GulIvYw18gAHgFVJbQGDxJ0J9TL8o4r',
                minIntervalMs: 1200,
                formatMessage: (messages) => ({
                    model: 'o4-mini-2025-04-16',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 3200
                }),
                extractContent: (data) => data.choices[0].message.content
            },
            'deepseek': {
                url: 'https://api.vectorengine.ai/v1/chat/completions',
                headers: {},
                model: 'deepseek-v3.2-thinking',
                key: 'sk-jjpi4tW6zQVHlaELMmjD6gdRoRmYcdeCLt1860fxVwiO1dMx',
                minIntervalMs: 1200,
                formatMessage: (messages) => ({
                    model: 'deepseek-v3.2-thinking',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 3200
                }),
                extractContent: (data) => data.choices[0].message.content
            },
            'chatgpt': {
                url: 'https://api.vectorengine.ai/v1/chat/completions',
                headers: {},
                model: 'gpt-4',
                key: 'sk-JbbsQlWgFSz6MvlBAW7hdrJsnNsX1cHIheznTfGC3gSOoW6H',
                minIntervalMs: 1200,
                formatMessage: (messages) => ({
                    model: 'gpt-4',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 3200
                }),
                extractContent: (data) => data.choices[0].message.content
            },
            'grok': {
                url: 'https://api.vectorengine.ai/v1/chat/completions',
                headers: {},
                model: 'grok-4-fast-reasoning',
                key: 'sk-DNOg6qYSj6TO55AuEDHVHt3zdDHehJ1NbAxtrVI0QFgEZhUC',
                minIntervalMs: 2200,
                formatMessage: (messages) => ({
                    model: 'grok-4-fast-reasoning',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 3200
                }),
                extractContent: (data) => data.choices[0].message.content
            }
        };

        this.questions = [];
        this.answers = [];
        this.scores = {};
        this.finalRanking = [];
        this.questionAssignments = {}; // 题目分配给AI的映射
    }

    isCheckpointStorageAvailable() {
        try {
            if (typeof localStorage === 'undefined') return false;
            const testKey = `${this.checkpointKey}__test__`;
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);
            return true;
        } catch (_) {
            return false;
        }
    }

    hasCheckpoint() {
        try {
            if (!this.isCheckpointStorageAvailable()) return false;
            return !!localStorage.getItem(this.checkpointKey);
        } catch (_) {
            return false;
        }
    }

    clearCheckpoint() {
        try {
            if (this.isCheckpointStorageAvailable()) {
                localStorage.removeItem(this.checkpointKey);
            }
        } catch (_) {
        }
    }

    exportState() {
        return {
            version: 1,
            timestamp: new Date().toISOString(),
            currentStage: this.currentStage,
            progress: this.progress,
            playerOrder: this.playerOrder,
            players: this.players,
            questions: this.questions,
            answers: this.answers,
            scores: this.scores,
            questionAssignments: this.questionAssignments,
            finalRanking: this.finalRanking,
            shuffledPlayers: this.shuffledPlayers
        };
    }

    saveCheckpoint() {
        try {
            if (!this.isCheckpointStorageAvailable()) return;
            localStorage.setItem(this.checkpointKey, JSON.stringify(this.exportState()));
        } catch (_) {
        }
    }

    loadCheckpoint() {
        try {
            if (!this.isCheckpointStorageAvailable()) return null;
            const raw = localStorage.getItem(this.checkpointKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return null;
            if (parsed.version !== 1) return null;
            return parsed;
        } catch (_) {
            return null;
        }
    }

    restoreFromState(state) {
        this.currentStage = state.currentStage;
        this.progress = state.progress || {
            stage1QuestionIndex: 0,
            stage2AnswerIndex: 0,
            stage3ScoreIndex: 0
        };
        this.questions = state.questions || [];
        this.answers = state.answers || [];
        this.scores = state.scores || {};
        this.finalRanking = state.finalRanking || [];
        this.questionAssignments = state.questionAssignments || {};
        this.shuffledPlayers = state.shuffledPlayers || null;

        // 重新设置当前指定的玩家，不使用断点中的玩家列表
        this.setupPlayers(this.playerOrder);

        // 恢复AI状态
        if (state.players) {
            // 只恢复当前参赛者的数据
            state.players.forEach(oldPlayer => {
                const currentPlayer = this.players.find(p => p.id === oldPlayer.id);
                if (currentPlayer) {
                    // 恢复玩家的状态和数据
                    if (oldPlayer.authoredQuestion) {
                        currentPlayer.authoredQuestion = oldPlayer.authoredQuestion;
                        currentPlayer.authoredQuestionId = oldPlayer.authoredQuestionId;
                    }
                    if (oldPlayer.answers) {
                        currentPlayer.answers = oldPlayer.answers;
                    }
                    if (oldPlayer.finalScore) {
                        currentPlayer.finalScore = oldPlayer.finalScore;
                    }

                    // 根据当前阶段恢复AI状态
                    if (this.currentStage === 'stage1') {
                        if (currentPlayer.authoredQuestion) {
                            this.updateAIStatus(currentPlayer.id, '出题完成');
                        } else {
                            this.updateAIStatus(currentPlayer.id, '等待出题');
                        }
                    } else if (this.currentStage === 'stage2') {
                        if (currentPlayer.authoredQuestion) {
                            this.updateAIStatus(currentPlayer.id, '出题完成');
                        }
                        if (currentPlayer.answers && Object.keys(currentPlayer.answers).length > 0) {
                            this.updateAIStatus(currentPlayer.id, '作答完成');
                        } else {
                            this.updateAIStatus(currentPlayer.id, '等待作答');
                        }
                    } else if (this.currentStage === 'stage3' || this.currentStage === 'stage4') {
                        this.updateAIStatus(currentPlayer.id, '评分完成');
                    } else {
                        this.updateAIStatus(currentPlayer.id, '准备就绪');
                    }
                }
            });
        }
    }

    setupPlayers(order = null) {
        const availableApiKeys = Array.isArray(order) && order.length > 0 ? order : Object.keys(this.aiConfigs);
        this.playerOrder = [...availableApiKeys];

        this.players = availableApiKeys.map((apiName) => {
            const chineseName = this.nameMapping[apiName] || apiName;
            return {
                id: apiName,
                name: chineseName,
                status: '准备就绪',
                authoredQuestionId: null,
                authoredQuestion: null,
                answers: {},
                finalScore: 0
            };
        });

        this.players.forEach(player => {
            this.playerMemories[player.id] = [];
        });

        this.addLog(`🤖 AI选手设置完成，共${this.players.length}个参赛者：${this.players.map(p => p.name).join('、')}`, 'success');
    }

    updateAIStatus(playerId, status) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.status = status;
            if (this.onStatusUpdateCallback) {
                this.onStatusUpdateCallback(playerId, status);
            }
        }
    }

    updateAIDetail(playerId, type, content) {
        if (window.updateAIDetailContent) {
            window.updateAIDetailContent(playerId, type, content);
        }
    }

    addLog(message, type = 'info') {
        if (this.onLogCallback) {
            this.onLogCallback(message, type);
        }
    }

    async enforceMinInterval(playerId) {
        const config = this.aiConfigs[playerId];
        const minIntervalMs = config?.minIntervalMs || 0;
        if (!minIntervalMs) return;

        const lastAt = this.lastRequestAt[playerId] || 0;
        const now = Date.now();
        const elapsed = now - lastAt;
        if (elapsed < minIntervalMs) {
            await new Promise(resolve => setTimeout(resolve, minIntervalMs - elapsed));
        }
    }

    safeJsonParse(text) {
        try {
            return JSON.parse(text);
        } catch (_) {
        }

        const firstArray = text.indexOf('[');
        const lastArray = text.lastIndexOf(']');
        if (firstArray !== -1 && lastArray !== -1 && lastArray > firstArray) {
            const maybe = text.slice(firstArray, lastArray + 1);
            try {
                return JSON.parse(maybe);
            } catch (_) {
            }
        }

        const firstObj = text.indexOf('{');
        const lastObj = text.lastIndexOf('}');
        if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
            const maybe = text.slice(firstObj, lastObj + 1);
            try {
                return JSON.parse(maybe);
            } catch (_) {
            }
        }

        return null;
    }

    average(nums) {
        if (!nums || nums.length === 0) return 0;
        return nums.reduce((sum, n) => sum + n, 0) / nums.length;
    }

    trimmedMean(nums) {
        if (!nums || nums.length === 0) return 0;
        if (nums.length <= 2) return this.average(nums);
        const sorted = [...nums].sort((a, b) => a - b);
        const trimmed = sorted.slice(1, -1);
        if (trimmed.length === 0) return this.average(sorted);
        return this.average(trimmed);
    }

    parseQuestionObject(playerId, responseText) {
        const parsed = this.safeJsonParse(responseText);
        if (parsed && typeof parsed === 'object') {
            const question = typeof parsed.question === 'string' ? parsed.question.trim() : '';
            const rubric = typeof parsed.rubric === 'string' ? parsed.rubric.trim() : '';
            if (question) {
                return {
                    authorId: playerId,
                    question,
                    rubric
                };
            }
        }

        const fallback = responseText.trim();
        if (!fallback) return null;
        return {
            authorId: playerId,
            question: fallback,
            rubric: ''
        };
    }

    parseQuestionScoreArray(responseText) {
        const parsed = this.safeJsonParse(responseText);
        if (Array.isArray(parsed)) {
            const cleaned = [];
            for (const item of parsed) {
                if (!item || typeof item !== 'object') continue;
                const id = String(item.id || item.questionId || '').trim();
                const score = Number(item.score);
                if (!id || !Number.isFinite(score)) continue;
                cleaned.push({ id, score: Math.max(0, Math.min(100, score)) });
            }
            if (cleaned.length > 0) return cleaned;
        }

        const results = [];
        const re = /Q(\d+)\s*[:：-]?\s*(\d{1,3})/gi;
        let m;
        while ((m = re.exec(responseText)) !== null) {
            const id = `Q${m[1]}`;
            const score = Math.max(0, Math.min(100, Number(m[2])));
            results.push({ id, score });
        }
        return results;
    }

    parseAnswerScoreArray(responseText) {
        const parsed = this.safeJsonParse(responseText);
        if (Array.isArray(parsed)) {
            const cleaned = [];
            for (const item of parsed) {
                if (!item || typeof item !== 'object') continue;
                const answerId = String(item.answerId || item.id || '').trim();
                const score = Number(item.score);
                if (!answerId || !Number.isFinite(score)) continue;
                cleaned.push({ answerId, score: Math.max(0, Math.min(100, score)) });
            }
            if (cleaned.length > 0) return cleaned;
        }

        const results = [];
        const re = /ANS-([A-Za-z0-9_-]+)\s*[:：-]?\s*(\d{1,3})/g;
        let m;
        while ((m = re.exec(responseText)) !== null) {
            const answerId = `ANS-${m[1]}`;
            const score = Math.max(0, Math.min(100, Number(m[2])));
            results.push({ answerId, score });
        }
        return results;
    }

    parseAnswersByQuestion(finalQuestionIds, responseText) {
        const answers = {};
        const normalized = responseText.replace(/\r\n/g, '\n');
        for (const qid of finalQuestionIds) {
            const marker = `[${qid}]`;
            answers[qid] = '';
            const idx = normalized.indexOf(marker);
            if (idx === -1) continue;

            const after = normalized.slice(idx + marker.length);
            const nextIdx = this.findNextMarkerIndex(after, finalQuestionIds);
            const segment = nextIdx === -1 ? after : after.slice(0, nextIdx);
            answers[qid] = segment.trim();
        }

        const hasAny = Object.values(answers).some(v => v && v.trim().length > 0);
        if (!hasAny) {
            for (const qid of finalQuestionIds) {
                answers[qid] = responseText.trim();
            }
        }

        return answers;
    }

    findNextMarkerIndex(text, finalQuestionIds) {
        let best = -1;
        for (const qid of finalQuestionIds) {
            const idx = text.indexOf(`[${qid}]`);
            if (idx === -1) continue;
            if (best === -1 || idx < best) best = idx;
        }
        return best;
    }

    async getAIResponse(playerId, prompt, options = {}) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) {
            throw new Error(`找不到AI选手: ${playerId}`);
        }

        try {
            const messages = [
                { role: 'user', content: prompt }
            ];

            if (this.playerMemories[playerId] && this.playerMemories[playerId].length > 0) {
                messages.unshift(...this.playerMemories[playerId]);
            }

            const config = this.aiConfigs[playerId];
            const requestBody = config.formatMessage(messages);

            const shouldStream = !!(options.stream || options.callback);
            if (shouldStream) {
                requestBody.stream = true;
            }
            if (typeof options.temperature === 'number') {
                requestBody.temperature = options.temperature;
            }
            if (typeof options.max_tokens === 'number') {
                requestBody.max_tokens = options.max_tokens;
            }

            const apiKey = config.key || this.apiKeys[playerId];

            const maxAttempts = typeof options.maxAttempts === 'number'
                ? options.maxAttempts
                : (playerId === 'grok' ? 4 : 2);

            let response;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                await this.enforceMinInterval(playerId);
                this.lastRequestAt[playerId] = Date.now();

                response = await fetch(config.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                        ...config.headers
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) break;

                const canRetry = response.status === 429 && attempt < maxAttempts - 1;
                if (!canRetry) break;

                try {
                    await response.text();
                } catch (_) {
                }

                const retryAfterHeader = response.headers.get('retry-after');
                const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
                const baseDelayMs = Number.isFinite(retryAfterSeconds)
                    ? retryAfterSeconds * 1000
                    : 1500 * (attempt + 1);
                const jitterMs = Math.floor(Math.random() * 400);
                const delayMs = Math.min(baseDelayMs + jitterMs, 10000);

                this.addLog(`⏳ ${player.name} 遭遇限流(429)，等待 ${(delayMs / 1000).toFixed(1)} 秒后重试...`, 'warning');
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`${player.name} API请求失败: ${response.status} - ${errorText}`);
            }

            if (shouldStream) {
                return await this.handleStreamResponse(response, options);
            }

            const data = await response.json();
            const result = config.extractContent(data);

            this.playerMemories[playerId].push(
                { role: 'user', content: prompt },
                { role: 'assistant', content: result }
            );

            return result;
        } catch (error) {
            this.addLog(`❌ ${player.name} 响应失败: ${error.message}`, 'error');
            throw error;
        }
    }

    async handleStreamResponse(response, options) {
        if (options.callback) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = '';
            let buffer = '';
            let lastFlushTime = Date.now();
            const BUFFER_INTERVAL = 30; // 减少缓冲间隔
            const MIN_BUFFER_SIZE = 1; // 减少最小缓冲大小

            const flushBuffer = () => {
                if (buffer.length > 0) {
                    accumulatedResponse += buffer;
                    options.callback(buffer);
                    buffer = '';
                    lastFlushTime = Date.now();
                }
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content || '';
                        if (content) {
                            buffer += content;

                            const now = Date.now();
                            const shouldFlush =
                                buffer.length >= MIN_BUFFER_SIZE ||
                                (now - lastFlushTime) >= BUFFER_INTERVAL;

                            if (shouldFlush) {
                                flushBuffer();
                            }
                        }
                    } catch (_) {
                    }
                }
            }

            flushBuffer();

            if (options.onComplete) {
                options.onComplete();
            }

            return accumulatedResponse;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
        }

        return result;
    }

    buildInitialExamText() {
        const lines = [];
        lines.push('初始试卷（共9题）');
        lines.push('');
        for (const q of this.initialQuestions) {
            lines.push(`${q.id} 题目：${q.question}`);
            if (q.rubric) {
                lines.push(`${q.id} 评分规则：${q.rubric}`);
            }
            lines.push('');
        }
        return lines.join('\n');
    }

    buildFinalExamText() {
        const lines = [];
        lines.push('最终试卷（共4题）');
        lines.push('');
        for (const q of this.finalQuestions) {
            lines.push(`${q.id} 题目：${q.question}`);
            if (q.rubric) {
                lines.push(`${q.id} 评分规则：${q.rubric}`);
            }
            lines.push('');
        }
        return lines.join('\n');
    }

    async run(options = {}) {
        const resume = !!options.resume;

        if (resume) {
            const state = this.loadCheckpoint();
            if (state) {
                // 检查断点中的玩家数量是否与当前配置一致
                if (state.players && state.players.length !== this.playerOrder.length) {
                    this.addLog(`⚠️ 断点中的玩家数量(${state.players.length})与当前配置(${this.playerOrder.length})不匹配，将开始新比赛`, 'warning');
                    this.clearCheckpoint();
                    resume = false;
                } else {
                    this.restoreFromState(state);
                    this.addLog(`🔄 已从断点恢复，当前阶段: ${this.currentStage || 'stage1'}`, 'warning');
                }
            } else {
                this.clearCheckpoint();
                resume = false;
            }
        }

        if (!resume) {
            this.clearCheckpoint();
            this.players = [];
            this.questions = [];
            this.answers = [];
            this.scores = {};
            this.finalRanking = [];
            this.questionAssignments = {};
            this.progress = {
                stage1QuestionIndex: 0,
                stage2AnswerIndex: 0,
                stage3ScoreIndex: 0
            };
            this.currentStage = null;
            this.setupPlayers(this.playerOrder);
        }

        this.addLog('🚀 开始AI问答竞赛流程', 'info');

        if (!this.currentStage) {
            this.currentStage = 'stage1';
            this.saveCheckpoint();
        }

        while (true) {
            if (this.currentStage === 'stage1') {
                await this.stage1_generateQuestions();
            } else if (this.currentStage === 'stage2') {
                await this.stage2_answerQuestions();
            } else if (this.currentStage === 'stage3') {
                await this.stage3_scoreAnswers();
            } else if (this.currentStage === 'stage4') {
                await this.stage4_computeRanking();
                break;
            } else {
                throw new Error(`未知阶段: ${this.currentStage}`);
            }
        }

        this.clearCheckpoint();
        this.addLog('🎉 AI问答竞赛完成！', 'success');
        return {
            questions: this.questions,
            answers: this.answers,
            scores: this.scores,
            questionAssignments: this.questionAssignments,
            finalRanking: this.finalRanking
        };
    }

    async stage1_generateQuestions() {
        this.currentStage = 'stage1';
        this.addLog('📝 阶段1：AI随机顺序出题（每人1题）', 'info');

        if (!Array.isArray(this.questions)) {
            this.questions = [];
        }

        const startIndex = Math.max(0, Number(this.progress.stage1QuestionIndex) || 0);
        if (this.questions.length === 0 && startIndex > 0) {
            this.progress.stage1QuestionIndex = 0;
        }

        // 随机打乱玩家顺序（只在第一次出题时）
        if (startIndex === 0) {
            // 使用更好的随机算法
            this.shuffledPlayers = [...this.players];
            for (let i = this.shuffledPlayers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.shuffledPlayers[i], this.shuffledPlayers[j]] = [this.shuffledPlayers[j], this.shuffledPlayers[i]];
            }
            this.addLog(`🎲 出题顺序: ${this.shuffledPlayers.map(p => p.name).join(' → ')}`, 'info');
        }

        for (let i = startIndex; i < this.shuffledPlayers.length; i++) {
            const player = this.shuffledPlayers[i];
            const qid = `Q${i + 1}`;
            player.authoredQuestionId = qid;
            player.questionOrder = i; // 记录出题顺序

            this.updateAIStatus(player.id, '出题中');
            this.updateAIDetail(player.id, 'question', '');

            // 确定回答者（下一个出题者）
            const answererIndex = (i + 1) % this.shuffledPlayers.length;
            const answerer = this.shuffledPlayers[answererIndex];

            // 更新出题者窗口标签
            if (this.onStatusUpdateCallback) {
                const questionLabel = document.getElementById(`question-label-${player.id}`);
                if (questionLabel) {
                    questionLabel.textContent = `发给${answerer.name}的提问内容：`;
                }
            }

            const prompt = `你是AI问答竞赛的出题人。请为${answerer.name}出一道围绕"${this.theme}"主题的题目，要求逻辑清晰、可评估、可在有限篇幅内作答。

题目主题要求：
- 必须围绕"${this.theme}"这个核心概念展开
- 可以是${this.theme}相关的理论、实践、应用、发展趋势等内容
- 题目要能考察AI对${this.theme}的理解和分析能力

严格要求：
1. 题目必须适合AI作答，不需要外部工具或实时数据
2. 题目要以中文输出
3. 必须给出评分规则，评分规则要明确可执行
4. 总分100分
5. 绝对禁止使用任何Markdown格式（包括#标题、*加粗*、-列表、>引用、代码块等）
6. 绝对禁止使用任何表情符号或特殊字符
7. 只允许输出一个JSON对象，不要任何多余文字

输出JSON格式如下：
{"question":"...","rubric":"..."}`;

            let accumulated = '';
            const response = await this.getAIResponse(player.id, prompt, {
                callback: (chunk) => {
                    accumulated += chunk;
                    this.updateAIDetail(player.id, 'question', accumulated);
                },
                onComplete: () => {
                    this.addLog(`📝 ${player.name} 完成出题 ${qid}`, 'success');
                },
                max_tokens: 3200
            });

            const parsed = this.parseQuestionObject(player.id, response);
            const questionObj = {
                id: qid,
                authorId: player.id,
                authorName: player.name,
                question: parsed ? parsed.question : response.trim(),
                rubric: parsed ? parsed.rubric : ''
            };

            player.authoredQuestion = questionObj;
            this.questions.push(questionObj);
            this.updateAIStatus(player.id, '出题完成');

            this.progress.stage1QuestionIndex = i + 1;
            this.saveCheckpoint();
        }

        this.addLog('✅ 阶段1完成：已收集所有题目', 'success');

        this.currentStage = 'stage2';
        this.progress.stage2AnswerIndex = 0;
        this.saveCheckpoint();
    }

    async stage2_answerQuestions() {
        this.currentStage = 'stage2';
        this.addLog('✍️ 阶段2：按出题顺序循环分配题目作答', 'info');

        if (!Array.isArray(this.answers)) {
            this.answers = [];
        }

        if (!this.questionAssignments || typeof this.questionAssignments !== 'object') {
            this.questionAssignments = {};
        }

        const startIndex = Math.max(0, Number(this.progress.stage2AnswerIndex) || 0);

        // 按出题顺序循环分配：第i个出题者回答第(i+1)%n个出题者的问题
        for (let i = startIndex; i < this.shuffledPlayers.length; i++) {
            const questionAuthor = this.shuffledPlayers[i];
            const answerer = this.shuffledPlayers[(i + 1) % this.shuffledPlayers.length];
            const question = questionAuthor.authoredQuestion;

            this.addLog(`📋 ${questionAuthor.name} 的题目分配给 ${answerer.name} 回答`, 'info');

            this.updateAIStatus(answerer.id, '作答中');
            this.updateAIDetail(answerer.id, 'answer', '');

            const prompt = `请回答${questionAuthor.name}提出的以下题目。要求逻辑清晰、内容准确、条理清楚。

题目：${question.question}
评分规则：${question.rubric}

请直接给出答案，不要使用Markdown格式，不要包含任何格式标记。`;

            let accumulated = '';
            const response = await this.getAIResponse(answerer.id, prompt, {
                callback: (chunk) => {
                    accumulated += chunk;
                    this.updateAIDetail(answerer.id, 'answer', accumulated);
                },
                onComplete: () => {
                    this.addLog(`✍️ ${answerer.name} 完成作答题目 ${question.id}`, 'success');
                },
                max_tokens: 3200
            });

            const answerObj = {
                id: `ANS-${question.id}-${answerer.id}`,
                questionId: question.id,
                questionText: question.question,
                answererId: answerer.id,
                answererName: answerer.name,
                answer: response.trim(),
                authorId: question.authorId,
                authorName: question.authorName
            };

            this.answers.push(answerObj);
            this.questionAssignments[question.id] = {
                question: question,
                answerer: answerer,
                answer: answerObj
            };

            // 保存到回答者的答案记录
            if (!answerer.answers) {
                answerer.answers = {};
            }
            answerer.answers[question.id] = response.trim();

            // 保存到出题者的收到的回答记录
            if (!questionAuthor.receivedAnswers) {
                questionAuthor.receivedAnswers = {};
            }
            questionAuthor.receivedAnswers[answerer.id] = {
                answererName: answerer.name,
                answer: response.trim()
            };

            // 更新出题者窗口显示收到的答案
            const receivedAnswerText = Object.values(questionAuthor.receivedAnswers)
                .map(ra => ra.answer)
                .join('\n\n');
            this.updateAIDetail(questionAuthor.id, 'answer', receivedAnswerText);

            // 更新出题者窗口标签
            if (this.onStatusUpdateCallback) {
                const answerLabel = document.getElementById(`answer-label-${questionAuthor.id}`);
                if (answerLabel) {
                    const answererNames = Object.values(questionAuthor.receivedAnswers)
                        .map(ra => ra.answererName)
                        .join('、');
                    answerLabel.textContent = `收到${answererNames}的回答内容：`;
                }
            }

            this.updateAIStatus(answerer.id, '准备就绪');
            this.progress.stage2AnswerIndex = i + 1;
            this.saveCheckpoint();
        }

        this.addLog('✅ 阶段2完成：所有题目已分配并作答', 'success');

        this.currentStage = 'stage3';
        this.progress.stage3ScoreIndex = 0;
        this.saveCheckpoint();
    }

    async stage3_scoreAnswers() {
        this.currentStage = 'stage3';
        this.addLog('🧮 阶段3：出题者对答案进行评分', 'info');

        if (!this.scores || typeof this.scores !== 'object') {
            this.scores = {};
        }

        const startIndex = Math.max(0, Number(this.progress.stage3ScoreIndex) || 0);

        for (let i = startIndex; i < this.answers.length; i++) {
            const answer = this.answers[i];
            const question = this.questions.find(q => q.id === answer.questionId);
            const author = this.players.find(p => p.id === answer.authorId);

            if (!question || !author) {
                this.addLog(`⚠️ 答案 ${answer.id} 找不到对应的题目或出题者`, 'warning');
                continue;
            }

            this.updateAIStatus(author.id, '评分中');
            this.updateAIDetail(author.id, 'scoring', '');

            const prompt = `请对${answer.answererName}的答案进行评分，并给出详细的评分理由。

题目：${question.question}
评分规则：${question.rubric}

回答者答案：${answer.answer}

请根据评分规则给出0-100分的分数，并详细说明为什么给出这个分数。

严格要求：
1. 必须先给出分数（0-100之间的整数）
2. 然后详细说明评分理由
3. 评分理由要具体，引用评分规则中的标准
4. 只输出评分结果，不要任何其他文字

输出格式如下：
分数：XX分
评分理由：...`;

            // 更新评分者窗口标签
            if (this.onStatusUpdateCallback) {
                const scoringLabel = document.getElementById(`scoring-label-${author.id}`);
                if (scoringLabel) {
                    scoringLabel.textContent = `给予${answer.answererName}的评分内容：`;
                }
            }

            let accumulated = '';
            const response = await this.getAIResponse(author.id, prompt, {
                callback: (chunk) => {
                    accumulated += chunk;
                    this.updateAIDetail(author.id, 'scoring', accumulated);
                },
                onComplete: () => {
                    this.addLog(`🧮 ${author.name} 完成对 ${answer.answererName} 答案的评分`, 'success');
                },
                max_tokens: 3200
            });

            // 提取分数和评分理由
            const scoreMatch = response.match(/分数[：:]\s*(\d{1,3})\s*分/);
            const reasonMatch = response.match(/评分理由[：:]\s*(.+)/);
            const score = scoreMatch ? Math.max(0, Math.min(100, Number(scoreMatch[1]))) : 60; // 默认60分
            const reason = reasonMatch ? reasonMatch[1].trim() : '未提供评分理由';

            // 保存评分
            if (!this.scores[answer.answererId]) {
                this.scores[answer.answererId] = {
                    totalScore: 0,
                    answerCount: 0,
                    details: []
                };
            }

            this.scores[answer.answererId].details.push({
                questionId: answer.questionId,
                questionText: question.question,
                answer: answer.answer,
                score: score,
                reason: reason,
                scorerId: author.id,
                scorerName: author.name
            });

            this.scores[answer.answererId].totalScore += score;
            this.scores[answer.answererId].answerCount += 1;

            this.updateAIStatus(author.id, '评分完成');
            this.addLog(`🧮 ${author.name} 给 ${answer.answererName} 的答案评分: ${score}分`, 'info');

            this.progress.stage3ScoreIndex = i + 1;
            this.saveCheckpoint();
        }

        this.addLog('✅ 阶段3完成：所有答案已评分', 'success');

        this.currentStage = 'stage4';
        this.saveCheckpoint();
    }

    async stage4_computeRanking() {
        this.currentStage = 'stage4';
        this.addLog('🏆 阶段4：计算最终排名', 'info');

        // 计算每个AI的总分（直接使用出题者评分，无需平均）
        const rankingData = [];
        for (const playerId in this.scores) {
            const scoreData = this.scores[playerId];
            const player = this.players.find(p => p.id === playerId);
            if (!player) continue;

            rankingData.push({
                id: playerId,
                name: player.name,
                totalScore: scoreData.totalScore,
                answerCount: scoreData.answerCount,
                avgScore: scoreData.answerCount > 0 ? scoreData.totalScore / scoreData.answerCount : 0,
                details: scoreData.details
            });

            // 更新玩家的最终分数（使用平均分）
            player.finalScore = scoreData.answerCount > 0 ? scoreData.totalScore / scoreData.answerCount : 0;
        }

        // 按平均分排序
        this.finalRanking = rankingData.sort((a, b) => b.avgScore - a.avgScore);

        // 显示排名
        this.addLog('🏆 最终排名：', 'info');
        for (let i = 0; i < this.finalRanking.length; i++) {
            const r = this.finalRanking[i];
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
            this.addLog(`${medal} 第${i + 1}名: ${r.name} - 平均分: ${r.avgScore.toFixed(2)} (${r.answerCount}个答案)`, 'info');
        }

        this.addLog('✅ 阶段4完成：排名计算完成', 'success');

        // 更新累积统计
        this.updateCumulativeStats();
    }

    loadCumulativeStats() {
        try {
            const raw = localStorage.getItem('AICompetitionCumulativeStats');
            if (!raw) {
                // 初始化统计数据
                const initialStats = {};
                const playerIds = this.playerOrder || ['deepseek', 'claude', 'grok', 'chatgpt'];
                playerIds.forEach(playerId => {
                    const name = this.nameMapping[playerId] || playerId;
                    initialStats[playerId] = {
                        name: name,
                        goldCount: 0,
                        silverCount: 0,
                        bronzeCount: 0,
                        totalScore: 0,
                        competitions: 0
                    };
                });
                return initialStats;
            }
            return JSON.parse(raw);
        } catch (_) {
            return {};
        }
    }

    saveCumulativeStats() {
        try {
            localStorage.setItem('AICompetitionCumulativeStats', JSON.stringify(this.cumulativeStats));
        } catch (_) {
        }
    }

    updateCumulativeStats() {
        this.addLog('📊 开始更新累积统计...', 'info');

        this.finalRanking.forEach((player, index) => {
            const stats = this.cumulativeStats[player.id];
            if (stats) {
                if (index === 0) stats.goldCount++;
                else if (index === 1) stats.silverCount++;
                else if (index === 2) stats.bronzeCount++;

                stats.totalScore += player.avgScore || 0;
                stats.competitions++;

                this.addLog(`📊 ${player.name}: 金牌${stats.goldCount}, 银牌${stats.silverCount}, 铜牌${stats.bronzeCount}, 总分${stats.totalScore.toFixed(2)}, 比赛次数${stats.competitions}`, 'info');
            } else {
                this.addLog(`❌ 找不到${player.name}的累积统计数据`, 'error');
            }
        });

        this.saveCumulativeStats();
        this.addLog('📊 累积统计已更新并保存', 'info');
    }

    getCumulativeRanking(sortBy = 'gold') {
        const ranking = Object.entries(this.cumulativeStats).map(([id, stats]) => ({
            id,
            ...stats
        }));

        switch(sortBy) {
            case 'gold':
                return ranking.sort((a, b) => b.goldCount - a.goldCount || b.silverCount - a.silverCount || b.bronzeCount - a.bronzeCount);
            case 'silver':
                return ranking.sort((a, b) => b.silverCount - a.silverCount || b.goldCount - a.goldCount || b.bronzeCount - a.bronzeCount);
            case 'bronze':
                return ranking.sort((a, b) => b.bronzeCount - a.bronzeCount || b.goldCount - a.goldCount || b.silverCount - a.silverCount);
            case 'total':
                return ranking.sort((a, b) => b.totalScore - a.totalScore);
            case 'avg':
                return ranking.sort((a, b) => (b.totalScore / b.competitions || 0) - (a.totalScore / a.competitions || 0));
            default:
                return ranking;
        }
    }

    // 主题管理
    setTheme(theme) {
        this.theme = theme;
        this.addLog(`🎯 竞赛主题已设置为: ${theme}`, 'info');
    }

    getTheme() {
        return this.theme;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIExamCompetition;
}
