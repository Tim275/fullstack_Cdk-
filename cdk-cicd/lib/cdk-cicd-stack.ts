import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, CodeBuildStep } from 'aws-cdk-lib/pipelines';
import { LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';



export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Source stage from GitHub
    const source = CodePipelineSource.gitHub('Tim275/fullstack_Cdk-', 'main', {
      authentication: cdk.SecretValue.secretsManager('github-token'),
    });

   

    // Build stage
    const build = new CodeBuildStep('Build', {
      input: source,
      commands: [
        'npm ci',
        'npm install -g aws-cdk',
        'npx cdk synth',
        'npm run cdk deploy --all' // Corrected command to use npm run for cdk deploy
      ],
      buildEnvironment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
    });

    // Define a ShellStep for running Jest tests
    const jestTestStep = new CodeBuildStep('RunJestTests', {
      input: source,
      commands: [
        'npm run alltests' // Jest test command
      ],
      buildEnvironment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
    });




  }
}

// Deploy the pipeline
const app = new cdk.App();
new CdkCicdStack(app, 'MyCdkPipelineStack', {
  env: { account: '506820257931', region: 'eu-central-1' },
});
app.synth();
