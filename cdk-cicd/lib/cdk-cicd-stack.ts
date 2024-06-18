import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Existing CodeBuild project
    const codeBuildProject = new codebuild.Project(this, 'MyProject', {
      source: codebuild.Source.gitHub({
        owner: 'Tim275',
        repo: 'fullstack_Cdk-',
        webhook: true,
        webhookFilters: [
          codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('main'),
        ],
      }),
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
    });

    // Create a new pipeline
    const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
      pipelineName: 'MyPipeline',
      crossAccountKeys: false, // Adjust based on your requirements
    });

    // Add source stage to pipeline
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'Tim275',
      repo: 'fullstack_Cdk-',
      oauthToken: cdk.SecretValue.secretsManager('github-token'), // Ensure this secret exists in Secrets Manager
      output: sourceOutput,
      branch: 'main', // Default is 'master'
      trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
    });
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });
////
    // Add build stage to pipeline
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project: codeBuildProject,
      input: sourceOutput, // Use the output from the source stage as input
    });
    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction],
    });

    // Additional stages (e.g., Deploy) can be added here
  }
}