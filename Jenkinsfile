pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                // Clone your source code repository or perform any required build steps

                // Build your Docker image
                script {
                    docker.image('my-image:latest').build()
                }
            }
        }

        stage('Run') {
            steps {
                // Run your Docker container
                script {
                    docker.image('my-image:latest').withRun('-p 8000:80 --name my-container') {
                        // Any additional steps you want to run inside the container
                        // For example, running tests or deployment commands
                    }
                }
            }
        }
    }
}
