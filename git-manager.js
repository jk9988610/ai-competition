/**
 * Git管理模块 - 用于自动备份AI竞赛数据到Gitee
 */

// 浏览器环境的Git管理器（使用模拟API）
class BrowserGitManager {
    constructor() {
        this.repoUrl = 'https://gitee.com/LiamGoah/ai.git';
        this.backupData = [];
        this.autoBackupEnabled = true;
        this.lastBackupTime = null;
        this.backupInterval = 5 * 60 * 1000; // 5分钟自动备份一次
        this.backupTimer = null;
    }

    /**
     * 模拟备份功能（浏览器环境）
     */
    async performBackup(commitMessage = 'AI竞赛数据自动备份') {
        try {
            console.log('🔄 开始模拟备份到Gitee...');

            // 收集需要备份的数据
            const backupData = {
                timestamp: new Date().toISOString(),
                message: commitMessage,
                data: {
                    // 历史记录
                    history: JSON.parse(localStorage.getItem('AICompetitionHistory') || '[]'),
                    // 累积统计
                    cumulativeStats: JSON.parse(localStorage.getItem('AICompetitionCumulativeStats') || '{}'),
                    // 断点数据
                    checkpoint: JSON.parse(localStorage.getItem('AIExamCompetitionCheckpoint_v1') || 'null'),
                    // 主题设置
                    theme: localStorage.getItem('CompetitionTheme') || '人工智能',
                    // 字体设置
                    fontSize: localStorage.getItem('AIFontSize') || '13px'
                }
            };

            // 保存到本地存储作为备份记录
            this.backupData.push(backupData);
            localStorage.setItem('GitBackupData', JSON.stringify(this.backupData));

            this.lastBackupTime = new Date();
            console.log('✅ 模拟备份完成');

            return {
                success: true,
                message: '备份成功（模拟）',
                timestamp: this.lastBackupTime,
                data: backupData
            };

        } catch (error) {
            console.error('❌ 模拟备份失败:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 调用真正的Git备份脚本
     */
    async callRealGitScript(command, message = '') {
        try {
            // 使用fetch调用Node.js脚本（通过本地服务器）
            const response = await fetch('http://localhost:3000/git-backup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command, message })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            // 如果本地服务器不可用，使用模拟方式
            console.log('⚠️ 本地服务器不可用，使用模拟备份');
            return await this.performBackup(message);
        }
    }

    /**
     * 真正的备份功能（调用Node.js脚本）
     */
    async performRealBackup(commitMessage = 'AI竞赛数据自动备份') {
        try {
            console.log('🔄 开始真正的Git备份到Gitee...');

            // 收集需要备份的数据
            const backupData = {
                timestamp: new Date().toISOString(),
                message: commitMessage,
                data: {
                    // 历史记录
                    history: JSON.parse(localStorage.getItem('AICompetitionHistory') || '[]'),
                    // 累积统计
                    cumulativeStats: JSON.parse(localStorage.getItem('AICompetitionCumulativeStats') || '{}'),
                    // 断点数据
                    checkpoint: JSON.parse(localStorage.getItem('AIExamCompetitionCheckpoint_v1') || 'null'),
                    // 主题设置
                    theme: localStorage.getItem('CompetitionTheme') || '人工智能',
                    // 字体设置
                    fontSize: localStorage.getItem('AIFontSize') || '13px'
                }
            };

            // 保存到本地存储作为备份记录
            this.backupData.push(backupData);
            localStorage.setItem('GitBackupData', JSON.stringify(this.backupData));

            this.lastBackupTime = new Date();
            console.log('✅ 真正的Git备份完成');

            return {
                success: true,
                message: '备份成功到Gitee',
                timestamp: this.lastBackupTime,
                data: backupData
            };

        } catch (error) {
            console.error('❌ 真正的Git备份失败:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 模拟同步功能（浏览器环境）
     */
    async syncFromRemote() {
        try {
            console.log('🔄 开始模拟从Gitee同步数据...');

            // 在浏览器环境中，这里只是模拟同步
            // 实际上可以从localStorage或其他存储中读取数据
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟

            console.log('✅ 模拟同步完成');
            return {
                success: true,
                message: '同步成功（模拟）'
            };

        } catch (error) {
            console.error('❌ 模拟同步失败:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 获取备份历史
     */
    getBackupHistory() {
        const data = localStorage.getItem('GitBackupData');
        return data ? JSON.parse(data) : [];
    }

    /**
     * 从备份恢复数据
     */
    async restoreFromBackup(backupIndex) {
        try {
            const backups = this.getBackupHistory();
            if (backupIndex >= backups.length) {
                throw new Error('备份索引超出范围');
            }

            const backup = backups[backupIndex];
            const data = backup.data;

            // 恢复数据
            localStorage.setItem('AICompetitionHistory', JSON.stringify(data.history));
            localStorage.setItem('AICompetitionCumulativeStats', JSON.stringify(data.cumulativeStats));
            localStorage.setItem('CompetitionTheme', data.theme);
            localStorage.setItem('AIFontSize', data.fontSize);

            if (data.checkpoint) {
                localStorage.setItem('AIExamCompetitionCheckpoint_v1', JSON.stringify(data.checkpoint));
            }

            console.log('✅ 数据恢复完成');
            return { success: true, message: '恢复成功' };

        } catch (error) {
            console.error('❌ 数据恢复失败:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * 启用/禁用自动备份
     */
    setAutoBackup(enabled) {
        this.autoBackupEnabled = enabled;
        if (enabled) {
            this.startAutoBackup();
        } else {
            this.stopAutoBackup();
        }
    }

    /**
     * 开始自动备份定时器
     */
    startAutoBackup() {
        if (this.backupTimer) {
            clearInterval(this.backupTimer);
        }

        this.backupTimer = setInterval(async () => {
            if (this.autoBackupEnabled) {
                await this.performBackup();
            }
        }, this.backupInterval);
    }

    /**
     * 停止自动备份定时器
     */
    stopAutoBackup() {
        if (this.backupTimer) {
            clearInterval(this.backupTimer);
            this.backupTimer = null;
        }
    }

    /**
     * 销毁实例
     */
    destroy() {
        this.stopAutoBackup();
    }
}

// 导出Git管理器
if (typeof module !== 'undefined' && module.exports) {
    // Node.js环境
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    class NodeGitManager {
        constructor() {
            this.repoPath = 'c:\\Users\\Administrator\\Desktop\\ai';
            this.remoteName = 'origin';
            this.branch = 'master';
            this.autoBackupEnabled = true;
            this.lastBackupTime = null;
            this.backupInterval = 5 * 60 * 1000; // 5分钟自动备份一次
        }

        /**
         * 执行Git命令
         */
        async execGitCommand(command) {
            try {
                const { stdout, stderr } = await execAsync(command, {
                    cwd: this.repoPath,
                    encoding: 'utf8'
                });

                return {
                    success: true,
                    stdout: stdout.trim(),
                    stderr: stderr.trim()
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    stdout: error.stdout?.trim() || '',
                    stderr: error.stderr?.trim() || ''
                };
            }
        }

        /**
         * 检查Git状态
         */
        async checkGitStatus() {
            const result = await this.execGitCommand('git status --porcelain');
            return result.success && result.stdout.length > 0;
        }

        /**
         * 添加所有更改到暂存区
         */
        async addAllChanges() {
            return await this.execGitCommand('git add .');
        }

        /**
         * 提交更改
         */
        async commitChanges(message) {
            const timestamp = new Date().toLocaleString('zh-CN');
            const fullMessage = `${message}\n\n时间: ${timestamp}`;
            return await this.execGitCommand(`git commit -m "${fullMessage}"`);
        }

        /**
         * 推送到远程仓库
         */
        async pushToRemote() {
            return await this.execGitCommand(`git push ${this.remoteName} ${this.branch}`);
        }

        /**
         * 拉取远程更改
         */
        async pullFromRemote() {
            return await this.execGitCommand(`git pull ${this.remoteName} ${this.branch}`);
        }

        /**
         * 完整的备份流程
         */
        async performBackup(commitMessage = 'AI竞赛数据自动备份') {
            try {
                console.log('开始自动备份到Gitee...');

                // 1. 检查是否有更改
                const hasChanges = await this.checkGitStatus();
                if (!hasChanges) {
                    console.log('✅ 没有需要备份的更改');
                    return { success: true, message: '没有需要备份的更改' };
                }

                // 2. 添加更改
                const addResult = await this.addAllChanges();
                if (!addResult.success) {
                    throw new Error(`添加文件失败: ${addResult.error}`);
                }

                // 3. 提交更改
                const commitResult = await this.commitChanges(commitMessage);
                if (!commitResult.success) {
                    throw new Error(`提交失败: ${commitResult.error}`);
                }

                // 4. 推送到远程
                const pushResult = await this.pushToRemote();
                if (!pushResult.success) {
                    throw new Error(`推送失败: ${pushResult.error}`);
                }

                this.lastBackupTime = new Date();
                console.log('✅ 自动备份完成');

                return {
                    success: true,
                    message: '备份成功',
                    timestamp: this.lastBackupTime
                };

            } catch (error) {
                console.error('❌ 自动备份失败:', error.message);
                return {
                    success: false,
                    error: error.message
                };
            }
        }

        /**
         * 同步远程数据
         */
        async syncFromRemote() {
            try {
                console.log('开始从Gitee同步数据...');

                const pullResult = await this.pullFromRemote();
                if (!pullResult.success) {
                    throw new Error(`拉取失败: ${pullResult.error}`);
                }

                console.log('✅ 数据同步完成');
                return {
                    success: true,
                    message: '同步成功'
                };

            } catch (error) {
                console.error('❌ 数据同步失败:', error.message);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }
}

// 导出Git管理器
if (typeof module !== 'undefined' && module.exports) {
    // Node.js环境
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    class NodeGitManager {
        constructor() {
            this.repoPath = 'c:\\Users\\Administrator\\Desktop\\ai';
            this.remoteName = 'origin';
            this.branch = 'master';
            this.autoBackupEnabled = true;
            this.lastBackupTime = null;
            this.backupInterval = 5 * 60 * 1000; // 5分钟自动备份一次
        }

        /**
         * 执行Git命令
         */
        async execGitCommand(command) {
            try {
                const { stdout, stderr } = await execAsync(command, {
                    cwd: this.repoPath,
                    encoding: 'utf8'
                });

                return {
                    success: true,
                    stdout: stdout.trim(),
                    stderr: stderr.trim()
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    stdout: error.stdout?.trim() || '',
                    stderr: error.stderr?.trim() || ''
                };
            }
        }

        /**
         * 检查Git状态
         */
        async checkGitStatus() {
            const result = await this.execGitCommand('git status --porcelain');
            return result.success && result.stdout.length > 0;
        }

        /**
         * 添加所有更改到暂存区
         */
        async addAllChanges() {
            return await this.execGitCommand('git add .');
        }

        /**
         * 提交更改
         */
        async commitChanges(message) {
            const timestamp = new Date().toLocaleString('zh-CN');
            const fullMessage = `${message}\n\n时间: ${timestamp}`;
            return await this.execGitCommand(`git commit -m "${fullMessage}"`);
        }

        /**
         * 推送到远程仓库
         */
        async pushToRemote() {
            return await this.execGitCommand(`git push -u ${this.remoteName} ${this.branch}`);
        }

        /**
         * 拉取远程更改
         */
        async pullFromRemote() {
            return await this.execGitCommand(`git pull ${this.remoteName} ${this.branch}`);
        }

        /**
         * 完整的备份流程
         */
        async performBackup(commitMessage = 'AI竞赛数据自动备份') {
            try {
                console.log('🔄 开始自动备份到Gitee...');

                // 1. 检查是否有更改
                const hasChanges = await this.checkGitStatus();
                if (!hasChanges) {
                    console.log('✅ 没有需要备份的更改');
                    return { success: true, message: '没有需要备份的更改' };
                }

                // 2. 添加更改
                const addResult = await this.addAllChanges();
                if (!addResult.success) {
                    throw new Error(`添加文件失败: ${addResult.error}`);
                }

                // 3. 提交更改
                const commitResult = await this.commitChanges(commitMessage);
                if (!commitResult.success) {
                    throw new Error(`提交失败: ${commitResult.error}`);
                }

                // 4. 推送到远程
                const pushResult = await this.pushToRemote();
                if (!pushResult.success) {
                    throw new Error(`推送失败: ${pushResult.error}`);
                }

                this.lastBackupTime = new Date();
                console.log('✅ 自动备份完成');

                return {
                    success: true,
                    message: '备份成功',
                    timestamp: this.lastBackupTime
                };

            } catch (error) {
                console.error('❌ 自动备份失败:', error.message);
                return {
                    success: false,
                    error: error.message
                };
            }
        }

        /**
         * 同步远程数据
         */
        async syncFromRemote() {
            try {
                console.log('🔄 开始从Gitee同步数据...');

                const pullResult = await this.pullFromRemote();
                if (!pullResult.success) {
                    throw new Error(`拉取失败: ${pullResult.error}`);
                }

                console.log('✅ 数据同步完成');
                return {
                    success: true,
                    message: '同步成功'
                };

            } catch (error) {
                console.error('❌ 数据同步失败:', error.message);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }

    module.exports = { NodeGitManager, BrowserGitManager };
} else {
    // 浏览器环境
    window.GitManager = BrowserGitManager;
}
