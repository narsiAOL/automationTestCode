pipeline {
    agent any
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        COMMITDATE = ""
    }
    stages {
        stage('setup') {
            steps {
                notifyBuild('STARTED')
                script {
                    COMMITDATE = sh(returnStdout: true, script: "git show -s --format=%ci ${GIT_COMMIT}").trim()
                }
                echo "${COMMITDATE}"
                sh script: 'git rev-parse --abbrev-ref HEAD'
                echo env.GIT_BRANCH
            }
        }
        stage('Stage-Build') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' }
            }
            steps {
                sh '''
                echo "Build complete"
                # Example: Install Node.js if needed
                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm install 20.19.0
                nvm use 20.19.0
                nvm alias default 20.19.0
                rm -rf dist
                npm install
                export VITE_PUBLIC_API_URL=https://api-familytree.enspirit.us/
                npm run build
                '''
            }
        }
        stage('Stage-Deploy') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' }
            }
            steps {
                // Check SSH
                sh "ssh -o StrictHostKeyChecking=no root@192.168.1.151 'echo SSH connection successful'"
                // Sync files
                sh '''
                rsync -avz --progress --exclude='.git' ./ root@192.168.1.151:/var/www/html/familytree/
                '''
                // Set permissions
                sh '''
                ssh -o StrictHostKeyChecking=no root@192.168.1.151 "sudo chmod -R 777 /var/www/html/familytree && \
                sudo chown -R www-data:www-data /var/www/html/familytree"
                '''
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
def notifyBuild(String buildStatus = 'STARTED') {
    buildStatus = buildStatus ?: 'SUCCESSFUL'
    def colorName = 'RED'
    def colorCode = '#FF0000'
    def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
    def summary = "${subject} (${env.BUILD_URL})"
    def details = """<p>STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
        <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>"""
    if (buildStatus == 'STARTED') {
        color = 'YELLOW'
        colorCode = '#FFFF00'
        summary = "@here Build <${env.BUILD_URL}|${currentBuild.displayName}> - ${env.JOB_NAME} successfully started"
    } else if (buildStatus == 'SUCCESS') {
        color = 'GREEN'
        colorCode = '#00FF00'
        summary = "@here Build <${env.BUILD_URL}|${currentBuild.displayName}> - ${env.JOB_NAME} successfully built & passed the quality gate verification and deployed to server :+1:"
    } else {
        color = 'RED'
        colorCode = '#FF0000'
        summary = "@here Build <${env.BUILD_URL}|${currentBuild.displayName}> - ${env.JOB_NAME} is unsuccessful due to unable to pass the quality gate inspection :scream: or syntax error or unable to reach the remote server :-1:"
    }
    // slackSend(color: colorCode, message: summary)
}