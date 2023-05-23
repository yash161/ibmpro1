pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                // Build Docker image from Dockerfile in the current folder
                script {
                    sudo('docker build -t my-image:latest .')
                }
            }
        }
        
        stage('Run') {
            steps {
                // Run Docker container and expose port 8000
                script {
                    sudo('docker run -p 8000:80 --name my-container my-image:latest')
                }
            }
        }
    }
}
