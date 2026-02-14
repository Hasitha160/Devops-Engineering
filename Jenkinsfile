pipeline {
    agent any

    environment {
        IMAGE_BACKEND  = "hasithalk/devops-engineering:backend-v2"
        IMAGE_FRONTEND = "hasithalk/devops-engineering:frontend-v2"
        TF_DIR = "terraform-cd"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Hasitha160/Devops-Engineering.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $IMAGE_BACKEND ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $IMAGE_FRONTEND ./my-app'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $IMAGE_BACKEND
                        docker push $IMAGE_FRONTEND
                    '''
                }
            }
        }

        stage('Get EC2 Public IP') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    script {
                        env.PUBLIC_IP = sh(
                            script: "aws ec2 describe-instances --filters 'Name=tag:Name,Values=devops-app-server' 'Name=instance-state-name,Values=running' --query 'Reservations[0].Instances[0].PublicIpAddress' --output text --region ap-south-1",
                            returnStdout: true
                        ).trim()
                    }
                }
            }
        }

        stage('Deploy with Docker') {
            steps {
                sh '''
                    # Pull latest images
                    docker pull $IMAGE_BACKEND
                    docker pull $IMAGE_FRONTEND
                    docker pull mongo:7.0

                    # Remove old containers
                    docker rm -f backend || true
                    docker rm -f frontend || true
                    docker rm -f mongodb || true

                    # Create docker network if it doesn't exist
                    docker network create app-network || true

                    # Start MongoDB
                    docker run -d --name mongodb \
                      --network app-network \
                      -p 27017:27017 \
                      -v mongo-data:/data/db \
                      --restart always \
                      mongo:7.0

                    # Wait for MongoDB to be ready
                    sleep 5

                    # Start Backend (connected to MongoDB)
                    docker run -d --name backend \
                      --network app-network \
                      -p 5001:5001 \
                      -e MONGO_URI="mongodb://mongodb:27017/mydatabase" \
                      -e PORT=5001 \
                      --restart always \
                      $IMAGE_BACKEND

                    # Start Frontend
                    docker run -d --name frontend \
                      --network app-network \
                      -p 80:80 \
                      --restart always \
                      $IMAGE_FRONTEND

                    # Show running containers
                    docker ps
                '''
            }
        }

    }
}
