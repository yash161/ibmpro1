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
                    docker.withRun('-p 8000:8000 --name my-container -d', 'my-image:latest') {
                        // No additional steps inside the container
                    }
                }
            }
        }
    }
}
