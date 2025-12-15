pipeline {
    agent any

    environment {
        // 設定你的環境變數
        PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

        // 在 Jenkins > Manage Jenkins > Credentials 設定 Docker Hub 帳號密碼，ID 填在這裡
        DOCKER_CREDS_ID = 'docker-hub-login' 
        
        // 你的 Docker Hub Image 名稱 (例如: user/node-app)
        DOCKER_IMAGE = 'yoyolee49/lsap-cicd'
        
        // Discord Webhook URL
        DISCORD_URL = 'https://discord.com/api/webhooks/1450054496880296027/lLAlkrHcZJDxkI7ENhACKi-uIJ4CFYxWTzii02PHexUanIbEZOW_FQHZQKYOsvGTym8v'
    }

    stages {
        // 1. 品質檢測 (Part 1) [cite: 22-25]
        stage('Static Analysis') {
            steps {
                echo 'Running ESLint...'
                // 執行 package.json 裡定義的 lint script
                sh 'npm install'
                sh 'npm run lint' 
            }
        }

        // 2. Staging 環境 (只在 dev 分支執行) [cite: 42-50]
        stage('Deploy to Staging') {
            when {
                branch 'dev'
            }
            steps {
                script {
                    echo 'Building and Deploying to Staging...'
                    
                    // --- Bonus: 讀取 package.json 版本號 ---
                    // 使用 node 指令直接讀取 JSON 欄位，不需要額外安裝 jq
                    def appVersion = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
                    echo "Detected App Version: ${appVersion}"
                    
                    def imageTag = "dev-${BUILD_NUMBER}"
                    def semanticTag = "v${appVersion}" // 例如 v1.0.0
                    // -------------------------------------
                    
                    // 登入 Docker Hub
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    }

                    // 建置 Image [cite: 47, 75]
                    // 注意：這裡我們打了兩個標籤 (-t)，一個是流水號，一個是語意化版本
                    sh "docker build -t ${DOCKER_IMAGE}:${imageTag} -t ${DOCKER_IMAGE}:${semanticTag} ."
                    
                    // 推送兩個標籤
                    sh "docker push ${DOCKER_IMAGE}:${imageTag}"
                    sh "docker push ${DOCKER_IMAGE}:${semanticTag}"

                    // 清除舊容器 (如果存在) [cite: 48]
                    sh "docker rm -f dev-app || true"

                    // 部署到 Port 8081 (使用流水號版本部署即可) [cite: 49]
                    sh "docker run -d -p 8081:3000 --name dev-app ${DOCKER_IMAGE}:${imageTag}"
                    
                    // 驗證 Health Endpoint 
                    sleep 5
                    sh "curl -f http://localhost:8081/health"
                }
            }
        }

        // 3. Production 環境 (只在 main 分支執行 - GitOps) [cite: 51-66]
        stage('Promote to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo 'Promoting to Production using GitOps...'
                    
                    // 1. 讀取 deploy.config 檔案 [cite: 59]
                    def targetTag = sh(script: "cat deploy.config", returnStdout: true).trim()
                    echo "Target version from config: ${targetTag}"

                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        
                        // 2. Artifact Promotion (拉取舊的 -> 改名 -> 推送新的) [cite: 60-62]
                        sh "docker pull ${DOCKER_IMAGE}:${targetTag}"
                        sh "docker tag ${DOCKER_IMAGE}:${targetTag} ${DOCKER_IMAGE}:prod-${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_IMAGE}:prod-${BUILD_NUMBER}"
                    }

                    // 3. 部署到 Port 8082 [cite: 66]
                    sh "docker rm -f prod-app || true"
                    sh "docker run -d -p 8082:3000 --name prod-app ${DOCKER_IMAGE}:prod-${BUILD_NUMBER}"
                }
            }
        }
    }

    // ChatOps 通知 (Part 1 & 2) [cite: 32-39]
    post {
        failure {
            script {
                def message = """
                {
                    "content": "**Build Failed!** \\n**Name:** 江彥宏\\n**ID:** B11705044\\n**Job:** ${env.JOB_NAME}\\n**Build:** ${env.BUILD_NUMBER}\\n**Repo:** ${env.GIT_URL}\\n**Branch:** ${env.BRANCH_NAME}\\n**Status:** ❌ FAILURE"
                }
                """
                sh "curl -H 'Content-Type: application/json' -d '${message}' ${env.DISCORD_URL}"
            }
        }
        success {
             script {
                def message = """
                {
                    "content": "**Build Success!**\\n**Job:** ${env.JOB_NAME}\\n**Branch:** ${env.BRANCH_NAME}"
                }
                """
                sh "curl -H 'Content-Type: application/json' -d '${message}' ${env.DISCORD_URL}"
            }
        }
    }
}