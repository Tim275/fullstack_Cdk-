import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { CodeBuildStep } from 'aws-cdk-lib/pipelines';
import { PipelineStage } from './PipelineStage';

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the pipeline within the stack
    const pipeline = new CodePipeline(this, 'FullstackPipeline', {
      pipelineName: 'FullstackPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('Tim275/fullstack_Cdk-', 'main'),
        commands: [
          'cd cdk-cicd',
          'npm ci',
          'npx cdk synth',
        ],
        primaryOutputDirectory: 'cdk-cicd/cdk.out',
      }),
    });

const testStage = pipeline.addStage(new PipelineStage(this, 'PipelineTestStage', {
  stageName: 'test'
}));



testStage.addPre(new CodeBuildStep('unit-tests', {
  commands: [
    'cd cdk-cicd',
    'npm ci',
    'npm test'
  ]
}))

}
}

