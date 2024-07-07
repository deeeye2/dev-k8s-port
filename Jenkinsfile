pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker_hub_login')  // DockerHub credentials stored in Jenkins
        BACKEND_IMAGE = "deeeye2/port-manager-backend"
        FRONTEND_IMAGE = "deeeye2/port-manager-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the provided GitHub repository
                git url: 'https://github.com/deeeye2/dev-k8s-port-.git', branch: 'main'
            }
        }
        
        stage('Build Backend Image') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t $BACKEND_IMAGE:latest .'
                    }
                }
            }
        }
        
        stage('Push Backend Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                        sh 'docker push $BACKEND_IMAGE:latest'
                    }
                }
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t $FRONTEND_IMAGE:latest .'
                    }
                }
            }
        }
        
        stage('Push Frontend Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                        sh 'docker push $FRONTEND_IMAGE:latest'
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up any leftover Docker images
                sh 'docker rmi $BACKEND_IMAGE:latest || true'
                sh 'docker rmi $FRONTEND_IMAGE:latest || true'
            }
        }
        success {
            echo 'Docker images built and pushed successfully.'
        }
        failure {
            echo 'Failed to build or push Docker images.'
        }
    }
}
