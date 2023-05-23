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
                    def container = docker.image('my-image:latest').run('-p 8000:8000')
                    // Additional steps you want to run inside the container
                    // For example, running tests or deployment commands
                    container.inside {
                        // Your additional steps here
                    }
                }
            }
        }
    }
}
