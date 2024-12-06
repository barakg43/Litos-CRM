pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Going to install project dependencies'
                sh 'yarn'
            }
        }
        stage('Test') {
            steps {
                echo 'Going to test the application'
                sh 'yarn test:ci'
            }
        }
        stage('Release') {
            when {
                allOf {
                    branch 'main'
                    changelog '^(?!v1.1).*'
                }
            }
            steps {
                withCredentials([gitUsernamePassword(credentialsId: '28b2de00-4e11-4482-b507-a6a668c2c287', gitToolName: 'Default')]) {
                    echo 'Build on main branch - Going to release'
                    sh 'yarn version --patch'
                }
            }
        }
    }
    post {
        always {
            junit testResults: 'junit.xml'
        }
    }
}
