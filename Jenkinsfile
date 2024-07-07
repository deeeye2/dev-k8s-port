pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials-id')  // DockerHub credentials stored in Jenkins
        BACKEND_IMAGE = "<your_dockerhub_username>/port-manager-backend"
        FRONTEND_IMAGE = "<your_dockerhub_username>/port-manager-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend Image') {
            steps {
                script {
                    dir('backend') {  // Assuming the backend Dockerfile and code are in the 'backend' directory
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
                    dir('frontend') {  // Assuming the frontend Dockerfile and code are in the 'frontend' directory
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
