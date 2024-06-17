import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { CodeBuildStep } from 'aws-cdk-lib/pipelines';
  //import { PipelineStage } from './PipelineStage';
import { SecretValue } from 'aws-cdk-lib'; // Ensure SecretValue is imported

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the pipeline within the stack
    const pipeline = new CodePipeline(this, 'FullstackPipeline', {
      pipelineName: 'FullstackPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('Tim275/fullstack_Cdk-', 'main', { //meine source
         
        }),
        commands: [  // mein build
          'echo pipeline in cdk backend awesome^^',
          'npm install -g aws-cdk',
          'npm ci',
          'npm install aws-cdk-lib constructs @aws-cdk/aws-lambda-nodejs',
          'echo hello',
          'cdk synth',
          'cdk deploy --all'
        ],
        primaryOutputDirectory: 'cdk-cicd/cdk.out',
      }),
    });




    // testphase
   // const testStage = pipeline.addStage(new PipelineStage(this, 'PipelineTestStage', {
    //  stageName: 'test'
    //}));
    



   // testStage.addPre(new CodeBuildStep('unit-tests from pipeline', {
    //  commands: [
    //    'cd cdk-cicd',
   //     'npm ci',
    //    'npm test'
   // }));

  //  testStage.addPre(new CodeBuildStep('unit-tests from project', {
 //     commands: [
   //     'cd ..',
   //     'npm ci',
  //      'npm test'
  //    ]
  //  }));



  }
}

///XXX