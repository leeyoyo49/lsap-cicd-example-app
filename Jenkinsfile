pipeline {
    agent any
    tools {
        nodejs 'NodeJS-24-LTS' // Ensure this matches your Jenkins Tool config [cite: 110]
    }
    stages {
        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh 'npm test' 
            }
        }
    }
}

