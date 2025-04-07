pipeline {
    agent any

    environment {
        NAMESPACE = "uber"
    }

    stages {

        stage('🔨 Build & Deploy') {
            steps {
                echo '🏗 Running run.sh to build & deploy...'
                sh './run.sh'
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