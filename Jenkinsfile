pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker_hub_login')  // DockerHub credentials stored in Jenkins
        BACKEND_IMAGE = "deeeye2/port-manager-softwear"
        FRONTEND_IMAGE = "deeeye2/port-manager-UI"
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
                        sh 'docker build -t $BACKEND_IMAGE:V1.0.1 .'
                    }
                }
            }
        }
        
        stage('Push Backend Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                        sh 'docker push $BACKEND_IMAGE:V1.0.1'
                    }
                }
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t $FRONTEND_IMAGE:V1.0.1 .'
                    }
                }
            }
        }
        
        stage('Push Frontend Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                        sh 'docker push $FRONTEND_IMAGE:V1.0.1'
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up any leftover Docker images
                sh 'docker rmi $BACKEND_IMAGE:V1.0.1 || true'
                sh 'docker rmi $FRONTEND_IMAGE:V1.0.1|| true'
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
