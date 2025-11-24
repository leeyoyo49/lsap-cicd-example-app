pipeline {
    agent any
    
    // 確保這裡的名字跟你 Jenkins 設定的一樣
    tools {
        nodejs 'NodeJS-24-LTS'
    }

    stages {
        stage('Install & Test') {
            steps {
                echo 'Testing...'
                sh 'npm install'
                // 為了避免測試卡住，確保 app.test.js 裡用的是隨機 Port (0)
                sh 'npm test'
            }
        }

        stage('Deploy') {
            // 這個階段只會在 dev 分支執行
            when {
                branch 'dev'
            }
            steps {
                script {
                    echo 'Deploying to Docker...'
                    
                    // 1. 清除舊的 Container (加上 || true 避免第一次執行因為找不到容器而報錯)
                    sh 'docker stop staging-app || true'
                    sh 'docker rm staging-app || true'
                    
                    // 2. 建置 Docker Image
                    sh 'docker build -t staging-app .'
                    
                    // 3. 啟動 Container
                    // -d: 背景執行
                    // -p 8081:3000: 將本機的 8081 對應到容器的 3000
                    // --name staging-app: 設定容器名稱方便管理
                    sh 'docker run -d -p 8081:3000 --name staging-app staging-app'
                }
            }
        }

        stage('Health Check') {
            when {
                branch 'dev'
            }
            steps {
                // 等待幾秒確保服務完全啟動
                sleep 5
                // 使用 curl 檢查 /health 端點，-f 代表如果 HTTP 錯誤碼 (如 404/500) 則當作失敗
                sh 'curl -f http://localhost:8081/health'
                echo 'Deployment Verified Successfully!'
            }
        }
    }
}