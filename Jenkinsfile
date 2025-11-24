pipeline {
    agent any
    
    // --- 這裡是用來修復 docker command not found 的關鍵 ---
    // 強制將常見的 Mac 執行檔路徑加入 Jenkins 的 PATH
    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:${env.PATH}"
    }
    // ---------------------------------------------------

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