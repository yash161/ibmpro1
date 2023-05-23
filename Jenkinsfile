pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                // Build Docker image from Dockerfile in the current folder
                script {
                    docker.build('my-image:latest', '.')
                }
            }
        }
        
        stage('Run') {
            steps {
                // Run Docker container and expose port 8000
                script {
                     docker.image('my-image:latest').withRun('-p 8000:8000')
                }
            }
        }
    }
}
