pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-24-LTS'
    }

    stages {
        stage('Install & Test') {
            steps {
                echo 'Testing...'
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Deploy') {
            // 移除 when { branch 'dev' }，因為 Job 設定已經限制只跑 dev 了
            steps {
                script {
                    echo 'Deploying to Docker...'
                    // 1. 清除舊的 Container (加上 || true 避免報錯)
                    sh 'docker stop staging-app || true'
                    sh 'docker rm staging-app || true'
                    
                    // 2. 建置 Docker Image
                    sh 'docker build -t staging-app .'
                    
                    // 3. 啟動 Container (背景執行, Port 8081->3000)
                    sh 'docker run -d -p 8081:3000 --name staging-app staging-app'
                }
            }
        }

        stage('Health Check') {
            // 移除 when { branch 'dev' }
            steps {
                // 等待服務啟動
                sleep 5
                // 檢查健康狀態
                sh 'curl -f http://localhost:8081/health'
                echo 'Deployment Verified Successfully!'
            }
        }
    }
}