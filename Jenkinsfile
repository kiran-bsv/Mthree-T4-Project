pipeline {
    agent any

    environment {
        NAMESPACE = "uber"
    }

    stages {

        stage('🔨 Build & Deploy') {
            steps {
                echo '🏗 Running run.sh to build & deploy...'
                sh 'chmod +x run-jenkins.sh'
                sh './run-jenkins.sh'
            }
        }
        stage('Port Forwarding') {
            steps {
                echo '🏗 Running host.sh to port forward...'
                sh 'chmod +x host.sh'
                sh './host.sh'
            }
        }
    }

    post {
        failure {
            echo '💥 Build failed. Check logs for errors.'
        }
        success {
            echo '🎉 Deployment successful!'
        }
    }
}